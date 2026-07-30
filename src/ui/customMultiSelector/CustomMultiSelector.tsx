import {HighlightColor} from "../../types/user.ts";
import {Check} from "lucide-react";
import {useProfileStore} from "../../store/profileStore.ts";
import styles from './CustomMultySelect.module.css';
import {getColorThemeVariables} from "../../utils/colorThemeSelector.ts";

interface CustomMultiSelectorProps {
    options: string[],
    selectedOptions: string[],
    onChange: (value: string) => void,
}

const getBlockClassKey = (color: HighlightColor) => `_block__${color}`;
const getRowClassKey = (color: HighlightColor) => `_assignedMembers_button__${color}`;

const CustomMultiSelector = ({ options, selectedOptions, onChange }: CustomMultiSelectorProps) => {
    const profile = useProfileStore((state) => state.profile);
    const highlightColor = profile?.highlightColor ?? HighlightColor.Purple;
    return (
        <div
            className={`${styles.block} hideScrollbar`}
            style={getColorThemeVariables(highlightColor)}
        >
            {options && options.map((o) => (
                <div
                    className={styles.row}
                    onClick={() => onChange(o)}
                    key={o}
                >
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