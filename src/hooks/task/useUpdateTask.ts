import {useMutation, useQueryClient} from "@tanstack/react-query";
import { updateTask } from "../../services/taskService.ts";
import {Task} from "../../types/task.ts";
import {toast} from "../../utils/toaster.ts";

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskData: Partial<Task> & { id: string }) => updateTask(taskData),
        onSuccess: () => {
            toast.success('Task updated');
            return queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: () => toast.error('Failed to update task')
    });
};