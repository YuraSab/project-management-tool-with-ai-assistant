import styles from "./Header.module.css";
import CustomUserIcon from "../../../ui/icons/CustomUserIcon";
import CustomNavLink from "../../../ui/link/CustomNavLink";
import {useProfileStore} from "../../../store/profileStore.ts";
import {useHeaderStore} from "../../../store/headerStore.ts";

const Header = () => {
    const profile = useProfileStore((state) => state.profile);
    const setIsHeaderModalToggle = useHeaderStore((state) => state.setIsHeaderModalToggle);
    return (
        <header
            className={styles.main}
            style={{borderColor: profile.highlightColor, backgroundColor: profile.theme}}
        >
            <nav className={styles.navigation}>
                <CustomNavLink to="/projects">Projects</CustomNavLink>
                <CustomNavLink to="/people">People</CustomNavLink>
            </nav>
            <CustomNavLink to={'/profile'}>
                <CustomUserIcon
                    title={profile ? profile.displayName : "User"}
                    onClick={setIsHeaderModalToggle}
                    backgroundColor={profile.iconColor}
                    size={36}
                />
            </CustomNavLink>
        </header>
    );
};

export default Header;