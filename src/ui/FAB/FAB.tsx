import React, {HTMLAttributes} from 'react';
import styles from './Fab.module.css';
import {useProfileStore} from "../../store/profileStore.ts";
import {HighlightColor} from "../../types/user.ts";
import {getColorThemeVariables} from "../../utils/colorThemeSelector.ts";

interface FabProps extends HTMLAttributes<HTMLDivElement> {
    type?: 'filled' | 'hollow',
    customStyles?: React.CSSProperties
}

const Fab = ({ children, type = 'filled', customStyles, onClick, ...rest }: FabProps) => {
    const { theme, highlightColor } = useProfileStore((state) => state.profile);
    const activeColor = highlightColor ?? HighlightColor.Purple;
    const colorVariables = getColorThemeVariables(activeColor);

    return (
        <div
            onClick={onClick}
            className={`${styles.fab} ${styles[type]}`}
            style={{
                ...colorVariables,
                ...customStyles,
                '--local-theme-color': theme,
            }}
            {...rest}
        >
            {children}
        </div>
    );
};

export default Fab;