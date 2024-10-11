import Announcements from "@/app/component/comp/Announcements "
import BigCalendarContainer from "@/app/component/comp/bigCalendarContainer"
import EventCalendarContainer from "@/app/component/comp/eventCalendarContainer";
import { auth } from "@clerk/nextjs/server";


const TeacherPage=({
    searchParams,
  }: {
    searchParams: { [keys: string]: string | undefined };
  }) => {
  
    const {userId,sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currnetUserId=userId!;
    return(
        <div className=" flex-1 p-4 flex gap-4 flex-col xl:flex-row">
               {/* {left} */}
               <div className="w-full  xl:w-2/3">
               <div className="h-full bg-white p-4 rounded-md">
                <h1 className="text-xl font-semibold">Schedule</h1>
                <BigCalendarContainer type="teacherId" id={currnetUserId!}/>
               </div>
               </div>
               {/* {right} */}
            <div className=" w-full  xl:w-1/3 flex flex-col gap-8">
            <EventCalendarContainer searchParams={searchParams}/>
            <Announcements/>
            </div>
        </div>
    )
    }
    export default TeacherPage