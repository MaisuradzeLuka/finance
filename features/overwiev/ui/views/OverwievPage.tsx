"use client";

import { convertFromMiliunits } from "@/lib/utils";
import { useGetOverviewData } from "../../api";
import OverviewCard from "../components/OverviewCard";
import { HandCoins, TrendingDown, TrendingUp } from "lucide-react";

const OverwievPage = () => {
  const { data, isError, isLoading } = useGetOverviewData();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading accounts.</div>;

  console.log(data);

  return (
    <div className="pageWrapper bg-transparent! shadow-none! -mt-20!">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OverviewCard
          title="Remaining"
          change={data.changes.remainingChange}
          value={convertFromMiliunits(data.currentPeriod.remaining)}
          icon={<HandCoins />}
          startDate={data.from}
          endDate={data.to}
        />
        <OverviewCard
          title="Income"
          change={data.changes.incomeChange}
          value={convertFromMiliunits(data.currentPeriod.income)}
          icon={<TrendingUp />}
          startDate={data.from}
          endDate={data.to}
        />
        <OverviewCard
          title="Expenses"
          change={data.changes.expenseChange}
          value={convertFromMiliunits(data.currentPeriod.expense)}
          icon={<TrendingDown />}
          startDate={data.from}
          endDate={data.to}
        />
      </div>
    </div>
  );
};

export default OverwievPage;
