import { NavLink, NavLinkProps } from "react-router-dom"
import { useProfileStore } from "../../store/profileStore";
import { HighlightColor, Theme } from "../../types/user";
import { getColor } from "../../utils/colorThemeSelector";
import styles from "./CustomNavLink.module.css";

const CustomNavLink = ({ to, children, onClick, style }: NavLinkProps) => {
    const profile = useProfileStore((state) => state.profile);

    const getLinkStyles = ({ isActive }: { isActive: boolean }) => {
        const activeColor = getColor(profile?.highlightColor || HighlightColor.Purple);
        const inactiveColor = profile?.theme === Theme.White ? Theme.Black : Theme.White;
        return {
            color: isActive ? activeColor : inactiveColor,
            borderBottom: `2px solid ${isActive ? activeColor : "transparent"}`,
            ...style
        };
    };

    return (
        <NavLink
            to={to}
            onClick={onClick}
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