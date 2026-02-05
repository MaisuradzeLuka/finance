import GuestAccountSignIn from "@/components/ui/guestAccountSignIn";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center h-dvh bg-[#1F1F23]">
      <SignIn appearance={{ theme: dark }} />
      <GuestAccountSignIn />
    </div>
  );
};

export default page;
