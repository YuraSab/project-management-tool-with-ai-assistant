import React from "react";
import styles from "./Input.module.css";

interface FormTextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    name: string, 
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

const FormTextInput = ({ name, value , onChange, ...props }: FormTextInputProps) => (
    <input
        name={name} 
        value={value} 
        onChange={onChange} 
        type="text"
        className={styles.customInput}
        {...props}
    />
);

export default FormTextInput;