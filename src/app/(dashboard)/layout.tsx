import Link from "next/link";
import Menu from "../component/comp/menu";
import Image from "next/image";
import Navbar from "../component/comp/navbar";

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <div className="h-screen flex ">
        {/* {left} */}
        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]  p-4">
          <Link href={'/'} className="flex items-center  justify-center lg:justify-start gap-2">
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            <span className="hidden lg:block font-bold">SchoolBoka</span>
          </Link>
            <Menu/>
          </div>
        {/* {right} */}
        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-slate-100 
        overflow-scroll flex flex-col">
          <Navbar/>
          {children}
          </div>

      </div>
    </html>
  );
}