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
    | "grade"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement"
    | "attendance"
    ;
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
                  const examLessons = await prisma.lesson.findMany({
                    where: {
                      ...(role === "teacher" ? { teacherId: userId! } : {}),
                    },
                    select: { id: true, name: true },
                  });
                  relatedData = { lessons: examLessons };
                  break;
                case "parent":
                  const parentStudent = await prisma.student.findMany({
                    select: { id: true, name: true,surname:true},
                  });
                  relatedData = { students: parentStudent };
                  break;
                  case "assignment":
                const assignmentLesson = await prisma.lesson.findMany({
                  where:{
                    ...(role === "teacher" ?{teacherId:userId!}:{}), 
                  },
                  select:{id:true,name:true}
                });
                relatedData = {lessons:assignmentLesson};
                break;

                case "lesson":
                const lessonSubject = await prisma.subject.findMany({
                  select: { id: true,name:true },
                });
                const lessonClass = await prisma.class.findMany({
                 select:{id:true ,name:true},
                });
                const lessonTeacher=await prisma.teacher.findMany({
                  select:{id:true,name:true,surname:true}
                })
                relatedData = { subjects: lessonSubject,classes:lessonClass,teachers:lessonTeacher };
                break;
                case "grade":
                const gradeStudent = await prisma.student.findMany({
                  select: { id: true,name:true,surname:true },
                });
                const gradeClass = await prisma.class.findMany({
                 select:{id:true ,name:true},
                });
                
                relatedData = { students: gradeStudent,classes:gradeClass};
                break;
                case "result":
                    const resultEaxm=await prisma.exam.findMany({
                    
                      select: { id: true,title:true,lessonId:true}
                    })
                    const resultAssignment=await prisma.assignment.findMany({
                      select:{id:true , title:true,lessonId:true}
                    })  
                    const resultStudent=await prisma.student.findMany({
                      select:{id:true,name:true,surname:true}
                    })
                    const resultSubject=await prisma.subject.findMany({
                      select:{id:true,name:true}
                    })
                    relatedData={exams:resultEaxm,assignments:resultAssignment,students:resultStudent,subjects:resultSubject
                    
                    }
                    break;
                case "event":
                  const eventClass = await prisma.class.findMany({
                    select:{id:true ,name:true},
                  });
                  relatedData = { classes: eventClass };
                  break;
                  case "announcement":
                    const announcementClass = await prisma.class.findMany({
                      select:{id:true ,name:true},
                    });
                    relatedData = { announcements: announcementClass };
                    break;
                    case "attendance":
                    const studentAttendance = await prisma.student.findMany({
                      select:{id:true ,name:true,surname:true},
                    });
                    const LessonAttendance = await prisma.lesson.findMany({
                      select:{id:true ,name:true},
                    });
                    relatedData = { students: studentAttendance ,lessons:LessonAttendance};
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