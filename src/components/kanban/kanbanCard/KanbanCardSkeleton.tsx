import styles from "./KanbanCardSkeleton.module.css";

const KanbanCardSkeleton = ({ isCompact }: { isCompact: boolean }) => {
    const iconSize = isCompact ? 20 : 24;
    return (
        <div className={styles.cardMain + " w-full"}>
            <div className={`${styles.shimmer} h-6 w-3/4 mb-2`} />
            <div className={`${styles.shimmer} h-4 w-full mb-1`} />
            <div className={`${styles.shimmer} h-4 w-1/2 mb-4`} />
            <div className="flex justify-end gap-1">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className={styles.shimmer}
                        style={{
                            width: iconSize,
                            height: iconSize,
                            borderRadius: '50%'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default KanbanCardSkeleton;