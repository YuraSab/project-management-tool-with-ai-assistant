import styles from "./Header.module.css";
import CustomUserIcon from "../../../ui/icons/CustomUserIcon";
import CustomNavLink from "../../../ui/link/CustomNavLink";
import {useProfileStore} from "../../../store/profileStore.ts";
import {getColor} from "../../../utils/colorThemeSelector.ts";
import {HighlightColor, IconColor} from "../../../types/user.ts";
import {useState} from "react";
import {Menu, X} from "lucide-react";

const Header = () => {
    const profile = useProfileStore((state) => state.profile);
    const highlightColor = profile?.highlightColor ?? HighlightColor.Purple;
    const iconColor = profile?.iconColor ?? IconColor.Purple;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header
            className={styles.main}
            style={{ borderColor: getColor(highlightColor) }}
        >
            <button
                className={styles.burgerBtn}
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="Toggle Navigation"
            >
                {isMenuOpen ? <X size={26}/> : <Menu size={26}/>}
            </button>
            {isMenuOpen && <div className={styles.backdrop} onClick={() => setIsMenuOpen(false)}></div>}
            <nav className={`${styles.navigation} ${isMenuOpen ? styles.navigationOpen : ''}`}>
                <CustomNavLink to="/projects">Projects</CustomNavLink>
                <CustomNavLink to="/people">People</CustomNavLink>
            </nav>
            <CustomNavLink to={'/profile'} onClick={() => setIsMenuOpen(false)}>
                <CustomUserIcon
                    title={profile ? profile.displayName : "User"}
                    backgroundColor={iconColor}
                    size={36}
                />
            </CustomNavLink>
        </header>
    );
};

export default Header;