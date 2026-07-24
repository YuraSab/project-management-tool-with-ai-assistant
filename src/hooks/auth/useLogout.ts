import {useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {useProfileStore} from "../../store/profileStore.ts";
import {useAuthStore} from "../../store/authStore.ts";
import {signOut} from "firebase/auth";
import {auth} from "../../firebase.ts";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const setLogout = useAuthStore((state) => state.setLogout);
    const setProfile = useProfileStore((state) => state.setProfile);

    return async () => {
        try {
            await signOut(auth);
        } catch (e) {
            console.error("Logout error", e);
        }
        setLogout();
        setProfile(null);
        queryClient.clear();
        // localStorage.removeItem("auth-session-storage");
        navigate('/login', {replace: true});
    };
};