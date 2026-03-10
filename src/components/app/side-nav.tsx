"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const routes = [
  { name: "Home", path: "/" },
  { name: "General Setup", path: "/generalsetup" },
  { name: "Parameters", path: "/parameters" },
  { name: "Financials", path: "/financials" },
  { name: "Students", path: "/students" },
];

const SideNav = () => {
  const pathname = usePathname(); // Get the current pathname

  return (
    <>
      <nav className="flex flex-col py-[1.2rem] px-[3.2rem] ">
      <Image
  src="/assets/images/edulynklogo.png"
  alt="educate logo"
  className="w-[500px] h-auto mt-[4rem] mb-[8.8rem] mx-auto"
  priority
/>
        <ul>
          {routes.map((route) => (
            <li key={route.path} className="my-[2.85rem]">
              <Link
                href={route.path}
                className={`flex flex-col gap-[1.2rem] w-[24rem] ${
                  pathname === route.path
                    ? "w-[24rem]  h-[5.2rem] bg-primary text-educ8_white-1 flex justify-center -mx-[3.2rem] px-[3.2rem] my-[2.85rem]"
                    : ""
                }`}
              >
                {route.name}
              </Link>
            </li>
          ))}
        </ul>

        <style jsx>{`
          .nav-links {
            list-style: none;
            display: flex;
          }
          .nav-links li {
            margin-right: 20px;
          }
        `}</style>
      </nav>

      <div className="w-full mb-[0.16rem] mt-[10.4rem] border border-stroke-1" />
      <div className="flex flex-col py-[1.2rem] px-[3.2rem] gap-[1.2rem]">
        <Link href={"#"} className="my-[1.2rem]">
          Settings
        </Link>
        <Link href={"#"} className="my-[1.2rem]">
          Log Out
        </Link>
      </div>
    </>
  );
};

export default SideNav;
