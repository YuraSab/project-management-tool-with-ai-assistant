import { useShallow } from "zustand/react/shallow";
import { UserMinus } from "lucide-react";
import { toast } from "../../utils/toaster";
import { useUpdateUser } from "../../hooks/users/useUpdateUser";
import { useProjectUsers } from "../../hooks/project/useProjectUsers";
import { useProfileStore } from "../../store/profileStore";
import CustomUserIcon from "../../ui/icons/CustomUserIcon";
import CopyIcon from "../../ui/copyIcon/CopyIcon";
import SearchMember from "../../components/searchMember/SearchMember";
import styles from "./People.module.css";

const People = () => {
    const { profile, editProfile } = useProfileStore(useShallow((state) => ({
        profile: state.profile, editProfile: state.editProfile
    })));

    const { data: reservedMembers, isPending } = useProjectUsers(profile?.reservedMembers || []);
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateUser();

    const handleRemoveReservedMember = (memberId: string) => {
        if (!profile?.uid)
            return toast.error('Profile not found!');

        const updatedReservedMembers = profile.reservedMembers.filter(mId => mId !== memberId);
        updateProfile({
            uid: profile.uid,
            reservedMembers: updatedReservedMembers
        }, {
            onSuccess: () => {
                editProfile({ reservedMembers: updatedReservedMembers });
                toast.success('Contact removed!');
            },
            onError: () => toast.error('Failed to remove contact.')
        });
    };

    return (
        <div className={styles.main}>
            <SearchMember />
            <div className={styles.contactsSection}>
                <h2 className={styles.sectionTitle}>My Contacts</h2>
                {isPending ? (
                    <p>Loading contacts...</p> // todo loader / skeleton
                ) : (
                    <ul>
                        {reservedMembers && reservedMembers.length > 0 ? (
                            reservedMembers.map((m) => (
                                <li key={m.uid} className={styles.element}>
                                    <div className={styles.userInfo}>
                                        <CustomUserIcon title={m.displayName ? m.displayName[0] : 'U'}
                                                        backgroundColor={m.iconColor}/>
                                        <div className={styles.userMeta}>
                                            <h3 className={styles.userEmail}>{m.email}</h3>
                                            <span className={styles.userRole}>{m.role || 'Member'}</span>
                                        </div>
                                    </div>
                                    <div className={styles.buttonsContainer}>
                                        <CopyIcon
                                            copyValue={m.email ?? ''}
                                            toastValue={'Email copied!'}
                                            size={20}
                                        />
                                        <UserMinus
                                            size={28}
                                            className={`${styles.deleteBtn}`}
                                            onClick={() => !isUpdating && handleRemoveReservedMember(m.uid)}
                                        />
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className={styles.noData}>No users added to your contact list yet.</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default People;