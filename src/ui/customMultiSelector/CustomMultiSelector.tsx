import { Check } from "lucide-react";
import { HighlightColor } from "../../types/user";
import { useProfileStore } from "../../store/profileStore";
import { getColorThemeVariables } from "../../utils/colorThemeSelector";
import styles from './CustomMultySelect.module.css';

interface CustomMultiSelectorProps {
    options: string[],
    selectedOptions: string[],
    onChange: (value: string) => void,
}

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