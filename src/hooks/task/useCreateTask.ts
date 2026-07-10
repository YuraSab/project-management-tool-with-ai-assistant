import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Task} from "../../types/task.ts";
import {createTask} from "../../services/taskService.ts";
import {toast} from "../../utils/toaster.ts";

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (taskData: Omit<Task, 'id'>) => createTask(taskData),
        onSuccess: () => {
            toast.success('Task created');
            return queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
        onError: () => toast.error('Failed to create task')
    });
};