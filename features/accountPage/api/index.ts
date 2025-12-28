import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await client.api.accountsPage.$get();

      if (!res.ok) throw new Error("Failed to fetch accounts");

      return await res.json();
    },
  });

  return query;
};
