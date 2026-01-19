import { formatAmount, formatMonthYear } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

type Props = {
  title: string;
  startDate: string;
  endDate: string;
  value: number;
  change: number;
  icon: React.ReactNode;
};

const OverviewCard = ({
  change,
  endDate,
  startDate,
  icon,
  title,
  value,
}: Props) => {
  const isNegative = change < 0;

  return (
    <div className="bg-white rounded-md p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-sm text-gray-600">
            {formatMonthYear(startDate)} - {formatMonthYear(endDate)}
          </p>
        </div>

        <div className="flex items-center justify-center bg-blue-100 text-[#1A5EF2] rounded-lg w-9 h-9">
          {icon}
        </div>
      </div>

      <div>
        <p className="font-medium text-lg">{formatAmount(value)}</p>
        <p
          className={`text-sm ${
            isNegative ? "text-red-500" : "text-green-500"
          }`}
        >
          {!isNegative && "+"}
          {change}% from last period
        </p>
      </div>
    </div>
  );
};

export default OverviewCard;
