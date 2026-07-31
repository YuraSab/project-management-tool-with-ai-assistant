import {ReactNode, MouseEvent, useEffect} from "react";
import {X} from "lucide-react";
import styles from './BlurWrapper.module.css';

interface BlurWrapperProps {
    closeEvent?: () => void,
    children: ReactNode,
}

const BlurWrapper = ({ closeEvent, children }: BlurWrapperProps) => {
    const handleContentClick = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

    useEffect(() => {
        if (!closeEvent) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape')
                closeEvent();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeEvent]);

    return (
        <div
            className={styles.overlay}
            aria-label="Close overlay"
            role={'button'}
        >
            <div
                className={styles.content}
                onClick={handleContentClick}
                role="dialog"
            >
                <button
                    type={"button"}
                    onClick={() => closeEvent?.()}
                >
                    <X
                        className={styles.x}
                        size={30}
                        color={'black'}
                    />
                </button>

                {children}
            </div>
        </div>
    );
};

export default BlurWrapper;