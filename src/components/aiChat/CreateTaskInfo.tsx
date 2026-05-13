import React from 'react';
import styles from './TaskInfo.module.css';
import {Plus} from "lucide-react";
import {Task} from "../../types/task.ts";
import StatusText from "../../ui/statusText/StatusText.tsx";
import UserIconCollection from "../usersIconsCollection/UsersIconsCollection.tsx";
import {useProjectUsers} from "../../hooks/project/useProjectUsers.ts";

interface CreateTaskInfoProps {
    title: string,
    payload: Partial<Task>,
}

const TaskFieldsLabels: Record<keyof Omit<Task, 'id' | 'projectId'>, string> = {
    title: 'Назва',
    description: 'Опис',
    assignedMembers: 'Виконавці',
    status: 'Статус',
    priority: 'Пріоритет',
    startDate: 'Дедлайн',
    endDate: 'Дедлайн',
};

const CreateTaskInfo = ({payload, title}: CreateTaskInfoProps) => {
    const { data: assignedMembersProfiles } = useProjectUsers(payload.assignedMembers || []);
    return (
        <div className={styles.actionDetails}>
            <div className={styles.actionMainLine}>
                <Plus size={14} color="#28a745" strokeWidth={2.5} className={styles.actionIcon}/>
                <strong>{title}</strong>
            </div>
            <div className={styles.detailsList}>
                {Object.entries(payload).map(([key, value]) => {
                    if (key === 'projectId') return null;
                    return (
                        <div key={key} className={styles.detailRow}>
                            <span className={styles.fieldName}>{TaskFieldsLabels[key] || key}:</span>
                            {
                                (key === 'status' || key === 'priority')
                                    ? <StatusText status={value}/>
                                    : (
                                        key === 'assignedMembers'
                                            ? <UserIconCollection users={assignedMembersProfiles || []} size={20} maxIcons={3} fontSize={12} align={'start'}/>
                                            : <span className={styles.fieldValue}>{String(value)}</span>
                                    )
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

export default CreateTaskInfo;