import { db } from "@/firebase";
import { Token } from "@/types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export const checkPreviousToken = async (uid: string) => {
  try {
    const q = query(
      collection(db, "tokens"),
      where("uid", "==", uid),
      orderBy("created_at", "desc"),
      limit(1),
    );
    let tokenData: Token[] = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Token;
      tokenData.push({ ...data });
    });
    const token = tokenData[0];
    console.log(token);

    if (!token) {
      return {
        success: true,
        message: "No previous token found",
      };
    }

    const lastTokenDate = new Date(token.created_at);
    const currentDate = new Date();

    const isSameDay =
      lastTokenDate.getFullYear() === currentDate.getFullYear() &&
      lastTokenDate.getMonth() === currentDate.getMonth() &&
      lastTokenDate.getDate() === currentDate.getDate();

    if (isSameDay) {
      return {
        success: true,
        message:"Token Found",
        token: token,
      };
    }else{
      return {
        success: true,
        message: "Previous token not on same day",
      };
    }
  } catch (error: any) {
    return {
      success: true,
      error: error.message,
    };
  }
};
