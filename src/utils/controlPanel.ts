import {SortOption, Task, TaskFilters, TaskStatus} from "../types/task.ts";
import {getTime} from "./dateFormat.ts";

export const getFilteredTasks = (tasks: Task[], status: TaskStatus, filters: TaskFilters): Task[] => {
    if (!tasks || tasks.length === 0) return [];
    return tasks?.filter(task =>
        task.status === status &&
        (!filters.priority || (task.priority && filters.priority.includes(task.priority)) || (task.priority === 'none' && filters.noPriority)) &&
        (filters.isInitialLoad || (
            (task.assignedMembers.length === 0 && filters.unassignedTasks) ||
            (filters.users.some(u => task.assignedMembers?.includes(u.uid)))
        )) &&
        (!task.startDate || getTime(filters.start) === 0 || getTime(task.startDate) >= getTime(filters.start)) &&
        (!task.endDate || getTime(filters.end) === 0 || getTime(task.endDate) <= getTime(filters.end)) &&
        (!filters.searchTerm || filters.searchTerm.trim().length === 0 || (task.title.includes(filters.searchTerm) || task.description.includes(filters.searchTerm)))
    ) || [];
};

export const getSortedTasks = (tasks: Task[], sortValue: SortOption): Task[] => {
    if (!tasks || tasks.length === 0) return [];
    const sortCollection: Record<string, () => Task[]> = {
        ["Start date dec"]: () => [...tasks].sort( (a, b) => getTime(b.startDate) - getTime(a.startDate) ),
        ["Start date inc"]: () => [...tasks].sort( (a, b) => getTime(a.startDate) - getTime(b.startDate) ),
        ["End date dec"]: () => [...tasks].sort( (a, b) => getTime(b.endDate) - getTime(a.endDate) ),
        ["End date inc"]: () => [...tasks].sort( (a, b) => getTime(a.endDate) - getTime(b.endDate) ),
        ["Create date dec"]: () => [...tasks].sort((a, b) => getTime(b.createdAt) - getTime(a.createdAt)),
        ["Create date inc"]: () => [...tasks].sort((a, b) => getTime(a.createdAt) - getTime(b.createdAt)),
    };
    return sortCollection[sortValue] ? sortCollection[sortValue]() : tasks;
};