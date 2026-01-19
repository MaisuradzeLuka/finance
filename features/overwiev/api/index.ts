import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetOverviewData = () => {
  const query = useQuery({
    queryKey: ["overview"],
    queryFn: async () => {
      const res = await client.api.overview.$get();

      if (!res.ok) {
        throw new Error("Error fetching transactions data");
      }

      return await res.json();
    },
  });

  return query;
};
