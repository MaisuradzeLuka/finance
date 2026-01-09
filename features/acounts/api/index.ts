import { client } from "@/lib/hono";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

export const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await client.api.accounts.$get();

      if (!res.ok) {
        throw new Error("Error fetching accounts");
      }

      return await res.json();
    },
  });

  return query;
};

export const useGetAccount = (id: string) => {
  const query = useQuery({
    queryKey: ["account", { id }],
    queryFn: async (c) => {
      const res = await client.api.accounts[":id"].$get({ param: { id } });

      if (!res.ok) {
        throw new Error("Error fetching account");
      }

      return await res.json();
    },
  });

  return query;
};

type PostRequestType = InferRequestType<
  typeof client.api.accounts.$post
>["json"];
type PostResponseType = InferResponseType<typeof client.api.accounts.$post>;

export const usePostAccounts = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<PostResponseType, Error, PostRequestType>({
    mutationFn: async (name) => {
      const res = await client.api.accounts.$post({ json: name });

      return await res.json();
    },
    onSuccess: async () => {
      toast.success("Account added successfully");
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => {
      toast.error("There was an error adding the account");
    },
  });

  return mutation;
};

type BulkDeleteRequestType = InferRequestType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>["json"];
type BulkDeleteResponseType = InferResponseType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>;

export const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    BulkDeleteResponseType,
    Error,
    BulkDeleteRequestType
  >({
    mutationFn: async (ids) => {
      const res = await client.api.accounts["bulk-delete"].$post({
        json: ids,
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

type EditRequestType = InferRequestType<
  typeof client.api.accounts.$patch
>["json"];
type EditResponseType = InferResponseType<typeof client.api.accounts.$patch>;

export const useEditAccount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<EditResponseType, Error, EditRequestType>({
    mutationFn: async (data) => {
      const res = await client.api.accounts.$patch({ json: data });

      if (!res.ok) throw new Error("Failed to edit account");

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Accounts edited successfully");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => {
      toast.error("Failed to edit accounts");
    },
  });

  return mutation;
};
