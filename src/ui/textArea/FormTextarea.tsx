import styles from "./FormTextarea.module.css";
import React from "react";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>{
    name: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
}

const FormTextarea = ({ name, value, onChange, ...props }: FormTextareaProps) => (
    <textarea
        name={name}
        value={value} 
        onChange={onChange}
        className={`${styles.customTextarea} hideScrollbar`}
        {...props}
    />
);

export default FormTextarea;