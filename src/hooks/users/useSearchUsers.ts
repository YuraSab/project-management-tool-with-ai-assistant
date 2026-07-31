import { useQuery } from "@tanstack/react-query";
import { searchUsersByEmail } from "../../services/userService";

export const useSearchUsers = (searchTerm: string, ownUid: string) => {
    return useQuery({
        queryKey: ['users_search', searchTerm],
        queryFn: () => searchUsersByEmail(searchTerm),
        enabled: searchTerm.trim().length > 0,
        select: (users) => {
            if (!users) return [];
            return users.filter((u) => u.uid !== ownUid);
        }
    });
};