import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Task} from "../../types/task.ts";
import {createTask} from "../../services/taskService.ts";

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (taskData: Omit<Task, 'id'>) => createTask(taskData),
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ['tasks'] })
        }
    });
};