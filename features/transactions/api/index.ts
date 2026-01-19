import { client } from "@/lib/hono";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

export const useGetTransactions = () => {
  const query = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await client.api.transactions.$get();

      if (!res.ok) {
        throw new Error("Error fetching transactions");
      }

      return await res.json();
    },
  });

  return query;
};

export const useGetTransaction = (id: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["transaction", { id }],
    queryFn: async () => {
      const res = await client.api.transactions[":id"].$get({ param: { id } });

      if (!res.ok) {
        throw new Error("Error fetching transaction");
      }

      return await res.json();
    },
  });

  return query;
};

type PostRequestType = InferRequestType<
  typeof client.api.transactions.$post
>["json"];
type PostResponseType = InferResponseType<typeof client.api.transactions.$post>;

export const usePostTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<PostResponseType, Error, PostRequestType>({
    mutationFn: async (values) => {
      const res = await client.api.transactions.$post({ json: { ...values } });

      if (!res.ok) throw new Error("Error adding transaction");

      return await res.json();
    },
    onSuccess: async () => {
      toast.success("Transaction added successfully");
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("There was an error adding the transaction");
    },
  });

  return mutation;
};

type BulkDeleteRequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-delete"]["$post"]
>["json"];
type BulkDeleteResponseType = InferResponseType<
  (typeof client.api.transactions)["bulk-delete"]["$post"]
>;

export const useBulkDeleteTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    BulkDeleteResponseType,
    Error,
    BulkDeleteRequestType
  >({
    mutationFn: async (ids) => {
      const res = await client.api.transactions["bulk-delete"].$post({
        json: ids,
      });

      if (!res.ok) throw new Error("Failed to delete transactions");

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Transactions deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to delete transactions");
    },
  });

  return mutation;
};

type EditRequestType = InferRequestType<
  typeof client.api.transactions.$patch
>["json"];
type EditResponseType = InferResponseType<
  typeof client.api.transactions.$patch
>;

export const useEditTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<EditResponseType, Error, EditRequestType>({
    mutationFn: async (data) => {
      const res = await client.api.transactions.$patch({ json: data });

      if (!res.ok) throw new Error("Failed to edit transaction");

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Transaction edited successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to edit transactions");
    },
  });

  return mutation;
};
