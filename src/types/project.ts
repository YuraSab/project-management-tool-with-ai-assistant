import type { Timestamp } from "firebase/firestore";
import {TaskCategory} from "./task.ts";

export enum ProjectStatus {
    Planned = "planned",
    InProgress = "in_progress",
    Completed = "completed"
}

export const ProjectStatuses: ProjectStatus[] = [ProjectStatus.Planned, ProjectStatus.InProgress, ProjectStatus.Completed];

export interface Project {
    id: string,
    title: string,
    description: string,
    assignedMembers: string[],
    status: ProjectStatus,
    startDate: Timestamp | Date | null,
    endDate: Timestamp | Date | null,
}