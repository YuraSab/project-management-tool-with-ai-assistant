import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { UserProfile } from "../../../types/user";
import { Task, TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES, TASK_TYPES, TaskCategory, TaskPriority, TaskStatus, TaskType } from "../../../types/task";
import { formatDateForInput } from "../../../utils/dateFormat";
import { switchRightPanelView } from "../../../utils/panelManager";
import { toast } from "../../../utils/toaster.ts";
import { useUser } from "../../../hooks/users/useUser";
import { useProjectUsers } from "../../../hooks/project/useProjectUsers";
import { useUpdateTask } from "../../../hooks/task/useUpdateTask";
import { useDeleteTask } from "../../../hooks/task/useDeleteTask";
import { useProject } from "../../../hooks/project/useProject";
import { useProfileStore } from "../../../store/profileStore";
import { useProjectControlStore } from "../../../store/projectControlStore";
import CustomForm from "../../../ui/form/CustomForm";
import Title from "../../../ui/title/Title";
import FormTextInput from "../../../ui/input/FormTextInput";
import FormDateInput from "../../../ui/input/FormDateInput";
import FormTextarea from "../../../ui/textArea/FormTextarea";
import FormSelect from "../../../ui/select/FormSelect";
import CustomButton from "../../../ui/button/CustomButton";
import MemberSelector from "../../../ui/memberSelector/MemberSelector";
import CustomUserIcon from "../../../ui/icons/CustomUserIcon";
import RightPanelHeader from "../../rightPanel/rightPanelHeader/RightPanelHeader";
import AssignMembers from "../../asignMembers/AssignMembers";
import styles from "./TaskEdit.module.css";

type FormData = Omit<Task, "id" | "projectId" | "creatorId" | "assignedMembers" | 'startDate' | 'endDate'> & {
    startDate: string, endDate: string, type: TaskType, category: TaskCategory
};
const getInitialFormData = (task: Task | null): FormData => ({
    title: task?.title ?? '', description: task?.description ?? '',
    type: task?.type ?? 'none', category: task?.category ?? 'none',
    status: task?.status ?? 'todo', priority: task?.priority ?? 'none',
    startDate: formatDateForInput(task?.startDate) ?? '', endDate: formatDateForInput(task?.endDate) ?? '',
});

