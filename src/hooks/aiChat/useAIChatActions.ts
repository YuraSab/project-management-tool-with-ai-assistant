import { useShallow } from "zustand/react/shallow";
import { CreateTaskPayload, UpdateTaskPayload } from "../../services/taskService";
import { useCreateTask } from "../task/useCreateTask";
import { useUpdateTask } from "../task/useUpdateTask";
import { useDeleteTask } from "../task/useDeleteTask";
import { AIChatAction, AIChatActionType, useAIChatStore } from "../../store/aiChatStore";
import { useProfileStore } from "../../store/profileStore";
import { useProjectControlStore } from "../../store/projectControlStore";
import { Sender } from "../../types/aiChat";
import {toast} from "../../utils/toaster";

export const useAIChatActions = () => {
    const ownId = useProfileStore((state) => state.profile?.uid || '')
    const selectedProject = useProjectControlStore((state) => state.selectedProject);
    const {addMessage, updateMessageActions} = useAIChatStore(useShallow((state) => ({
        addMessage: state.addMessage, updateMessageActions: state.updateMessageActions
    })));

    const {mutateAsync: createTask} = useCreateTask();
    const {mutateAsync: updateTask} = useUpdateTask(selectedProject?.id ?? '', ownId);
    const {mutateAsync: deleteTask} = useDeleteTask();

    const handleApply = async (messageId: string, actions: AIChatAction[]) => {
        try {
            if (!selectedProject?.id)
                return toast.error('Project not selected!');

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
                        await deleteTask(action.payload.id!);
                        break;
                }
            }
            updateMessageActions(messageId, []);
            addMessage({
                role: Sender.model,
                text: "✅ The changes have been successfully applied to the project!"
            });
        } catch (error) {
            console.error("Error applying actions: ", error);
            addMessage({
                role: Sender.model,
                text: "❌ An error occurred while applying the changes."
            });
        }
    };

    const handleCancel = (messageId: string) => {
        updateMessageActions(messageId, []);
        addMessage({
            role: Sender.model,
            text: "🗑️ The proposed changes have been cancelled."
        });
    };

    return { handleApply, handleCancel };
};