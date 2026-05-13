import { useQuery } from "@tanstack/react-query";
import { User } from "../../types/user";

const fetchTasksUsersByIds = async (usersIds: string[]): Promise<User[]> => {
    // const response = await fetch(`http://localhost:3001/users`);
    // if ( !response.ok )
    //     throw new Error(`HTTP Error during fetching user. Status: ${response.status}`);
    // const data: User[] = await response.json();
    // return data.filter((user) => usersIds.includes(user.id));
    return []
};

export const useTaskUsers = (usersIds: string[]) => {
    return useQuery({ 
        queryKey: ["projectTasks", usersIds], 
        queryFn: () => fetchTasksUsersByIds(usersIds),
        enabled: usersIds && usersIds.length > 0,
    });
};