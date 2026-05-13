import styles from './AIChat.module.css';
import CreateTaskInfo from "./CreateTaskInfo.tsx";
import UpdateTaskInfo from "./UpdateTaskInfo.tsx";
import DeleteTaskInfo from "./DeleteTaskInfo.tsx";
import {AIChatAction} from "../../store/aiChatStore.ts";

interface ActionCardProps {
    actions: AIChatAction[],
    onApply: () => void,
    onCancel: () => void
}

const ActionCard = ({ actions, onApply, onCancel }: ActionCardProps) => (
    <div className={styles.actionCard}>
        <div className={styles.actionCardHeader}>Зміни:</div>
        <div className={styles.actionsContent}>
            {actions.map((a, index) => (
                <div key={index} className={styles.actionItemWrapper}>
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

export default ActionCard;