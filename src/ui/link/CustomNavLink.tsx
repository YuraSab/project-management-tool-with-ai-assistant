import {NavLink, NavLinkProps} from "react-router-dom"
import React from "react";
import {useProfileStore} from "../../store/profileStore.ts";
import {Theme} from "../../types/user.ts";
import styles from "./CustomNavLink.module.css";
import {getColor} from "../../utils/colorThemeSelector.ts";

interface CustomNavLinkProps extends Pick<NavLinkProps, 'to' | 'children'>{
    customStyles?: React.CSSProperties,
}

const CustomNavLink = ({ to, children, customStyles }: CustomNavLinkProps) => {
    const profile = useProfileStore((state) => state.profile);
    const getLinkStyles = ({ isActive }: { isActive: boolean }) => {
        const activeColor = getColor(profile.highlightColor);
        const inactiveColor = profile.theme === Theme.White ? Theme.Black : Theme.White;
        return {
            color: isActive ? activeColor : inactiveColor,
            borderBottom: `2px solid ${isActive ? activeColor : "transparent"}`,
            ...customStyles
        };
    };

    return (
        <NavLink
            to={to}
            className={({ isActive }) => `
                ${styles.navLink} 
                ${!isActive ? styles.hoverEffects : ''}
            `}
            style={getLinkStyles}
        >
            { children }
        </NavLink>
    );
};

export default CustomNavLink;