import React from "react";
import styles from "./CustomButton.module.css";
import {useProfileStore} from "../../store/profileStore.ts";
import {HighlightColor} from "../../types/user.ts";
import {getColorThemeVariables} from "../../utils/colorThemeSelector.ts";

interface CustomButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    customStyles?: React.CSSProperties
}

const CustomButton = ({ children, customStyles, disabled, type='button', ...rest }: CustomButtonProps) => {
    const profile = useProfileStore((state) => state?.profile);
    const colorTheme = profile?.highlightColor ?? HighlightColor.Purple;
    const colorVariables = getColorThemeVariables(colorTheme);

    return (
        <button
            type={type}
            disabled={disabled}
            className={styles.customSubmitButton}
            style={{ ...colorVariables, ...customStyles, color: profile?.theme }}
            {...rest}
        >
            {children}
        </button>
    );
};

export default CustomButton;