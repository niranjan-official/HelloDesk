"use client";
import Clock from "@/components/clock";
import { rtdb } from "@/firebase";
import { checkPreviousToken } from "@/helpers";
import { onValue, ref } from "firebase/database";
import { useEffect, useLayoutEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";

export default function Home() {
  const [currentToken, setCurrentToken] = useState(-1);
  const [yourToken, setYourToken] = useState<number>(-1);
  const [tokenLoad, setTokenLoad] = useState(true);
  const [isRunning, setIsRunning] = useState(true);
  const [date, setDate] = useState("");
  const [uid, setUid] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setTimeout(() => {
      const data = localStorage.getItem("userDeskData");
      if (data) {
        const userData = JSON.parse(data);
        setUid(userData.uid);
        console.log(userData.uid);
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (uid) {
      checkTokenHistory();
    }
  }, [uid]);

  useEffect(() => {
    const starCountRef = ref(rtdb, "isRunning");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setIsRunning(data);
    });
  }, []);

  useEffect(() => {
    const starCountRef = ref(rtdb, "CurrentToken");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setCurrentToken(data);

      if (yourToken !== -1) {
        if (data > yourToken) {
          setStatus("skipped");
        } else {
          setStatus("pending");
        }
      }
    });
  }, [yourToken]);

  const checkTokenHistory = async () => {
    const res = await checkPreviousToken(uid);
    console.log(res);

    if (!res.success) {
      console.log(res.error);
      return;
    }
    console.log(res.message);

    if (res.token) {
      setYourToken(res.token.token);
      setStatus(res.token.status);
      const newDate = new Date(res.token.created_at);
      const formattedTimeIST = newDate.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setDate(formattedTimeIST);
    }
    setTokenLoad(false);
  };

  const generateToken = async () => {
    if (!isRunning) return;
    setTokenLoad(true);
    const data = {
      uid,
    };
    try {
      const res = await fetch("/api/generate-token", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
      });
      const result = await res.json();
      console.log(result);
      if (result.success) {
        console.log("Token Generated");
        setYourToken(result.token);
      }
    } catch (error: any) {
      console.log(error.message);
    }
    setTokenLoad(false);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center p-4">
      <div className="flex flex-col rounded-[0.4rem] border p-5 shadow">
        <h3 className="text-xl font-bold">Working Hours</h3>
        <p className="mt-2 text-sm text-neutral-500">
          Monday to Friday: 9:00 AM - 4:00 PM
        </p>
        <p className="mt-2 text-sm font-medium">
          Tokens are generated only during working hours. Please ensure you use
          your token within this timeframe
        </p>
      </div>
      <button
        disabled={
          !isRunning ||
          tokenLoad ||
          (yourToken !== -1 && currentToken <= yourToken)
        }
        onClick={generateToken}
        className="mt-6 flex w-full justify-center rounded-[0.4rem] bg-[#9c0f05] p-2 font-medium text-white shadow disabled:bg-zinc-600"
      >
        {" "}
        {tokenLoad ? (
          <VscLoading size={25} className="animate-spin" />
        ) : yourToken !== -1 && currentToken > yourToken ? (
          "Regenerate Token"
        ) : (
          "Generate Token"
        )}
      </button>
      <div className="relative mt-6 flex w-full flex-col rounded-[0.4rem] border p-5 shadow">
        <h4 className="text-2xl font-semibold">Current Token</h4>
        {currentToken !== -1 ? (
          <span className="text-4xl font-extrabold">{currentToken}</span>
        ) : (
          <VscLoading size={25} className="mt-2 animate-spin" />
        )}
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          {!isRunning ? (
            <span className="rounded-3xl bg-red-500 p-1 px-3 text-xs font-medium text-white">
              System Paused
            </span>
          ) : (
            <Clock />
          )}
        </div>
      </div>
      {!tokenLoad && yourToken !== -1 && (
        <div className="relative mt-4 flex w-full items-center justify-between rounded-[0.4rem] border p-5 pr-8 shadow">
          <div>
            <h4 className="text-2xl font-bold leading-6">
              Your Token <br /> Number
            </h4>
            <p className="mt-1 text-sm text-neutral-600">
              Generated At <span className="uppercase">{date}</span>
            </p>
            <p className="text-sm text-yellow-600">{status === "pending" && "Token is in pending list"}</p>
          </div>
          <span className="text-4xl font-bold">:</span>
          <span className="text-6xl font-extrabold">{yourToken}</span>
        </div>
      )}
    </div>
  );
}
