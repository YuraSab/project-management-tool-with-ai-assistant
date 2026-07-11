import React from "react";
import {HighlightColor} from "../../types/user";
import styles from "./SelectorBlock.module.css";
import {useProfileStore} from "../../store/profileStore.ts";

interface SelectorBlockProps {
    onSelectorActive: () => void,
}

const themeClassMap: Record<HighlightColor, string> = {
    purple: styles._assignedMembers_button__purple,
    green: styles._assignedMembers_button__green,
    blue: styles._assignedMembers_button__blue,
    orange: styles._assignedMembers_button__orange,
};

const SelectorBlock = ({onSelectorActive, children}: SelectorBlockProps) => {
    const highlightColor = useProfileStore((state) => state.profile.highlightColor);
    return (
        <div className={styles.assignedMembers}>
            <button
                className={highlightColor && themeClassMap[highlightColor]}
                onClick={onSelectorActive}
                type="button"
            >
                {children}
            </button>
        </div>
    );
};

export default React.memo(SelectorBlock);