import React from "react";
import styles from "./AuthFormLayout.module.css";

interface AuthFormLayoutProps extends React.FormHTMLAttributes<HTMLFormElement>{
    onSubmit: () => void,
}

const AuthFormLayout = ({ onSubmit, children, style, ...props }: AuthFormLayoutProps) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSubmit)
            onSubmit();
    };

    return (
        <div
            className={styles.mainOverlay}
            style={style}
        >
            <form
                onSubmit={handleSubmit}
                className={styles.formAuth}
                {...props}
            >
                {children}
            </form>
        </div>
    );
}

export default AuthFormLayout;