import styles from './TaskInfo.module.css';
import {Trash2} from "lucide-react";
import {Task} from "../../types/task.ts";

interface DeleteTaskInfoProps {
    title: string,
    payload: Partial<Task>,
}

const DeleteTaskInfo = ({payload, title}: DeleteTaskInfoProps) => (
    <div className={styles.actionDetails}>
        <div className={styles.actionMainLine}>
            <Trash2 size={14} color="#dc3545" />
            <strong>{title || payload.id}</strong>
        </div>
    </div>
);

export default DeleteTaskInfo;