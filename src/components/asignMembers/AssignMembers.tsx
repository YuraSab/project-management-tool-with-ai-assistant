import React from "react";
import {HighlightColor, UserProfile} from "../../types/user";
import UserIconCollection from "../usersIconsCollection/UsersIconsCollection";
import styles from "./AsignMembers.module.css";
import {useProfileStore} from "../../store/profileStore.ts";

interface AssignMembersProps {
    assignedMembers: UserProfile[],
    onSelectMembersActive: () => void,
    uniqueText?: string,
    maxIcons?: number,
    iconSize?: number,
}

const themeClassMap: Record<HighlightColor, string> = {
    purple: styles._assignedMembers_button__purple,
    green: styles._assignedMembers_button__green,
    blue: styles._assignedMembers_button__blue,
    orange: styles._assignedMembers_button__orange,
};

const AssignMembers = ({assignedMembers, onSelectMembersActive, maxIcons, iconSize, uniqueText}: AssignMembersProps) => {
    const highlightColor = useProfileStore((state) => state.profile.highlightColor);
    return (
        <div className={styles.asignBlock}>
            <div className={styles.assignedMembers}>
                <button
                    className={highlightColor && themeClassMap[highlightColor]}
                    onClick={onSelectMembersActive}
                    type="button"
                >
                    {uniqueText ?? "＋ Add Member"}
                </button>
            </div>
            {assignedMembers && assignedMembers.length > 0 && (
                <UserIconCollection
                    users={assignedMembers || []}
                    maxIcons={maxIcons}
                    size={iconSize}
                />
            )}
        </div>
    );
};

export default React.memo(AssignMembers);