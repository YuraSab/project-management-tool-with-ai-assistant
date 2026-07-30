import { useCallback, useEffect, useState } from "react";
import styles from "./SearchMember.module.css";
import CustomUserIcon from "../../ui/icons/CustomUserIcon";
import { UserPlus, Check } from "lucide-react"; // 👈 Додали іконку Check
import { useUpdateUser } from "../../hooks/users/useUpdateUser.ts";
import { useProfileStore } from "../../store/profileStore.ts";
import { useSearchUsers } from "../../hooks/users/useSearchUsers.ts";
import { useShallow } from "zustand/react/shallow";
import Error from "../error/Error.tsx";
import {toast} from "../../utils/toaster.ts";
import {getColorThemeVariables} from "../../utils/colorThemeSelector.ts";
import {HighlightColor} from "../../types/user.ts";

const SearchMember = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debounceTerm, setDebounceTerm] = useState<string>('');
    const { profile, editProfile } = useProfileStore(useShallow((state) => ({
        profile: state.profile, editProfile: state.editProfile
    })));
    const { mutate: updateUser } = useUpdateUser();

    // Передаємо тільки profile.uid
    const { data: searchMembers, isPending, isError } = useSearchUsers(debounceTerm, profile?.uid || '');

    const colorVariables = getColorThemeVariables(profile?.highlightColor ?? HighlightColor.Purple);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebounceTerm(searchTerm);
        }, 700);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const handleReserveUser = useCallback((userId: string) => {
        if (!profile || profile.reservedMembers.includes(userId))
            return;

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

            {isPending && debounceTerm.trim() !== "" && <p style={{ color: '#6b7280', fontSize: '14px' }}>Searching...</p>}
            {isError && <Error type={'server_crash'} style={{ padding: 10 }} />}

            {searchMembers && searchMembers.length > 0 && (
                <ul className={styles.resultsList}>
                    {searchMembers.map((m) => {
                        // 🌟 Перевіряємо, чи користувач вже доданий у контакти
                        const isAlreadyAdded = profile?.reservedMembers.includes(m.uid);

                        return (
                            <li key={m.uid} className={styles.searchResultCard}>
                                <div className={styles.userInfo}>
                                    {/* 🔥 Безпечний рендер першої літери (захист від undefined) */}
                                    <CustomUserIcon
                                        title={m.displayName ? m.displayName[0] : m.email[0].toUpperCase()}
                                        backgroundColor={m.iconColor}
                                    />
                                    <h3 className={styles.userEmail}>{m.email}</h3>
                                </div>

                                {/* 🌟 Динамічна зміна іконки залежно від статусу */}
                                {isAlreadyAdded ? (
                                    <Check
                                        size={24}
                                        style={{ color: '#10b981', marginRight: 2 }} // Зелена галочка для доданих
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