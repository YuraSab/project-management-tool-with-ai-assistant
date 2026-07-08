import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteMembersFromProjectTasks} from "../../services/projectService.ts";

export const useProjectDeleteMembers = () => {
    const queryClient = useQueryClient();
    return useMutation({
        // чи обов'язковор це має бути async/await
        mutationFn: (args: { projectId: string, memberIds: string[] }) =>
            deleteMembersFromProjectTasks(args),
        onSuccess: (_, { projectId }) => {
            // invalidate task of certain project
            return queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
        },
        onError: (error) => {
            console.error("Помилка при видаленні мембера:", error);
        }
    });
};