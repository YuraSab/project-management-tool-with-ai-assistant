import React from "react";
import { HighlightColor, UserProfile } from "../../types/user";
import { getColorThemeVariables } from "../../utils/colorThemeSelector";
import { useProfileStore } from "../../store/profileStore";
import UserIconCollection from "../usersIconsCollection/UsersIconsCollection";
import styles from "./AsignMembers.module.css";

interface AssignMembersProps {
    projectAssignedMembers: UserProfile[], // members on the project + reserved members
    localAssignedMembersIds: string[],
    onSelectMembersActive: () => void,
    uniqueText?: string,
    maxIcons?: number,
    iconSize?: number,
}

const AssignMembersFilter = ({projectAssignedMembers, localAssignedMembersIds, onSelectMembersActive, maxIcons = 3, iconSize, uniqueText}: AssignMembersProps) => {
    const highlightColor = useProfileStore((state) => state.profile?.highlightColor);
    const colorTheme = highlightColor ?? HighlightColor.Purple;
    const colorVariables = getColorThemeVariables(colorTheme);
    const visibleMembers = projectAssignedMembers.filter((m) => localAssignedMembersIds.includes(m.uid));
    return (
        <div className={styles.assignBlock}>
            <button
                // className={styles.assignButton}
                style={colorVariables}
                onClick={onSelectMembersActive}
                type="button"
            >
                {uniqueText ?? "＋ Add Member"}
            </button>
            {projectAssignedMembers && projectAssignedMembers.length !== 0 && localAssignedMembersIds && (
                <UserIconCollection
                    users={visibleMembers || []}
                    maxIcons={maxIcons}
                    size={iconSize}
                />
            )}
        </div>
    );
};

export default React.memo(AssignMembersFilter);