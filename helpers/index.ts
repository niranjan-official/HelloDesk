import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export const checkPreviousToken = async (uid: string) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return { success: false, error: "user not logged in" };
  }

  const data = docSnap.data();
  if (!data.last_token) {
    return { success: true, tokenExist: false, error: "No previous token found" };
  }

  const lastTokenDate = new Date(data.last_token);
  const currentDate = new Date();

  const isSameDay =
    lastTokenDate.getFullYear() === currentDate.getFullYear() &&
    lastTokenDate.getMonth() === currentDate.getMonth() &&
    lastTokenDate.getDate() === currentDate.getDate();

  if (isSameDay) {
    return {
      success: true,
      tokenExist: true,
      token: data.token,
    };
  }

  return {
    success: true,
    tokenExist: false,
    error: "Token expired or not found for today",
  };
};
