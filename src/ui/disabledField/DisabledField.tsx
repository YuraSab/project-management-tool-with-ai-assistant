import React from 'react';
import styles from './DisabledField.module.css';
import CopyIcon from "../copyIcon/CopyIcon.tsx";

interface DisabledFieldProps {
    children: string,
    copyText?: string,
    toastValue?: string,
}

const DisabledField = ({copyText, toastValue, children}: DisabledFieldProps) => (
    <div className={styles.displayInputLike}>
        <span>{children}</span>
        {copyText && (
            <CopyIcon copyValue={copyText} toastValue={toastValue ?? 'Copied!'}/>
        )}
    </div>
);

export default DisabledField;