"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../comp/inputField";
import {gradeSchema, GradeSchema } from "@/lib/formValidationSchemas";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import {createGrade, updateGrade } from "@/lib/actions";
import { toast } from "react-toastify";

const GradeForm =  ({
    setOpen,
    type,
    data,
  }: {
    setOpen: Dispatch<SetStateAction<boolean>>;
    type: "create" | "update";
    data?: any;
  }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<GradeSchema>({
        resolver: zodResolver(gradeSchema),
    });
// AFTER REACT 19 IT'LL BE USEACTIONSTATE

const [state, formAction] = useFormState(
    type === "create" ? createGrade: updateGrade,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Level has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type,setOpen]);
   
    return (

        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-lg font-semibold ">{type === "create" ? "Create a New Grade" : "Update Grade"}</h1>
            <div className="flex justify-between flex-wrap gap-4">
            <InputField
                    label="Level"
                    name="level"
                    defaultValue={data?.level}
                    register={register}
                    error={errors?.level}
                />
               {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}

            </div>

            <button className="bg-blue-400 text-white p-2 rounded-md ">{type === "create" ? "Create" : "Update"}</button>
        </form>
    )
}
export default GradeForm