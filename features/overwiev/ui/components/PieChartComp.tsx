import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

type Props = {
  data: { categoryName: string; total: number }[];
};

const PieChartComp = ({ data }: Props) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const totalSum = data.reduce((acc, cur) => acc + cur.total, 0);

  return (
    <div className="w-full xl:col-span-2 h-80 ">
      <h3 className="text-xl mt-12 font-medium mb-2">Categories</h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 30, left: 0 }}>
          <Pie
            data={data}
            dataKey="total"
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="80%"
            paddingAngle={1}
            isAnimationActive
          >
            {data.map((entry: any, index: number) => (
              <Cell
                key={entry.categoryName}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Legend
            layout="horizontal"
            align="left"
            verticalAlign="bottom"
            content={({ payload }) => (
              <ul className="absolute space-y-2 top-0">
                {payload?.map((item: any, index: number) => {
                  const percent = (
                    (item.payload.total / totalSum) *
                    100
                  ).toFixed(1);

                  return (
                    <li
                      key={`item-${index}`}
                      className="w-max flex items-center gap-2"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="flex-1 text-gray-500">
                        {item.payload.categoryName}
                      </span>
                      <span className="text-muted-foreground font-medium">
                        {percent}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComp;
