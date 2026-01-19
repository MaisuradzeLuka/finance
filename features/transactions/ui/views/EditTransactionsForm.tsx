"use client";

import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useCreateTransaction from "@/hooks/transactionsHools";
import FormComp from "../components/Form";

const EditTransactionsForm = ({
  triggerStyles,
  id,
}: {
  triggerStyles?: string;
  id: string;
}) => {
  const { isOpen, onOpen, onClose } = useCreateTransaction();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? onOpen() : onClose())}>
      <SheetTrigger
        className={` text-black px-3 py-1 border border-black rounded-md hover:bg-black hover:text-white cursor-pointer transition ${triggerStyles}`}
      >
        Edit
      </SheetTrigger>

      <SheetContent className="text-center md:text-left bg-white border-none px-6 py-4">
        <SheetTitle className="text-lg">Edit transaction</SheetTitle>
        <SheetDescription>Edit and modify your transaction </SheetDescription>

        <FormComp onClose={onClose} id={id} />
      </SheetContent>
    </Sheet>
  );
};

export default EditTransactionsForm;
