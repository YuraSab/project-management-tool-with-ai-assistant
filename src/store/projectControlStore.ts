import { create } from "zustand";
import {SortOption, Task, TaskPriority, TaskStatus} from "../types/task";
import { Project, ProjectStatus } from "../types/project";
import {UserProfile} from "../types/user.ts";

export type TestAndProjectStatuses = TaskStatus | ProjectStatus;

interface ProjectControlState {
    selectedProject: Project | null;
    setSelectedProject: (project: Project | null) => void;
    selectedTask: Task | null;
    setSelectedTask: (task: Task) => void;
    clearSelectedTask: () => void;
    isAddMembersActive: boolean;
    setIsAddMembersActive: (value: boolean) => void;
    isRightPanelActive: boolean;
    setIsRightPanelActive: (value: boolean) => void;
    isLeftPanelActive: boolean;
    setIsLeftPanelActive: (value: boolean) => void;
    isEditTaskActive: boolean;
    setIsEditTaskActive: (value: boolean) => void;
    isAddTaskActive: boolean;
    setIsAddTaskActive: (value: boolean) => void;
    statusFilter: TestAndProjectStatuses[];
    setStatusFilter: (value: TestAndProjectStatuses) => void;
    usersFilter: UserProfile[];
    setUserFilter: (value: UserProfile) => void;
    setUsersFilter: (values: UserProfile[]) => void;
    startDateFilter: string;
    setStartDateFilter: (value: string) => void;
    endDateFilter: string;
    setEndDateFilter: (value: string) => void;
    priorityFilter: TaskPriority[];
    setPriorityFilter: (value: TaskPriority) => void;
    sortValue: SortOption;
    setSortValue: (value: SortOption) => void;
    clearFiltersAndSorts: () => void;
    isProjectSettingsActive: boolean;
    setIsProjectSettingsActive: () => void;
    searchTermFilter: string;
    setSearchTermFilter: (value: string) => void;
    isInitialLoad: boolean;
    setIsInitialLoad: (value: boolean) => void;
    showUnassignedTasks: boolean;
    setShowUnassignedTasks: (value: boolean) => void;
}

export const useProjectControlStore = create<ProjectControlState>((set, get) => ({
    selectedProject: null,
    setSelectedProject: (project) => set({ selectedProject: project }),
    selectedTask: null,
    setSelectedTask: (task) => set({ selectedTask: task }),
    clearSelectedTask: () => set({ selectedTask: null }),
    isAddMembersActive: false,
    setIsAddMembersActive: (value) => set({ isAddMembersActive: value }),
    isRightPanelActive: false,
    setIsRightPanelActive: (value) => set({ isRightPanelActive: value }),
    isLeftPanelActive: false,
    setIsLeftPanelActive: (value) => set({ isLeftPanelActive: value }),
    isEditTaskActive: false,
    setIsEditTaskActive: (value) => set({ isEditTaskActive: value }),
    isAddTaskActive: false,
    setIsAddTaskActive: (value) => set({ isAddTaskActive: value }),
    statusFilter: [],
    setStatusFilter: (value) => {
        const currentStatuses = get().statusFilter;
        // currentStatuses.includes(value)
        // ? set({ statusFilter: currentStatuses.filter((el) => el != value) })
        // : set({ statusFilter: [...currentStatuses, value] })
        set({
            statusFilter: currentStatuses.includes(value)
                ? currentStatuses.filter((el) => el != value)
                : [...currentStatuses, value]
        });
    },
    usersFilter: [],
    setUserFilter: (chosenUser) => {
        const currentUsers = get().usersFilter;
        // currentUsers.some((u) => u.id === chosenUser.uid)
        // ? set({ usersFilter: currentUsers.filter((el) => el.id != chosenUser.uid) })
        // : set({ usersFilter: [...currentUsers, chosenUser] });
        set({
            usersFilter: currentUsers.some((u) => u.uid === chosenUser.uid)
                ? currentUsers.filter((el) => el.uid != chosenUser.uid)
                : [...currentUsers, chosenUser]
        });
    },
    setUsersFilter: (users) => set({ usersFilter: users }),
    startDateFilter: "",
    setStartDateFilter: (value) => set({ startDateFilter: value }),
    endDateFilter: "",
    setEndDateFilter: (value) => set({ endDateFilter: value }),
    priorityFilter: [],
    setPriorityFilter: (value) => {
        const currentPriorities = get().priorityFilter;
        // currentPriorities.includes(value)
        // ? set({ priorityFilter: currentPriorities.filter((el) => el != value) })
        // : set({ priorityFilter: [...currentPriorities, value] })
        set({
            priorityFilter: currentPriorities.includes(value)
            ? currentPriorities.filter((el) => el != value)
            : [...currentPriorities, value]
        });
    },
    sortValue: "none",
    setSortValue: (value) => set({ sortValue: value }),
    clearFiltersAndSorts: () => {
        set({ 
            selectedTask: null,
            isAddMembersActive: false,
            isRightPanelActive: false,
            isLeftPanelActive: false,
            statusFilter: [] ,
            usersFilter: [],
            startDateFilter: "",
            endDateFilter: "",
            priorityFilter: [],
            sortValue: "none",
        });
    },
    isProjectSettingsActive: false,
    setIsProjectSettingsActive: () => set({ isProjectSettingsActive: !get().isProjectSettingsActive }),
    searchTermFilter: '',
    setSearchTermFilter: (value) => set({ searchTermFilter: value }),
    isInitialLoad: true,
    setIsInitialLoad: (value) => set({ isInitialLoad: value }),
    showUnassignedTasks: true,
    setShowUnassignedTasks: (value) => set({ showUnassignedTasks: value }),
}));