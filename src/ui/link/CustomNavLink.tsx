import {NavLink, NavLinkProps} from "react-router-dom"
import React from "react";
import {useProfileStore} from "../../store/profileStore.ts";
import {Theme} from "../../types/user.ts";
import styles from "./CustomNavLink.module.css";

interface CustomNavLinkProps extends NavLinkProps  {
    className?: string,
    customStyles?: React.CSSProperties,
}

const CustomNavLink = ({ className = "", customStyles = {}, ...navLinkProps }: CustomNavLinkProps) => {
    const profile = useProfileStore((state) => state.profile);
    const getLinkStyles = ({isActive}: {isActive: boolean}) => {
        const activeColor = profile.highlightColor;
        const inactiveColor = Theme.White ? Theme.Black : Theme.White;
        return {
            color: isActive ? activeColor : inactiveColor,
            borderBottom: `2px solid ${isActive ? activeColor : "transparent"}`,
            ...customStyles
        };
    };

    return (
        <NavLink
            {...navLinkProps}
            style={getLinkStyles}
            className={({ isActive }) => `${styles.navLink} ${className} ${!isActive ? styles.hoverEffects : ""}`}
        />
    );
};

export default CustomNavLink;