import {Project} from "../types/project.ts";
import {collection, doc, getDoc, getDocs, query, updateDoc, deleteDoc, where, addDoc, writeBatch, arrayRemove} from "firebase/firestore";
import {db} from "../firebase.ts";

export const getProjects = async (userId: string): Promise<Project[]> => {
    if (!userId) return [];

    // 1. Створюємо посилання на колекцію
    const projectsRef = collection(db, 'projects');
    // 2. Створюємо запит: вибрати проекти, де в масиві assignedMembers є наш userId
    const projectsQuery = query(projectsRef, where('assignedMembers', 'array-contains', userId));
    // 3. Виконуємо запит
    const projectsSnap = await getDocs(projectsQuery);

    return projectsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Project[];
};

export const getProject = async (projectId: string): Promise<Project | null> => {
    if (!projectId) return null;

    const projectRef = doc(db, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists()) throw new Error("Project not found");

    return {
        id: projectSnap.id,
        ...projectSnap.data()
    } as Project;
};

export const createProject = async (data: Omit<Project, 'id'>): Promise<Project> => {
    const projectsCol = collection(db, 'projects');
    const projectSnap = await addDoc(projectsCol, data);
    return {
        id: projectSnap.id,
        ...data
    };
};

export const updateProject = async (data: Partial<Project> & { id: string }): Promise<void> => {
    const { id, ...rest } = data;
    const projectRef = doc(db, 'projects', id);
    return await updateDoc(projectRef, rest);
};

export const deleteProject = async (projectId: string): Promise<void> => {
    const projectRef = doc(db, 'projects', projectId);
    return await deleteDoc(projectRef);
};

export const deleteMembersFromProjectTasks = async ({ projectId, memberIds }: { projectId: string, memberIds: string[] }) => {
    if (memberIds.length === 0) return;
    const tasksRef = collection(db, 'tasks');
    const tasksQuery = query(
        tasksRef,
        where('projectId', '==', projectId),
        where('assignedMembers', 'array-contains-any', memberIds)
    );
    const taskSnap = await getDocs(tasksQuery);
    if (taskSnap.empty) return;
    // Use Batch (batch update) to execute everything in a single request.
    const batch = writeBatch(db);
    taskSnap.docs.forEach(((taskDoc) => {
        const taskRef = doc(db, 'tasks', taskDoc.id);
        // For each task, iterate through all removed members
        memberIds.forEach((taskId) => {
            batch.update(taskRef, {
                // removes userId from the array without affecting other users
                assignedMembers: arrayRemove(taskId)
            });
        });
    }));
    // 3. Фіксуємо зміни в базі
    await batch.commit();
};