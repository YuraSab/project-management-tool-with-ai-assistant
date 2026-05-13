import React, {HTMLAttributes} from 'react';
import styles from './Fab.module.css';
import {useProfileStore} from "../../store/profileStore.ts";

interface FabProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode,
    type?: 'filled' | 'hollow',
}

const Fab = ({ children, type = 'filled', onClick, className, style, ...rest }: FabProps) => {
    const { theme, highlightColor } = useProfileStore((state) => state.profile);
    const combinedStyles: React.CSSProperties = {
        backgroundColor: type === 'filled' ? highlightColor : theme,
        borderColor: type === 'filled' ? 'none' : highlightColor,
        ...style,
    };
    const combinedClasses = `${styles.fab} ${className || ''}`.trim();

    return (
        <div
            {...rest}
            onClick={onClick}
            className={combinedClasses}
            style={combinedStyles}
        >
            {children}
        </div>
    );
};

export default Fab;