import {useCallback, useMemo} from 'react';
import {useProfileStore} from "../../store/profileStore.ts";
import CustomUserIcon from "../../ui/icons/CustomUserIcon.tsx";
import Title from "../../ui/title/Title.tsx";
import {formatDateForInput} from "../../utils/dateFormat.ts";
import styles from './Profile.module.css';
import CustomForm from "../../ui/form/CustomForm.tsx";
import { HighlightColor,  HighlightColorSet,  IconColor,  IconColorSet,  Theme,  ThemeSet,  UserProfile
} from "../../types/user.ts";
import CustomColorIcon from "../../ui/icons/CustomColorIcon.tsx";
import CustomButton from "../../ui/button/CustomButton.tsx";
import DisabledField from "../../ui/disabledField/DisabledField.tsx";
import {useUpdateUser} from "../../hooks/users/useUpdateUser.ts";
import {toast} from "../../utils/toaster.ts";
import {useUser} from "../../hooks/users/useUser.ts";
import FormTextInput from "../../ui/input/FormTextInput.tsx";
import {LogOut} from "lucide-react";
import {useLogout} from "../../hooks/auth/useLogout.ts";

const Profile = () => {
    const logout = useLogout();
    const profile = useProfileStore((state) => state.profile);
    const { uid, email, role, displayName, createdAt, theme, iconColor, highlightColor } = profile;
    const editProfile = useProfileStore((state) => state.editProfile);

    const { data: initialProfile } = useUser(uid || "");
    const { mutate: updateUser } = useUpdateUser();

    const hasChangedForm = useMemo(() => {
        return !(
            initialProfile?.displayName === displayName &&
            initialProfile?.theme === theme &&
            initialProfile?.iconColor === iconColor &&
            initialProfile?.highlightColor === highlightColor
        )
    }, [initialProfile, displayName, theme, iconColor, highlightColor]);

    const handleUpdateProfile = useCallback(() => {
        if (!hasChangedForm) return;
        const updatedProfileData: Partial<UserProfile> = {
            displayName,
            theme,
            iconColor,
            highlightColor,
        };
        updateUser({ uid, ...updatedProfileData });
        editProfile(updatedProfileData);
        toast.success('Profile updated');
    }, [uid, displayName, theme, iconColor, highlightColor, updateUser, editProfile, hasChangedForm]);

    return (
        <CustomForm onSubmit={handleUpdateProfile} className={styles.mainBlock}>
            <div  className={styles.logoutBlock}>
                <Title text='Avatar' style={{ paddingTop: 0 }}/>
                <LogOut onClick={logout}/>
            </div>
            <CustomUserIcon backgroundColor={iconColor} title={displayName[0]} customStyles={{ marginTop: 4 }}/>
            <Title text='ID'/>
            <DisabledField children={uid} copyText={uid} toastValue={'User ID copied'}/>
            <Title text='Email'/>
            <DisabledField children={email} copyText={email} toastValue={'User email copied'}/>
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
            <CustomButton children={'Save changes'} customStyles={{ marginTop: 8 }} disabled={!hasChangedForm} type={'submit'}/>
        </CustomForm>
    );
};

export default Profile;