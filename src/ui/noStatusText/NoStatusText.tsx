import { useProfileStore } from "../../store/profileStore";
import { HighlightColor } from "../../types/user";
import { getColor } from "../../utils/colorThemeSelector";
import styles from "./NoStatusText.module.css";

interface NoStatusTextProps {
    text: string
}

const NoStatusText = ({ text }: NoStatusTextProps) => {
    const profile = useProfileStore((state) => state.profile);
    const highlightColor = profile?.highlightColor ?? HighlightColor.Purple;
    return(
        <span
            className={styles.textBlock}
            style={{ backgroundColor: getColor(highlightColor) }}
        >
            {text}
        </span>
    );
};

export default NoStatusText;