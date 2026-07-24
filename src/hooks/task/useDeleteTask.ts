import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteTask} from "../../services/taskService.ts";
import {toast} from "../../utils/toaster.ts";

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId: string) => deleteTask(taskId),
        onSuccess: () => {
            toast.success('Task deleted');
            return  queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: () => toast.error('Failed to delete task')
    });
};