"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Form from "../components/Form";
import useCreateAccount from "@/hooks/accountHooks";

const AccountForm = ({ triggerStyles }: { triggerStyles?: string }) => {
  const { isOpen, onOpen, onClose } = useCreateAccount();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? onOpen() : onClose())}>
      <SheetTrigger
        className={`bg-black text-white px-4 py-2 rounded-md hover:bg-blue-500 cursor-pointer transition ${triggerStyles}`}
      >
        Add New Account
      </SheetTrigger>

      <SheetContent className="text-center md:text-left bg-white border-none px-6 py-4">
        <SheetTitle className="text-lg">New Account</SheetTitle>
        <SheetDescription>
          Create a new account to keep tack of your transactions
        </SheetDescription>

        <Form onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
};

export default AccountForm;
