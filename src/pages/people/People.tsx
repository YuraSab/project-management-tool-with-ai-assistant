import { UserMinus } from "lucide-react";
import CustomUserIcon from "../../ui/icons/CustomUserIcon";
import styles from "./People.module.css";
import SearchMember from "../../components/searchMember/SearchMember";
import { useProfileStore } from "../../store/profileStore.ts";
import { useProjectUsers } from "../../hooks/project/useProjectUsers.ts";
import { useUpdateUser } from "../../hooks/users/useUpdateUser.ts";
import { useShallow } from "zustand/react/shallow";
import React from "react";
import CopyIcon from "../../ui/copyIcon/CopyIcon.tsx";
import {toast} from "../../utils/toaster.ts";

const People = () => {
    const { profile, editProfile } = useProfileStore(useShallow((state) => ({
        profile: state.profile, editProfile: state.editProfile
    })));
    const { data: reservedMembers } = useProjectUsers(profile.reservedMembers);
    const { mutate: updateProfile } = useUpdateUser();

    const handleRemoveReservedMember = (memberId: string) => {
        if (!profile.uid) return alert('Profile not found.');
        const updatedReservedMembers = profile.reservedMembers.filter(mId => mId !== memberId);
        updateProfile({
            uid: profile.uid,
            reservedMembers: updatedReservedMembers
        }, {
            onSuccess: () => {
                editProfile({ reservedMembers: updatedReservedMembers });
                toast.success('Deleted member');
            }
        });
    };

    return (
        <div className={styles.main}>
            <SearchMember />
            <div className={styles.contactsSection}>
                <h2 className={styles.sectionTitle}>My Contacts</h2>
                <ul>
                    {reservedMembers && reservedMembers.length > 0 ? (
                        reservedMembers.map((m) => (
                            <li key={m.uid} className={styles.element}>
                                <div className={styles.userInfo}>
                                    <CustomUserIcon title={m.displayName ? m.displayName[0] : 'U'} backgroundColor={m.iconColor} />
                                    <div className={styles.userMeta}>
                                        <h3 className={styles.userEmail}>{m.email}</h3>
                                        <span className={styles.userRole}>{m.role || 'Member'}</span>
                                    </div>
                                </div>
                                <div className={styles.buttonsContainer}>
                                    <CopyIcon
                                        copyValue={m.email}
                                        toastValue={'Email copied!'}
                                        size={20}
                                        // customStyles={{ color: '#64748b' }}
                                    />
                                    <UserMinus
                                        size={28}
                                        className={`
                                        ${styles.deleteBtn}`}
                                        onClick={() => handleRemoveReservedMember(m.uid)}
                                    />
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className={styles.noData}>No users added to your contact list yet.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default People;