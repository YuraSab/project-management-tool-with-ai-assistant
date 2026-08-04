import { useCallback, useMemo } from 'react';
import { LogOut } from "lucide-react";
import {
    HighlightColor,
    HighlightColorSet,
    IconColor,
    IconColorSet,
    Role,
    Theme,
    ThemeSet,
    UserProfile
} from "../../types/user";
import { formatDateForInput } from "../../utils/dateFormat";
import { toast } from "../../utils/toaster";
import { useLogout } from "../../hooks/auth/useLogout";
import { useUser } from "../../hooks/users/useUser";
import { useUpdateUser } from "../../hooks/users/useUpdateUser";
import { useProfileStore } from "../../store/profileStore";
import Title from "../../ui/title/Title";
import FormTextInput from "../../ui/input/FormTextInput";
import DisabledField from "../../ui/disabledField/DisabledField";
import CustomButton from "../../ui/button/CustomButton";
import CustomForm from "../../ui/form/CustomForm";
import CustomUserIcon from "../../ui/icons/CustomUserIcon";
import CustomColorIcon from "../../ui/icons/CustomColorIcon";
import styles from './Profile.module.css';

const Profile = () => {
    const logout = useLogout();
    const profile = useProfileStore((state) => state.profile);
    const editProfile = useProfileStore((state) => state.editProfile);

    const {
        uid = "",
        email = "",
        role = Role.Member,
        displayName = "",
        createdAt = "",
        theme = Theme.White,
        iconColor = IconColor.Purple,
        highlightColor = HighlightColor.Purple
    } = profile || {};

    const { data: initialProfile } = useUser(uid);
    const { mutate: updateUser, isPending } = useUpdateUser();

    const hasChangedForm = useMemo(() => {
        if (!initialProfile) return false;
        return !(
            initialProfile.displayName === displayName &&
            initialProfile.theme === theme &&
            initialProfile.iconColor === iconColor &&
            initialProfile.highlightColor === highlightColor
        )
    }, [initialProfile, displayName, theme, iconColor, highlightColor]);

    const handleUpdateProfile = useCallback(() => {
        if (!hasChangedForm || !profile) return;
        if (!displayName.trim()) return toast.warning('Display name cannot be empty!');
        const updatedProfileData: Partial<UserProfile> = {
            displayName: displayName,
            theme,
            iconColor,
            highlightColor,
        };
        updateUser({ uid, ...updatedProfileData });
        editProfile(updatedProfileData);
    }, [uid, displayName, theme, iconColor, highlightColor, updateUser, editProfile, hasChangedForm, profile]);

    if (!profile) return null; // todo loader

    return (
        <CustomForm onSubmit={handleUpdateProfile} className={styles.mainBlock} disabled={isPending}>
            <div  className={styles.logoutBlock}>
                <Title text='Avatar' style={{ paddingTop: 0 }}/>
                <LogOut onClick={logout}/>
            </div>
            <CustomUserIcon backgroundColor={iconColor} title={displayName.trim() ? displayName.trim()[0] : 'U'} style={{ marginTop: 4 }}/>
            <Title text='ID'/>
            <DisabledField children={uid || ''} copyText={uid || ''} toastValue={'User ID copied'}/>
            <Title text='Email'/>
            <DisabledField children={email || ''} copyText={email || ''} toastValue={'User email copied'}/>
            <Title text={'Role'}/>
            <DisabledField children={role}/>
            <Title text='Created at'/>
            <DisabledField children={formatDateForInput(createdAt)}/>
            <Title text='Name'/>
            <FormTextInput name={'displayName'} value={displayName} onChange={(e) => editProfile({ displayName: e.target.value })}/>
            <Title text={'Your icon color'}/>
            <div className={styles.paletteBlock}>
                {IconColorSet.map((color) => (
                    <CustomColorIcon<IconColor>
                        currentColor={color}
                        selectedColor={iconColor}
                        onClick={() => editProfile({ iconColor: color })}
                        key={color}
                    />
                ))}
            </div>
            <Title text={'Highlight color'}/>
            <div className={styles.paletteBlock}>
                {HighlightColorSet.map((color) => (
                    <CustomColorIcon<HighlightColor>
                        currentColor={color}
                        selectedColor={highlightColor}
                        onClick={() => editProfile({ highlightColor: color })}
                        key={color}
                    />
                ))}
            </div>
            <Title text={'Theme color'}/>
            <div className={styles.paletteBlock}>
                {ThemeSet.map((color) => (
                    <CustomColorIcon<Theme>
                        currentColor={color}
                        selectedColor={theme}
                        onClick={() => editProfile({ theme: color })}
                        key={color}
                    />
                ))}
            </div>
            <CustomButton children={'Save changes'} style={{ marginTop: 8 }} disabled={!hasChangedForm} type={'submit'}/>
        </CustomForm>
    );
};

export default Profile;