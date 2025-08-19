// utils/favorites.ts
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {Home} from "@/app/api/homes";
export async function toggleFavorite(uid: string, home: Home) {
  const ref = doc(db, `users/${uid}/favorites`, home.id);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    await deleteDoc(ref); // remove from favorites
  } else {
    await setDoc(ref, home); // save to favorites
  }
}

export async function isHomeFavorited(uid: string, homeId: string) {
  const ref = doc(db, `users/${uid}/favorites`, homeId);
  const snapshot = await getDoc(ref);
  return snapshot.exists();
}
