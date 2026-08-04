import React, {memo} from "react";
import {HighlightColor} from "../../types/user.ts";
import { AIChatAction } from "../../store/aiChatStore";
import {useProfileStore} from "../../store/profileStore.ts";
import CreateTaskInfo from "./CreateTaskInfo";
import UpdateTaskInfo from "./UpdateTaskInfo";
import DeleteTaskInfo from "./DeleteTaskInfo";
import styles from './AIChat.module.css';

interface ActionCardProps {
    actions: AIChatAction[],
    onApply: () => void,
    onCancel: () => void
}

const ActionCard = memo(({ actions, onApply, onCancel }: ActionCardProps) => {
    const highlightColor = useProfileStore((state) => state.profile?.highlightColor) ?? HighlightColor.Purple;
    return (
        <div className={styles.actionCard} style={{ '--local-color': `var(--color-${highlightColor})` } as React.CSSProperties}>
            <div className={styles.actionTitle}>Зміни:</div>
            <div className={styles.actionsContent}>
                {actions.map((a, index) => (
                    <div key={index}>
                        {a.type === 'CREATE_TASK' && <CreateTaskInfo title={a.title} payload={a.payload}/>}
                        {a.type === 'UPDATE_TASK' && <UpdateTaskInfo title={a.title} payload={a.payload}/>}
                        {a.type === 'DELETE_TASK' && <DeleteTaskInfo title={a.title} payload={a.payload}/>}
                    </div>
                ))}
            </div>
            <div className={styles.actionButtons}>
                <button onClick={onApply} className={styles.applyBtn}>Застосувати</button>
                <button onClick={onCancel} className={styles.cancelBtn}>Відмінити</button>
            </div>
        </div>
    );
});

ActionCard.displayName = "ActionCard";

export default ActionCard;