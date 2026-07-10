import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateProject} from "../../services/projectService.ts";
import {Project} from "../../types/project.ts";
import {toast} from "../../utils/toaster.ts";

type UpdateProjectVariables = Partial<Project> & { id: string };
export const useProjectUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateProjectVariables) => updateProject(data),
        onSuccess: async (_, variables) => {
            toast.success('Project updated');
            // This ensures that the mutation is considered complete only after the cache has been successfully cleared.
            await Promise.all([
                queryClient.invalidateQueries({queryKey: ['projects']}),
                queryClient.invalidateQueries({queryKey: ['project', variables.id]})
            ]);
        },
        onError: () => toast.error('Failed to update project!')
    });
};