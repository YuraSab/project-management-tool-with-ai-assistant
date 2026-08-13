import { AIChatAction, ProjectSummary } from "../store/aiChatStore";

interface ParseResult {
    cleanText: string;
    actions: AIChatAction[];
    summary?: ProjectSummary;
}

export const parseAIActions = (responseText: string): ParseResult => {
    let cleanText = responseText;
    const actions: AIChatAction[] = [];
    let summary: ProjectSummary | undefined = undefined;
    // 1. SUMMARY: {...}
    const summaryMatch = responseText.match(/SUMMARY:\s*(\{[\s\S]*?\})(?=\s*(?:ACTION:|$))/i);
    if (summaryMatch) {
        try {
            summary = JSON.parse(summaryMatch[1]);
            // Видаляємо блок SUMMARY з тексту
            cleanText = cleanText.replace(summaryMatch[0], '');
        } catch (e) {
            console.error("Failed to parse AI Summary JSON:", e);
        }
    }

    // 2. ACTION: {...}
    const actionRegex = /ACTION:\s*(\{[\s\S]*?\})/g;
    let actionMatch;
    while ((actionMatch = actionRegex.exec(responseText)) !== null) {
        try {
            const parsedAction = JSON.parse(actionMatch[1]);
            if (parsedAction.type && parsedAction.payload) {
                actions.push(parsedAction);
            }
        } catch (e) {
            console.error("Failed to parse AI Action JSON:", e);
        }
    }
    cleanText = cleanText.replace(actionRegex, '');

    return {
        cleanText: cleanText.trim(),
        actions,
        summary,
    };
};