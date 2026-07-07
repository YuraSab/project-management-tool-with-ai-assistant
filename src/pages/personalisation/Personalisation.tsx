import CustomColorIcon from "../../ui/icons/CustomColorIcon";
import styles from "./Personalisation.module.css";
import CustomButton from "../../ui/button/CustomButton";
import {useProfileStore} from "../../store/profileStore.ts";
import {ColorPalette, HighlightColorSet, IconColorSet, Theme, ThemeSet, UserProfile} from "../../types/user.ts";
import {useUpdateUser} from "../../hooks/users/useUpdateUser.ts";
import Title from "../../ui/title/Title.tsx";

const Personalisation = () => {
    const { uid, theme, iconColor, highlightColor } = useProfileStore((state) => state.profile);
    const editProfile = useProfileStore((state) => state.editProfile);
    const { mutate: updateProfile } = useUpdateUser();

    const handleUpdateTheme = () => {
        if ( !uid ) return;
        updateProfile({
            uid,
            theme, iconColor, highlightColor,
        });
    };

    const handleChangeColor = (field: keyof UserProfile, color: ColorPalette) => {
        editProfile({ field: color });
    };

    return(
        <div className={`${styles.main} ${theme === Theme.Black ? styles.dark : styles.light}`}>
            <Title text={'Your icon color'}/>
            <div className={styles.palleteBlock}>
                { IconColorSet.map((color) => <CustomColorIcon key={color} backgroundColor={theme} field={'iconColor'} onClick={handleChangeColor} currentColor={iconColor}/> ) }
            </div>
            <Title text={'Highlight color'}/>
            <div className={styles.palleteBlock}>
                { HighlightColorSet.map((color) => <CustomColorIcon key={color} backgroundColor={theme} field={'highlightColor'} onClick={handleChangeColor} currentColor={highlightColor}/> ) }
            </div>
            <Title text={'Theme color'}/>
            <div className={styles.palleteBlock}>
                { ThemeSet.map((color) => <CustomColorIcon key={color} backgroundColor={theme} field={'theme'} onClick={handleChangeColor} currentColor={theme}/> ) }
            </div>
            <CustomButton children={"Save changes"} onClick={handleUpdateTheme} customStyles={{width: 200}}/>
        </div>
    );
};

export default Personalisation;