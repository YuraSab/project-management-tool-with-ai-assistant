import React, {ComponentPropsWithoutRef, FormEvent, ReactNode, useCallback} from "react";
import styles from "./CustomForm.module.css";
import {useProfileStore} from "../../store/profileStore.ts";

interface CustomFormProps extends ComponentPropsWithoutRef<'form'>{
    children: ReactNode,
    disabled?: boolean,
    customStyles?: React.CSSProperties
}

const CustomForm = ({ children, onSubmit, disabled, customStyles, className, style, ...rest }: CustomFormProps) => {
    const theme = useProfileStore((state) => state.profile.theme);

    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSubmit)
            onSubmit(e);
    }, [onSubmit]);

    const formClassName = `
        ${styles.customForm}
        ${theme === 'black' ? styles.dark : styles.light}
        ${className || ''}
    `.trim();

    return (
        <form
            {...rest}
            onSubmit={handleSubmit}
        >
            <fieldset
                disabled={disabled}
                className={formClassName}
                style={{...style, ...customStyles}}
            >
                {children}
            </fieldset>
        </form>
    );
};

export default React.memo(CustomForm);