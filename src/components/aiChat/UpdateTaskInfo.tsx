import { Pencil } from "lucide-react";
import { Task } from "../../types/task";
import { useProjectUsers } from "../../hooks/project/useProjectUsers";
import StatusText, { StatusType } from "../../ui/statusText/StatusText";
import UserIconCollection from "../usersIconsCollection/UsersIconsCollection";
import styles from './TaskInfo.module.css';

interface UpdateTaskInfoProps {
    title: string,
    payload: Partial<Task>,
}

const TaskFieldsLabels: Record<keyof Omit<Task, 'id' | 'projectId' | 'createdAt' | 'creatorId' | 'updatedAt'>, string> = {
    title: 'Title',
    description: 'Description',
    assignedMembers: 'Assigned',
    status: 'Status',
    priority: 'Priority',
    startDate: 'From',
    endDate: 'To',
    type: 'Type',
    category: 'Category'
};

const UpdateTaskInfo = ({payload, title}: UpdateTaskInfoProps) => {
    const {data: assignedMembersProfiles} = useProjectUsers(payload.assignedMembers || []);
    return (
        <div className={styles.actionDetails}>
            <div className={styles.actionMainLine}>
                <Pencil size={14} color="#007bff"/>
                <strong>{title || payload.id}</strong>
            </div>
            <div className={styles.detailsList}>
                {Object.entries(payload).map(([key, value]) => {
                    if (['id', 'projectId'].includes(key) || ['id', 'projectId'].includes(key))
                        return null;
                    return (
                        <div key={key} className={styles.detailRow}>
                            <span className={styles.fieldName}>{TaskFieldsLabels[key as keyof typeof TaskFieldsLabels] || key}:</span>
                            {(key === 'status' || key === 'priority') ? (
                                value && <StatusText status={value as StatusType}/>
                            ) : key === 'assignedMembers' ? (
                                <UserIconCollection
                                    users={assignedMembersProfiles || []}
                                    size={20} maxIcons={3} fontSize={12} align={'start'}
                                />
                            ) : (
                                <span className={styles.fieldValue}>{String(value)}</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UpdateTaskInfo;