import React from 'react';
import {copyText} from "../../utils/copy.ts";
import {Copy} from "lucide-react";
import styles from './CopyIcon.module.css';
import {toast} from "../../utils/toaster.ts";

interface CopyIcon {
    copyValue: string,
    toastValue?: string,
    size?: number,
    customStyles: React.CSSProperties,
}

const CopyIcon = ({ copyValue, toastValue, size = 19, customStyles }: CopyIcon) => {
    const handleCopy = () => {
        copyText(copyValue);
        toast.info(toastValue ?? 'Copied!');
    };

    return (
        <Copy
            size={size}
            onClick={handleCopy}
            className={styles.copyIcon}
            style={{ ...customStyles }}
        />
    );
};

export default React.memo(CopyIcon);