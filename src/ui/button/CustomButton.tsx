import React from "react";
import { useProfileStore } from "../../store/profileStore.ts";
import { HighlightColor } from "../../types/user.ts";
import { getColorThemeVariables } from "../../utils/colorThemeSelector.ts";
import styles from "./CustomButton.module.css";

type CustomButtonProps = React.ComponentPropsWithoutRef<'button'>;

const CustomButton = ({ children, disabled, type = 'button', style, ...rest }: CustomButtonProps) => {
    const profile = useProfileStore((state) => state?.profile);
    const colorTheme = profile?.highlightColor ?? HighlightColor.Purple;
    const colorVariables = getColorThemeVariables(colorTheme);

    return (
        <button
            type={type}
            disabled={disabled}
            className={styles.customSubmitButton}
            style={{
                ...colorVariables,
                color: profile?.theme,
                ...style
            }}
            {...rest}
        >
            {children}
        </button>
    );
};

export default CustomButton;