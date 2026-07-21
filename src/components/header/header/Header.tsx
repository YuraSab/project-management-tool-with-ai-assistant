import styles from "./Header.module.css";
import CustomUserIcon from "../../../ui/icons/CustomUserIcon";
import CustomNavLink from "../../../ui/link/CustomNavLink";
import {useProfileStore} from "../../../store/profileStore.ts";
import {getColor} from "../../../utils/colorThemeSelector.ts";

const Header = () => {
    const profile = useProfileStore((state) => state.profile);
    return (
        <header
            className={styles.main}
            style={{ borderColor: getColor(profile.highlightColor) }}
        >
            <nav className={styles.navigation}>
                <CustomNavLink to="/projects">Projects</CustomNavLink>
                <CustomNavLink to="/people">People</CustomNavLink>
            </nav>
            <CustomNavLink to={'/profile'}>
                <CustomUserIcon
                    title={profile ? profile.displayName : "User"}
                    backgroundColor={profile.iconColor}
                    size={36}
                />
            </CustomNavLink>
        </header>
    );
};

export default Header;