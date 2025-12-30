import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.account.$post>["json"];
type ResponseType = InferResponseType<typeof client.api.account.$post>;

export const usePostAccounts = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (accountName) => {
      const newPost = await client.api.account.$post({
        json: accountName,
      });

      return await newPost.json();
    },
    onSuccess: async () => {
      toast.success("Account added succesfuly");
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => {
      toast.error("There was an error adding the account");
    },
  });

  return mutation;
};
