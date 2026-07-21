import { create } from "zustand";
import { persist } from "zustand/middleware";
import {AuthUser} from "../types/auth.ts";
import {useProfileStore} from "./profileStore.ts";

// true storage !!!!
interface AuthState {
    user: AuthUser | null;
    isUserLoading: boolean;
    isHeaderModalActive: boolean;
    // Методи
    setLogin: (user: AuthUser) => void;
    setLogout: () => void;
    setIsUserLoading: (value: boolean) => void;
    setIsHeaderModalActive: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isUserLoading: true,
            isHeaderModalActive: false, // todo delete

            setLogin: (user) => set({
                user: user,
                isUserLoading: false,
                isHeaderModalActive: false
            }),
            setLogout: () => {
                useProfileStore.getState().setProfile(null);
                set({
                    user: null,
                    isUserLoading: false,
                    // headerModalActive: false
                });
            },
            setIsUserLoading: (value) => set({ isUserLoading: value }),
            setIsHeaderModalActive: (value) => set({ isHeaderModalActive: value }),
        }),
        {
            name: "auth-session-storage", // ключ у localStorage
            partialize: (state) => ({ user: state.user })
        }
    )
);
