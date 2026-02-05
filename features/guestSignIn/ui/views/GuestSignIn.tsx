"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { usePostGuestSignIn } from "../../api";
import { useState } from "react";

const GuestSignIn = () => {
  const postGuest = usePostGuestSignIn();
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoaded) return null;

  const handleClick = async () => {
    setIsLoading(true);
    const token = await postGuest.mutateAsync({});

    const result = await signIn.create({
      strategy: "ticket",
      ticket: token as string,
    });

    if (result.status === "complete") {
      await setActive({ session: result.createdSessionId });
      router.push("/");
    }
    setIsLoading(false);
  };

  return (
    <button
      disabled={isLoading}
      onClick={handleClick}
      className="w-full max-w-[325px] bg-white py-1.5 font-sans mt-4 text-sm font-medium rounded-lg cursor-pointer disabled:bg-gray-500 disabled:cursor-normal"
    >
      Sign In As A Guest
    </button>
  );
};

export default GuestSignIn;
