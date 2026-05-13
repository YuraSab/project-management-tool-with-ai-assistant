import {UserProfile} from "./user.ts";
import type {Timestamp} from "firebase/firestore";

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "none";
export interface TaskFilters {
    users: UserProfile[],
    start: string,
    end: string,
    priority: TaskPriority,
}
export type SortOption = "Start date dec" | "Start date inc" | "End date dec" | "End date inc" | "none";

export interface Task {
    id: string,
    projectId: string,
    title: string,
    description: string,
    assignedMembers: string[],
    status: TaskStatus,
    priority?: TaskPriority,
    startDate?: Timestamp | Date | null,
    endDate?: Timestamp | Date | null,
    createdAt?: Timestamp | Date | null,
}

export const TASK_STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];
export const TASK_PRIORITIES: TaskPriority[] = ["low", "medium", "high"];