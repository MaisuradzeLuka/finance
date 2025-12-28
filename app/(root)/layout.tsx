import Header from "@/features/header/ui/views/Header";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className=" max-w-[1240px] mx-4 -mt-14 xl:mx-auto bg-white rounded-lg px-4 md:px-8 py-12 shadow-lg">
        {children}
      </main>
    </>
  );
};

export default RootLayout;
