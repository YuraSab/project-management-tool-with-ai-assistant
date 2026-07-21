import React, {useCallback, useEffect, useMemo, useState} from "react";
import styles from "./TaskEdit.module.css";
import {useProjectControlStore} from "../../../store/projectControlStore";
import {Task, TASK_CATEGORIES, TASK_TYPES, TaskCategory, TaskPriority, TaskStatus, TaskType} from "../../../types/task";
import CustomForm from "../../../ui/form/CustomForm";
import RightPanelHeader from "../../rightPanel/rightPanelHeader/RightPanelHeader";
import FormTextInput from "../../../ui/input/FormTextInput";
import FormTextarea from "../../../ui/textArea/FormTextarea";
import AssignMembers from "../../asignMembers/AssignMembers";
import FormSelect from "../../../ui/select/FormSelect";
import FormDateInput from "../../../ui/input/FormDateInput";
import CustomButton from "../../../ui/button/CustomButton";
import {UserProfile} from "../../../types/user";
import {useParams} from "react-router-dom";
import {useProject} from "../../../hooks/project/useProject";
import Title from "../../../ui/title/Title";
import {useProjectUsers} from "../../../hooks/project/useProjectUsers.ts";
import {useUpdateTask} from "../../../hooks/task/useUpdateTask.ts";
import {useDeleteTask} from "../../../hooks/task/useDeleteTask.ts";
import {formatDateForInput} from "../../../utils/dateFormat.ts";
import MemberSelector from "../../../ui/memberSelector/MemberSelector.tsx";
import {switchRightPanelView} from "../../../utils/panelManager.ts";
import {useUser} from "../../../hooks/users/useUser.ts";
import CustomUserIcon from "../../../ui/icons/CustomUserIcon.tsx";
import {useProfileStore} from "../../../store/profileStore.ts";

type FormData = Omit<Task, "id" | "projectId" | "creatorId" | "assignedMembers" | 'startDate' | 'endDate'> & {
    startDate: string, endDate: string, type: TaskType | '', category: TaskCategory | ''
};
const getInitialFormData = (task: Task | null): FormData => ({
    title: task?.title ?? '', description: task?.description ?? '',
    type: task?.type ?? 'none', category: task?.category ?? 'none',
    status: task?.status ?? 'todo', priority: task?.priority ?? 'none',
    startDate: formatDateForInput(task?.startDate) ?? '', endDate: formatDateForInput(task?.endDate) ?? '',
});

const TaskEdit = () => {
    const { projectId } = useParams();

    const ownId = useProfileStore((state) => state.profile.uid);
    const selectedTask = useProjectControlStore((state) => state.selectedTask);
    const setIsRightPanelActive = useProjectControlStore((state) => state.setIsRightPanelActive);
    const setIsEditTaskActive = useProjectControlStore((state) => state.setIsEditTaskActive);

    const { data: project } = useProject(projectId || "");
    const { data: projectMembers } = useProjectUsers(project?.assignedMembers || []);
    const { data: taskAssignedMembers } = useProjectUsers(selectedTask?.assignedMembers || []);
    const { data: taskCreator } = useUser(selectedTask?.creatorId || "");
    const { mutate: updateTask, isPending: isPendingUpdate } = useUpdateTask(projectId || '', ownId || '');
    const { mutate: deleteTask, isPending: isPendingDelete } = useDeleteTask();

    const [formData, setFormData] = useState<FormData>(getInitialFormData(selectedTask));
    const [localAssignedMembersMap, setLocalAssignedMembersMap] = useState<Map<string, UserProfile>>(new Map());
    const [addMembersActive, setAddMembersActive] = useState<boolean>(false);

    const projectMembersMap = useMemo(() => new Map([...(projectMembers || []).map(m => [m.uid, m])]), [projectMembers]);
    const localAssignedMembersIds = useMemo(() => [...localAssignedMembersMap.keys()], [localAssignedMembersMap]);
    const localAssignedMembers = useMemo(() => [...localAssignedMembersMap.values()], [localAssignedMembersMap]);

    const handleAssignMember = useCallback((member: UserProfile) => {
        setLocalAssignedMembersMap((prev) => {
            const newPrev = new Map(prev);
            return newPrev.delete(member.uid) ? newPrev : newPrev.set(member.uid, member);
        })
    }, []);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleUpdate = useCallback(() => {
        if (!selectedTask?.id) return;
        if (!formData.title.trim() || !formData.description.trim()) return alert("Please fill all the required fields!");
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
        if (taskAssignedMembers)
            setLocalAssignedMembersMap(new Map(taskAssignedMembers.map(m => [m.uid, m])));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTask?.id, taskAssignedMembers]);

    return (
        <CustomForm onSubmit={handleUpdate} style={{margin: 15, height: "calc(100vh - 130px)"}} disabled={isPendingUpdate || isPendingDelete}>
            <RightPanelHeader taskTitle={selectedTask?.title || ""} setIsEditTaskActive={setIsEditTaskActive} setIsRightPanelActive={setIsRightPanelActive}/>
            <div className={styles.rightPanelChildEdit}>
                <Title text={'Title'}/>
                <FormTextInput name={"title"} value={formData.title} onChange={handleChange} required/>
                <Title text={'Description'}/>
                <FormTextarea name={"description"} value={formData.description} onChange={handleChange} />
                <Title text={'Members'}/>
                <AssignMembers
                    assignedMembers={localAssignedMembers}
                    onSelectMembersActive={() => setAddMembersActive(!addMembersActive)}
                    maxIcons={2} iconSize={28}
                />
                {addMembersActive && (
                    <MemberSelector membersMap={projectMembersMap} selectedMembersIds={localAssignedMembersIds} clickAction={handleAssignMember} />
                )}
                {taskCreator && (<>
                    <Title text={'Creator'}/>
                    <CustomUserIcon title={taskCreator ? taskCreator.displayName : "User"} backgroundColor={taskCreator?.iconColor}/>
                </>)}
                <Title text={'Type'}/>
                <FormSelect<TaskType | ''> name="type" value={formData.type || ''} onChange={handleChange} options={TASK_TYPES}/>
                <Title text={'Category'}/>
                <FormSelect<TaskCategory | ''> name="category" value={formData.category || ''} onChange={handleChange} options={TASK_CATEGORIES}/>
                <Title text={'Status'}/>
                <FormSelect<TaskStatus> name={"status"} value={formData.status} onChange={handleChange} options={["todo", "in_progress", "done"]}/>
                <Title text={'Priority'}/>
                <FormSelect<TaskPriority> name={"priority"} value={formData.priority} onChange={handleChange} options={["low", "medium", "high", "none"]}/>
                <Title text={'From'}/>
                <FormDateInput name={"startDate"} value={formData.startDate} onChange={handleChange} />
                <Title text={'To'}/>
                <FormDateInput name={"endDate"} value={formData.endDate} onChange={handleChange} />
                <Title text={'Created'}/>
                <FormDateInput name={"endDate"} value={formatDateForInput(selectedTask?.createdAt)} onChange={handleChange} disabled={true}/>
                <div className={styles.buttonBlock}>
                    <CustomButton children={"Save changes"} disabled={isPendingUpdate || isPendingDelete} type={'submit'}/>
                    <CustomButton children={"Delete task"} onClick={handleDelete} customStyles={{backgroundColor: "#D10000"}} disabled={isPendingUpdate || isPendingDelete}/>
                </div>
            </div>
        </CustomForm>
    );
};

export default React.memo(TaskEdit);