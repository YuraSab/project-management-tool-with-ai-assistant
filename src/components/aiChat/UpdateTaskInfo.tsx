import React from 'react';
import styles from './TaskInfo.module.css';
import {Pencil} from "lucide-react";
import StatusText from "../../ui/statusText/StatusText.tsx";
import {Task} from "../../types/task.ts";
import UserIconCollection from "../usersIconsCollection/UsersIconsCollection.tsx";
import {useProjectUsers} from "../../hooks/project/useProjectUsers.ts";

interface UpdateTaskInfoProps {
    title: string,
    payload: Partial<Task>,
}

const TaskFieldsLabels: Record<keyof Omit<Task, 'id' | 'projectId'>, string> = {
    title: 'Нова назва',
    description: 'Опис',
    assignedMembers: 'Виконавці',
    status: 'Статус',
    priority: 'Пріоритет',
    startDate: 'Дедлайн',
    endDate: 'Дедлайн',
};

const UpdateTaskInfo = ({payload, title}: UpdateTaskInfoProps) => {
    const { data: assignedMembersProfiles } = useProjectUsers(payload.assignedMembers || []); // todo - make some hook for UserIconCollection and pass there ids only
    return (
    <div className={styles.actionDetails}>
        <div className={styles.actionMainLine}>
            <Pencil size={14} color="#007bff"/>
            <strong>{title || payload.id}</strong>
        </div>
        <div className={styles.detailsList}>
            {Object.entries(payload).map(([key, value]) => {
                if (['id', 'projectId'].includes(key)) return null;
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
                );
            })}
        </div>
    </div>
)};

export default UpdateTaskInfo;