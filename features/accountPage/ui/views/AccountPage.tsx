"use client";

import { columns } from "@/components/ui/columns";
import DataTable from "@/components/ui/dataTable";
import AccountForm from "@/features/account/ui/views/AccountForm";
import { useGetAccounts } from "../../api";

const AccountPage = () => {
  const { data, isError, isLoading } = useGetAccounts();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading accounts.</div>;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="text-3xl font-bold">Account Page</h2>
        <AccountForm triggerStyles="mt-4 mb-10 w-full md:w-max" />
      </div>
      <DataTable columns={columns} data={data} />
    </>
  );
};

export default AccountPage;
