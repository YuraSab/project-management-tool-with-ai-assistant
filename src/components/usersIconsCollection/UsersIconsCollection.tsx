import { UserProfile } from "../../types/user";
import { CustomUserIcon } from "../../ui";
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
        <div className={styles.iconsBlock} style={{justifyContent: align}}>
            {hiddenUsers > 0 && (
                hiddenUsers < 9
                    ? <CustomUserIcon title={`+${hiddenUsers}`} total size={size} fontSize={fontSize}/>
                    : <CustomUserIcon title={"9+"} total size={size} fontSize={fontSize}/>
            )}
            {visibleUsers?.map((u) => (
                <CustomUserIcon
                    title={u.displayName}
                    backgroundColor={u.iconColor}
                    size={size} fontSize={fontSize}
                    key={u.uid}
                />
            ))}
        </div>
    );
};

export default UserIconCollection;