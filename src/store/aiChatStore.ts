import {create} from "zustand";
import {Task} from "../types/task.ts";
import {Sender} from "../types/aiChat.ts";

const INITIAL_MESSAGE: AIChatMessage = {
    id: '1',
    role: Sender.model,
    text: 'Привіт! Я твій AI-помічник. Чим можу допомогти з проектом?',
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

export interface AIChatMessage {
    id: string,
    role: Sender,
    text: string,
    pendingActions?: AIChatAction[],
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