import prisma from "@/lib/prisma";
import FormModal from "./FormModals";
import { auth } from "@clerk/nextjs/server";

export type FormContaierProps={
    table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
    type: "create" | "update" | "delete";
    data?: any;
    id?: number|string;
}
const FormContaier=async({
    table,
    type,
    data,
    id,
  }: FormContaierProps) => {
    const {userId,sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    
  let relatedData;
    if (type !== "delete") {
        switch (table) {
          case "subject":
            const subjectTeachers = await prisma.teacher.findMany({
              select: { id: true, name: true, surname: true },
            });
            relatedData = { teachers: subjectTeachers };
            break;
            case "class":
              const classGrade = await prisma.grade.findMany({
                select: { id: true, level: true },
              });
              const classTeacher =  await prisma.teacher.findMany({
                select: { id: true, name: true, surname: true },
              });
              relatedData = { teachers: classTeacher ,grades:classGrade };
              break;
              case "teacher":
                const teacherSubject = await prisma.subject.findMany({
                  select: { id: true, name: true},
                });
                relatedData = { subjects: teacherSubject };
                break;
                case "student":
                const studentGrade = await prisma.grade.findMany({
                  select: { id: true,level:true },
                });
                const studentClasses = await prisma.class.findMany({
                  include: { _count: { select: { students: true } } },
                });
                const Theparnets=await prisma.parent.findMany({
                  select:{id:true,name:true}
                })
                relatedData = { grades: studentGrade,classes:studentClasses,parents:Theparnets };
                break;
                case "exam":
                const examsLesson = await prisma.lesson.findMany({
                  where:{
                    ...(role === "teacher" ?{teacherId:userId!}:{}), 
                  },
                  select:{id:true,name:true}
                });
                
                relatedData = {lessons:examsLesson};
                break;
    
          default:
            break;
        }
      }
    
      return (
        <div className="">
          <FormModal
            table={table}
            type={type}
            data={data}
            id={id}
            relatedData={relatedData}
          />
        </div>
      );
    };
export default FormContaier