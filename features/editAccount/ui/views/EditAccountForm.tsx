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

const EditAccountForm = ({
  triggerStyles,
  id,
}: {
  triggerStyles?: string;
  id: string;
}) => {
  const { isOpen, onOpen, onClose } = useCreateAccount();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? onOpen() : onClose())}>
      <SheetTrigger
        className={` text-black px-3 py-1 border border-black rounded-md hover:bg-black hover:text-white cursor-pointer transition ${triggerStyles}`}
      >
        Edit
      </SheetTrigger>

      <SheetContent className="text-center md:text-left bg-white border-none px-6 py-4">
        <SheetTitle className="text-lg">Edit Account</SheetTitle>
        <SheetDescription>Edit and modify your account </SheetDescription>

        <Form onClose={onClose} id={id} />
      </SheetContent>
    </Sheet>
  );
};

export default EditAccountForm;
