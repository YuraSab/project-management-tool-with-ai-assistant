import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../../services/userService";
import { UserProfile } from "../../types/user";
import { toast } from "../../utils/toaster";

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: Partial<UserProfile> & { uid: string }) => updateUser(user),
        onSuccess: (_data, variables) => {
            toast.success('User updated!');
            const { uid } = variables;
            return queryClient.invalidateQueries({ queryKey: ['users', uid] })
        },
        onError: () => toast.error('Failed to update user!')
    });
};