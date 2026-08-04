import { useEffect, useRef, useState } from 'react';
import { Send, Trash2, X } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Sender } from "../../types/aiChat";
import {HighlightColor, Theme} from "../../types/user";
import { parseAIActions } from "../../utils/parseAIActions";
import { switchRightPanelView } from "../../utils/panelManager";
import { useProjectUsers } from "../../hooks/project/useProjectUsers";
import { useTasks } from "../../hooks/task/useTasks";
import { getGeminiResponse } from "../../services/aiService";
import { useProjectControlStore } from "../../store/projectControlStore";
import { useProfileStore } from "../../store/profileStore";
import { useAIChatStore } from "../../store/aiChatStore";
import GeminiIcon from "../../ui/icons/GeminiIcon";
import Messages from "./Messages";
import styles from './AIChat.module.css';

const AIChat = () => {
    const profile = useProfileStore((state) => state.profile);
    const selectedProject = useProjectControlStore((state) => state.selectedProject)
    const { messages, addMessage, clearChat } = useAIChatStore(useShallow((state) => ({
        messages: state.messages, addMessage: state.addMessage, clearChat: state.clearChat
    })));

    const {data: projectTasks} = useTasks(selectedProject?.id || '', profile?.uid || '');
    const {data: projectUsers} = useProjectUsers(selectedProject?.assignedMembers || []);

    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement>(null!);

    useEffect(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
                tasks: projectTasks || [],
                members: projectUsers || []
            };

            const aiRawResponse = await getGeminiResponse(userText, context, historyForGemini);
            const { cleanText, actions } = parseAIActions(aiRawResponse);
            addMessage({
                role: Sender.model,
                text: cleanText || "Actions prepared by:",
                pendingActions: actions
            });
        } catch (error) {
            console.error("AI Error:", error);
            addMessage({
                role: Sender.model,
                text: "Sorry, an error occurred while accessing the service."
            });
        } finally {
            setIsLoading(false);
        }
    };

    const highlightColor = profile?.highlightColor ?? HighlightColor.Purple;

    return (
        <div
            className={styles.container}
            style={{
                 backgroundColor: profile?.theme === Theme.Black ? '#1e1e1e' : '#ffffff',
                 '--local-color': `var(--color-${highlightColor})`,
            }}
        >
            <div className={styles.header} style={{borderBottom: `1px solid ${profile?.highlightColor}44`}}>
                <div className={styles.title}>
                    <GeminiIcon size={24}/>
                    <span>Gemini Assistant</span>
                </div>
                <div className={styles.actions}>
                    <Trash2 size={18} className={styles.icon} onClick={clearChat}/>
                    <X size={24} className={styles.icon} onClick={() => switchRightPanelView('closeAll')}/>
                </div>
            </div>
            <div className={styles.scrollArea}>
                <Messages/>
                <div ref={messagesEndRef}/>
            </div>
            {isLoading && (
                <div className={styles.aiTypingBlock}>
                    <GeminiIcon size={28}/>
                    <div className={styles.aiTyping}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            )}
            <div className={styles.inputArea}>
                <input
                    type="text"
                    placeholder={isLoading ? 'Please wait for the AI agent`s  response...' : 'Do you want to change anything?'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className={styles.input}
                    style={{border: `1px solid ${profile?.highlightColor}44`}}
                    disabled={isLoading}
                />
                <button
                    className={styles.sendBtn}
                    onClick={handleSend}
                    style={{
                        backgroundColor: profile?.highlightColor,
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