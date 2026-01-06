import { client } from "@/lib/hono";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  typeof client.api.editAccount.$patch
>["json"];
type ResponseType = InferResponseType<typeof client.api.editAccount.$patch>;

export const useEditAccount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (accountName) => {
      const editedAccount = await client.api.editAccount.$patch({
        json: accountName,
      });

      return await editedAccount.json();
    },
    onSuccess: async () => {
      toast.success("Account edited succesfuly");
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => {
      toast.error("There was an error editing the account");
    },
  });

  return mutation;
};

export const useGetAccount = (id: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["account", id],
    queryFn: async () => {
      const res = await client.api.editAccount[":id"].$get({
        param: { id },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch account");
      }

      return res.json();
    },
  });

  return query;
};
