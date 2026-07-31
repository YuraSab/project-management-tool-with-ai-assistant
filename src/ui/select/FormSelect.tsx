import React from "react";
import { ProjectStatus } from "../../types/project";
import { SortOption, TaskCategory, TaskPriority, TaskStatus, TaskType } from "../../types/task";
import { Role } from "../../types/user";
import styles from "./FormSelect.module.css";

type SelectOption = Role | ProjectStatus | TaskStatus | TaskPriority | SortOption | TaskType | TaskCategory;

interface FormSelectProps<T extends SelectOption> extends React.SelectHTMLAttributes<HTMLSelectElement>{
    name: string,
    value: T | undefined,
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    options: readonly T[],
}

const FormSelect = <T extends SelectOption>({ name, value, onChange, options, ...props }: FormSelectProps<T>) => (
    <select
        name={name}
        value={value}
        onChange={onChange}
        className={styles.customSelect}
        {...props}
    >
        {options.map((option) => (
            <option value={option} key={option}>
                {option === 'none' ? '' : option}
            </option>
        ))}
    </select>
);

export default FormSelect;