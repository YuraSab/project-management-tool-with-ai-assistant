import React, {useEffect, useRef, useState} from 'react';
import styles from './AIChat.module.css';
import {useProfileStore} from "../../store/profileStore.ts";
import {Send, Trash2, X} from "lucide-react";
import GeminiIcon from "../../ui/icons/GeminiIcon.tsx";
import {useAIChatStore} from "../../store/aiChatStore.ts";
import {useProjectControlStore} from "../../store/projectControlStore.ts";
import {useProjectUsers} from "../../hooks/project/useProjectUsers.ts";
import {useTasks} from "../../hooks/task/useTasks.ts";
import Messages from "./Messages.tsx";
import {Sender} from "../../types/aiChat.ts";
import {useShallow} from "zustand/react/shallow";
import {parseAIActions} from "../../utils/parseAIActions.ts";
import {getGeminiResponse} from "../../services/aiService.ts";

    const AIChat = () => {
    const profile = useProfileStore((state) => state.profile);
    const selectedProject = useProjectControlStore((state) => state.selectedProject)
    const {messages, addMessage, clearChat, setIsAIChatOpened} = useAIChatStore(useShallow((state) => ({
        messages: state.messages, addMessage: state.addMessage, clearChat: state.clearChat, setIsAIChatOpened: state.setIsAIChatOpened
    })));

    // Думаю на момент переходу на сторінку проекту - вартувало б додавати до zustand всі таски і юзерів заесайнених до проекту, щоб брати дані з zustand а не з нових запитів
    const {data: projectTasks} = useTasks(selectedProject?.id || "");
    const {data: projectUsers} = useProjectUsers(selectedProject?.assignedMembers || []);

    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
            messagesEndRef.current?.scrollIntoView({behavior: "smooth"} as ScrollIntoViewOptions);
    }, [messages]);

    console.log('projectTasks', projectTasks)
    const handleSend = async () => {
        if (!inputValue.trim() || !selectedProject || isLoading) return;

        const userText = inputValue;
        setInputValue('');
        setIsLoading(true);
        addMessage({role: Sender.user, text: userText});

        try {
            const historyForGemini = messages
                .filter((m, index) => (
                    !(index === 0 && m.role === Sender.model)
                ))
                .map(m => ({
                    role: m.role,
                    parts: [{text: m.text}]
                }));
            const context = {
                project: selectedProject,
                tasks: projectTasks,
                members: projectUsers
            };

            // const aiRawResponse = `Ось зміни. ACTION: {"type": "UPDATE_TASK", "title": "Rofler", "payload": {"id": "7gy1WlyQWucUee6CMkoE", "description": "tiktok audience"}}`;
            const aiRawResponse = await getGeminiResponse(userText, context, historyForGemini);
            const { cleanText, actions } = parseAIActions(aiRawResponse);
            addMessage({
                role: Sender.model,
                text: cleanText || "Дії підготовлено:",
                pendingActions: actions
            });
        } catch (error) {
            console.error("AI Error:", error);
            addMessage({
                role: Sender.model,
                text: "Вибачте, сталася помилка при зверненні до сервісу."
            });
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className={styles.container} style={{backgroundColor: profile.theme === 'black' ? '#1e1e1e' : '#ffffff'}}>
            <div className={styles.header} style={{borderBottom: `1px solid ${profile.highlightColor}44`}}>
                <div className={styles.title}>
                    <GeminiIcon size={24}/>
                    <span>Gemini Assistant</span>
                </div>
                <div className={styles.actions}>
                    <Trash2 size={18} className={styles.icon} onClick={clearChat}/>
                    <X size={24} className={styles.icon} onClick={() => setIsAIChatOpened(false)}/>
                </div>
            </div>
            <div className={styles.scrollArea}>
                <Messages/>
                <div ref={messagesEndRef}/>
            </div>
            <div className={styles.inputArea}>
                <input
                    type="text"
                    placeholder={isLoading ? 'Зачекайте відповідь AI агента...' : 'Щось хочете змінити?'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className={styles.input}
                    style={{border: `1px solid ${profile.highlightColor}44`}}
                    disabled={isLoading}
                />
                <button
                    className={styles.sendBtn}
                    onClick={handleSend}
                    style={{
                        backgroundColor: profile.highlightColor,
                        opacity: (isLoading || !inputValue.trim()) ? 0.6 : 1
                    }}
                    disabled={isLoading || !inputValue.trim()}
                >
                    <Send size={20} color="#fff"/>
                </button>
            </div>
        </div>
    );
};

export default AIChat;