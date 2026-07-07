import React from 'react';
import {useAIChatStore} from "../../store/aiChatStore.ts";
import styles from "./AIChat.module.css";
import CustomUserIcon from "../../ui/icons/CustomUserIcon.tsx";
import GeminiIcon from "../../ui/icons/GeminiIcon.tsx";
import {useProfileStore} from "../../store/profileStore.ts";
import ActionCard from "./ActionCard.tsx";
import {Sender} from "../../types/aiChat.ts";
import {useAIChatActions} from "../../hooks/aiChat/useAIChatActions.ts";

const Messages = () => {
    const profile = useProfileStore((state) => state.profile);
    const messages = useAIChatStore((state) => state.messages);

    const { handleApply, handleCancel } = useAIChatActions();

    return (
        <div className={`${styles.messagesList} hideScrollbar`}>
            {messages.map((m, index) => (
                <div key={index} className={`${styles.messageWrapper} ${m.role === Sender.user ? styles.userWrapper : styles.aiWrapper}`}>
                    <div className={styles.avatar}>
                        {m.role === Sender.user
                            ? <CustomUserIcon title={profile.displayName?.[0]} size={32}/>
                            : <GeminiIcon size={28}/>}
                    </div>
                    <div className={styles.messageContent}>
                        <div className={styles.messageBubble}>{m.text}</div>
                        {m.pendingActions && m.pendingActions.length > 0 && (
                            // чи варто меморизувати ф-ї (useCallback)
                            <ActionCard
                                actions={m.pendingActions}
                                onApply={() => handleApply(m.id, m.pendingActions || [])}
                                onCancel={() => handleCancel(m.id)}
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Messages;