import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../../services/projectService";

export const useUserProjects = (userId: string , options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["userProjects", userId], 
        queryFn: () => getProjects(userId),
        enabled: !!userId && (options?.enabled ?? true)
    });
};