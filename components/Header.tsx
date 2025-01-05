"use client";
import React, { useState } from "react";
import { FaUniversity } from "react-icons/fa";
import { BsGrid3X3GapFill } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { VscLoading } from "react-icons/vsc";
import Image from "next/image";
import { Oleo_Script } from 'next/font/google'

const oleo = Oleo_Script({
  subsets: ['latin'],
  display: 'swap',
  weight: '700'
})
const Header = () => {
  const [load, setLoad] = useState(false);
  const Router = useRouter();

  const logout = () => {
    setLoad(true);
    signOut(auth)
      .then(() => {
        Router.push("/login");
      })
      .catch((error) => {
        alert("Logout Failed");
        console.log(error.message);
        setLoad(false);
      });
  };
  return (
    <div className="flex items-center justify-between border-b p-4 shadow">
      <div className="flex items-center gap-2">
        <Image src={'/prc-official.png'} width={60} height={60} alt=".." />
        <div className="flex flex-col">
          <h1 className={`mt-1 text-xl font-extrabold leading-5 ${oleo.className}`}>Hello Desk</h1>
          <p className="text-xs uppercase text-neutral-500">
            providence college of engineering
          </p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <BsGrid3X3GapFill size={25} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <AlertDialog>
              <AlertDialogTrigger className="px-2 pb-2 text-sm">
                Logout
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Do you want to logout ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. You will need to login again to continue using your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button disabled={load} onClick={logout}>
                    {load ? <VscLoading /> : "Confirm"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
