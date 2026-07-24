import {AIChatAction, AIChatActionType, useAIChatStore} from "../../store/aiChatStore.ts";
import {CreateTaskPayload, UpdateTaskPayload} from "../../services/taskService.ts";
import {useProjectControlStore} from "../../store/projectControlStore.ts";
import {useCreateTask} from "../task/useCreateTask.ts";
import {useUpdateTask} from "../task/useUpdateTask.ts";
import {useDeleteTask} from "../task/useDeleteTask.ts";
import {Sender} from "../../types/aiChat.ts";
import {useShallow} from "zustand/react/shallow";
import {useProfileStore} from "../../store/profileStore.ts";

export const useAIChatActions = () => {
    const ownId = useProfileStore((state) => state.profile.uid)
    const selectedProject = useProjectControlStore((state) => state.selectedProject);
    const {addMessage, updateMessageActions} = useAIChatStore(useShallow((state) => ({
        addMessage: state.addMessage, updateMessageActions: state.updateMessageActions
    })));

    const {mutate: createTask} = useCreateTask();
    const {mutate: updateTask} = useUpdateTask(selectedProject?.id ?? '', ownId);
    const {mutate: deleteTask} = useDeleteTask();

    const handleApply = async (messageId: string, actions: AIChatAction[]) => {
        try {
            for (const action of actions) {
                switch (action.type) {
                    case AIChatActionType.CREATE_TASK:
                        await createTask({
                            ...action.payload,
                            projectId: selectedProject?.id,
                            createdAt: new Date(),
                        } as CreateTaskPayload);
                        break;
                    case AIChatActionType.UPDATE_TASK:
                        await updateTask(action.payload as UpdateTaskPayload);
                        break;
                    case AIChatActionType.DELETE_TASK:
                        await deleteTask(action.payload.id);
                        break;
                }
            }
            updateMessageActions(messageId, []);
            addMessage({
                role: Sender.model,
                text: "✅ Зміни успішно застосовані до проекту!"
            });
        } catch (error) {
            console.error("Помилка при застосуванні дій:", error);
            addMessage({
                role: Sender.model,
                text: "❌ Сталася помилка при застосуванні змін."
            });
        }
    };

    const handleCancel = (messageId: string) => {
        updateMessageActions(messageId, []);
        addMessage({
            role: Sender.model,
            text: "🗑️ Запропоновані зміни скасовано."
        });
    };

    return { handleApply, handleCancel };
};