"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../comp/inputField";
import { eventSchema, EventSchema, ExamSchema,examSchema } from "@/lib/formValidationSchemas";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { createEvent, createExam,updateEvent,updateExam } from "@/lib/actions";
import { toast } from "react-toastify";

const EventForm =  ({
    setOpen,
    type,
    data,
    relatedData,
  }: {
    setOpen: Dispatch<SetStateAction<boolean>>;
    type: "create" | "update";
    data?: any;
    relatedData?: any;
  }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EventSchema>({
        resolver: zodResolver(eventSchema),
    });
// AFTER REACT 19 IT'LL BE USEACTIONSTATE

const [state, formAction] = useFormState(
    type === "create" ? createEvent: updateEvent,
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
      toast(`Event has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type,setOpen]);
   
  const {classes}=relatedData;
    return (

        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-lg font-semibold ">{type === "create" ? "Create a New Event" : "Update Event"}</h1>
            <div className="flex justify-between flex-wrap gap-4">
            <InputField
          label="Event title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Event Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
          type="textarea"
        />
        <InputField
          label="Start Date"
          name="startTime"
          defaultValue={data?.startTime.toISOString().split("T")[0]}
          register={register}
          error={errors?.startTime}
          type="datetime-local"
        />
        <InputField
          label="End Date"
          name="endTime"
          defaultValue={data?.endTime.toISOString().split("T")[0]}
          register={register}
          error={errors?.endTime}
          type="datetime-local"
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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            {classes.map(
              (item: { id: string; name: string;}) => (
                <option
                  value={item.id}
                  key={item.id}
                  selected={data && item.id === data.classId}
                >
                  {item.name}
                </option>
              )
            )}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>
            </div>

            <button className="bg-blue-400 text-white p-2 rounded-md ">{type === "create" ? "Create" : "Update"}</button>
        </form>
    )
}
export default EventForm