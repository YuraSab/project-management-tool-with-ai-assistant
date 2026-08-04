import { create } from "zustand";
import { UserProfile } from "../types/user.ts";

interface ProfileState {
    profile: UserProfile | null,
    setProfile: (data: UserProfile | null) => void,
    editProfile: (data: Partial<UserProfile>) => void,
}
export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    setProfile: (data) => set({ profile: data }),
    editProfile: (data) => set((state) => {
        if (!state.profile) return state;
        return {
            profile: { ...state.profile, ...data }
        }
    }),
}));