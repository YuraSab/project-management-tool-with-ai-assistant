import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser } from "../types/auth";
import { useProfileStore } from "./profileStore";

interface AuthState {
    user: AuthUser | null;
    isUserLoading: boolean;
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
            setLogin: (user) => set({
                user: user,
                isUserLoading: false,
                isHeaderModalActive: false
            }),
            setLogout: () => {
                useProfileStore.getState?.().setProfile(null);
                set({
                    user: null,
                    isUserLoading: false,
                });
            },
            setIsUserLoading: (value) => set({ isUserLoading: value }),
            setIsHeaderModalActive: (value) => set({ isHeaderModalActive: value }),
        }),
        {
            name: "auth-session-storage",
            partialize: (state) => ({ user: state.user })
        }
    )
);
