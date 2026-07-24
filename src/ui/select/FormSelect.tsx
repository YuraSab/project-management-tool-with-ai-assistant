import {ProjectStatus} from "../../types/project";
import {SortOption, TaskCategory, TaskPriority, TaskStatus, TaskType} from "../../types/task";
import {Role} from "../../types/user";
import styles from "./FormSelect.module.css";
import React from "react";

type SelectOption = Role | ProjectStatus | TaskStatus | TaskPriority | SortOption | TaskType | TaskCategory;

interface FormSelectProps<T extends SelectOption> {
    name: string,
    value: T | undefined,
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    options: T[],
}

const FormSelect = <T extends SelectOption, >({name, value, onChange, options}: FormSelectProps<T>) => (
    <select
        name={name}
        value={value}
        onChange={onChange}
        className={styles.customSelect}
    >
        {options.map((option) => (
            <option value={option} key={option}>
                {option === 'none' ? '' : option}
            </option>
        ))}
    </select>
);

export default FormSelect;