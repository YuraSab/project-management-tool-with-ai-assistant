import { Task } from "../types/task";
import { useProjectControlStore } from "../store/projectControlStore";
import { useAIChatStore } from "../store/aiChatStore";

export type PanelView = "addTask" | "editTask" | "aiChat" | "closeAll";

export const switchRightPanelView = (view: PanelView, task?: Task | null) => {
    const projectStore = useProjectControlStore.getState?.();
    const chatStore = useAIChatStore.getState?.();

    switch (view) {
        case "addTask":
            projectStore.setIsRightPanelActive(true);
            projectStore.setIsAddTaskActive(true);
            projectStore.setIsEditTaskActive(false);
            projectStore.setSelectedTask(null);
            chatStore.setIsAIChatOpened(false);
            break;
        case "editTask":
            projectStore.setIsRightPanelActive(true);
            projectStore.setIsAddTaskActive(false);
            projectStore.setIsEditTaskActive(true);
            projectStore.setSelectedTask(task ?? null);
            chatStore.setIsAIChatOpened(false);
            break;
        case "aiChat":
            projectStore.setIsRightPanelActive(true);
            projectStore.setIsAddTaskActive(false);
            projectStore.setIsEditTaskActive(false);
            projectStore.setSelectedTask(null);
            chatStore.setIsAIChatOpened(true);
            break;
        case "closeAll":
            projectStore.setIsRightPanelActive(false);
            projectStore.setIsAddTaskActive(false);
            projectStore.setIsEditTaskActive(false);
            projectStore.setSelectedTask(null);
            chatStore.setIsAIChatOpened(false);
            break;
    }
};