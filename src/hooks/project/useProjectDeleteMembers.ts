import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMembersFromProjectTasks } from "../../services/projectService";
import { toast } from "../../utils/toaster";

export const useProjectDeleteMembers = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (args: { projectId: string, memberIds: string[] }) => deleteMembersFromProjectTasks(args),
        onSuccess: (_, { projectId }) => {
            toast.success('Member deleted from project!');
            return queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
        },
        onError: () => toast.error('Failed to delete member from project!')
    });
};