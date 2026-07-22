import styles from "./NoStatusText.module.css";
import {useProfileStore} from "../../store/profileStore.ts";
import {HighlightColor} from "../../types/user.ts";
import {getColor} from "../../utils/colorThemeSelector.ts";

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