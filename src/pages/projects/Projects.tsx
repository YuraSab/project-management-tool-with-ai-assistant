import styles from "./Projects.module.css";
import { useUserProjects } from "../../hooks/users/useUserProjects";
import {useAuthStore} from "../../store/authStore.ts";
import ProjectCard from "../../components/projectCard/ProjectCard.tsx";
import clsx from "clsx";
import ProjectsSkeleton from "../../components/projectCard/ProjectsSkeleton.tsx";
import FAB from "../../ui/FAB/FAB.tsx";
import {Plus} from "lucide-react";
import Error from "../../components/error/Error.tsx";
import {useProfileStore} from "../../store/profileStore.ts";
import {useNavigate} from "react-router-dom";

const MODES = {
    white: styles.isLightMode,
    black: styles.isDarkMode
} as const;

const Projects = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user)
    const { data: projects, isPending, isError } = useUserProjects(user?.uid ?? "");
    const theme = useProfileStore((state) => state.profile.theme);

    if (isPending) return <ProjectsSkeleton/>;

    return (
        <div className={`${styles.main} ${MODES[theme]}`}>
            {
                projects && projects.length > 0
                    ? projects.map(p => <ProjectCard project={p} key={p.id}/>)
                    : <Error type={'not_found'}/>
            }
            {isError && <Error type={'server_crash'}/>}
            <FAB>
                <Plus size={36} color={theme} onClick={() => navigate('/projects/create')}/>
            </FAB>
        </div>
    );
};

export default Projects;