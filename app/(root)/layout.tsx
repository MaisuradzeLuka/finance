import Header from "@/features/header/ui/views/Header";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default RootLayout;
