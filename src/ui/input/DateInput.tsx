import styles from "./Input.module.css";

interface FormDateInputProps {
    value: string,
    onChange: (value: string) => void,
    required?: boolean,
}

const DateInput = ({ value , onChange, required, ...props }: FormDateInputProps) => {
    return <input 
        value={value} 
        onChange={(event) => onChange(event.target.value)} 
        required={required}
        type="date" 
        className={styles.customInput}
        {...props}
    />
}

export default DateInput;