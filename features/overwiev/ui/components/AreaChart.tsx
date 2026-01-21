import { convertFromMiliunits } from "@/lib/utils";
import { formatDate } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Props = {
  transactions: { income: number; expenses: number; date: string }[];
};

const AreaChartComp = ({ transactions }: Props) => {
  const formatedTransactions = transactions.map((transaction) => ({
    income: convertFromMiliunits(transaction.income),
    expense: convertFromMiliunits(transaction.expenses) * -1,
    date: formatDate(new Date(transaction.date), "MM/dd"),
  }));

  return (
    <div className="w-full lg:col-span-2 xl:col-span-3">
      <h3 className="mt-12 text-xl font-medium mb-2">Transactions</h3>
      <AreaChart
        style={{
          width: "100%",
          maxWidth: "950px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        responsive
        data={formatedTransactions}
        margin={{
          top: 20,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <Area
          dataKey="income"
          type="monotone"
          stroke="#22c55e"
          fill="rgba(34, 197, 94, 0.2)"
        />

        <Area
          dataKey="expense"
          type="monotone"
          stroke="#ef4444"
          fill="rgba(239, 68, 68, 0.2)"
        />
        <Tooltip />
      </AreaChart>
    </div>
  );
};

export default AreaChartComp;
