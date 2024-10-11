"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../comp/inputField";
import Image from "next/image";
import { ParentSchema,parentSchema } from "@/lib/formValidationSchemas";


const ParentForm = ({
    type,
    data,
}: {
    type: "create" | "update";
    data?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ParentSchema>({
        resolver: zodResolver(parentSchema),
    });
    const onSubmit = handleSubmit((data) => {
        console.log(data);
    });

    return (

        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-lg font-semibold ">
            {type ==="create"?"Create a New Parent":"Update Parent information"}
                 </h1>
            <span className="text-sm text-gray-400 font-medium">
                Authetication Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="User Name"
                    name="username"
                    defaultValue={data?.username}
                    register={register}
                    error={errors?.username}
                />
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    defaultValue={data?.email}
                    register={register}
                    error={errors.email}
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    defaultValue={data?.password}
                    register={register}
                    error={errors?.password}
                />
            </div>
            <span className="text-sm text-gray-400 font-medium">
                Personal Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="First Name"
                    name="firstName"
                    defaultValue={data?.name}
                    register={register}
                    error={errors.name}
                />
                <InputField
                    label="Last Name"
                    name="lastName"
                    defaultValue={data?.surname}
                    register={register}
                    error={errors.surname}
                />
                <InputField
                    label="Phone"
                    name="phone"
                    defaultValue={data?.phone}
                    register={register}
                    error={errors.phone}
                />
                <InputField
                    label="Address"
                    name="address"
                    defaultValue={data?.address}
                    register={register}
                    error={errors.address}
                />
                <InputField
                    label="Blood Type"
                    name="bloodType"
                    defaultValue={data?.bloodType}
                    register={register}
                    error={errors.bloodType}
                />
                <InputField
                    label="Birthday"
                    name="birthday"
                    defaultValue={data?.birthday}
                    register={register}
                    error={errors.birthday}
                    type="date"
                />
            <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Sex</label>

                <select className="ring-[1.5px]
         ring-gray-300 p-2 rounded-md text-sm w-full" {...register("sex")}
                    defaultValue={data?.sex}
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                {errors.sex?.message && <p className="text-xs text-red-400">{errors.sex?.message.toString()}</p>}

            </div>

                </div>
            <button className="bg-blue-400 text-white p-2 rounded-md ">{type === "create" ? "Create" : "Update"}</button>
        </form>
    )
}
export default ParentForm