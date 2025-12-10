"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/constants/headerData";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const MobileNav = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const handleClick = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <nav className="md:hidden ml-auto mr-2">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger
          onClick={() => setIsOpen(true)}
          className=" text-white cursor-pointer bg-white/20 p-1 rounded-sm"
        >
          <Menu />
        </SheetTrigger>

        <SheetContent className="bg-white">
          <SheetHeader>
            <SheetTitle className="hidden" />

            <ul className="grid items-center gap-4 mt-8">
              {navLinks.map((link) => {
                const isActive = link.path === pathname;

                return (
                  <li key={link.id}>
                    <button
                      onClick={() => handleClick(link.path)}
                      className={cn(
                        "text-black cursor-pointer",
                        isActive && "bg-black/20 px-3 py-1.5 rounded-md"
                      )}
                    >
                      {link.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
