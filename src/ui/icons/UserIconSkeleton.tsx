import styles from "./UserIconSkeleton.module.css";

interface CustomUserIconProps {
    size?: number,
}

const CustomUserIcon = ({ size = 36 }: CustomUserIconProps) => (
    <div
        className={styles.skeleton}
        style={{width: size, height: size}}
    />
);

export default CustomUserIcon;