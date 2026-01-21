import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const OverwievSkeleton = () => {
  return (
    <div className="pageWrapper bg-transparent! shadow-none! -mt-20! mb-[200px]">
      {/* Top overview cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-40 w-full rounded-md bg-gray-300" />
        <Skeleton className="h-40 w-full rounded-md bg-gray-300" />
        <Skeleton className="h-40 w-full rounded-md bg-gray-300" />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-16 mt-8">
        {/* Area chart placeholder spanning 2 cols on lg and 3 on xl */}
        <div className="w-full lg:col-span-2 xl:col-span-3">
          <h3 className="mt-4 text-xl font-medium mb-2">Transactions</h3>
          <Skeleton className="w-full h-80 rounded-md bg-gray-300" />
        </div>

        {/* Pie chart placeholder */}
        <div className="w-full xl:col-span-2 h-80">
          <h3 className="mt-4 text-xl font-medium mb-2">Categories</h3>
          <div className="flex items-center justify-center">
            <Skeleton className="w-48 h-48 rounded-full bg-gray-300" />
          </div>
          <div className="mt-6 space-y-3">
            <Skeleton className="h-4 w-40 rounded-md bg-gray-300" />
            <Skeleton className="h-4 w-36 rounded-md bg-gray-300" />
            <Skeleton className="h-4 w-32 rounded-md bg-gray-300" />
            <Skeleton className="h-4 w-24 rounded-md bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverwievSkeleton;
