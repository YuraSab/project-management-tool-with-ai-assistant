import React from "react";
import styles from "./CustomButton.module.css";
import {useProfileStore} from "../../store/profileStore.ts";
import {HighlightColor} from "../../types/user.ts";

interface CustomButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    customStyles?: React.CSSProperties
}

const CustomButton = ({ children, customStyles, disabled, type='button', ...rest }: CustomButtonProps) => {
    const highlightColor = useProfileStore((state) => state.profile.highlightColor);
    return (
        <button
            type={type}
            disabled={disabled}
            className={styles.customSubmitButton}
            style={{
                backgroundColor: disabled ? '#640564' : (highlightColor ?? HighlightColor.Purple),
                ...customStyles,
            }}
            {...rest}
        >
            {children}
        </button>
    );
};

export default CustomButton;