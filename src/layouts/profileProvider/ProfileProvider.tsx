import { ReactNode, useEffect } from 'react';
import { useUser } from "../../hooks/users/useUser";
import { useAuthStore } from "../../store/authStore";
import { useProfileStore } from "../../store/profileStore";

interface ProfileProviderProps {
    children: ReactNode,
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
    const user = useAuthStore((state) => state.user);
    const setProfile = useProfileStore((state) => state.setProfile);

    const { data: fetchedProfile, isSuccess, isLoading } = useUser(user?.uid || '', {
        enabled: !!user?.uid
    });

    useEffect(() => {
        if (!user) {
            setProfile(null);
            return;
        }
        if (isSuccess && fetchedProfile)
            setProfile(fetchedProfile);
    }, [fetchedProfile, user, isSuccess, setProfile]);

    if (user && isLoading)
        return <div>Loading profile...</div>; // todo - handle this with <GlobalSplashScreen/>

    return children;
};
