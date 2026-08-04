import ProjectCardSkeleton from "./ProjectCardSkeleton";
import styles from './ProjectSkeleton.module.css';

interface ProjectsSkeletonProps {
    count?: number;
}

const ProjectsSkeleton = ({ count }: ProjectsSkeletonProps) => (
    <div className={styles.wrapper}>
        <div className={styles.container}>
            {Array.from({ length: count || 10}).map((_, index) => (
                <ProjectCardSkeleton key={index}/>
            ))}
        </div>
    </div>
);

export default ProjectsSkeleton;