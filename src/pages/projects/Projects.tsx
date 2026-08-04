import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useUserProjects } from "../../hooks/users/useUserProjects";
import { useAuthStore } from "../../store/authStore.ts";
import { useProfileStore } from "../../store/profileStore.ts";
import FAB from "../../ui/FAB/FAB.tsx";
import ProjectCard from "../../components/projectCard/ProjectCard.tsx";
import ProjectsSkeleton from "../../components/projectCard/ProjectsSkeleton.tsx";
import Error from "../../components/error/Error";
import styles from "./Projects.module.css";

const Projects = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user)
    const theme = useProfileStore((state) => state.profile?.theme);
    const { data: projects, isPending, isError } = useUserProjects(user?.uid ?? "");

    if (isPending) return <ProjectsSkeleton/>;
    if (isError) return <Error type={'server_crash'}/>;

    return (
        <div className={styles.main}>
            {projects && projects.length > 0
                ? projects.map(p => <ProjectCard project={p} key={p.id}/>)
                : <Error type={'not_found'}/>
            }
            <FAB onClick={() => navigate('/projects/create')}>
                <Plus size={36} color={theme} />
            </FAB>
        </div>
    );
};

export default Projects;