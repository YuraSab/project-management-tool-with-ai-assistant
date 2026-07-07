import React from "react";
import styles from "./FormButtonSubmit.module.css";
import {useProfileStore} from "../../store/profileStore.ts";
import {HighlightColor} from "../../types/user.ts";

interface CustomButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    customStyles?: React.CSSProperties
}

const CustomButton = ({ children, customStyles, disabled, ...rest }: CustomButtonProps) => {
    const highlightColor = useProfileStore((state) => state.profile.highlightColor);
    return <button
        className={styles.customSubmitButton}
        style={{
            backgroundColor: disabled ? ('#640564') : (highlightColor ?? HighlightColor.Purple),
            ...customStyles,
        }}
        disabled={disabled}
        {...rest}
    >
            {children}
    </button>
}

export default CustomButton;