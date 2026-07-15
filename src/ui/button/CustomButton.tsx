import React from "react";
import styles from "./CustomButton.module.css";
import {useProfileStore} from "../../store/profileStore.ts";
import {HighlightColor} from "../../types/user.ts";
import {getColorThemeVariables} from "../../utils/colorThemeSelector.ts";

interface CustomButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    customStyles?: React.CSSProperties
}

const CustomButton = ({ children, customStyles, disabled, type='button', ...rest }: CustomButtonProps) => {
    // const highlightColor = useProfileStore((state) => state.profile.highlightColor);
    // const colorTheme = highlightColor ?? HighlightColor.Purple;
    const colorTheme = HighlightColor.Purple;

    const colorVariables = getColorThemeVariables(colorTheme);
    return (
        <button
            type={type}
            disabled={disabled}
            className={`${styles.customSubmitButton} ${styles[colorTheme]}`}
            style={{ ...colorVariables, ...customStyles }}
            {...rest}
        >
            {children}
        </button>
    );
};

export default CustomButton;