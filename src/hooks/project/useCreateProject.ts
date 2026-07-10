import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createProject} from "../../services/projectService.ts";
import {Project} from "../../types/project.ts";
import {toast} from "../../utils/toaster.ts";

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<Project, 'id'>) => createProject(data),
        onSuccess: () => {
            toast.success('Project created');
            return queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
        onError: () => toast.error('Failed to create project')
    });
};