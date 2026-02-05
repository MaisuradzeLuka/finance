import GuestSignIn from "@/features/guestSignIn/ui/views/GuestSignIn";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center h-dvh bg-[#1F1F23]">
      <SignIn appearance={{ theme: dark }} />
      <GuestSignIn />
    </div>
  );
};

export default page;
