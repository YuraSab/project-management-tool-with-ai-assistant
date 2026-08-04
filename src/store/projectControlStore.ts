import { create } from "zustand";
import { SortOption,  Task,  TASK_CATEGORIES,  TASK_PRIORITIES,  TASK_STATUSES,  TASK_TYPES,  TaskCategory,  TaskPriority,  TaskStatus,  TaskType } from "../types/task";
import { Project, ProjectStatus } from "../types/project";
import { UserProfile } from "../types/user.ts";

export type TestAndProjectStatuses = TaskStatus | ProjectStatus;

const toggleItem = <T>(array: T[], value: T): T[] =>
    array.includes(value) ? array.filter((el) => el !== value) : [...array, value];

const toggleUser = (users: UserProfile[], user: UserProfile): UserProfile[] =>
    users.some((u) => u.uid === user.uid)
        ? users.filter((el) => el.uid !== user.uid)
        : [...users, user];

interface ProjectControlState {
    // ---- PROJECT ----
    selectedProject: Project | null;
    setSelectedProject: (project: Project | null) => void;
    // ---- TASK ----
    selectedTask: Task | null;
    setSelectedTask: (task: Task | null) => void;
    // ---- PANELS ----
    isRightPanelActive: boolean;
    setIsRightPanelActive: (value: boolean) => void;
    isLeftPanelActive: boolean;
    setIsLeftPanelActive: (value: boolean) => void;
    isEditTaskActive: boolean;
    setIsEditTaskActive: (value: boolean) => void;
    isAddTaskActive: boolean;
    setIsAddTaskActive: (value: boolean) => void;
    isProjectSettingsActive: boolean;
    setIsProjectSettingsActive: () => void;
    closePanels: () => void;
    // ---- FILTERS ----
    statusFilter: TestAndProjectStatuses[];
    setStatusFilter: (value: TestAndProjectStatuses) => void;
    priorityFilter: TaskPriority[];
    setPriorityFilter: (value: TaskPriority) => void;
    showNoPriorityTasks: boolean;
    setShowNoPriorityTasks: (value: boolean) => void;
    usersFilter: UserProfile[];
    setUserFilter: (value: UserProfile) => void;
    setUsersFilter: (values: UserProfile[]) => void;
    startDateFilter: string;
    setStartDateFilter: (value: string) => void;
    endDateFilter: string;
    setEndDateFilter: (value: string) => void;
    searchTermFilter: string;
    setSearchTermFilter: (value: string) => void;
    showUnassignedTasks: boolean;
    setShowUnassignedTasks: (value: boolean) => void;
    typesFilter: TaskType[];
    setTypesFilter: (value: TaskType) => void;
    categoriesFilter: TaskCategory[];
    setCategoriesFilter: (value: TaskCategory) => void;
    // ---- SORT ----
    sortValue: SortOption;
    setSortValue: (value: SortOption) => void;
    // ---- FILTERS AND SORTS ----
    clearFiltersAndSorts: () => void;
    // ---- UTILITY ----
    isInitialLoad: boolean;
    setIsInitialLoad: (value: boolean) => void;
    showTaskCounter: boolean;
    setShowTaskCounter: (value: boolean) => void;
    showAIChat: boolean;
    setShowAIChat: (value: boolean) => void;
}

export const useProjectControlStore = create<ProjectControlState>((set) => ({
    // ---- PROJECT ----
    selectedProject: null,
    setSelectedProject: (project) => set({ selectedProject: project }),
    // ---- TASK ----
    selectedTask: null,
    setSelectedTask: (task) => set({ selectedTask: task }),
    // ---- PANELS ----
    isRightPanelActive: false,
    setIsRightPanelActive: (value) => set({ isRightPanelActive: value }),
    isLeftPanelActive: false,
    setIsLeftPanelActive: (value) => set({ isLeftPanelActive: value }),
    isEditTaskActive: false,
    setIsEditTaskActive: (value) => set({ isEditTaskActive: value }),
    isAddTaskActive: false,
    setIsAddTaskActive: (value) => set({ isAddTaskActive: value }),
    isProjectSettingsActive: false,
    setIsProjectSettingsActive: () => set((state) => ({ isProjectSettingsActive: !state.isProjectSettingsActive })),
    closePanels: () => set({
        selectedTask: null,
        isLeftPanelActive: false,
        isRightPanelActive: false,
        isAddTaskActive: false,
        isEditTaskActive: false,
    }),
    // ---- FILTERS ----
    statusFilter: [...TASK_STATUSES],
    setStatusFilter: (value) => set((state) => ({ statusFilter: toggleItem(state.statusFilter, value) })),
    priorityFilter: [...TASK_PRIORITIES],
    setPriorityFilter: (value) => set((state) => ({ priorityFilter: toggleItem(state.priorityFilter, value) })),
    showNoPriorityTasks: true,
    setShowNoPriorityTasks: (value) => set({ showNoPriorityTasks: value }),
    usersFilter: [],
    setUserFilter: (user) => set((state) => ({ usersFilter: toggleUser(state.usersFilter, user) })),
    setUsersFilter: (users) => set({ usersFilter: users }),
    startDateFilter: "",
    setStartDateFilter: (value) => set({ startDateFilter: value }),
    endDateFilter: "",
    setEndDateFilter: (value) => set({ endDateFilter: value }),
    searchTermFilter: '',
    setSearchTermFilter: (value) => set({ searchTermFilter: value }),
    showUnassignedTasks: true,
    setShowUnassignedTasks: (value) => set({ showUnassignedTasks: value }),
    typesFilter: TASK_TYPES,
    setTypesFilter: (value) => set((state) => ({ typesFilter: toggleItem(state.typesFilter, value) })),
    categoriesFilter: TASK_CATEGORIES,
    setCategoriesFilter: (value) => set((state) => ({ categoriesFilter: toggleItem(state.categoriesFilter, value) })),
    // ---- SORT ----
    sortValue: "none",
    setSortValue: (value) => set({ sortValue: value }),
    // ---- FILTERS AND SORTS ----
    clearFiltersAndSorts: () => set({
        statusFilter: [...TASK_STATUSES],
        priorityFilter: [...TASK_PRIORITIES],
        startDateFilter: "",
        endDateFilter: "",
        sortValue: "none",
        searchTermFilter: '',
        showUnassignedTasks: true,
        showNoPriorityTasks: true,
        typesFilter: [...TASK_TYPES],
        categoriesFilter: [...TASK_CATEGORIES],
    }),
    // ---- UTILITY ----
    isInitialLoad: true,
    setIsInitialLoad: (value) => set({ isInitialLoad: value }),
    showTaskCounter: true,
    setShowTaskCounter: (value) => set({ showTaskCounter: value }),
    showAIChat: true,
    setShowAIChat: (value) => set({ showAIChat: value }),
}));