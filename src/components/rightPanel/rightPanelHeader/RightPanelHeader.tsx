import React from "react";
import {X} from "lucide-react";
import styles from "./RightPanelHeader.module.css";
import {switchRightPanelView} from "../../../utils/panelManager.ts";

interface RightPanelHeaderProps {
    taskTitle: string,
}

const RightPanelHeader = ({taskTitle}: RightPanelHeaderProps) => (
    <div className={styles.titleBlock}>
        <h1>{taskTitle}</h1>
        <div className={styles.controlIcons}>
            <X
                onClick={() => switchRightPanelView('closeAll')}
                size={34}
            />
        </div>
    </div>
);

export default React.memo(RightPanelHeader);