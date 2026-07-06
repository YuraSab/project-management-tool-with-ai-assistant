import React, {useCallback, useEffect, useMemo, useState} from "react";
import styles from "./TaskEdit.module.css";
import {useProjectControlStore} from "../../../store/projectControlStore";
import {Task, TaskPriority, TaskStatus} from "../../../types/task";
import CustomForm from "../../../ui/form/CustomForm";
import RightPanelHeader from "../../rightPanel/rightPanelHeader/RightPanelHeader";
import FormTextInput from "../../../ui/input/FormTextInput";
import FormTextarea from "../../../ui/textArea/FormTextarea";
import AssignMembers from "../../asignMembers/AssignMembers";
import FormSelect from "../../../ui/select/FormSelect";
import FormDateInput from "../../../ui/input/FormDateInput";
import FormButtonSubmit from "../../../ui/button/FormButtonSubmit";
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

type FormData = Omit<Task, "id" | "projectId" | "assignedMembers" | 'startDate' | 'endDate'> & { startDate: string, endDate: string };
const getInitialFormData = (task: Task | null): FormData => ({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'todo',
    startDate: formatDateForInput(task?.startDate) ?? '',
    endDate: formatDateForInput(task?.endDate) ?? '',
    priority: task?.priority ?? 'none',
});

const TaskEdit = () => {
    const { projectId } = useParams();
    
    const selectedTask = useProjectControlStore((state) => state.selectedTask);
    const setIsRightPanelActive = useProjectControlStore((state) => state.setIsRightPanelActive);
    const setIsEditTaskActive = useProjectControlStore((state) => state.setIsEditTaskActive);
    const clearSelectedTask = useProjectControlStore((state) => state.clearSelectedTask);

    const { data: project } = useProject(projectId || "");
    const { data: projectMembers } = useProjectUsers(project?.assignedMembers || []);
    const { data: taskAssignedMembers } = useProjectUsers(selectedTask?.assignedMembers || []);
    const { mutate: updateTask, isPending: isPendingUpdate } = useUpdateTask();
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
        updateTask({
            ...formData,
            id: selectedTask.id,
            projectId: selectedTask.projectId,
            assignedMembers: [...localAssignedMembersMap.keys()],
            startDate: formData.startDate ? new Date(formData.startDate) : null,
            endDate: formData.endDate ? new Date(formData.endDate) : null,
        });
    }, [formData, localAssignedMembersMap, selectedTask, updateTask]);

    const handleDelete = useCallback(() => {
        if (window.confirm("Are you sure you wanna delete this task?")) {
            deleteTask(selectedTask?.id || "");
            clearSelectedTask();
        }
    }, [selectedTask, deleteTask, clearSelectedTask]);

    useEffect(() => {
        if(selectedTask && taskAssignedMembers) {
            setFormData(getInitialFormData(selectedTask));
            setLocalAssignedMembersMap(
                new Map(taskAssignedMembers.map(m => [m.uid, m]))
            );
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTask?.id]);

    return (
        <CustomForm onSubmit={handleUpdate} style={{margin: 15, height: "calc(100vh - 130px)"}} disabled={isPendingUpdate || isPendingDelete}>
            <RightPanelHeader taskTitle={selectedTask?.title || ""} setIsEditTaskActive={setIsEditTaskActive} setIsRightPanelActive={setIsRightPanelActive}/>
            <div className={styles.rightPanelChildEdit}>
                <Title text={'Title'}/>
                <FormTextInput name={"title"} value={formData.title} onChange={handleChange} required/>
                <Title text={'Description:'}/>
                <FormTextarea name={"description"} value={formData.description} onChange={handleChange} />
                <Title text={'Members:'}/>
                <AssignMembers
                    assignedMembers={localAssignedMembers}
                    onSelectMembersActive={() => setAddMembersActive(!addMembersActive)}
                    maxIcons={2} iconSize={28}
                />
                {addMembersActive && (
                    <MemberSelector membersMap={projectMembersMap} selectedMembersIds={localAssignedMembersIds} clickAction={handleAssignMember} />
                )}
                <Title text={'Status:'}/>
                <FormSelect<TaskStatus> name={"status"} value={formData.status} onChange={handleChange} options={["todo", "in_progress", "done"]}/>
                <Title text={'From:'}/>
                <FormDateInput name={"startDate"} value={formData.startDate} onChange={handleChange} />
                <Title text={'To:'}/>
                <FormDateInput name={"endDate"} value={formData.endDate} onChange={handleChange} />
                <Title text={'Priority:'}/>
                <FormSelect<TaskPriority> name={"priority"} value={formData.priority} onChange={handleChange} options={["low", "medium", "high", "none"]}/>
                <div className={styles.buttonBlock}>
                    <FormButtonSubmit text={"Save changes"}/>
                    <CustomButton text={"Delete task"} onClick={() => handleDelete()} customStyles={{backgroundColor: "#D10000"}}/>
                </div>
            </div>
        </CustomForm>
    );
};

export default React.memo(TaskEdit);