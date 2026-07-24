import styles from "./Input.module.css";

interface TextInputProps {
    name: string, 
    value: string,
    onChange: (value: string) => void,
}

const TextInput = ({ name, value, onChange, ...props }: TextInputProps) => (
    <input
        name={name} 
        value={value} 
        onChange={(event) => onChange(event.target.value)} 
        type="text"
        className={styles.customInput}
        {...props}
    />
);

export default TextInput;