const TaskEdit = () => {
    const {projectId} = useParams();

    const ownId = useProfileStore((state) => state.profile?.uid);
    const selectedTask = useProjectControlStore((state) => state.selectedTask);
    const setIsRightPanelActive = useProjectControlStore((state) => state.setIsRightPanelActive);

    const {data: project} = useProject(projectId || "");
    const {data: projectMembers} = useProjectUsers(project?.assignedMembers || []);
    const {data: taskAssignedMembers} = useProjectUsers(selectedTask?.assignedMembers || []);
    const {data: taskCreator} = useUser(selectedTask?.creatorId || "");
    const {mutate: updateTask, isPending: isPendingUpdate} = useUpdateTask(projectId || '', ownId || '');
    const {mutate: deleteTask, isPending: isPendingDelete} = useDeleteTask();

    const [formData, setFormData] = useState<FormData>(getInitialFormData(selectedTask));
    const [localAssignedMembersMap, setLocalAssignedMembersMap] = useState<Map<string, UserProfile>>(new Map());
    const [addMembersActive, setAddMembersActive] = useState<boolean>(false);

    const projectMembersMap = useMemo((
        () => new Map<string, UserProfile>((projectMembers || []).map(m => [m.uid, m]))
    ), [projectMembers]);
    const localAssignedMembersIds = useMemo(() => [...localAssignedMembersMap.keys()], [localAssignedMembersMap]);
    const localAssignedMembers = useMemo(() => [...localAssignedMembersMap.values()], [localAssignedMembersMap]);

    const handleAssignMember = useCallback((member: UserProfile) => {
        setLocalAssignedMembersMap((prev) => {
            const newPrev = new Map(prev);
            if (newPrev.has(member.uid))
                newPrev.delete(member.uid);
            else
                newPrev.set(member.uid, member);
            return newPrev;
        });
    }, []);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }, []);

    const handleUpdate = useCallback(() => {
        if (!selectedTask?.id) return toast.error("No selected task found!");
        if (!formData.title.trim() || !formData.description.trim()) return toast.warning("Please fill all the required fields!");
        const taskData: Partial<Task> & { id: string } = {
            id: selectedTask.id,
            title: formData.title, description: formData.description,
            assignedMembers: [...localAssignedMembersMap.keys()],
            type: formData.type, category: formData.category,
            status: formData.status, priority: formData.priority,
            startDate: formData.startDate ? new Date(formData.startDate) : null,
            endDate: formData.endDate ? new Date(formData.endDate) : null,
            updatedAt: new Date(),
        };
        updateTask(taskData);
        setAddMembersActive(false);
    }, [formData, localAssignedMembersMap, selectedTask, updateTask]);

    const handleDelete = useCallback(() => {
        if (window.confirm("Are you sure you wanna delete this task?")) {
            deleteTask(selectedTask?.id || "");
            switchRightPanelView('closeAll');
        }
    }, [selectedTask, deleteTask]);

    useEffect(() => {
        if (!selectedTask) return;
        setFormData(getInitialFormData(selectedTask));
    }, [selectedTask]);

    useEffect(() => {
        if (taskAssignedMembers && taskAssignedMembers.length > 0)
            setLocalAssignedMembersMap(new Map(taskAssignedMembers.map(m => [m.uid, m])));
    }, [selectedTask?.id, taskAssignedMembers]);

    return (
        <CustomForm onSubmit={handleUpdate} style={{height: "calc(100vh - 130px)"}} disabled={isPendingUpdate || isPendingDelete} isDrawer={true}>
            <RightPanelHeader taskTitle={selectedTask?.title || ""}/>
            <div className={styles.rightPanelChildEdit}>
                <Title text={'Title'}/>
                <FormTextInput name={"title"} value={formData.title} onChange={handleChange} required/>
                <Title text={'Description'}/>
                <FormTextarea name={"description"} value={formData.description} onChange={handleChange}/>
                <Title text={'Members'}/>
                <AssignMembers
                    assignedMembers={localAssignedMembers}
                    onSelectMembersActive={() => setAddMembersActive(!addMembersActive)}
                    maxIcons={2} iconSize={28}
                />
                {addMembersActive && (
                    <MemberSelector membersMap={projectMembersMap} selectedMembersIds={localAssignedMembersIds} clickAction={handleAssignMember}/>
                )}
                {taskCreator && (<>
                    <Title text={'Creator'}/>
                    <CustomUserIcon title={taskCreator ? taskCreator.displayName : "User"} backgroundColor={taskCreator?.iconColor}/>
                </>)}
                <Title text={'Type'}/>
                <FormSelect<TaskType> name="type" value={formData.type} onChange={handleChange} options={TASK_TYPES}/>
                <Title text={'Category'}/>
                <FormSelect<TaskCategory> name="category" value={formData.category} onChange={handleChange}  options={TASK_CATEGORIES}/>
                <Title text={'Status'}/>
                <FormSelect<TaskStatus> name={"status"} value={formData.status} onChange={handleChange} options={TASK_STATUSES}/>
                <Title text={'Priority'}/>
                <FormSelect<TaskPriority> name={"priority"} value={formData.priority} onChange={handleChange} options={TASK_PRIORITIES}/>
                <Title text={'From'}/>
                <FormDateInput name={"startDate"} value={formData.startDate} onChange={handleChange}/>
                <Title text={'To'}/>
                <FormDateInput name={"endDate"} value={formData.endDate} onChange={handleChange}/>
                <Title text={'Created'}/>
                <FormDateInput name={"createdAt"} value={formatDateForInput(selectedTask?.createdAt)} onChange={handleChange} disabled={true}/>
                <div className={styles.buttonBlock}>
                    <CustomButton children={"Save changes"} disabled={isPendingUpdate || isPendingDelete} type={'submit'}/>
                    <CustomButton children={"Delete task"} onClick={handleDelete} style={{backgroundColor: "#D10000"}} disabled={isPendingUpdate || isPendingDelete}/>
                </div>
            </div>
        </CustomForm>
    );
};

export default React.memo(TaskEdit);