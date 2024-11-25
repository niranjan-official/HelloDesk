import { NextRequest, NextResponse } from "next/server";
import { doc, runTransaction, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const uid = data.uid;

  if (!uid) {
    return NextResponse.json({
      success: false,
      error: "User ID is required.",
    });
  }

  const counterDocRef = doc(db, "counters", "tokenDetails");
  const userDocRef = doc(db, "users", uid);

  try {
    const token = await runTransaction(db, async (transaction) => {
      // Fetch and update the token counter
      const counterDoc = await transaction.get(counterDocRef);

      let nextValue = 1;

      if (counterDoc.exists()) {
        const currentValue = counterDoc.data().token;
        nextValue = currentValue + 1;
        transaction.update(counterDocRef, { token: nextValue });
      } else {
        transaction.set(counterDocRef, { token: nextValue });
      }

      // Update the user's document with the new token and timestamp
      const timestamp = new Date().toISOString();
      transaction.set(
        userDocRef,
        {
          token: nextValue,
          last_token: timestamp,
        },
        { merge: true }
      );

      return nextValue;
    });

    // Parallel write: Add the token document to the "tokens" collection
    const tokenDocRef = doc(db, "tokens", token.toString());
    await setDoc(tokenDocRef, {
      uid: uid,
      token: token,
      created_at: new Date().toISOString(),
      status: "pending"
    });

    return NextResponse.json({
      success: true,
      token,
    });
  } catch (error: any) {
    console.error("Error generating token:", error.message);
    return NextResponse.json({
      success: false,
      error: "Failed to generate token. Please try again.",
    });
  }
}
