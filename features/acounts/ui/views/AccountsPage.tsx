"use client";

import { useBulkDeleteAccounts } from "@/features/acounts/api/index";
import { useGetAccounts } from "../../api";
import { columns } from "../components/Columns";
import DataTable from "../components/DataTable";
import AccountsForm from "./AccountsForm";
import AccountsSkeleton from "../components/AccountsSkeleton";

const AccountsPage = () => {
  const { data, isError, isLoading } = useGetAccounts();
  const mutation = useBulkDeleteAccounts();

  if (isLoading) return <AccountsSkeleton />;
  if (isError || !data) return <div>Error loading accounts.</div>;

  return (
    <div className="pageWrapper">
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="text-3xl font-bold">Accounts Page</h2>
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
    </div>
  );
};

export default AccountsPage;
