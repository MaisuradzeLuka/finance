import useCreateAccount from "@/hooks/accountHooks";
import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePostAccounts = () => {
  const mutation = useMutation({
    mutationFn: async (accountName: string) => {
      const newPost = await client.api.account.$post({
        json: { name: accountName },
      });

      return await newPost.json();
    },
    onSuccess: () => {
      toast.success("Account added succesfuly");
    },
    onError: () => {
      toast.error("There was an error adding the account");
    },
  });

  return mutation;
};
