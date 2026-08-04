import React, {memo, useCallback, useMemo} from "react";
import { useShallow } from "zustand/react/shallow";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { TASK_STATUSES, TaskFilters, TaskStatus } from "../../../types/task";
import { getFilteredTasks, getSortedTasks } from "../../../utils/controlPanel";
import { switchRightPanelView } from "../../../utils/panelManager";
import { useTasks } from "../../../hooks/task/useTasks";
import { useUpdateTask } from "../../../hooks/task/useUpdateTask";
import { useProfileStore } from "../../../store/profileStore";
import { useProjectControlStore } from "../../../store/projectControlStore";
import { DroppableColumnBody } from "../drag/DroppableColumnBody";
import KanbanDraggableCard from "../drag/KanbanDraggableCard";
import KanbanCardSkeleton from "../kanbanCard/KanbanCardSkeleton";
import styles from "./KanbanBoard.module.css";

interface KanbanBoardProps { projectId: string }

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
    const ownId = useProfileStore((state) => state.profile?.uid);
    const { data: projectTasks, isPending } = useTasks(projectId || '', ownId || '');
    const taskUpdateMutation = useUpdateTask(projectId, ownId || '');

    const filters = useProjectControlStore(useShallow(state => ({
        users: state.usersFilter,
        status: state.statusFilter, priority: state.priorityFilter,
        noPriority: state.showNoPriorityTasks,
        start: state.startDateFilter, end: state.endDateFilter,
        sortValue: state.sortValue,
        searchTermFilter: state.searchTermFilter,
        isInitialLoad: state.isInitialLoad,
        unassignedTasks: state.showUnassignedTasks,
        showTaskCounter: state.showTaskCounter,
        typesFilter: state.typesFilter, categoriesFilter: state.categoriesFilter
    })));
    const statuses = useProjectControlStore(useShallow(state => ({
        isLeftPanelActive: state.isLeftPanelActive, isRightPanelActive: state.isRightPanelActive,
    })));

    const handleDragEnd = useCallback(async (result: DropResult): Promise<void> => {
        const {destination, draggableId} = result;
        if (!destination || !projectTasks) return; // if drop happened outer columns
        const selectedTask = projectTasks?.find(t => t.id === draggableId);
        if (!selectedTask) return;
        // If the status hasn't changed, don't hit the database unnecessarily
        if (destination.droppableId === selectedTask.status) return;
        taskUpdateMutation.mutate({
            id: selectedTask.id,
            status: destination.droppableId as TaskStatus
        });
    }, [projectTasks, taskUpdateMutation]);

    const filteredTasks = useMemo(() => {
        if (!projectTasks) return { todo: [], in_progress: [], done: [] };

        const currentFilters = {
            users: filters.users,
            start: filters.start, end: filters.end,
            priority: filters.priority, noPriority: filters.noPriority,
            searchTerm: filters.searchTermFilter,
            isInitialLoad: filters.isInitialLoad,
            unassignedTasks: filters.unassignedTasks,
            types: filters.typesFilter, categories: filters.categoriesFilter,
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
    }, [projectTasks, filters.users, filters.start, filters.end, filters.priority, filters.sortValue, filters.searchTermFilter, filters.isInitialLoad, filters.unassignedTasks, filters.noPriority, filters.typesFilter, filters.categoriesFilter]);

    const taskCounter = useMemo(() => {
        return TASK_STATUSES.reduce((acc, status) => {
            acc[status] = {
                total: filteredTasks[status].length,
                own: filteredTasks[status].filter((t) => ownId && t.assignedMembers?.includes(ownId)).length,
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

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className={styles.kanbanBoard}>
                {columns.map(col => shouldShowColumn(col.id) && (
                    <div key={col.id} className={styles.columnWrapper}>
                        <div className={`${styles.columnHeader} ${col.headerClass}`}> {/* column header */}
                            <span className={styles.columnTitle}>{col.title}</span>
                            {filters.showTaskCounter && (
                                <span className={styles.counterBlock}>{col.counts.own}/{col.counts.total}</span>
                            )}
                        </div>
                        <DroppableColumnBody droppableId={col.id}> {/* column body */}
                            {isPending ? (
                                [...Array(3)].map((_, i) => (
                                    <KanbanCardSkeleton key={i} isCompact={statuses.isLeftPanelActive && statuses.isRightPanelActive}/>
                                ))
                            ) : (
                                col.tasks.map((task, index) => (
                                    <KanbanDraggableCard
                                        key={task.id}
                                        task={task}
                                        index={index}
                                        handleOnTaskClick={() => switchRightPanelView('editTask', task)}
                                    />
                                ))
                            )}
                        </DroppableColumnBody>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
};

KanbanBoard.displayName = "KanbanBoard";

export default memo(KanbanBoard);