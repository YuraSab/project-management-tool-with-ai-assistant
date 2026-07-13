import React from 'react';
import {HighlightColor, UserProfile} from "../../types/user.ts";
import CustomUserIcon from "../icons/CustomUserIcon.tsx";
import {Check} from "lucide-react";
import styles from './MemberSelector.module.css';
import {useProfileStore} from "../../store/profileStore.ts";

interface MemberSelectorProps {
    membersMap: Map<string, UserProfile>,
    selectedMembersIds: string[],
    clickAction: (member: UserProfile) => void,
}

const getBlockClassKey = (color: HighlightColor) => `_block__${color}`;
const getRowClassKey = (color: HighlightColor) => `_assignedMembers_button__${color}`;

const MemberSelector = ({membersMap, selectedMembersIds, clickAction}: MemberSelectorProps) => {
    const highlightColor = useProfileStore((state) => state.profile.highlightColor);
    const members = [...membersMap.values()];
    console.log(members)
    return (
        <div className={`${styles.block} hideScrollbar ${highlightColor && styles[getBlockClassKey(highlightColor)]}`}>
            {members && members.map((m) => (
                <div className={`${styles.row} ${highlightColor && styles[getRowClassKey(highlightColor)]}`} onClick={() => clickAction(m)} key={m.uid}>
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