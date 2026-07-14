import styles from "./Input.module.css";
import React from "react";

interface FormDateInputProps {
    name: string, 
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    required?: boolean,
}

const FormDateInput = ({ name, value , onChange, required = false, ...props }: FormDateInputProps) => {
    return <input 
        name={name} 
        value={value} 
        onChange={onChange} 
        required={required}
        type="date" 
        className={styles.cunstomInput}
        {...props}
    />
}

export default FormDateInput;