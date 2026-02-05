import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type GuestSignInRequestType = InferRequestType<
  typeof client.api.guestsignin.$post
>;
type GuestSignInResponseType = InferResponseType<
  typeof client.api.guestsignin.$post
>;

export const usePostGuestSignIn = () => {
  const mutation = useMutation<
    GuestSignInResponseType,
    Error,
    GuestSignInRequestType
  >({
    mutationFn: async () => {
      const res = await client.api.guestsignin.$post();

      if (!res.ok) throw new Error("Failed to sign in");

      return await res.json();
    },

    onError: () => {
      toast.error("Something went wrong try again later");
    },
  });

  return mutation;
};
