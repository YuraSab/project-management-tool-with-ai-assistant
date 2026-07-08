import React from "react";
import Title from "../title/Title.tsx";
import styles from './CustomCheckbox.module.css';

interface CustomCheckBoxProps extends Omit<React.CustomComponentPropsWithRef<'input'>, 'onChange'> {
    checked: boolean,
    onChange: (checked: boolean) => void,
    name?: string,
    customStyles?: React.CSSProperties
}

const CustomCheckBox = ({ checked, onChange, name = 'non-assigned-members', customStyles, ...props }: CustomCheckBoxProps) => (
    <div className={styles.block}>
        <Title text={'Unassigned tasks'}/>
        <input
            type={"checkbox"}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            name={name}
            style={{marginRight: 4, ...customStyles}}
            {...props}
        />
    </div>
);

export default CustomCheckBox;