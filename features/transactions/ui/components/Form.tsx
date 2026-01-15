import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostTransactions } from "../../api";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useGetAccounts } from "@/features/acounts/api";
import { useGetCategories } from "@/features/categories/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { transactionFormSchema } from "@/lib/validationSchemas";
import Amount from "./Amount";
import { convertToMiliunits } from "@/lib/utils";

type FormValues = z.input<typeof transactionFormSchema>;

const FormComp = ({ onClose }: { onClose: () => void }) => {
  const postTransactions = usePostTransactions();
  const { data: accountsData } = useGetAccounts();
  const { data: categoriesData } = useGetCategories();

  const form = useForm<FormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      date: "",
      categoryId: "",
      payee: "",
      amount: "",
      accountId: "",
      notes: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    const parsedAmount = parseInt(values.amount);

    const formattedAmount = convertToMiliunits(parsedAmount);

    const formattedValues = { ...values, amount: formattedAmount };
    const res = await postTransactions.mutateAsync({ ...formattedValues });
    if (res) {
      form.reset();
      onClose();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid grid-cols-1 gap-6 mt-6"
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="w-full border border-gray-500 rounded-md px-3 py-2 placeholder-gray-400 outline-none ring-0!"
                />
              </FormControl>
              <FormMessage className="text-left -mb-2 mt-1 text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  className="w-full border border-gray-500 rounded-md px-3 py-2 placeholder-gray-400 outline-none ring-0!"
                />
              </FormControl>
              <FormMessage className="text-left -mb-2 mt-1 text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Amount field={field} />
              </FormControl>
              <FormMessage className="text-left -mb-2 mt-1 text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full border-gray-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white top-12">
                    {accountsData?.map((account) => (
                      <SelectItem
                        key={account.id}
                        value={account.id}
                        className="hover:bg-blue-100 cursor-pointer"
                      >
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-left -mb-2 mt-1 text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>category</FormLabel>
              <FormControl>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full border-gray-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white top-12">
                    {categoriesData?.map((account) => (
                      <SelectItem
                        key={account.id}
                        value={account.id}
                        className="hover:bg-blue-100 cursor-pointer"
                      >
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-left -mb-2 mt-1 text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  value={field.value || ""}
                  className="w-full border border-gray-500 rounded-md px-3 py-2 placeholder-gray-400 outline-none ring-0!"
                />
              </FormControl>
              <FormMessage className="text-left -mb-2 mt-1 text-red-500" />
            </FormItem>
          )}
        />
        <div>
          <Button
            type="submit"
            className="w-full bg-black text-white rounded-md py-3 mt-2 cursor-pointer"
          >
            Add Transaction
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormComp;
