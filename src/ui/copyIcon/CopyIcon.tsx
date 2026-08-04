import React from 'react';
import { Copy } from "lucide-react";
import { copyText } from "../../utils/copy.ts";
import { toast } from "../../utils/toaster.ts";
import styles from './CopyIcon.module.css';

interface CopyIconProps {
    copyValue: string,
    toastValue?: string,
    size?: number,
    style?: React.CSSProperties
}

const CopyIcon = ({ copyValue, toastValue, size = 19, style }: CopyIconProps) => {
    const handleCopy = async () => {
        await copyText(copyValue);
        toast.info(toastValue ?? 'Copied!');
    };

    return (
        <Copy
            role={'button'}
            onClick={handleCopy}
            size={size}
            className={styles.copyIcon}
            style={style}
        />
    );
};

export default React.memo(CopyIcon);