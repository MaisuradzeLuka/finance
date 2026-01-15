import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useCreateTransaction from "@/hooks/categoriesHooks";
import Form from "../components/Form";

const CategoriesForm = ({ triggerStyles }: { triggerStyles?: string }) => {
  const { isOpen, onOpen, onClose } = useCreateTransaction();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? onOpen() : onClose())}>
      <SheetTrigger
        className={`bg-black text-white px-4 py-2 rounded-md hover:bg-blue-500 cursor-pointer transition ${triggerStyles}`}
      >
        Add New transaction
      </SheetTrigger>

      <SheetContent className="text-center md:text-left bg-white border-none px-6 py-4">
        <SheetTitle className="text-lg">New transaction</SheetTitle>
        <SheetDescription>
          Create a new transaction to keep track of your transactions
        </SheetDescription>

        <Form onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
};

export default CategoriesForm;
