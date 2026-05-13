import { useQuery } from "@tanstack/react-query";
import {getUsersByIds} from "../../services/userService.ts";

export const useProjectUsers = (usersIds: string[]) => {
    return useQuery({
        queryKey: ['users', usersIds], // todo - це помилка передавати сюди масив?
        queryFn: () => getUsersByIds(usersIds),
        enabled: usersIds && usersIds.length > 0, // don`t make request for empty array
    });
};