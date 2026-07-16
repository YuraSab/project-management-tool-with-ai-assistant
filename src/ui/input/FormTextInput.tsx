import styles from "./Input.module.css";
import React from "react";

interface FormTextInputProps {
    name: string, 
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    required?: boolean,
    placeholder?: string,
}

const FormTextInput = ({ name, value , onChange, required, placeholder}: FormTextInputProps) => {
    return <input 
        name={name} 
        value={value} 
        onChange={onChange} 
        required={required}
        type="text" 
        className={styles.customInput}
        placeholder={placeholder}
    />
}

export default FormTextInput;