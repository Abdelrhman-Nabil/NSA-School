"use server";

import { revalidatePath } from "next/cache";
import { Day, PrismaClient, UserSex } from "@prisma/client";

import {
  AnnouncementSchema,
  AssignmentSchema,
  AttendaceSchema,
  ClassSchema,
  EventSchema,
  ExamSchema,
  GradeSchema,
  LessonSchema,
  ParentSchema,
  ResultSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.create({
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata:{role:"teacher"}
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
 
  try {
    const classItem=await prisma.class.findUnique({
      where:{id:data.classId},
      include:{
        _count:{select:{students:true}}
      }
    })
     if(classItem && classItem.capacity === classItem._count.students){
      return{
        success:true,error:true
      }
     }
    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata:{role:"student"}
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId:data.gradeId,
        classId:data.classId,
        parentId:data.parentId
      },
    });

    // revalidatePath("/list/studnet");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {

  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        ...(data.parentId !== "" && { parentId: data.parentId }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId:data.gradeId,
        classId:data.classId,
        parentId:data.parentId
        
      },
    });
    // revalidatePath("/list/student");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/student");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  try {
    await prisma.exam.create({
      data: {
       title:data.title,
       startTime:data.startTime,
       endTime:data.endTime,
      lessonId:data.lessonId
      },
    });

    // revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  try {
    await prisma.exam.update({
     where:{
      id:data.id
     },
      data:{
      title:data.title,
      startTime:data.startTime,
      endTime:data.endTime,
      lessonId:data.lessonId
     },
    });

    // revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};



export const createParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  try {
    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata:{role:"parent"}
    });

    await prisma.parent.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null ,
        address: data.address,
        students: {
          connect: data.students?.map((studentId: string) => ({
            id:studentId,
          })),
        },
      },
    });

    // revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const updateParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {

  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.parent.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,

        students: {
          connect: data.students?.map((studentId: string) => ({
            id:studentId,
          })),
        },
      },
    });
    // revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const deleteParent  = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.parent.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const createAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  try {
    await prisma.assignment.create({
      data: {
       title:data.title,
       startDate:data.startDate,
       dueDate:data.dueDate,
       lessonId:data.lessonId
      },
    });

    // revalidatePath("/list/assignmets");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const updateAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  try {
    await prisma.assignment.update({
     where:{
      id:data.id
     },
      data:{
        title:data.title,
        startDate:data.startDate,
        dueDate:data.dueDate,
        lessonId:data.lessonId
      },
    });

    // revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const deleteAssignment = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.assignment.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};


export const createLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {
  try {
    await prisma.lesson.create({
      data:{
        id:data.id,
        name:data.name,
        day:data.day as Day,
        startTime:data.startTime,
        endTime:data.endTime,
        subjectId:data.subjectId,
        classId:data.classId,
        teacherId:data.teacherId,
         

      },
    });

    // revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const updateLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {
  try {
    await prisma.lesson.update({
      where: {
        id: data.id,
      },
      data:{
        id:data.id,
        name:data.name,
        day:data.day as Day,
        startTime:data.startTime,
        endTime:data.endTime,
        subjectId:data.subjectId,
        classId:data.classId,
        teacherId:data.teacherId,
      },
    });

    // revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const deleteLesson = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.lesson.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};
export const createGrade = async (
  currentState: CurrentState,
  data: GradeSchema
) => {
  try {
    await prisma.grade.create({
      data: {
       level:data.level,
      },
    });

    // revalidatePath("/list/Grades");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const updateGrade = async (
  currentState: CurrentState,
  data: GradeSchema
) => {
  try {
    await prisma.grade.update({
     where:{
      id:data.id
     },
      data:{
      level:data.level,
     },
    });

    // revalidatePath("/list/grades");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const deleteGrade = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.grade.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/grades");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const createResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  const comma=data.title.indexOf(",")+1;
  const title=data.title.slice(comma,data.title.length);
  const id=data.title.slice(0,comma-1)
  let assignmentId,examId;
  if(title.includes("xam")){
    examId=parseInt(id)
  }else{
    assignmentId=parseInt(id)
  }
try {
  await prisma.result.create({
    data:{
      id:data.id,
      title:title,
      subject:data.subject,
      score:data.score,
      assignmentId:assignmentId || null,
      examId:examId || null,
      studentId:data.studentId
    }
  })
   

    // revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const updateResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  const comma=data.title.indexOf(",")+1;
  const title=data.title.slice(comma,data.title.length);
  const id=data.title.slice(0,comma-1)
  let assignmentId,examId;
  if(title.includes("xam")){
    examId=parseInt(id)
  }else{
    assignmentId=parseInt(id)
  }
     try{
        await prisma.result.update({
         where:{
          id:data.id
         },
          data:{
            title:title,
            subject:data.subject,
            score:data.score,
            assignmentId:assignmentId || null,
            examId:examId || null,
            studentId:data.studentId
         }
        })
     
    // revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const deleteResult = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.result.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const createEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  try {
    await prisma.event.create({
      data: {
       title:data.title,
       description:data.description,
       startTime:data.startTime,
       endTime:data.endTime,
      classId:data.classId
      },
    });

    // revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const updateEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  try {
    await prisma.event.update({
     where:{
      id:data.id
     },
      data:{
      title:data.title,
      description:data.description,
      startTime:data.startTime,
      endTime:data.endTime,
      classId:data.classId
     },
    });

    // revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const deleteEvent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.event.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const createAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {
  try {
    await prisma.announcement.create({
      data: {
       title:data.title,
       description:data.description,
       date:data.date,
      classId:data.classId
      },
    });

    // revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const updateAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {
  try {
    await prisma.announcement.update({
     where:{
      id:data.id
     },
      data:{
      title:data.title,
      description:data.description,
      date:data.date,
      classId:data.classId
     },
    });

    // revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const deleteAnnouncement = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.announcement.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const createAttendace = async (
  currentState: CurrentState,
  data: AttendaceSchema
) => {
  try {
    await prisma.attendance.create({
      data: {
       id:data.id,
       date:data.date,
       present:data.present,
       studentId:data.studentId,
       lessonId:data.lessonId
      },
    });

    // revalidatePath("/list/attendace");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const updateAttendace = async (
  currentState: CurrentState,
  data: AttendaceSchema
) => {
  try {
    await prisma.attendance.update({
     where:{
      id:data.id
     },
     data: {
      id:data.id,
      date:data.date,
      present:data.present,
      studentId:data.studentId,
      lessonId:data.lessonId
     },
    });

    // revalidatePath("/list/attendace");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};

export const deleteAttendance = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.attendance.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/attendance");
    return { success: true, error: false };
  } catch (err) {
    return { success: false, error: true };
  }
};