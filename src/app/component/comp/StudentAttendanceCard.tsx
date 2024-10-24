import prisma from "@/lib/prisma"

const StudentAttendanceCard = async ({ id }: { id: string }) => {

    const attendance=await prisma.attendance.findMany({
        where:{
            studentId:id,
            date:{
                gte:new Date(new Date().getFullYear(),0,1)
            }
        }
    })
    const TotalDay=attendance.length;
    const present=attendance.filter(day=>day.present).length;
    const persentage=(present / TotalDay) * 100;
    return (
        <div className="">
            <h1 className="text-xl font-semibold">{persentage||"-"}%</h1>
            <span className="text-sm text-gray-400">Attendance</span>
        </div>
    )
}
export default StudentAttendanceCard