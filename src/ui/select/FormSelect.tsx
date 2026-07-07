import { ProjectStatus } from "../../types/project";
import {SortOption, TaskPriority, TaskStatus} from "../../types/task";
import { Role } from "../../types/user";
import styles from "./FormSelect.module.css";

type SelectOption = Role | ProjectStatus | TaskStatus | TaskPriority | SortOption;

interface FormSelectProps<T extends SelectOption> {
    name: string, 
    value: T | undefined,
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    options: T[],
}

const FormSelect = <T extends SelectOption,>({ name, value, onChange, options }: FormSelectProps<T>) => {
    return <select 
        name={name} 
        value={value} 
        onChange={onChange} 
        className={styles.customSelect}
    >
        { options.map((option) => <option value={option} key={option}>{option}</option>) }
    </select>
}

export default FormSelect;