import {Check} from "lucide-react";
import styles from "./CustomColorIcon.module.css";
import {ColorPalette, UserProfile} from "../../types/user.ts";

interface CustomColorIconProps<T extends ColorPalette> {
    currentColor: T,
    selectedColor: T,
    onClick: () => void,
    size?: number,
}

const CustomColorIcon = <T extends ColorPalette>({
    currentColor, selectedColor, onClick, size = 36
}: CustomColorIconProps<T>) => (
    <div
        className={`${styles.iconBlock}`}
        style={{
            width: size,
            height: size,
            backgroundColor: currentColor,
            color: currentColor === "white" ? "black" : "white",
            borderColor: currentColor === "black" ? "white" :"black"
        }}
        onClick={onClick}
    >
        {currentColor === selectedColor && <Check/>}
    </div>
);

export default CustomColorIcon;