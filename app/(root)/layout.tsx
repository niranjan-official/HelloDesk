"use client";
import Header from "@/components/Header";
import { useAuth } from "@/firebase/auth";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  const User = useAuth();
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <Header />
      {children}
    </div>
  );
};

export default layout;
