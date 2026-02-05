"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const GuestAccountSignIn = () => {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  if (!isLoaded) return null;

  const handleClick = async () => {
    const result = await signIn.create({
      identifier: process.env.NEXT_PUBLIC_GUEST_EMAIL!,
      password: process.env.NEXT_PUBLIC_GUEST_PASSWORD!,
      strategy: "password",
    });

    if (result.status === "complete") {
      await setActive({ session: result.createdSessionId });
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full max-w-[325px] bg-white py-1.5 font-sans mt-4 text-sm font-medium rounded-lg cursor-pointer"
    >
      Sign In As A Guest
    </button>
  );
};

export default GuestAccountSignIn;
