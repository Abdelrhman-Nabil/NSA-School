import Announcements from "@/app/component/comp/Announcements "
import AttendanceChartConiter from "@/app/component/comp/attendanceChartContianer"
import CounterChartContianer from "@/app/component/comp/countChartContainer"
import EventCalendarContainer from "@/app/component/comp/eventCalendarContainer"
import FinanceChart from "@/app/component/comp/FinanceChart"
import UserCard from "@/app/component/comp/userCard"

const AdminPage = async ({
    searchParams,
  }: {
    searchParams: { [keys: string]: string | undefined };
  }) => {
    return (
        <div className=" p-4 flex gap-4 flex-col md:flex-row">
            {/* {left} */}
            <div className="w-full lg:w-2/3 flex-col gap-8">
                <div className=" flex gap-4 justify-between flex-wrap">
                    {/* {userCard} */}
                    <UserCard type="admin" />
                    <UserCard type="teacher" />
                    <UserCard type="student" />
                    <UserCard type="parent" />
                </div>
                {/* {middle chart} */}
                <div className="flex gap-4 flex-col lg:flex-row mt-3">
                    {/* countChart */}
                    <div className="w-full lg:w-1/3 h-[450px] ">
                    <CounterChartContianer/>
                        </div>
                    {/* AttendChart */}
                    <div className="w-full lg:w-2/3 h-[450px] ">
                    <AttendanceChartConiter/>
                    </div>
                </div>
                {/* {Bottom chart} */}
                <div className="w-full h-[500px]">
                    <FinanceChart/>
                </div>

            </div>
            {/* {right} */}
            <div className=" w-full  lg:w-1/3 flex flex-col gap-8">
            <EventCalendarContainer searchParams={searchParams}/>
            <Announcements/>
            </div>
        </div>
    )
}
export default AdminPage