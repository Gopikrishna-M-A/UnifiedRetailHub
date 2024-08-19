"use client";
import { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import Combobox from "./Combobox";
import { Menu, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

const Nav = () => {
  const [online, setOnline] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.onLine) {
        setOnline(true);
      } else {
        setOnline(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="border-b h-14 flex items-center px-5 justify-between">
      <div className="flex gap-3 items-center">
      <Link href='/manage'>
      <Menu className='w-5 h-5'/>
      </Link>
        <Link href='/' className="font-bold text-lg">Mart</Link>

        
      </div>

    

      <div className="flex gap-5 items-center">
        {/* <div>Register:Default Register</div> */}
        {/* <div>Company:ABc</div> */}
        {online ? (
          <div suppressHydrationWarning={true} className=" border-green-300 border text-sm px-2 rounded bg-green-50 text-green-400 dark:bg-green-950 dark:border-green-700 dark:text-green-500">Online</div>
        ) : (
          <div suppressHydrationWarning={true} className="border-red-300 border text-sm px-2 rounded bg-red-50 text-red-400  dark:bg-red-950 dark:border-red-900 dark:text-red-500">Offline</div>
        )}
       
       <RefreshCcw  
       onClick={() =>  router.refresh()}
       className="text-gray-500 hover:text-gray-700 cursor-pointer h-4 w-4"/>

        <Combobox/>

        <ModeToggle />
      </div>
    </div>
  );
};

export default Nav;
