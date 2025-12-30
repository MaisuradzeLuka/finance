import { client } from "@/lib/hono";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  (typeof client.api.accountsPage)["bulk-delete"]["$post"]
>["json"];
type ResponseType = InferResponseType<
  (typeof client.api.accountsPage)["bulk-delete"]["$post"]
>;

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

export const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.accountsPage["bulk-delete"].$post({
        json,
      });

      if (!res.ok) throw new Error("Failed to delete accounts");

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Accounts deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => {
      toast.error("Failed to delete accounts");
    },
  });

  return mutation;
};
