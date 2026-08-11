import { collection, doc, getDoc, getDocs, query, where, documentId, updateDoc, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { UserProfile } from "../types/user";

// export const createUser = async ( user: Partial<UserProfile> & { id: string }): Promise<void> => {
//     const userRef = doc(db, 'users', user.id);
//     const profile = {
//         uid: user.id,
//         email: user.email,
//         displayName: user.displayName || "User",
//         photoURL: user.photoURL || null,
//         role: user.role || "member",
//         createdAt: new Date().toISOString(),
//     };
//     return await setDoc(userRef, profile);
// };

export const getUser = async (userId: string): Promise<UserProfile | null> => {
    if (!userId) return null;
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return null;
    return {
        uid: userSnap.id,
        ...userSnap.data()
    } as UserProfile;
};

export const getUsersByIds = async (usersIds: string[]): Promise<UserProfile[]> => {
    if (!usersIds || usersIds.length === 0) return [];
    const usersRef = collection(db, 'users');
    const usersQuery = query(usersRef, where(documentId(), 'in', usersIds ));
    const usersSnap = await getDocs(usersQuery);
    return usersSnap.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data()
    } as UserProfile));
};

export const searchUsersByEmail = async (searchTerm: string): Promise<UserProfile[]> => {
    // Create an upper bound for the search.
    const strStart = searchTerm.trim().toLowerCase();
    if (!strStart) return [];
    // Adding the character '\uf8ff' (the last Unicode character) allows finding all strings
    // that start with strSearch
    const strEnd = strStart + '\uf8ff';
    const usersRef = collection(db ,'users');
    const usersQuery = query(
      usersRef,
        orderBy('email'),
        where('email', '>=', strStart),
        where('email', '<=', strEnd),
        limit(10)
    );
    const usersSnap = await getDocs(usersQuery);

    return usersSnap.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data()
    } as UserProfile));
};

export const updateUser = async (user : Partial<UserProfile> & { uid: string }): Promise<void> => {
    const { uid, ...rest } = user;
    const userRef = doc(db, 'users', uid);
    return await updateDoc(userRef, rest);
};

