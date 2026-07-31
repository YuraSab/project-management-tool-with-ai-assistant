import styles from "./Input.module.css";
import React from "react";

interface FormDateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
    value: string,
    onChange: (value: string) => void,
}

const DateInput = ({ value , onChange, ...props }: FormDateInputProps) => (
    <input
        value={value} 
        onChange={(event) => onChange(event.target.value)} 
        type="date"
        className={styles.customInput}
        {...props}
    />
);

export default DateInput;