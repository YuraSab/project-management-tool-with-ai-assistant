import { create } from "zustand";
import { Task } from "../types/task";
import { Sender } from "../types/aiChat";

const INITIAL_MESSAGE: AIChatMessage = {
    id: '1',
    role: Sender.model,
    text: 'Hi! I’m your AI assistant. How can I help with the project?',
    timestamp: Date.now(),
};

export enum AIChatActionType {
    CREATE_TASK = 'CREATE_TASK',
    UPDATE_TASK = 'UPDATE_TASK',
    DELETE_TASK = 'DELETE_TASK',
}

export interface AIChatAction {
    title: string,
    type: AIChatActionType,
    payload: Partial<Task>
}

export interface ProjectSummary {
    totalTasks: number;
    completedPercent: number;
    todoCount: number;
    inProgressCount: number;
    doneCount: number;
    attentionTasks: {
        id: string;
        title: string;
        reason: string;
        status: string;
        priority: string;
    }[];
    recommendations: string[];
}

export interface AIChatMessage {
    id: string,
    role: Sender,
    text: string,
    pendingActions?: AIChatAction[],
    summary?: ProjectSummary;
    timestamp: number,
}

interface AIChatState {
    messages: AIChatMessage[],
    addMessage: (message: Omit<AIChatMessage, 'id' | 'timestamp'>) => void,
    clearChat: () => void,
    updateMessageActions: (id: string, actions: AIChatAction[]) => void,
    isAIChatOpened: boolean,
    setIsAIChatOpened: (value: boolean) => void,
}

export const useAIChatStore = create<AIChatState>((set) => ({
    messages: [INITIAL_MESSAGE],
    addMessage: (msg) => set((state) => ({
        messages: [...state.messages, { ...msg, id: Date.now().toString(), timestamp: Date.now(), }]
    })),
    clearChat: () => set({ messages: [INITIAL_MESSAGE] }),
    updateMessageActions: (id, actions) => set((state) => ({
        messages: state.messages.map(m => m.id === id ? { ...m, pendingActions: actions } : m)
    })),
    isAIChatOpened: false,
    setIsAIChatOpened: (value) => set({ isAIChatOpened: value }),
}));