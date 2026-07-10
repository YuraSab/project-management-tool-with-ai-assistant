import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteProject} from "../../services/projectService.ts";
import {toast} from "../../utils/toaster.ts";

export const useProjectDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>  deleteProject(id),
        onSuccess: () => {
            toast.success('Project deleted');
            return queryClient.invalidateQueries({ queryKey: ['projects'] })
        },
        onError: () => toast.error('Failed to delete project')
    });
};