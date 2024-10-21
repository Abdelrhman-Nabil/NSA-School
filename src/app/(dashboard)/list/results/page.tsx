import FormContianer from "@/app/component/comp/formContianer";
import Pagination from "@/app/component/comp/Pagination";
import Table from "@/app/component/comp/Table";
import TableSearch from "@/app/component/comp/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type resultsList = {
  id: number,
  title: string,
  className: string,
  studentName: string,
  studentSurname: string,
  score: number,
  startTime: Date,


};


const ReusltListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {

  const {userId,sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currnetUserId=userId!;

  const columns = [
    {
      header: "Title",
      accessor: "title",
      className: "",
  
    },
    {
      header: "Subject",
      accessor: " subject",
      className: "hidden lg:table-cell",
    },

    {
      header: "Student",
      accessor: "student",
      className: "hidden md:table-cell",
    },
  
    {
      header: "Score",
      accessor: "score",
      className: "hidden lg:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden lg:table-cell",
    },
  
    ...(role === "admin" || role === "teacher"
      ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
      : []),
  ];
  const renderRow = (item: resultsList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.title}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.className}</td>
      <td className="hidden md:table-cell">{item.studentName + " " + item.studentSurname}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      {new Intl.DateTimeFormat("en-GB").format(item.startTime)}
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContianer table="result" type="update" data={item} />
              <FormContianer table="result" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ResultWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = value;
            break;
          case "search":
            query.OR = [
              { exam: { title: { contains: value, mode: "insensitive" } } },
              { student: { name: { contains: value, mode: "insensitive" } } },
            ]
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
      query.OR = [
        { exam: { lesson: { teacherId: currnetUserId! } } },
        { assignment: { lesson: { teacherId: currnetUserId! } } },
      ];
      break;

    case "student":
      query.studentId = currnetUserId!;
      break;

    case "parent":
      query.student = {
        parentId: currnetUserId!,
      };
      break;
    default:
      break;
  }

  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: {
              select: {
                     subject:{select:{id:true,name:true}}
              }
            }
          }
        },
        assignment: {
          include: {
            lesson: {
              select: {
                subject:{select:{id:true,name:true}}
              }
            }
          }
        }
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.result.count({ where: query }),
  ]);
  const data = dataRes.map((item) => {
    const assessment = item.exam || item.assignment;

    if (!assessment) return null;

    const isExam = "startTime" in assessment;
    return {
      id: item.id,
      title: assessment.title,
      className: assessment.lesson.subject.name,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      score: item.score,
      startTime: isExam ? assessment.startTime : assessment.startDate,
    };
  });
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && (

              <FormContianer table="result" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ReusltListPage;