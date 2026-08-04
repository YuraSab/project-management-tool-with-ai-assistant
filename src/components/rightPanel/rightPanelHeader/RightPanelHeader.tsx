import React, { useCallback } from "react";
import { X } from "lucide-react";
import { switchRightPanelView } from "../../../utils/panelManager";
import styles from "./RightPanelHeader.module.css";

interface RightPanelHeaderProps {
    taskTitle: string,
}

const RightPanelHeader = ({taskTitle}: RightPanelHeaderProps) => {
    const handleClose = useCallback(() => {
        switchRightPanelView('closeAll');
    }, [])

    return (
        <div className={styles.titleBlock}>
            <h1>{taskTitle}</h1>
            <div className={styles.controlIcons}>
                <X
                    onClick={handleClose}
                    role={"button"}
                    size={34}
                />
            </div>
        </div>
    );
};

RightPanelHeader.displayName = "RightPanelHeader";

export default React.memo(RightPanelHeader);