import React from "react";
import { HighlightColor } from "../../types/user";
import { useProfileStore } from "../../store/profileStore";
import { getColorThemeVariables } from "../../utils/colorThemeSelector";
import styles from "./SelectorBlock.module.css";

interface SelectorBlockProps {
    onSelectorActive: () => void,
    children: React.ReactNode,
}

const SelectorBlock = ({ onSelectorActive, children }: SelectorBlockProps) => {
    const profile = useProfileStore((state) => state.profile);
    const highlightColor: HighlightColor = profile?.highlightColor ?? HighlightColor.Purple;
    return (
        <div className={styles.assignedMembers}>
            <button
                style={getColorThemeVariables(highlightColor)}
                onClick={onSelectorActive}
                type='button'
            >
                {children}
            </button>
        </div>
    );
};

export default React.memo(SelectorBlock);