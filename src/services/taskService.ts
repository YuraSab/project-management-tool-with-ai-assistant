import {Task} from "../types/task.ts";
import {collection, getDocs, query, where, doc, updateDoc, addDoc, deleteDoc} from "firebase/firestore";
import {db} from "../firebase.ts";

export type CreateTaskPayload = Omit<Task, 'id'>;
export type UpdateTaskPayload = Partial<Task> & { id: string };

export const getTasks = async (projectId: string): Promise<Task[]> => {
    if ( !projectId ) return [];

    const tasksRef = collection(db, 'tasks');
    const tasksQuery = query(tasksRef, where('projectId', '==', projectId));
    const tasksSnap = await getDocs(tasksQuery);

    return tasksSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Task[];
};

export const createTask = async (task: CreateTaskPayload): Promise<Task> => {
    const tasksCol = collection(db, 'tasks');
    const taskSnap = await addDoc(tasksCol, task);
    return {
        id: taskSnap.id,
        ...task
    };
};

export const updateTask = async (task: UpdateTaskPayload): Promise<void> => {
    const { id, ...updateData } = task;
    const taskRef = doc(db, 'tasks', id);
    return await updateDoc(taskRef, updateData);
};

export const deleteTask = async (taskId: string): Promise<void> => {
    const taskRef = doc(db, 'tasks', taskId);
    return await deleteDoc(taskRef);
};