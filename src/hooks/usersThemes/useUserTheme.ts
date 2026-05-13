import { useQuery } from "@tanstack/react-query";
import { UserTheme } from "../../types/userTheme";

const fetchUserTheme = async (userId: string): Promise<UserTheme | null> => {
    try{
        const response = await fetch(`http://localhost:3001/userThemes/${userId}`);
        if ( !response.ok )
            throw new Error(`HTTP Error during fetching user. Status: ${response.status}`); 
        return await response.json();
    } catch (error) {
        // console.log(`No personalision data of user with id: ${userId} found`);
        return null;
    }
}

export const useUserTheme = (userId: string , options?: { enabled?: boolean }) => {
    return useQuery({ 
        queryKey: ["userTheme", userId], 
        queryFn: () => fetchUserTheme(userId),
        enabled: options?.enabled ?? true,
    });
}