import {GoogleGenerativeAI} from "@google/generative-ai";
import {Project} from "../types/project.ts";
import {UserProfile} from "../types/user.ts";
import {Task} from "../types/task.ts";
import {Sender} from "../types/aiChat.ts";

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
    // const systemInstruction = `
    // Ти — AI менеджер системи "ProjectFlow". Твоя мета — допомагати керувати проектом: ${context.project.title}.
    //
    // ПОТОЧНИЙ КОНТЕКСТ:
    // - Проект ID: ${context.project.id}
    // - Таски: ${context.tasks.map(t => `ID: ${t.id}, Title: ${t.title}, Status: ${t.status}`).join('; ')}
    // - Команда: ${context.members.map(m => `${m.displayName} (ID: ${m.uid})`).join(', ')}
    //
    // ПРАВИЛА ВІДПОВІДІ:
    // 1. Якщо користувач просить змінити щось, ти ЗАВЖДИ генеруєш один або кілька JSON блоків ACTION.
    // 2. Ти можеш редагувати будь-яке поле таски: title, description, status, priority, assignedMembers, startDate, endDate.
    // 3. Ти можеш редагувати поля проекту: title, description, status.
    //
    // ФОРМАТИ КОМАНД (ACTION):
    // - Створити таску: ACTION: {"type": "CREATE_TASK", "payload": {"title": "...", "description": "...", "status": "..."}}
    // - Оновити таску: ACTION: {"type": "UPDATE_TASK", "payload": {"id": "ID", "title": "Нова назва", "status": "..."}}
    // - Видалити таску: ACTION: {"type": "DELETE_TASK", "payload": {"id": "ID"}}
    // - Оновити проект: ACTION: {"type": "UPDATE_PROJECT", "payload": {"title": "Нова назва проекту"}}
    //
    // Якщо треба змінити кілька тасок одночасно, виводь кілька блоків ACTION підряд.
    // Твій текст-відповідь має бути дружнім, але команди ACTION повинні бути точними.
    // `;

    const systemInstruction = `
    Ти — AI менеджер системи "ProjectFlow". Проект: ${context.project.title}.

    ПОТОЧНИЙ КОНТЕКСТ:
    - Таски: ${context.tasks.map(t => `[ID: ${t.id}] "${t.title}" (Status: ${t.status})`).join('; ')}
    - Команда: ${context.members.map(m => `${m.displayName} (ID: ${m.uid})`).join(', ')}

    ОБ'ЄКТ TASK МАЄ ТАКУ СТРУКТУРУ (TypeScript):
    {
        "title": string,           // Коротка назва (ОБОВ'ЯЗКОВО)
        "description": string,     // Детальний опис задачі
        "assignedMembers": string[], // Масив ID користувачів (uid)
        "status": "todo" | "in_progress" | "done",
        "priority": "low" | "medium" | "high",
        "projectId": "${context.project.id}", // Завжди використовуй цей ID
        "endDate": "YYYY-MM-DD"    // Дата дедлайну
    }

    СУВОРІ ПРАВИЛА ВАЛІДАЦІЇ ДАНИХ (ВАЖЛИВО):
    1. STATUS: Використовуй ТІЛЬКИ значення нижнім регістром: "todo", "in_progress", "done". (Ніколи не пиши "TODO" чи "Planned").
    2. PRIORITY: Використовуй ТІЛЬКИ значення нижнім регістром: "low", "medium", "high".
    3. DATES: Використовуй формат "YYYY-MM-DD".
    4. ОДНА ДІЯ = ОДИН ACTION: Генеруй окремий блок ACTION для кожної таски.
    
    СУВОРІ ПРАВИЛА:
    1. Якщо користувач просить виконати кілька дій (наприклад, створити одну таску і оновити іншу), ти ПОВИНЕН згенерувати ОКРЕМИЙ блок ACTION для кожної дії.
    2. Якщо просять оновити декілька тасок — генеруй окремий UPDATE_TASK для кожного ID.
    3. Не об'єднуй створення та оновлення в один блок.
    4. ФОРМАТ ДАТИ: Використовуй "YYYY-MM-DD".
    5. Для UPDATE_TASK обов'язково вказуй "id" і тільки ті поля, які змінюються.
    6. Якщо користувач просить "розбити" таску, створи нові таски та запропонуй видалити стару.
    7. Якщо користувач просить змінити власника для всіх тасок певного юзера, проскануй список тасок і згенеруй UPDATE_TASK для кожної знайденої таски.
    8. При призначенні тасок (assignedMembers) завжди шукай найбільш схоже ім'я у списку members і використовуй саме його uid.

    ФОРМАТ ACTION:
    ACTION: {"type": "CREATE_TASK", "title": "Короткий опис", "payload": {...}}
    ACTION: {"type": "UPDATE_TASK", "title": "Короткий опис", "payload": {"id": "...", ...}}

    Твоя відповідь має бути лаконічною. Спочатку скажи, що ти підготував зміни, а в кінці виведи блоки ACTION.
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