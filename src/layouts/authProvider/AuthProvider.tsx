import { ReactNode, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuthStore } from "../../store/authStore";
import { useShallow } from "zustand/react/shallow";

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const {
        setLogin, setLogout,
        isUserLoading, setIsUserLoading
    } = useAuthStore(useShallow((state) => ({
        setLogin: state.setLogin, setLogout: state.setLogout,
        isUserLoading: state.isUserLoading, setIsUserLoading: state.setIsUserLoading
    })));

    useEffect(() => { // firebase & zustand data sync
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setLogin({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName ||'User',
                });
            } else
                setLogout();
            setIsUserLoading(false);
        });
        return () => unsubscribe();
    }, [setLogin, setLogout, setIsUserLoading]);


    if (isUserLoading)
        return <div>Loading...</div>; // todo - add real loader

    return children;
};