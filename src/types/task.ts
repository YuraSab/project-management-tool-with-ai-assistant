import {UserProfile} from "./user.ts";
import type {Timestamp} from "firebase/firestore";

export type TaskType = 'Feature' | 'Improvement' | 'Fix' | 'QuickFix' | 'UIFix' | 'Refactoring' | 'TechDebt' | 'Research' | 'Analytics' | 'Documentation' | 'Management' | 'Utils' | 'none';
export type TaskCategory = 'Frontend' | 'Backend' | 'Fullstack' | 'Mobile' | 'DevOps' | 'UIUX' | 'Product' | 'QA_Manual' | 'QA_Automation' | 'PM' | 'HR' | 'Marketing' | 'Support' | 'none';

// Selectors arrays
export const TASK_TYPES: TaskType[] = ['none', 'Feature', 'Improvement', 'Fix', 'QuickFix', 'UIFix', 'Refactoring', 'TechDebt', 'Research', 'Analytics', 'Documentation', 'Management', 'Utils'];
export const TASK_CATEGORIES: TaskCategory[] = ['none', 'Frontend', 'Backend', 'Fullstack', 'Mobile', 'DevOps', 'UIUX', 'Product', 'QA_Manual', 'QA_Automation', 'PM', 'HR', 'Marketing', 'Support'];

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "none";
export interface TaskFilters {
    users: UserProfile[],
    start: string,
    end: string,
    createdAt: string,
    updatedAt: string,
    priority: TaskPriority,
    noStatus: boolean,
    noPriority: boolean,
    searchTerm: string,
    isInitialLoad: boolean,
    unassignedTasks: boolean,
    types: TaskType[],
    categories: TaskCategory[],
}
export type SortOption = "Start date dec" | "Start date inc" | "End date dec" | "End date inc" | "Create date dec"| "Create date inc" | "Update date dec"| "Update date inc" | "none";

export interface Task {
    id: string,
    projectId: string,
    creatorId: string,
    title: string,
    description: string,
    assignedMembers: string[],
    status: TaskStatus,
    priority?: TaskPriority,
    startDate?: Timestamp | Date | null,
    endDate?: Timestamp | Date | null,
    createdAt?: Timestamp | Date | null,
    updatedAt?: Timestamp | Date | null,
    type?: TaskType,
    category?: TaskCategory,
}

export const TASK_STATUSES: TaskStatus[] = ["todo", "in_progress", "done"] as const;
export const TASK_PRIORITIES: TaskPriority[] = ["low", "medium", "high"] as const;