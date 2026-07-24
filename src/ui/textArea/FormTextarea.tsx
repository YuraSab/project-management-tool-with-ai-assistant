import styles from "./FormTextarea.module.css";
import React from "react";

interface FormTextareaProps {
    name: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
}

const FormTextarea = ({ name, value, onChange }: FormTextareaProps) => {
    return <textarea
        name={name}
        value={value} 
        onChange={onChange}
        className={`${styles.customTextarea} hideScrollbar`}
    />
}

export default FormTextarea;