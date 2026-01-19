"use client";

import { useBulkDeleteCategories, useGetCategories } from "../../api";
import { columns } from "../components/Columns";
import DataTable from "../components/DataTable";
import CategoriesForm from "./CategoriesForm";

const CategoriesPage = () => {
  const { data, isError, isLoading } = useGetCategories();
  const mutation = useBulkDeleteCategories();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading accounts.</div>;

  return (
    <div className="pageWrapper">
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="text-3xl font-bold">Categories Page</h2>
        <CategoriesForm triggerStyles="mt-4 mb-10 w-full md:w-max" />
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

export default CategoriesPage;
