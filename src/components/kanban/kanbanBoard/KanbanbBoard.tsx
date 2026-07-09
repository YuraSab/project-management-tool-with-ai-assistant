import {DragDropContext, DropResult} from "@hello-pangea/dnd";
import styles from "./KanbanBoard.module.css";
import {DroppableColumnBody} from "../drag/DroppableColumnBody";
import KanbanDraggableCard from "../drag/KanbanDraggableCard";
import {TASK_STATUSES, TaskFilters, TaskStatus} from "../../../types/task";
import React, {memo, useCallback, useMemo} from "react";
import KanbanCardSkeleton from "../kanbanCard/KanbanCardSkeleton.tsx";
import {useTasks} from "../../../hooks/task/useTasks.ts";
import {useUpdateTask} from "../../../hooks/task/useUpdateTask.ts";
import {useProjectControlStore} from "../../../store/projectControlStore.ts";
import {useShallow} from "zustand/react/shallow";
import {getFilteredTasks, getSortedTasks} from "../../../utils/controlPanel.ts";
import {switchRightPanelView} from "../../../utils/panelManager.ts";
import {useProfileStore} from "../../../store/profileStore.ts";

interface KanbanBoardProps { projectId: string }
const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
    const ownId = useProfileStore((state) => state.profile.uid)
    const { data: projectTasks, isPending } = useTasks(projectId || "");
    const taskUpdateMutation = useUpdateTask();
    const filters = useProjectControlStore(useShallow(state => ({
        users: state.usersFilter,
        status: state.statusFilter, priority: state.priorityFilter, noPriority: state.showNoPriorityTasks,
        start: state.startDateFilter, end: state.endDateFilter,
        sortValue: state.sortValue,
        searchTermFilter: state.searchTermFilter,
        isInitialLoad: state.isInitialLoad,
        unassignedTasks: state.showUnassignedTasks,
        showTaskCounter: state.showTaskCounter,
    })));
    const statuses = useProjectControlStore(useShallow(state => ({
        isLeftPanelActive: state.isLeftPanelActive, isRightPanelActive: state.isRightPanelActive,
    })));

    const handleDragEnd = useCallback(async (result: DropResult): Promise<void> => {
        const {destination, draggableId} = result;
        if (!destination || !projectTasks) return; // if drop happened outer columns
        const selectedTask = projectTasks?.find(t => t.id === draggableId);
        if (!selectedTask) return;
        await taskUpdateMutation.mutate({
            id: selectedTask.id,
            status: destination.droppableId as TaskStatus
        });
    }, [projectTasks, taskUpdateMutation]);

    const filteredTasks = useMemo(() => {
        if (!projectTasks) return { todo: [], in_progress: [], done: [] };

        const currentFilters = {
            users: filters.users,
            start: filters.start,
            end: filters.end,
            priority: filters.priority,
            noPriority: filters.noPriority,
            searchTerm: filters.searchTermFilter,
            isInitialLoad: filters.isInitialLoad,
            unassignedTasks: filters.unassignedTasks
        } as TaskFilters;

        const processTasks = (status: TaskStatus) => {
            const filtered = getFilteredTasks(projectTasks, status, currentFilters);
            return getSortedTasks(filtered, filters.sortValue);
        };

        return {
            todo: processTasks('todo'),
            in_progress: processTasks('in_progress'),
            done: processTasks('done')
        };
    }, [projectTasks, filters.users, filters.start, filters.end, filters.priority, filters.sortValue, filters.searchTermFilter, filters.isInitialLoad, filters.unassignedTasks, filters.noPriority]);

    const taskCounter = useMemo(() => {
        return TASK_STATUSES.reduce((acc, status) => {
            acc[status] = {
                total: filteredTasks[status].length,
                own: filteredTasks[status].filter((t) => t.assignedMembers?.includes(ownId)).length,
            };
            return acc;
        }, {} as Record<TaskStatus, { total: number, own: number }>);
    }, [filteredTasks, ownId]);

    const shouldShowColumn = useCallback((status: TaskStatus): boolean => {
        return filters.status.length === 0 || filters.status.includes(status);
    }, [filters.status]);

    const columns = useMemo(() => [
        { id: "todo" as TaskStatus, title: "Todo", tasks: filteredTasks.todo, headerClass: styles.todoHeader, counts: taskCounter.todo },
        { id: "in_progress" as TaskStatus, title: "In Progress", tasks: filteredTasks.in_progress, headerClass: styles.inProgressHeader, counts: taskCounter.in_progress },
        { id: "done" as TaskStatus, title: "Done", tasks: filteredTasks.done, headerClass: styles.doneHeader,counts: taskCounter.done },
    ], [filteredTasks, taskCounter]);

    const gridStyle = useMemo(() => {
        const count = columns.filter(col => shouldShowColumn(col.id)).length;
        return {display: 'grid', gridTemplateColumns: `repeat(${count}, 1fr)`};
    }, [columns, shouldShowColumn]);

    return <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.kanbanBoard} style={gridStyle}>
            {/* Column headers */}
            {columns.map(col => shouldShowColumn(col.id) && (
                <div key={`${col.id}-header`} className={`${styles.columnHeader} ${col.headerClass}`}>
                    <span className={styles.columnTitle}>{col.title}</span>
                    {filters.showTaskCounter && (
                        <span className={styles.counterBlock}>{col.counts.own}/{col.counts.total}</span>
                    )}
                </div>
            ))}
            {/* Column bodies */}
            {columns.map(col => shouldShowColumn(col.id) && (
                <DroppableColumnBody key={`${col.id}-body`} droppableId={col.id}>
                    <div className={styles.statusColumn}>
                        {
                            isPending
                                ? ([...Array(3)].map((_, i) => (
                                    <KanbanCardSkeleton key={i} isCompact={statuses.isLeftPanelActive && statuses.isRightPanelActive}/>
                                )))
                                : (col.tasks.map((task, index) => (
                                    <KanbanDraggableCard
                                        key={task.id}
                                        task={task}
                                        index={index}
                                        handleOnTaskClick={() => switchRightPanelView('editTask', task)}
                                    />
                                )))
                        }
                    </div>
                </DroppableColumnBody>
            ))}
        </div>
    </DragDropContext>
}

export default memo(KanbanBoard);