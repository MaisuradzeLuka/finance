"use client";

import Image from "next/image";
import Link from "next/link";
import MobileNav from "../components/MobileNav";
import DesktopNav from "../components/DesktopNav";
import { UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <header className="px-4 py-6 bg-linear-to-b from-blue-700 to-blue-500">
      <div className=" max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" width={140} height={60} alt="page logo" />
          </Link>

          <MobileNav />
          <DesktopNav />

          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "!w-10 !h-10",
              },
            }}
          />
        </div>

        <div className="my-10 md:my-20">
          <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-medium">
            Welcome to finance
          </h2>

          <p className="text-gray-200 mt-2 md:mt-3 lg:text-lg">
            This is your Financial Overview Report
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
