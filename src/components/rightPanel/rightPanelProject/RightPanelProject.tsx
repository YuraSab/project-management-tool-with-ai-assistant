import React from "react";
import { Theme } from "../../../types/user";
import { useProfileStore } from "../../../store/profileStore";
import { useAIChatStore } from "../../../store/aiChatStore";
import { useProjectControlStore } from "../../../store/projectControlStore";
import AIChat from "../../aiChat/AIChat";
import TaskAdd from "../../task/taskAdd/TaskAdd";
import TaskEdit from "../../task/taskEdit/TaskEdit";
import styles from "./RightPanelProject.module.css";

const RightPanelProject = () => {
    const isAIChatOpened= useAIChatStore((state) => state.isAIChatOpened );
    const selectedTask = useProjectControlStore((state) => state.selectedTask);
    const isAddTaskActive = useProjectControlStore((state) => state.isAddTaskActive);
    const theme = useProfileStore((state) => state.profile?.theme);

    return (
        <div className={styles.main} style={{ backgroundColor: theme === Theme.Black ? Theme.Black : "#f3f4f6" }}>
            {isAIChatOpened
                    ? <AIChat/>
                    : isAddTaskActive
                        ? <TaskAdd/>
                        :  selectedTask && <TaskEdit/>
            }
        </div>
    );
};

RightPanelProject.displayName = "RightPanelProject";

export default React.memo(RightPanelProject);