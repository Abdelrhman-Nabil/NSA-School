import FormContaier from "@/app/component/comp/formContianer";
import Pagination from "@/app/component/comp/Pagination";
import Table from "@/app/component/comp/Table";
import TableSearch from "@/app/component/comp/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Assignment, Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
type AssignmentList = Assignment & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};


;
const AssignmentsListPage =async ({
    searchParams,
  }: {
    searchParams: { [key: string]: string | undefined };
  }) => {
  
  
    const {userId,sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currnetUserId=userId!;

    const { page, ...queryParams } = searchParams;
  
    const p = page ? parseInt(page) : 1;
    const columns = [
      {
        header: "subject name",
        accessor: "subject",
        className: "",
    
      },
      {
        header: "Class",
        accessor: "class",
        className: "hidden md:table-cell",
      },
    
      {
        header: "Teacher",
        accessor: "teacher",
        className: "hidden lg:table-cell",
      },
    
      {
        header: "Due Date",
        accessor: " dueDate",
        className: "hidden lg:table-cell",
      },
    
      ...(role === "admin" || "teacher"
        ? [
            {
              header: "Actions",
              accessor: "action",
            },
          ]
        : []),
    ];
    
    const renderRow = (item: AssignmentList) => (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
      >
        <td className="flex items-center gap-4 p-4">
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.lesson.subject.name}</h3>
          </div>
        </td>
        <td className="hidden md:table-cell">{item.lesson.class.name}</td>
        <td className="hidden md:table-cell"> {item.lesson.teacher.name + " " + item.lesson.teacher.surname}</td>
        <td className="hidden md:table-cell">
         {new Intl.DateTimeFormat("en-US").format(item.dueDate)}
       </td>    <td>
          <div className="flex items-center gap-2">
    
          {(role === "admin" || role === "teacher") && (
                <>
                  <FormContaier table="assignment" type="update" data={item} />
                  <FormContaier table="assignment" type="delete" id={item.id} />
                </>
              )}
    </div>
        </td>
      </tr>
    )
  
    // URL PARAMS CONDITION
  
    const query: Prisma.AssignmentWhereInput = {};
  
    query.lesson = {};
    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          switch (key) {
            case "classId":
              query.lesson.classId = parseInt(value);
              break;
            case "teacherId":
              query.lesson.teacherId = value;
              break;
            case "search":
              query.lesson.subject = {
                name: { contains: value, mode: "insensitive" },
              };
              break;
            default:
              break;
          }
        }
      }
    }
    
    // role conditions
    switch (role) {
      case "admin":
        break;
        case "teacher":
          query.lesson.teacherId=currnetUserId!;
        break;
        case "student":
          query.lesson.class={
            students:{
              some:{id:currnetUserId!}
            }
          }
          break;
          case "student":
          query.lesson.class={
            students:{
              some:{parentId:currnetUserId!}
            }
          }
          break;
      default:
        break;
    }


    const [data, count] = await prisma.$transaction([
      prisma.assignment.findMany({
        where: query,
        include: {
          lesson: {
            select: {
              subject: { select: { name: true } },
              teacher: { select: { name: true, surname: true } },
              class: { select: { name: true } },
            },
          },
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      }),
      prisma.assignment.count({ where: query }),
    ]);
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Assignments</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContaier table="assignment" type="create"/>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count}/>
    </div>
  );
};

export default AssignmentsListPage;