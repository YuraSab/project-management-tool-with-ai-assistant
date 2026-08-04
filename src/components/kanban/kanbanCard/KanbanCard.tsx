import { Task } from "../../../types/task";
import { useProjectUsers } from "../../../hooks/project/useProjectUsers";
import { useProjectControlStore } from "../../../store/projectControlStore";
import UserIconCollection from "../../usersIconsCollection/UsersIconsCollection";
import styles from "./Kanban.module.css";
import React from "react";

interface KanbanCardProps {
    task: Task,
    handleOnTaskClick: (task: Task) => void,
} 

const KanbanCard = ({ task, handleOnTaskClick }: KanbanCardProps) => {
    const { data: assignedMembersProfiles } = useProjectUsers(task.assignedMembers);
    const isLeftPanelActive = useProjectControlStore((state) => state.isLeftPanelActive);
    const isRightPanelActive = useProjectControlStore((state) => state.isRightPanelActive);
    return (
        <div
            className={styles.cardMain}
            onClick={() => handleOnTaskClick(task)}
            role={'button'}
        >
            <h3 className={`text-lg font-semibold ${styles.title}`}>{task.title}</h3>            
            <p className={`text-sm text-gray-600 ${styles.description}`}>{task.description}</p>
            {assignedMembersProfiles && (
                <UserIconCollection
                    users={assignedMembersProfiles}
                    size={(isLeftPanelActive && isRightPanelActive) ? 24 : 28}
                    fontSize={(isLeftPanelActive && isRightPanelActive) ? 16 : 18}
                />
            )}
        </div>
    );
};

KanbanCard.displayName = "KanbanCard";

export default React.memo(KanbanCard);