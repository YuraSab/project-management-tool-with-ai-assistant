import { GoogleGenerativeAI } from "@google/generative-ai";
import { Project } from "../types/project";
import { UserProfile } from "../types/user";
import { Task, TASK_CATEGORIES, TASK_TYPES } from "../types/task";
import { Sender } from "../types/aiChat";

const getAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface Message {
    role: Sender,
    parts: { text: string }[],
}

export const getGeminiResponse = async (
    userMessage: string,
    context: {
        project: Project,
        tasks: Task[],
        members: UserProfile[],
    },
    history: Message[]
) => {
    const availableTypes = TASK_TYPES.filter(t => t !== 'none').join(', ');
    const availableCategories = TASK_CATEGORIES.filter(c => c !== 'none').join(', ');
    const systemInstruction = `
        Ти — AI менеджер системи "ProjectFlow". Проект: "${context.project.title}".
        Опис проекту: "${context.project.description || 'Немає опису'}".
    
        ПОТОЧНИЙ КОНТЕКСТ:
            - Таски проекту: ${
                context.tasks.length > 0
                    ? context.tasks.map(t =>
                        `[ID: ${t.id}] "${t.title}" | Status: ${t.status} | Priority: ${t.priority || 'none'} | Type: ${t.type || 'none'} | Category: ${t.category || 'none'} | Assigned: [${t.assignedMembers.join(', ')}]`
                    ).join(';\n  ')
                    : 'Немає створених тасок'
            }
        - Учасники команди: ${context.members.map(m => `${m.displayName} (ID: ${m.uid})`).join(', ')}
        
        ОБ'ЄКТ TASK МАЄ ТАКУ СТРУКТУРУ (TypeScript):
        {
            "title": string,             // Коротка назва (ОБОВ'ЯЗКОВО)
            "description": string,       // Детальний опис задачі
            "assignedMembers": string[], // Масив ID користувачів (uid)
            "status": "todo" | "in_progress" | "done",
            "priority": "low" | "medium" | "high" | "none",
            "type": "${availableTypes}" | "none",
            "category": "${availableCategories}" | "none",
            "projectId": "${context.project.id}", // Завжди використовуй цей ID
            "startDate": "YYYY-MM-DD",   // Дата початку
            "endDate": "YYYY-MM-DD"      // Дата дедлайну
        }
        
        СУВОРІ ПРАВИЛА ВАЛІДАЦІЇ ДАНИХ (ВАЖЛИВО):
        1. STATUS: Використовуй ТІЛЬКИ значення нижнім регістром: "todo", "in_progress", "done".
        2. PRIORITY: Використовуй ТІЛЬКИ значення нижнім регістром: "low", "medium", "high", "none".
        3. TYPE: Використовуй ТІЛЬКИ одне з дозволених значень: ${availableTypes}, "none".
        4. CATEGORY: Використовуй ТІЛЬКИ одне з дозволених значень: ${availableCategories}, "none".
        5. DATES: Використовуй формат "YYYY-MM-DD" (наприклад, "2026-08-01").
        6. ASSIGNED MEMBERS: Використовуй тільки реальні ID (uid) зі списку учасників команди.
    
        СУВОРІ ПРАВИЛА ГЕНЕРАЦІЇ ACTION:
        1. Якщо користувач просить виконати кілька дій (наприклад, створити одну таску і оновити іншу), генеруй ОКРЕМИЙ блок ACTION для кожної дії.
        2. Для UPDATE_TASK обов'язково вказуй "id" і тільки ті поля, які реально змінюються.
        3. Якщо користувач просить "розбити" таску, створи нові таски через CREATE_TASK і запропонуй або згенеруй DELETE_TASK/зміну статусу для старої.
        4. При призначенні тасок (assignedMembers) завжди шукай найбільш схоже ім'я у списку members і використовуй саме його uid.
    
        ФОРМАТ ACTION:
        ACTION: {"type": "CREATE_TASK", "title": "Короткий опис дії", "payload": {...}}
        ACTION: {"type": "UPDATE_TASK", "title": "Короткий опис дії", "payload": {"id": "...", ...}}
    
        Твоя відповідь має бути дружньою та лаконічною. Спочатку поясни, що саме ти підготував, а в самому кінці виведи блоки ACTION.
    `;

    const model = getAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
        systemInstruction: systemInstruction
    });

    const chat = model.startChat({
        history: history,
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
};