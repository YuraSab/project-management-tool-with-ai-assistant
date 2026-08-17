import { AIChatAction, ProjectSummary } from "../store/aiChatStore";

export interface ParsedAIResponse {
    cleanText: string;
    actions: AIChatAction[];
    summary?: ProjectSummary;
}

// 1. For update actions
export const parseAIActionsOnly = (rawText: string): { cleanText: string; actions: AIChatAction[] } => {
    let cleanText = rawText;
    const actions: AIChatAction[] = [];

    const actionRegex = /ACTION:\s*({[\s\S]*?})(?=\s*(?:ACTION:|$))/g;
    let match;

    while ((match = actionRegex.exec(rawText)) !== null) {
        try {
            const actionJson = JSON.parse(match[1]);
            if (actionJson && actionJson.type && actionJson.payload) {
                actions.push(actionJson);
            }
        } catch (e) {
            console.error("Failed to parse action JSON:", e);
        }
    }

    cleanText = cleanText
        .replace(/ACTION:\s*{[\s\S]*?}/g, '')
        .replace(/[}\s]+$/, '')
        .trim();

    return { cleanText, actions };
};

// 2. For analytic
export const parseAISummaryOnly = (rawText: string): { cleanText: string; summary?: ProjectSummary } => {
    let cleanText = rawText;
    let summary: ProjectSummary | undefined = undefined;

    const summaryRegex = /SUMMARY:\s*({[\s\S]*?})$/m;
    const match = rawText.match(summaryRegex);

    if (match && match[1]) {
        try {
            summary = JSON.parse(match[1]);
            cleanText = rawText
                .replace(match[0], '')
                .replace(/[}\s]+$/, '')
                .trim();
        } catch (e) {
            console.error("Failed to parse summary JSON:", e);
        }
    }
    return { cleanText, summary };
};

export const parseAIResponse = (rawResponse: string): ParsedAIResponse => {
    // analytic response
    if (rawResponse.includes("[TYPE: SUMMARY]") || rawResponse.includes("SUMMARY:")) {
        const cleanedRaw = rawResponse.replace("[TYPE: SUMMARY]", "").trim();
        const { cleanText, summary } = parseAISummaryOnly(cleanedRaw);
        return { cleanText, actions: [], summary };
    }
    // update response
    const cleanedRaw = rawResponse.replace("[TYPE: ACTIONS]", "").replace("[TYPE: TEXT]", "").trim();
    const { cleanText, actions } = parseAIActionsOnly(cleanedRaw);
    return { cleanText, actions, summary: undefined };
};