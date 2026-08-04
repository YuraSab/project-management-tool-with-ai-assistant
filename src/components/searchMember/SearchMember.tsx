import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { UserPlus, Check } from "lucide-react";
import { HighlightColor } from "../../types/user";
import { getColorThemeVariables } from "../../utils/colorThemeSelector";
import { toast } from "../../utils/toaster";
import { useSearchUsers } from "../../hooks/users/useSearchUsers";
import { useUpdateUser } from "../../hooks/users/useUpdateUser";
import { useProfileStore } from "../../store/profileStore";
import CustomUserIcon from "../../ui/icons/CustomUserIcon";
import Error from "../error/Error.tsx";
import styles from "./SearchMember.module.css";

const SearchMember = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debounceTerm, setDebounceTerm] = useState<string>('');
    const { profile, editProfile } = useProfileStore(useShallow((state) => ({
        profile: state.profile, editProfile: state.editProfile
    })));

    const { data: searchMembers, isPending, isError } = useSearchUsers(debounceTerm, profile?.uid || '');
    const { mutate: updateUser } = useUpdateUser();

    const reservedMembersSet = useMemo(() => (
        new Set(profile?.reservedMembers || [])
    ), [profile?.reservedMembers]);

    const handleReserveUser = useCallback((userId: string) => {
        if (!profile || profile?.reservedMembers?.includes(userId)) return;
        const reservedMembers = [...profile.reservedMembers, userId];
        updateUser({
            uid: profile.uid,
            reservedMembers: reservedMembers
        });
        editProfile({ reservedMembers });
        setSearchTerm('');
        setDebounceTerm('');
        toast.success('Reserved member');
    }, [profile, updateUser, editProfile]);

    const colorVariables = getColorThemeVariables(profile?.highlightColor ?? HighlightColor.Purple);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebounceTerm(searchTerm);
        }, 700);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    return (
        <div className={styles.searchSection}>
            <input
                type="text"
                value={searchTerm}
                className={styles.searchInput}
                placeholder="Search user by email..."
                onChange={(e) => setSearchTerm(e.target.value)}
                style={colorVariables}
            />
            {isPending && debounceTerm.trim() !== "" && (
                <p style={styles.searchingText}>Searching...</p>
            )}
            {isError && <Error type={'server_crash'} style={{padding: 10 }} />}
            {searchMembers && searchMembers.length > 0 && (
                <ul className={styles.resultsList}>
                    {searchMembers.map((m) => {
                        const isAlreadyAdded = reservedMembersSet.has(m.uid);
                        const avatarTitle = m.displayName?.charAt(0) || m.email?.charAt(0).toUpperCase() || "U";
                        return (
                            <li key={m.uid} className={styles.searchResultCard}>
                                <div className={styles.userInfo}>
                                    <CustomUserIcon
                                        title={avatarTitle}
                                        backgroundColor={m.iconColor}
                                    />
                                    <h3 className={styles.userEmail}>{m.email}</h3>
                                </div>
                                {isAlreadyAdded ? (
                                    <Check
                                        size={24}
                                        style={{ color: '#10b981', marginRight: 2 }}
                                    />
                                ) : (
                                    <UserPlus
                                        size={28}
                                        className={styles.plusBtn}
                                        onClick={() => handleReserveUser(m.uid)}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
            {debounceTerm.trim() !== '' && !isPending && (!searchMembers || searchMembers.length === 0) && (
                <Error type={'not_found'} style={{ padding: 10 }} />
            )}
        </div>
    );
};

export default SearchMember;