"use client";

import { convertFromMiliunits } from "@/lib/utils";
import { useGetOverviewData } from "../../api";
import OverviewCard from "../components/OverviewCard";
import { HandCoins, TrendingDown, TrendingUp } from "lucide-react";
import AreaChart from "../components/AreaChart";
import PieChartComp from "../components/PieChartComp";

const OverwievPage = () => {
  const { data, isError, isLoading } = useGetOverviewData();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading accounts.</div>;

  return (
    <div className="pageWrapper bg-transparent! shadow-none! -mt-20! mb-[200px]">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-16 ">
        <AreaChart transactions={data.transactions} />
        <PieChartComp data={data.spendingsByCategory} />
      </div>
    </div>
  );
};

export default OverwievPage;
