import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../../services/taskService";
import { toast } from "../../utils/toaster";
import { Task } from "../../types/task";

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (taskData: Omit<Task, 'id'>) => createTask(taskData),
        onSuccess: () => {
            toast.success('Task created!');
            return queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
        onError: () => toast.error('Failed to create task!')
    });
};