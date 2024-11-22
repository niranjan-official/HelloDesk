"use client";
import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase"; // Ensure you import Firestore
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { VscLoading } from "react-icons/vsc";

const SignupPage = () => {
  const Router = useRouter();
  const [load, setLoad] = useState(false);

  const signup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoad(true);
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phno: formData.get("phno") as string,
      dept: formData.get("dept") as string,
      year: formData.get("year") as string,
      password: formData.get("password") as string,
      confirm: formData.get("confirm") as string,
    };

    // Check if passwords match
    if (data.password !== data.confirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      const user = userCredential.user;

      // Write user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        email: data.email,
        phno: data.phno,
        dept: data.dept,
        year: data.year,
        uid: user.uid,
        createdAt: new Date(),
      });

      Router.push("/");
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Error during signup. Please try again.");
      setLoad(false);
    }
  };

  return (
    <div className="m-h-screen flex w-full flex-col items-center justify-center bg-slate-50 p-4">
      <form
        className="flex w-full flex-col gap-4 rounded-xl border-2 border-black/50 bg-white p-4 shadow-xl md:w-80"
        onSubmit={signup}
      >
        <div className="flex flex-col items-center justify-end">
          <p className="font-serif text-2xl">Sign Up For</p>
          <h1 className="font-sans text-4xl font-extrabold text-black/80">
            Hello Desk PRC
          </h1>
          <p className="text-sm text-black/50">Powered by μLearn PRC</p>
          <hr className="mt-3 w-3/4 bg-black/10" />
        </div>
        <label htmlFor="name" className="flex flex-col gap-2">
          <span className="w-max rounded-xl bg-rose-200 p-2 px-4 font-serif text-sm">
            Name
          </span>
          <input
            type="string"
            name="name"
            id="name"
            placeholder="Name"
            required
          />
        </label>

        <label htmlFor="email" className="flex flex-col gap-2">
          <span className="w-max rounded-xl bg-purple-300 p-2 px-4 font-serif text-sm">
            E Mail
          </span>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="example@gmail.com"
            required
          />
        </label>

        <label htmlFor="phno" className="flex flex-col gap-2">
          <span className="w-max rounded-xl bg-green-300 p-2 px-4 font-serif text-sm">
            Phone Number
          </span>
          <input
            type="string"
            name="phno"
            id="phno"
            placeholder="+91 462658626"
            required
          />
        </label>
        <div className="flex flex-row justify-between gap-4">
          <label htmlFor="dept" className="flex flex-col gap-2">
            <span className="w-max rounded-xl bg-orange-300 p-2 px-4 font-serif text-sm">
              Department
            </span>
            <input
              type="string"
              name="dept"
              id="dept"
              placeholder="eg:ME"
              required
            />
          </label>
          <label htmlFor="year" className="flex flex-col gap-2">
            <span className="w-max rounded-xl bg-blue-300 p-2 px-4 font-serif text-sm">
              Year
            </span>
            <input
              type="string"
              name="year"
              id="year"
              placeholder="2"
              required
            />
          </label>
        </div>

        <label htmlFor="password" className="flex flex-col gap-2">
          <span className="w-max rounded-xl bg-purple-300 p-2 px-4 font-serif text-sm">
            Password
          </span>

          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
          />
        </label>

        <label htmlFor="confirm" className="flex flex-col gap-2">
          <span className="w-max rounded-xl bg-yellow-200 p-2 px-4 font-serif text-sm">
            Confirm Password
          </span>
          <input
            type="password"
            name="confirm"
            id="confirm"
            placeholder="Retype Password"
            required
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
          Already have an account ?{" "}
          <Link className="font-bold text-black" href={"/login"}>
            SignIn
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;