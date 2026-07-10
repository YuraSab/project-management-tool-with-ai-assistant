import React from 'react';
import {HighlightColor} from "../../types/user.ts";
import {Check} from "lucide-react";
import {useProfileStore} from "../../store/profileStore.ts";
import styles from './CustomMultySelect.module.css';

interface CustomMultiSelectorProps {
    options: string[],
    selectedOptions: string[],
    onChange: (value: string) => void,
}

const getBlockClassKey = (color: HighlightColor) => `_block__${color}`;
const getRowClassKey = (color: HighlightColor) => `_assignedMembers_button__${color}`;

const CustomMultiSelector = ({ options, selectedOptions, onChange }: CustomMultiSelectorProps) => {
    const highlightColor = useProfileStore((state) => state.profile.highlightColor);
    return (
        <div className={`${styles.block} hideScrollbar ${highlightColor && styles[getBlockClassKey(highlightColor)]}`}>
            {options && options.map((o) => (
                <div className={`${styles.row} ${highlightColor && styles[getRowClassKey(highlightColor)]}`} onClick={() => onChange(o)} key={o}>
                    <div className={styles.user}>
                        <h3>{o}</h3>
                    </div>
                    <div>
                        {selectedOptions?.includes(o) && (
                            <Check size={16} color={'green'}/>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CustomMultiSelector;