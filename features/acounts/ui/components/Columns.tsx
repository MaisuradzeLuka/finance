"use client";

import { ColumnDef } from "@tanstack/react-table";
import { client } from "@/lib/hono";
import { ArrowUpDown } from "lucide-react";
import { InferResponseType } from "hono";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import EditAccountsForm from "../views/EditAccountsForm";

export type ResponseType = InferResponseType<
  typeof client.api.accounts.$get,
  200
>[0];

export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <EditAccountsForm id={row.original.id} />;
    },
  },
];
