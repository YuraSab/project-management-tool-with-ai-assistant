import { getTime } from "./dateFormat";
import { SortOption, Task, TaskFilters, TaskStatus } from "../types/task";

export const getFilteredTasks = (tasks: Task[], status: TaskStatus, filters: TaskFilters): Task[] => {
    if (!tasks || tasks.length === 0) return [];

    const startTime = getTime(filters.start);
    const endTime = getTime(filters.end);
    const search = filters.searchTerm?.trim().toLowerCase();
    return tasks?.filter(task =>
        task.status === status &&
        (!filters.priority || (
            (task.priority && filters.priority.includes(task.priority))) ||
            (task.priority === 'none' && filters.noPriority)
        ) &&
        (filters.isInitialLoad || (
            ((task.assignedMembers?.length ?? 0) === 0 && filters.unassignedTasks) ||
            (filters.users?.some(u => task.assignedMembers?.includes(u.uid)))
        )) &&
        (!filters.types || (task.type && filters.types.includes(task.type))) &&
        (!filters.categories || (task.category && filters.categories.includes(task.category))) &&
        (!task.startDate || startTime === 0 || getTime(task.startDate) >= startTime) &&
        (!task.endDate || endTime === 0 || getTime(task.endDate) <= endTime) &&
        (!search || search.length === 0 || (
            task.title?.toLowerCase().includes(search) ||
            task.description?.toLowerCase().includes(search)
        ))
    ) || [];
};

type SortComparator = (a: Task, b: Task) => number;

const SORT_STRATEGIES: Record<Exclude<SortOption, 'none'>, SortComparator> = {
    "Start date dec": (a, b) => getTime(b.startDate) - getTime(a.startDate),
    "Start date inc": (a, b) => getTime(a.startDate) - getTime(b.startDate),
    "End date dec": (a, b) => getTime(b.endDate) - getTime(a.endDate),
    "End date inc": (a, b) => getTime(a.endDate) - getTime(b.endDate),
    "Create date dec": (a, b) => getTime(b.createdAt) - getTime(a.createdAt),
    "Create date inc": (a, b) => getTime(a.createdAt) - getTime(b.createdAt),
    "Update date dec": (a, b) => getTime(b.updatedAt) - getTime(a.updatedAt),
    "Update date inc": (a, b) => getTime(a.updatedAt) - getTime(b.updatedAt),
};

export const getSortedTasks = (tasks: Task[], sortValue: SortOption): Task[] => {
    if (!tasks || tasks.length === 0) return [];
    if (sortValue === "none") return tasks;
    const comparator = SORT_STRATEGIES[sortValue];
    if (!comparator) return tasks;
    return [...tasks].sort(comparator);
};