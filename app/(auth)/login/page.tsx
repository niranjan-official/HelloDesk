"use client";
import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VscLoading } from "react-icons/vsc";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

const page = () => {
  const Router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);
  const { toast } = useToast();

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoad(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Router.push("/");
    } catch (error: any) {
      console.error("Login failed:", error.code);
      if(error.code === "auth/invalid-credential"){
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid Email or password",
        });
      }else{
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
      }
      setLoad(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-100 px-4">
      <form
        className="flex w-full flex-col gap-4 rounded-xl border-2 border-black/50 bg-white p-4 shadow-xl md:w-80"
        onSubmit={login}
      >
        <div className="flex flex-col items-center justify-end">
          <p className="font-serif text-2xl">Login In To</p>
          <h1 className="font-sans text-4xl font-extrabold text-black/80">
            Hello Desk Prc
          </h1>
          <p className="text-sm text-black/50">Powered by μLearn PRC</p>
          <hr className="mt-3 w-3/4 bg-black/10" />
        </div>

        <label htmlFor="email" className="flex flex-col gap-2">
          <span className="w-max rounded-xl bg-rose-200 p-2 px-4 font-serif text-sm">
            E Mail
          </span>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="example@gmail.com"
            className="border-2 border-black/30"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label htmlFor="password" className="flex flex-col gap-2">
          <span className="w-max rounded-xl bg-purple-300 p-2 px-4 font-serif text-sm">
            Password
          </span>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="password"
            className="border-2 border-black/30"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button
          disabled={load}
          type="submit"
          className="flex justify-center rounded-[0.5rem] bg-green-500 p-2 font-serif text-white shadow disabled:bg-green-700"
        >
          {load ? (
            <VscLoading size={20} className="animate-spin text-white" />
          ) : (
            "Submit"
          )}
        </button>
        <p className="text-center text-neutral-600">
          Don't have an account?{" "}
          <Link className="font-bold text-black" href={"/signup"}>
            SignUp
          </Link>
        </p>
      </form>
    </div>
  );
};

export default page;
