import styles from "./ProjectCardSkeleton.module.css";

const ProjectCardSkeleton = () => (
    <div className={styles.skeletonCard}>
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`}/>
        <div className={`${styles.skeleton} ${styles.skeletonText}`}/>
    </div>
);

export default ProjectCardSkeleton;