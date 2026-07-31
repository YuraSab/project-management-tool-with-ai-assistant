import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { useProfileStore } from "../../store/profileStore";
import { useAuthStore } from "../../store/authStore";
import { toast } from "../../utils/toaster";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const setLogout = useAuthStore((state) => state.setLogout);
    const setProfile = useProfileStore((state) => state.setProfile);

    return async () => {
        try {
            await logout();
        } catch (e) {
            console.error("Logout error", e);
            toast.error('Logout error!');
        } finally {
            setLogout();
            setProfile(null);
            queryClient.clear();
            navigate('/login', { replace: true });
        }
    };
};