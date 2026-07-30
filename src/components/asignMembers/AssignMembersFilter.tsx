import React from "react";
import {HighlightColor, UserProfile} from "../../types/user";
import UserIconCollection from "../usersIconsCollection/UsersIconsCollection";
import styles from "./AsignMembers.module.css";
import {useProfileStore} from "../../store/profileStore.ts";
import {getColorThemeVariables} from "../../utils/colorThemeSelector.ts";

interface AssignMembersProps {
    projectAssignedMembers: UserProfile[], // members on the project + reserved members
    localAssignedMembersIds: string[],
    onSelectMembersActive: () => void,
    uniqueText?: string,
    maxIcons?: number,
    iconSize?: number,
}

const AssignMembers = ({projectAssignedMembers, localAssignedMembersIds, onSelectMembersActive, maxIcons = 3, iconSize, uniqueText}: AssignMembersProps) => {
    const highlightColor = useProfileStore((state) => state.profile?.highlightColor);
    const colorTheme = highlightColor ?? HighlightColor.Purple;
    const colorVariables = getColorThemeVariables(colorTheme);
    const visibleMembers = projectAssignedMembers.filter((m) => localAssignedMembersIds.includes(m.uid));
    return (
        <div className={styles.assignBlock}>
            <button
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

export default React.memo(AssignMembers);