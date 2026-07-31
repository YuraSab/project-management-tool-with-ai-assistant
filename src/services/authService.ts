import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase"
import { HighlightColor, IconColor, Role, Theme } from "../types/user";

export const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const register = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName });
    const userRef = doc(db, 'users', user.uid);
    const body = {
        uid: user.uid,
        displayName,
        email,
        role: Role.Member,
        reservedMembers: [],
        createdAt: new Date().toISOString(),
        photoURL: '',
        iconColor: IconColor.Purple,
        highlightColor: HighlightColor.Purple,
        theme: Theme.White
    };
    await setDoc(userRef, body);
    return user;
};

export const logout = () => {
    return signOut(auth);
};