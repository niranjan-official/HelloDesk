"use client";
import Header from "@/components/Header";
import { useAuth } from "@/firebase/auth";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  const User = useAuth();
  return (
    <div className="flex h-screen w-full flex-col items-center sm:justify-center overflow-hidden">
      <div className="max-w-2xl">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default layout;
