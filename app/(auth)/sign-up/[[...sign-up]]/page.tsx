import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center h-dvh bg-[#1F1F23]">
      <SignUp appearance={{ theme: dark }} />
    </div>
  );
};

export default page;
