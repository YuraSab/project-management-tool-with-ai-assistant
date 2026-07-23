import React, {ComponentPropsWithoutRef, FormEvent, useCallback} from "react";
import styles from "./CustomForm.module.css";

interface CustomFormProps extends ComponentPropsWithoutRef<'form'>{
    children: React.ReactNode,
    disabled?: boolean,
    isDrawer?: boolean,
    className?: string,
}

const CustomForm = ({ onSubmit, children, disabled, isDrawer = false, className = '', style, ...props }: CustomFormProps) => {
    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSubmit)
            onSubmit(e);
    }, [onSubmit]);

    return (
        <form
            onSubmit={handleSubmit}
            {...props}
        >
            <fieldset
                disabled={disabled}
                className={`${styles.customForm} ${isDrawer ? styles.isDrawer : ''} ${className}`}
                style={style}
            >
                {children}
            </fieldset>
        </form>
    );
};

export default React.memo(CustomForm);