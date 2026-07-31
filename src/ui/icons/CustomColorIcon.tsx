import { Check } from "lucide-react";
import { ColorPalette, Theme } from "../../types/user";
import styles from "./CustomColorIcon.module.css";

interface CustomColorIconProps<T extends ColorPalette> {
    currentColor: T,
    selectedColor: T,
    onClick: (color: T) => void,
    size?: number,
}

const CustomColorIcon = <T extends ColorPalette>({
    currentColor, selectedColor, onClick, size = 36
}: CustomColorIconProps<T>) => {
    const cssBackgroundColor = `var(--color-${currentColor})`;
    return (
        <div
            className={`${styles.iconBlock}`}
            style={{
                width: size,
                height: size,
                backgroundColor: cssBackgroundColor,
                color: currentColor === Theme.White ? "black" : "white",
                borderColor: currentColor === Theme.Black ? "white" : "black"
            }}
            onClick={() => onClick(currentColor)}
        >
            {currentColor === selectedColor && (
                <Check/>
            )}
        </div>
    );
};

export default CustomColorIcon;