import { create } from "zustand";
import { UserProfile } from "../types/user.ts";

interface ProfileState {
    profile: UserProfile | null,
    setProfile: (data: UserProfile | null) => void,
    editProfile: (data: Partial<UserProfile>) => void,
}
export const useProfileStore = create<ProfileState>((set, get) => ({
    profile: null,
    setProfile: (data) => set({ profile: data }),
    editProfile: (data) => set({ profile: { ...get().profile, ...data } }),
}));