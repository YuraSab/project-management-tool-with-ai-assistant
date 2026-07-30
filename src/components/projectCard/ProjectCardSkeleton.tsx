import clsx from "clsx";
import styles from "./ProjectCardSkeleton.module.css";

const ProjectCardSkeleton = () => {
    return (
        <div className={styles.skeletonCard}>
            <div style={{ width: '100%' }}>
                <div className={clsx(styles.skeleton, styles.skeletonTitle)} />
                <div className={clsx(styles.skeleton, styles.skeletonText)} />
            </div>
        </div>
    );
};

export default ProjectCardSkeleton;