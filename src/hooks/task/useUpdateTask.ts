import {useMutation, useQueryClient} from "@tanstack/react-query";
import { updateTask } from "../../services/taskService.ts";
import {Task} from "../../types/task.ts";
import {toast} from "../../utils/toaster.ts";

interface MutationContext {
    previousTasks?: Task[];
}

export const useUpdateTask = (projectId: string, userId: string) => {
    const queryClient = useQueryClient();
    const queryKey = ["tasks", projectId, userId];
    return useMutation<void, Error, Partial<Task> & { id: string }, MutationContext>({
        mutationFn: updateTask,
        // 🔥 Optimistic update happens HERE
        onMutate: async (updatedTask) => {
            // 1. Cancel ongoing task fetches, so they don't overwrite our optimistic state.
            await queryClient.cancelQueries({ queryKey });
            // 2. Save the previous state of the tasks (in case the server returns an error)
            const previousTasks = queryClient.getQueryData<Task[]>(queryKey);
            // 3. INSTANTLY update the local React Query cache
            if (Array.isArray(previousTasks)) {
                queryClient.setQueryData<Task[]>(
                    queryKey,
                    previousTasks.map((task) =>
                        task.id === updatedTask.id ? { ...task, ...updatedTask } as Task : task
                    )
                );
            }
            // Save the context with previous tasks in case of a rollback
            return { previousTasks };
        },
        // ❌ If an error occurs, roll back the old tasks.
        onError: (err, updatedTask, context) => {
            if (context?.previousTasks)
                queryClient.setQueryData(queryKey, context.previousTasks);
            toast.error('Failed to update task');
        },
        // ⚡️ Once everything is complete (successfully or not) — silently synchronize data with the database
        onSuccess: () => toast.success('Task updated'),
        onSettled: () => queryClient.invalidateQueries({ queryKey })
    });
};