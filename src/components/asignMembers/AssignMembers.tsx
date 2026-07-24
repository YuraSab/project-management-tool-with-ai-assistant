import React from "react";
import {HighlightColor, UserProfile} from "../../types/user";
import UserIconCollection from "../usersIconsCollection/UsersIconsCollection";
import styles from "./AsignMembers.module.css";
import {useProfileStore} from "../../store/profileStore.ts";
import {getColorThemeVariables} from "../../utils/colorThemeSelector.ts";

interface AssignMembersProps {
    assignedMembers: UserProfile[],
    onSelectMembersActive: () => void,
    uniqueText?: string,
    maxIcons?: number,
    iconSize?: number,
}

const AssignMembers = ({ assignedMembers, onSelectMembersActive, maxIcons, iconSize, uniqueText }: AssignMembersProps) => {
    const highlightColor = useProfileStore((state) => state.profile.highlightColor);
    const colorTheme = highlightColor ?? HighlightColor.Purple;
    const colorVariables = getColorThemeVariables(colorTheme);
    return (
        <div className={styles.assignBlock}>
            <button
                style={colorVariables}
                className={styles.assignButton}
                onClick={onSelectMembersActive}
                type="button"
            >
                {uniqueText ?? "＋ Add Member"}
            </button>
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