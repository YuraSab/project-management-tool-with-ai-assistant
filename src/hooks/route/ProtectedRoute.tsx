import {Navigate, Outlet} from "react-router-dom";
import {useAuthStore} from "../../store/authStore.ts";
import {useProfileStore} from "../../store/profileStore.ts";
import {Role} from "../../types/user.ts";

interface ProtectedRouteProps {
    allowedRoles?: Role[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const user = useAuthStore((state) => state.user);
    const isUserLoading = useAuthStore((state) => state.isUserLoading);
    const profile = useProfileStore((state) => state.profile);

    if (isUserLoading)
      return <div>Loading...</div>; // todo - real spinner
    if (!user)
      return <Navigate to={'/login'} replace />;
    if (!profile)
        return <div>Loading profile...</div>; // todo - real spinner
    if (allowedRoles && !allowedRoles.includes(profile.role))
        return <Navigate to={'/'} replace />;
    return <Outlet/>;
};
  
export default ProtectedRoute;