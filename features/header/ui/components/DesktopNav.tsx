"use client";

import { navLinks } from "@/constants/headerData";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DesktopNav = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex justify-between w-full ml-8">
      <ul className="flex items-center gap-4">
        {navLinks.map((link) => {
          const isActive = link.path === pathname;

          return (
            <li key={link.id}>
              <Link
                href={link.path}
                className={cn(
                  "text-white",
                  isActive && "bg-white/20 px-3 py-1.5 rounded-md"
                )}
              >
                {link.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default DesktopNav;
