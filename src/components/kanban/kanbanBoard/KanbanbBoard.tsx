import {DragDropContext, DropResult} from "@hello-pangea/dnd";
import styles from "./KanbanBoard.module.css";
import {DroppableColumnBody} from "../drag/DroppableColumnBody";
import KanbanDraggableCard from "../drag/KanbanDraggableCard";
import {Task, TaskFilters, TaskStatus} from "../../../types/task";
import React, {memo, useCallback, useMemo} from "react";
import KanbanCardSkeleton from "../kanbanCard/KanbanCardSkeleton.tsx";
import {useTasks} from "../../../hooks/task/useTasks.ts";
import {useUpdateTask} from "../../../hooks/task/useUpdateTask.ts";
import {useProjectControlStore} from "../../../store/projectControlStore.ts";
import {useShallow} from "zustand/react/shallow";
import {getFilteredTasks, getSortedTasks} from "../../../utils/controlPanel.ts";
interface KanbanBoardProps { projectId: string }
const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
    const { data: projectTasks, isPending } = useTasks(projectId || "");
    const taskUpdateMutation = useUpdateTask();
    console.log('projectTasks', projectTasks)
    const filters = useProjectControlStore(useShallow(state => ({
        status: state.statusFilter,
        users: state.usersFilter,
        start: state.startDateFilter,
        end: state.endDateFilter,
        priority: state.priorityFilter,
        sortValue: state.sortValue,
    })));
    const status = useProjectControlStore(useShallow(state => ({
        isLeftPanelActive: state.isLeftPanelActive,
        isRightPanelActive: state.isRightPanelActive,
    })));
    const actions = useProjectControlStore(useShallow(state => ({
        setSelectedTask: state.setSelectedTask,
        setIsRightPanelActive: state.setIsRightPanelActive,
        setIsAddTaskActive: state.setIsAddTaskActive,
        setIsEditTaskActive: state.setIsEditTaskActive,
    })));

    const handleOnTaskClick = useCallback((task: Task): void => {
        actions.setIsAddTaskActive(false);
        actions.setIsEditTaskActive(false);
        actions.setSelectedTask(task);
        actions.setIsRightPanelActive(true);
    }, [actions]);

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
            priority: filters.priority
        } as TaskFilters;

        const processTasks = (status: TaskStatus) => {
            const filtered = getFilteredTasks(projectTasks, status, currentFilters);
            return getSortedTasks(filtered, filters.sortValue);
        };

        return {
            todo: processTasks('todo'),
            in_progress: processTasks('in_progress'),
            done: processTasks('done')
        }
    }, [projectTasks, filters.users, filters.start, filters.end, filters.priority, filters.sortValue]);


    const shouldShowColumn = useCallback((status: TaskStatus): boolean => {
        return filters.status.length === 0 || filters.status.includes(status);
    }, [filters.status]);

    const columns = useMemo(() => [
        { id: "todo" as TaskStatus, title: "Todo", tasks: filteredTasks.todo, headerClass: styles.todoHeader },
        { id: "in_progress" as TaskStatus, title: "In Progress", tasks: filteredTasks.in_progress, headerClass: styles.inProgressHeader },
        { id: "done" as TaskStatus, title: "Done", tasks: filteredTasks.done, headerClass: styles.doneHeader },
    ], [filteredTasks]);

    const gridStyle = useMemo(() => {
        const count = columns.filter(col => shouldShowColumn(col.id)).length;
        return {display: 'grid', gridTemplateColumns: `repeat(${count}, 1fr)`};
    }, [columns, shouldShowColumn]);

    return <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.kanbanBoard} style={gridStyle}>
            {/* Column headers */}
            {columns.map(col => shouldShowColumn(col.id) && (
                <div key={`${col.id}-header`} className={`${styles.columnHeader} ${col.headerClass}`}>
                    {col.title}
                </div>
            ))}
            {/* Column bodies */}
            {columns.map(col => shouldShowColumn(col.id) && (
                <DroppableColumnBody key={`${col.id}-body`} droppableId={col.id}>
                    <div className={styles.statusColumn}>
                        {
                            isPending
                                ? ([...Array(3)].map((_, i) => (
                                    <KanbanCardSkeleton
                                        key={i}
                                        isCompact={status.isLeftPanelActive && status.isRightPanelActive}
                                    />
                                )))
                                : (col.tasks.map((task, index) => (
                                        <KanbanDraggableCard
                                            key={task.id}
                                            task={task}
                                            index={index}
                                            handleOnTaskClick={handleOnTaskClick}
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