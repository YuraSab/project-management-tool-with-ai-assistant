import React from "react";
import styles from "./Input.module.css";

interface FormDateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    name: string, 
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

const FormDateInput = ({ name, value , onChange, ...props }: FormDateInputProps) => (
    <input
        name={name} 
        value={value} 
        onChange={onChange} 
        type="date"
        className={styles.customInput}
        {...props}
    />
);

export default FormDateInput;