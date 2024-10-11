"use client";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormContaierProps } from "./formContianer";
import { deleteClass, deleteExam, deleteStudent, deleteSubject, deleteTeacher } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";



const deleteActionMap:any = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExam,
// // TODO: OTHER DELETE ACTIONS
//   parent: deleteSubject,
//   lesson: deleteSubject,
//   assignment: deleteSubject,
//   result: deleteSubject,
//   attendance: deleteSubject,
//   event: deleteSubject,
//   announcement: deleteSubject,
};
const TeacherForm = dynamic(() => import("../forms/teacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("../forms/studentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("../forms/subjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("../forms/classForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("../forms/examForm"), {
  loading: () => <h1>Loading...</h1>,
});

const Forms:{
  [key:string]:(setOpen:Dispatch<SetStateAction<boolean>>,type:"create" | "update" ,data:any ,relatedData?: any)=>JSX.Element
}={
  
  subject: (setOpen,type, data, relatedData) => 
    <SubjectForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />
    ,class: (setOpen,type, data, relatedData) => 
      <ClassForm
        setOpen={setOpen}
        type={type}
        data={data}
        relatedData={relatedData}
      />
      ,teacher: (setOpen,type, data, relatedData) => 
        <TeacherForm
          setOpen={setOpen}
          type={type}
          data={data}
          relatedData={relatedData}
        />
        ,student: (setOpen,type, data, relatedData) => 
          <StudentForm
            setOpen={setOpen}
            type={type}
            data={data}
            relatedData={relatedData}
          />
          ,exam: (setOpen,type, data, relatedData) => 
            <ExamForm
              setOpen={setOpen}
              type={type}
              data={data}
              relatedData={relatedData}
            />

}
const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData
}:FormContaierProps & {relatedData:any}) => {

  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-[#FAE27C]"
      : type === "update"
        ? "bg-[#C3EBFA]"
        : "bg-[#CFCEFF]";

  const [open, setOpen] = useState(false)

   const Form=()=>{
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted!`);
        setOpen(false);
        router.refresh();
      }
    }, [state, router])
    return type ==="delete" && id?(
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="text | number" name="id" value={id} hidden />
      <span className="text-center font-medium">
        All data will be lost. Are you sure you want to delete this {table}?
      </span>
      <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
        Delete
      </button>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
    </form>
  ):type ==="create" ||type ==="update"?(
    Forms[table](setOpen,type,data,relatedData)
  ):("form not found") 
   }
  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => { setOpen(true) }}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && <div className="w-screen h-screen absolute left-0 top-0
        bg-black bg-opacity-60 z-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[60%] 2xl:w-[40%]">
          <Form/>
          <div className="absolute top-4 right-4  cursor-pointer" onClick={() => { setOpen(false) }}>
            <Image src="/close.png" alt="" width={14} height={14} />
            </div>

        </div>
      </div>
      }
    </>
  );
};

export default FormModal;
function setOpen(value: SetStateAction<boolean>): void {
  throw new Error("Function not implemented.");
}

