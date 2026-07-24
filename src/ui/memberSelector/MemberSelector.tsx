import React from 'react';
import {HighlightColor, UserProfile} from "../../types/user.ts";
import CustomUserIcon from "../icons/CustomUserIcon.tsx";
import {Check} from "lucide-react";
import styles from './MemberSelector.module.css';
import {useProfileStore} from "../../store/profileStore.ts";
import {getColorThemeVariables} from "../../utils/colorThemeSelector.ts";

interface MemberSelectorProps {
    membersMap: Map<string, UserProfile>,
    selectedMembersIds: string[],
    clickAction: (member: UserProfile) => void,
}


const MemberSelector = ({membersMap, selectedMembersIds, clickAction}: MemberSelectorProps) => {
    const highlightColor = useProfileStore((state) => state.profile.highlightColor);
    const colorVariables = getColorThemeVariables(highlightColor ?? HighlightColor.Purple);
    const members = [...membersMap.values()];
    return (
        <div
            className={`${styles.block} hideScrollbar`}
            style={colorVariables}
        >
            {members && members.map((m) => (
                <div className={styles.row} onClick={() => clickAction(m)} key={m.uid}>
                    <div className={styles.user}>
                        <CustomUserIcon title={m.displayName && m.displayName[0] || ''} backgroundColor={m.iconColor} size={20} fontSize={14}/>
                        <h3>{m.displayName}</h3>
                    </div>
                    <div>
                        {selectedMembersIds.includes(m.uid) && (
                            <Check size={16} color={'green'}/>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MemberSelector;