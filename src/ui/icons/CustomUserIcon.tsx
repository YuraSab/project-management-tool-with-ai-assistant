import React from "react";
import styles from "./CustomUserIcon.module.css";
import {ColorPalette} from "../../types/user.ts";
import {useProfileStore} from "../../store/profileStore.ts";

interface UserIconProps {
    title: string,
    backgroundColor?: ColorPalette,
    total?: boolean,
    size?: number,
    fontSize?: number,
    onClick?: React.Dispatch<React.SetStateAction<boolean>>,
}

// todo - parse whole user here to optional display avatar
const CustomUserIcon: React.FC<UserIconProps> = ({ title = '', backgroundColor, total, size=36, fontSize = 18, onClick }) => {
    const highlightColor = useProfileStore((state) => state.profile.highlightColor)
    return(
        <div className={styles.iconWrapper} title={title}>
            <div 
                className={`${styles.iconBlock} ${total && styles.smallerText}`}
                style={{ 
                    width: size, 
                    height: size, 
                    fontSize: fontSize, 
                    backgroundColor: backgroundColor ?? highlightColor
                }} 
                onClick={() => onClick && onClick((prev) => !prev)}
            >
                { total ? title : title[0] }
            </div>
        </div>
    )
}

export default CustomUserIcon;