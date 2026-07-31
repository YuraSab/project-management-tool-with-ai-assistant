import { useQuery } from "@tanstack/react-query";
import { getUsersByIds } from "../../services/userService";

export const useProjectUsers = (usersIds: string[]) => {
    return useQuery({
        queryKey: ['users', usersIds],
        queryFn: () => getUsersByIds(usersIds),
        enabled: usersIds && usersIds.length > 0
    });
};