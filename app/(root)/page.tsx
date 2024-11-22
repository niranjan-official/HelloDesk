"use client";
import { rtdb } from "@/firebase";
import { checkPreviousToken } from "@/helpers";
import { onValue, ref } from "firebase/database";
import { useEffect, useLayoutEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";

export default function Home() {
  const [currentToken, setCurrentToken] = useState(-1);
  const [yourToken, setYourToken] = useState(-1);
  const [tokenLoad, setTokenLoad] = useState(true);
  const [uid, setUid] = useState("");

  useLayoutEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userDeskData"));
    if (userData) {
      setUid(userData.uid);
    }
    console.log(userData.uid);
  }, []);

  useEffect(() => {
    if (uid) {
      checkTokenHistory();
    }
  }, [uid]);

  useEffect(() => {
    const starCountRef = ref(rtdb, "CurrentToken");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setCurrentToken(data);
    });
  }, []);

  const checkTokenHistory = async () => {
    const res = await checkPreviousToken(uid);
    console.log(res);

    if (res.success) {
      if (res.tokenExist) {
        setYourToken(res.token);
      }
    }
    setTokenLoad(false);
  };

  const generateToken = async () => {
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
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="flex items-center gap-6 text-4xl font-extrabold">
        <div className="flex aspect-square w-36 flex-col items-center justify-center rounded-[0.6rem] border-4 border-slate-950 p-4">
          {currentToken !== -1 ? (
            <div className="flex flex-col text-center">
              <span className="text-sm">Current Token</span>
              {currentToken}
            </div>
          ) : (
            <VscLoading size={25} className="animate-spin" />
          )}
        </div>
        <div className="flex aspect-square w-36 flex-col items-center justify-center rounded-[0.6rem] border-4 border-slate-950 p-4">
          {!tokenLoad ? (
            yourToken !== -1 ? (
              <div className="flex flex-col text-center">
                <span className="text-sm">Your Token</span>
                {yourToken}
              </div>
            ) : (
              <button
                onClick={generateToken}
                className="cursor-pointer text-center text-xl uppercase"
              >
                Generate Token
              </button>
            )
          ) : (
            <VscLoading size={25} className="animate-spin" />
          )}
        </div>
      </div>
      {
        ((yourToken !== -1) && (currentToken > yourToken)) && (
          <button onClick={generateToken} className="p-2 px-4 bg-black text-white mt-4 rounded-xl">Regenerate</button>
        )
      }
    </div>
  );
}
