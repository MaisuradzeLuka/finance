"use client";

import { useBulkDeleteTransactions } from "@/features/transactions/api/index";
import { useGetTransactions } from "../../api";
import { columns } from "../components/Columns";
import DataTable from "../components/DataTable";
import AccountsForm from "./TransactionsForm";

const TransactionsPage = () => {
  const { data, isError, isLoading } = useGetTransactions();
  const mutation = useBulkDeleteTransactions();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading Transactions.</div>;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="text-3xl font-bold">Transactions Page</h2>
        <AccountsForm triggerStyles="mt-4 mb-10 w-full md:w-max" />
      </div>
      <DataTable
        columns={columns}
        data={data}
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id);

          mutation.mutate({ ids });
        }}
      />
    </>
  );
};

export default TransactionsPage;
