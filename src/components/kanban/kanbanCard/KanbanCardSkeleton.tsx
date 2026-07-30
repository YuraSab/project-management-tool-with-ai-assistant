import styles from "./KanbanCardSkeleton.module.css";
import {useProfileStore} from "../../../store/profileStore.ts";
import {Theme} from "../../../types/user.ts";
// import skeletonStyles from "./Skeleton.module.css";

const KanbanCardSkeleton = ({ isCompact }: { isCompact: boolean }) => {
    const theme = useProfileStore((state) => state.profile?.theme) || Theme.White;
    const iconSize = isCompact ? 20 : 24;
    return (
        <div
            className={styles.cardMain + " w-full"}
            style={{ backgroundColor: theme, cursor: 'default' }}
        >
            {/* Імітація Title - висота 1.75rem (text-lg) */}
            <div className={`${styles.shimmer} h-6 w-3/4 mb-2`} />

            {/* Імітація Description - два рядки (text-sm) */}
            <div className={`${styles.shimmer} h-4 w-full mb-1`} />
            <div className={`${styles.shimmer} h-4 w-1/2 mb-4`} />

            {/* Сет іконок */}
            <div className="flex justify-end gap-1">
                {/* Рендеримо 3 "іконки" */}
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