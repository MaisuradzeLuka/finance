"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Form from "../components/Form";

const AccountForm = () => {
  return (
    <Sheet>
      <SheetTrigger>Create Account</SheetTrigger>

      <SheetContent className="text-center md:text-left bg-white border-none px-6 py-4">
        <SheetTitle className="text-lg">New Account</SheetTitle>
        <SheetDescription>
          Create a new account to keep tack of your transactions
        </SheetDescription>

        <Form />
      </SheetContent>
    </Sheet>
  );
};

export default AccountForm;
