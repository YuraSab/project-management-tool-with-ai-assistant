import { create } from "zustand";
import {
    SortOption,
    Task, TASK_CATEGORIES,
    TASK_PRIORITIES,
    TASK_STATUSES,
    TASK_TYPES,
    TaskCategory,
    TaskPriority,
    TaskStatus
} from "../types/task";
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
    isProjectSettingsActive: boolean;
    setIsProjectSettingsActive: () => void;
    searchTermFilter: string;
    setSearchTermFilter: (value: string) => void;
    isInitialLoad: boolean;
    setIsInitialLoad: (value: boolean) => void;
    showUnassignedTasks: boolean;
    setShowUnassignedTasks: (value: boolean) => void;
    showNoPriorityTasks: boolean;
    setShowNoPriorityTasks: (value: boolean) => void;
    showTaskCounter: boolean;
    setShowTaskCounter: (value: boolean) => void;
    typesFilter: TaskCategory[];
    setTypesFilter: (value: TaskCategory) => void;
    categoriesFilter: TaskCategory[];
    setCategoriesFilter: (value: TaskCategory) => void;
    showAIChat: boolean;
    setShowAIChat: (value: boolean) => void;
    clearFiltersAndSorts: () => void;
    closePanels: () => void;
}

export const useProjectControlStore = create<ProjectControlState>((set, get) => ({
    selectedProject: null,
    setSelectedProject: (project) => set({ selectedProject: project }),
    selectedTask: null,
    setSelectedTask: (task) => set({ selectedTask: task }),
    clearSelectedTask: () => set({ selectedTask: null }),
    isAddMembersActive: false,
    // todo - remove field
    setIsAddMembersActive: (value) => set({ isAddMembersActive: value }),
    isRightPanelActive: false,
    setIsRightPanelActive: (value) => set({ isRightPanelActive: value }),
    isLeftPanelActive: false,
    setIsLeftPanelActive: (value) => set({ isLeftPanelActive: value }),
    isEditTaskActive: false,
    setIsEditTaskActive: (value) => set({ isEditTaskActive: value }),
    isAddTaskActive: false,
    setIsAddTaskActive: (value) => set({ isAddTaskActive: value }),
    statusFilter: [...TASK_STATUSES],
    setStatusFilter: (value) => {
        const currentStatuses = get().statusFilter;
        set({
            statusFilter: currentStatuses.includes(value)
                ? currentStatuses.filter((el) => el != value)
                : [...currentStatuses, value]
        });
    },
    usersFilter: [],
    setUserFilter: (chosenUser) => {
        const currentUsers = get().usersFilter;
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
    priorityFilter: [...TASK_PRIORITIES],
    setPriorityFilter: (value) => {
        const currentPriorities = get().priorityFilter;
        set({
            priorityFilter: currentPriorities.includes(value)
            ? currentPriorities.filter((el) => el != value)
            : [...currentPriorities, value]
        });
    },
    sortValue: "none",
    setSortValue: (value) => set({ sortValue: value }),
    isProjectSettingsActive: false,
    setIsProjectSettingsActive: () => set({ isProjectSettingsActive: !get().isProjectSettingsActive }),
    searchTermFilter: '',
    setSearchTermFilter: (value) => set({ searchTermFilter: value }),
    isInitialLoad: true,
    setIsInitialLoad: (value) => set({ isInitialLoad: value }),
    showUnassignedTasks: true,
    setShowUnassignedTasks: (value) => set({ showUnassignedTasks: value }),
    showNoPriorityTasks: true,
    setShowNoPriorityTasks: (value) => set({ showNoPriorityTasks: value }),
    showTaskCounter: true,
    setShowTaskCounter: (value) => set({ showTaskCounter: value }),
    typesFilter: TASK_TYPES,
    setTypesFilter: (value) => {
        const cur = get().typesFilter;
        set({
            typesFilter: cur.includes(value)
            ? cur.filter((t) => t !== value)
            : [...cur, value]
        });
    },
    categoriesFilter: TASK_CATEGORIES,
    setCategoriesFilter: (value) => {
        const cur = get().categoriesFilter;
        set({
            categoriesFilter: cur.includes(value)
                ? cur.filter((t) => t !== value)
                : [...cur, value]
        });
    },
    showAIChat: true,
    setShowAIChat: (value) => set({ showAIChat: value }),
    clearFiltersAndSorts: () => set({
        statusFilter: [...TASK_STATUSES],
        priorityFilter: [...TASK_PRIORITIES],
        startDateFilter: "",
        endDateFilter: "",
        sortValue: "none",
        searchTermFilter: '',
        showUnassignedTasks: true,
        showNoPriorityTasks: true,
        typesFilter: TASK_TYPES,
        categoriesFilter: TASK_CATEGORIES,
    }),
    closePanels: () => set({
        selectedTask: null,
        isLeftPanelActive: false,
        isRightPanelActive: false,
        isAddTaskActive: false,
        isEditTaskActive: false,
        // isProjectSettingsActive: false,
        showAIChat: false,
    })
}));