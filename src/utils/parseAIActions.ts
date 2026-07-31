import { AIChatAction } from "../store/aiChatStore.ts";

export const parseAIActions = (text: string) => {
    const actionRegex = /ACTION:\s*(\{.*?})(?=\s*ACTION:|\s*$)/gs;
    const actions: AIChatAction[] = [];
    let match;

    while ((match = actionRegex.exec(text)) !== null) {
        try {
            actions.push(JSON.parse(match[1].trim()));
        } catch (e) {
            console.error("JSON Parse error:", e);
        }
    }
    const cleanText = text.replace(actionRegex, '').trim();
    return { actions, cleanText };
};