import { collection, getDocs, query, where, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Task } from "../types/task";

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

export const updateTasks__TEST = async (): Promise<void> => {
    try {
        console.log("🚀 Start Migration...");
        const tasksRef = collection(db, 'tasks');
        const tasksSnap = await getDocs(tasksRef);
        // let updatedCount = 0;

        console.log(`📊 Усього тасок у базі: ${tasksSnap.docs.length}`);
        tasksSnap.docs.forEach((taskDoc) => {
            const data = taskDoc.data();
            console.log(`ID: [${taskDoc.id}] | Title: "${data.title}" | updatedAt:`, data.updatedAt);
        });

        // const now = new Date().toISOString(); // Поточний час для ініціалізації дат
        // const targetCreatorId = 'nmt7XA4CQUQtSQlItj0B35Qitkx2';

        // for (const taskDoc of tasksSnap.docs) {
            // const data = taskDoc.data();
            // const taskRef = doc(db, 'tasks', taskDoc.id);
            // ---- Category ----
            // if (data.type === undefined || data.category === undefined) {
            //     await updateDoc(taskRef, {
            //         type: data.type ?? 'none',
            //         category: data.category ?? 'none'
            //     });
            //     updatedCount++;
            // }
            // const targetCreatorId = 'nmt7XA4CQUQtSQlItj0B35Qitkx2';
            // if (data.creatorId === undefined) {
            //     await updateDoc(taskRef, 'creatorId', targetCreatorId);
            //     updatedCount++
            // }

            // ---- updatedAt ----
            // const updates: Record<string, any> = {};
            // if (data.updatedAt === undefined) {
            //     updates.updatedAt = now;
            // }
            // // Якщо для цієї таски немає поля updatedAt, оновлюємо її
            // if (Object.keys(updates).length > 0) {
            //     await updateDoc(taskRef, updates);
            //     updatedCount++;
            //     console.log(`📝 Added updatedAt to task [${taskDoc.id}]:`, updates.updatedAt);
            // }
        // }
        // console.log(`⚙️ Updated tasks: ${updatedCount}`);
    } catch (error) {
        console.error("❌ Migration error:", error);
    }
    finally {
        console.log('✅ End Migration!');
    }
};