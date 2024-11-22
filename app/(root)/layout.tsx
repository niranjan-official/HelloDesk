"use client";
import { useAuth } from "@/firebase/auth";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  const User = useAuth();
  return <div>{children}</div>;
};

export default layout;
