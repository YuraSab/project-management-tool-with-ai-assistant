// src/services/aiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Project } from "../types/project";
import { UserProfile } from "../types/user";
import { Task, TASK_CATEGORIES, TASK_TYPES } from "../types/task";
import { Sender } from "../types/aiChat";

const getAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface Message {
    role: Sender;
    parts: { text: string }[];
}

export const getGeminiResponse = async (
    userMessage: string,
    context: {
        project: Project;
        tasks: Task[];
        members: UserProfile[];
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
                `[ID: ${t.id}] "${t.title}" | Status: ${t.status} | Priority: ${t.priority || 'none'} | Type: ${t.type || 'none'} | Category: ${t.category || 'none'} | Assigned: [${t.assignedMembers?.join(', ') || ''}]`
            ).join(';\n  ')
            : 'Немає створених тасок'
    }
        - Учасники команди: ${context.members.map(m => `${m.displayName} (ID: ${m.uid})`).join(', ')}
    
        СТРУКТУРА ОБ'ЄКТА TASK У ВСЕРЕДИНІ PAYLOAD:
        {
            "title": string,             // Назва таски (ОБОВ'ЯЗКОВО! Наприклад: "Розробка авторизації")
            "description": string,       // Детальний опис
            "assignedMembers": string[], // Масив ID користувачів (uid). ВИКОРИСТОВУЙ ТІЛЬКИ ЦЮ НАЗВУ ПОЛЯ!
            "status": "todo" | "in_progress" | "done",
            "priority": "low" | "medium" | "high" | "none",
            "type": "${availableTypes}" | "none",
            "category": "${availableCategories}" | "none",
            "startDate": "YYYY-MM-DD",   // Опціонально
            "endDate": "YYYY-MM-DD"      // Опціонально
        }
    
        СУВОРІ ПРАВИЛА ВАЛІДАЦІЇ:
        1. TASK TITLE: Поле "title" УСЕРЕДИНІ payload є ОБОВ'ЯЗКОВИМ для кожного CREATE_TASK та UPDATE_TASK!
        2. ASSIGNED MEMBERS: Назва поля має бути ТІЛЬКИ "assignedMembers" (масив uid рядків).
        3. STATUS: Тільки значення нижнім регістром: "todo", "in_progress", "done".
        4. PRIORITY: Тільки значення нижнім регістром: "low", "medium", "high", "none".
        5. TYPE: Тільки дозволені значення: ${availableTypes}, "none".
        6. CATEGORY: Тільки дозволені значення: ${availableCategories}, "none".
        7. DATES: Формат "YYYY-MM-DD".
    
        ВКАЗІВКА ЩОДО ФОРМАТУ ВІДПОВІДІ:
    
        СЦЕНАРІЙ 1: РОБОТА З ТАСКАМИ (СТВОРЕННЯ / ОНОВЛЕННЯ / ВИДАЛЕННЯ)
        Якщо користувач просить розбити задачу, створити або змінити таски:
        1. На початку напиши дружню відповідь. Текстова частина НЕ повинна містити зайвих фігурних дужок у кінці.
        2. В кінці відповіді додай кожну дію в окремому рядку. ЗВЕРНИ УВАГУ: title має бути і в ACTION, і ВСЕРЕДИНІ payload!
           ACTION: {"type": "CREATE_TASK", "title": "Створення таски: Розробка БД", "payload": {"title": "Розробка БД", "description": "Опис...", "status": "todo", "assignedMembers": []}}
           ACTION: {"type": "UPDATE_TASK", "title": "Оновлення таски: Fix Auth", "payload": {"id": "TASK_ID", "title": "Fix Auth", "status": "in_progress"}}
           ACTION: {"type": "DELETE_TASK", "title": "Видалення таски", "payload": {"id": "TASK_ID"}}
    
        СЦЕНАРІЙ 2: АНАЛІТИКА ТА ЗВІТИ
        Якщо користувач просить аналітику, статус чи звіт по проекту:
        1. На початку відповіді напиши маркер: [TYPE: SUMMARY]
        2. Напиши короткий пояснювальний текст.
        3. В самому кінці виведи об'єкт аналітики в одному рядку:
           SUMMARY: {"totalTasks": 10, "completedPercent": 50, "todoCount": 3, "inProgressCount": 2, "doneCount": 5, "attentionTasks": [{"id": "TASK_ID", "title": "Назва таски", "reason": "Причина уваги"}], "recommendations": ["Порада 1"]}

        ПРАВИЛА ДЛЯ attentionTasks:
        - Поле "attentionTasks" має містити таски з високим пріоритетом або прострочені.
        - Кожен елемент ОБОВ'ЯЗКОВО повинен бути об'єктом з полями "id", "title", "reason".
        - Якщо проблемних тасок немає — повертай порожній масив: "attentionTasks": [].
    
        СЦЕНАРІЙ 3: ЗВИЧАЙНА РОЗМОВА
        Просто відповідай текстом.
    `;

    const model = getAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
        systemInstruction: systemInstruction,
    });

    const chat = model.startChat({
        history: history,
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
};