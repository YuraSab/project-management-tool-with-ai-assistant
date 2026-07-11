import styles from "./NoStatusText.module.css";
import {useProfileStore} from "../../store/profileStore.ts";

interface NoStatusTextProps {
    text: string
}
const NoStatusText = ({ text }: NoStatusTextProps) => {
    const highlightColor = useProfileStore((state) => state.profile.highlightColor);
    return(
        <span
            className={styles.textBlock}
            style={{ backgroundColor: highlightColor }}
        >
            {text}
        </span>
    );
};

export default NoStatusText;