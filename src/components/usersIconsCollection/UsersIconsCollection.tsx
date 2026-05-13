import {UserProfile} from "../../types/user";
import CustomUserIcon from "../../ui/icons/CustomUserIcon";
import styles from "./UserIconCollection.module.css";

interface UserIconCollectionProps {
    users: UserProfile[],
    size?: number,
    fontSize?: number,
    maxIcons?: number,
    align?: 'start' | 'end',
}

const UserIconCollection = ({ users, size = 34, maxIcons = 4, fontSize, align = 'end' }: UserIconCollectionProps) => {
    const visibleUsers = users.slice(0, maxIcons);
    const hiddenUsers = (users?.length || 0) - maxIcons;
    return (
        // <div className={styles.iconsBlock} style={{ justifyContent: align }}>
        <div className={styles.iconsBlock} style={{justifyContent: align}}>
            {
                hiddenUsers > 0 && (
                    hiddenUsers < 9
                        ? <CustomUserIcon title={`+${hiddenUsers}`} totaly size={size} fontSize={fontSize}/>
                        : <CustomUserIcon title={"9+"} totaly size={size} fontSize={fontSize}/>
                )
            }
            {visibleUsers?.map((u) => <CustomUserIcon backgroundColor={u.iconColor} title={u.displayName} size={size}
                                                      key={u.uid} fontSize={fontSize}/>)}
        </div>
    )
}

export default UserIconCollection;