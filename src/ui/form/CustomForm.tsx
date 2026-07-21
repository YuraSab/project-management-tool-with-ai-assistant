import React, {ComponentPropsWithoutRef, FormEvent, useCallback} from "react";
import styles from "./CustomForm.module.css";

interface CustomFormProps extends ComponentPropsWithoutRef<'form'>{
    disabled?: boolean,
}

const CustomForm = ({ onSubmit, children, disabled, style, ...props }: CustomFormProps) => {
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
                className={styles.customForm}
                style={style}
            >
                {children}
            </fieldset>
        </form>
    );
};

export default React.memo(CustomForm);