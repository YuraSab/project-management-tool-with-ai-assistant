import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../services/taskService";

export const useTasks = ( projectId: string, userId: string, options?: { enabled?: boolean } ) => {
    return useQuery({ 
        queryKey: ["tasks", projectId, userId],
        queryFn: () => getTasks(projectId),
        enabled: !!projectId && !!userId && (options?.enabled ?? true)
    });
};