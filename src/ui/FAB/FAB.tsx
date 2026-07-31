import React, { ButtonHTMLAttributes } from 'react';
import { useProfileStore } from "../../store/profileStore";
import { HighlightColor, Theme } from "../../types/user";
import { getColorThemeVariables } from "../../utils/colorThemeSelector";
import styles from './Fab.module.css';

interface FabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    format?: 'filled' | 'hollow',
}

const Fab = (
    { children, format = 'filled', className = '', style, onClick, ...props }: FabProps
) => {
    const profile = useProfileStore((state) => state.profile);
    const activeColor = profile?.highlightColor ?? HighlightColor.Purple;
    const activeTheme = profile?.theme ?? Theme.White;
    const colorVariables = getColorThemeVariables(activeColor);

    return (
        <button
            onClick={onClick}
            type={'button'}
            className={`${styles.fab} ${styles[format]} ${className}`}
            style={{
                ...colorVariables,
                '--local-theme-color': activeTheme,
                ...style
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Fab;