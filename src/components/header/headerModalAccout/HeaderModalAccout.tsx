import {LogOut, Paintbrush, UserRoundCog, X} from "lucide-react";
import styles from "./HeaderModalAcccout.module.css";
import {useAuthStore} from "../../../store/authStore.ts";
import {useHeaderStore} from "../../../store/headerStore.ts";
import {useProfileStore} from "../../../store/profileStore.ts";
import {Role, Theme} from "../../../types/user.ts";
import {useNavigate} from "react-router-dom";

const themeClassMap = {
    purple: styles.purpleBlock,
    green: styles.greenBlock,
    blue: styles.blueBlock,
    orange: styles.orangeBlock,
};

const HeaderModalAccount = () => {
    const navigate = useNavigate();
    const setLogout = useAuthStore((state) => state.setLogout);
    const profile = useProfileStore((state) => state.profile);
    const setProfile = useProfileStore((state) => state.setProfile);
    const setIsHeaderModalToggle = useHeaderStore((state) => state.setIsHeaderModalToggle);

     const handleClickPersonalisation = () => {
        navigate("/personalisation");
        setIsHeaderModalToggle();
    };
    const handleClickAccount = () => {
        navigate(`/edit/user/${profile.uid}`);
        setIsHeaderModalToggle();
    };
    const handleLogout = () => {
        setLogout();
        setProfile(null);
        navigate("/login");
        setIsHeaderModalToggle();
    };

    const item = `${styles.item} ${profile.highlightColor && themeClassMap[profile.highlightColor]}`;
    
    return (
        <div className={styles.overlay}  onClick={setIsHeaderModalToggle}>
             <div
                 className={styles.main}
                 onClick={(event) => event.stopPropagation()}
                 style={{backgroundColor: profile.backgroundColor === Theme.Black ? Theme.Black : Theme.White}}
             >
                 <div className={styles.exitBlock} style={{justifyContent: "end"}} onClick={setIsHeaderModalToggle}>
                     <X size={24}/>
                 </div>
                 {
                    profile.role === Role.Admin && (
                         <div className={item} onClick={handleClickAccount}>
                             <h2>Account</h2>
                             <UserRoundCog size={20}/>
                         </div>
                    )
                 }
                 <div className={item} onClick={handleClickPersonalisation}>
                     <h2>Personalisation</h2>
                     <Paintbrush size={20}/>
                </div>
                <div className={item} onClick={handleLogout}>
                    <h2>Logout</h2>
                    <LogOut size={20}/>
                </div>
            </div>
        </div>
    )
}

export default HeaderModalAccount;