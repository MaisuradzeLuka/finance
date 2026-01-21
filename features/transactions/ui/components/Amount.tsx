import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

type Props = {
  field: ControllerRenderProps<
    {
      amount: string;
      date: string;
      payee: string;
      accountId: string;
      categoryId?: string | undefined;
      notes?: string | undefined;
    },
    "amount"
  >;
};

const Amount = ({ field }: Props) => {
  const [isExpense, setIsExpense] = useState(+field.value < 0);

  const handleClick = () => {
    setIsExpense((prev) => !prev);

    const value = field.value;

    field.onChange(isExpense ? value.replace("-", "") : `-${value}`);
  };

  return (
    <div className="relative flex items-center">
      <Tooltip>
        <TooltipTrigger
          type="button"
          onClick={handleClick}
          className={`absolute left-2 w-6 h-6 rounded-md text-white ${
            isExpense ? "bg-red-500" : "bg-green-500"
          } cursor-pointer select-none`}
        >
          <span className="flex items-center justify-center">
            {isExpense ? (
              <BanknoteArrowDown className="w-5 h-5" />
            ) : (
              <BanknoteArrowUp className="w-5 h-5" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent className="bg-white">
          <p>{isExpense ? "Expense" : "Income"}</p>
        </TooltipContent>
      </Tooltip>

      <Input
        type="text"
        {...field}
        className="w-full border border-gray-500 rounded-md px-3 pl-10 py-2 placeholder-gray-400 outline-none ring-0!"
      />
    </div>
  );
};

export default Amount;
