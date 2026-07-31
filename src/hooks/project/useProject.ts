import { useQuery } from "@tanstack/react-query";
import { getProject } from "../../services/projectService";

export const useProject = (projectId: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["project", projectId],
        queryFn: () => getProject(projectId),
        enabled: !!projectId && (options?.enabled ?? true)
    });
};