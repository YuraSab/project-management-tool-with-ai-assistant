import { Sender } from "../../types/aiChat";
import { useAIChatActions } from "../../hooks/aiChat/useAIChatActions";
import { useAIChatStore } from "../../store/aiChatStore";
import { useProfileStore } from "../../store/profileStore";
import CustomUserIcon from "../../ui/icons/CustomUserIcon";
import GeminiIcon from "../../ui/icons/GeminiIcon";
import ActionCard from "./ActionCard";
import styles from "./AIChat.module.css";

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
                            ? <CustomUserIcon title={profile?.displayName[0] ?? 'U'} size={32}/>
                            : <GeminiIcon size={28}/>}
                    </div>
                    <div className={styles.messageContent}>
                        <div className={styles.messageBubble}>{m.text}</div>
                        {m.pendingActions && m.pendingActions.length > 0 && (
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