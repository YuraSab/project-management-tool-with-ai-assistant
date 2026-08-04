import React from "react";
import { ColorPalette } from "../../types/user.ts";
import { useProfileStore} from "../../store/profileStore.ts";
import styles from "./CustomUserIcon.module.css";

interface UserIconProps {
    title?: string,
    backgroundColor?: ColorPalette,
    total?: boolean,
    size?: number,
    fontSize?: number,
    onClick?: React.Dispatch<React.SetStateAction<boolean>>,
    style?: React.CSSProperties
}

const CustomUserIcon: React.FC<UserIconProps> = ({
    title = 'U', backgroundColor, style, total, size= 32, fontSize = 18, onClick
}) => {
    const highlightColor = useProfileStore((state) => state.profile?.highlightColor);
    const activeColor = backgroundColor ?? highlightColor;
    const cssBackgroundColor = `var(--color-${activeColor})`;
    return (
        <div
            className={`${styles.iconBlock} ${total && styles.smallerText}`}
            style={{
                width: `var(--user-icon-size, ${size}px)`,
                height: `var(--user-icon-size, ${size}px)`,
                fontSize: fontSize,
                backgroundColor: cssBackgroundColor,
                ...style
        }}
            onClick={() => onClick && onClick((prev) => !prev)}
        >
            {title[0]}
        </div>
    );
};

export default CustomUserIcon;