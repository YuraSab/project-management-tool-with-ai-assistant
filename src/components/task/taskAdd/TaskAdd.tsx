import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { UserProfile } from "../../../types/user";
import { Task, TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES, TASK_TYPES, TaskCategory, TaskPriority, TaskStatus, TaskType } from "../../../types/task";
import { useProjectUsers } from "../../../hooks/project/useProjectUsers";
import { useProject } from "../../../hooks/project/useProject";
import { useCreateTask } from "../../../hooks/task/useCreateTask";
import { useProfileStore } from "../../../store/profileStore";
import CustomForm from "../../../ui/form/CustomForm";
import Title from "../../../ui/title/Title";
import FormTextInput from "../../../ui/input/FormTextInput";
import FormDateInput from "../../../ui/input/FormDateInput";
import FormTextarea from "../../../ui/textArea/FormTextarea";
import FormSelect from "../../../ui/select/FormSelect";
import CustomButton from "../../../ui/button/CustomButton";
import MemberSelector from "../../../ui/memberSelector/MemberSelector";
import RightPanelHeader from "../../rightPanel/rightPanelHeader/RightPanelHeader";
import AssignMembers from "../../asignMembers/AssignMembers";
import styles from "./TaskAdd.module.css";
import {toast} from "../../../utils/toaster.ts";

type FormData = Pick<Task, 'title'| 'description'| 'status' | 'priority'> & {
    startDate: string, endDate: string, type: TaskType | '', category: TaskCategory | ''
};

const INITIAL_TASK: FormData = {
    title: '', description: '',
    status: "todo", priority: 'none',
    startDate: '', endDate: '',
    type: 'none', category: 'none',
};

const TaskAdd = React.memo(() => {
    const { projectId } = useParams();

    const profileId = useProfileStore((state) => state.profile?.uid);
    const { data: project} = useProject(projectId || "");
    const { data: projectMembers} = useProjectUsers(project?.assignedMembers || []);
    const { mutate: createTask, isPending } = useCreateTask();

    const [formData, setFormData] = useState<FormData>(INITIAL_TASK);
    const [assignedMembersMap, setAssignedMembersMap] = useState<Map<string, UserProfile>>(new Map());
    const [addMembersActive, setAddMembersActive] = useState<boolean>(false);

    const projectMembersMap = useMemo<Map<string, UserProfile>>(() => (
        new Map(projectMembers
            ? projectMembers.map(m => [m.uid, m])
            : []
        )
    ), [projectMembers]);

    const assignedMembersIds = useMemo(() => [...assignedMembersMap.keys()], [assignedMembersMap]);
    const assignedMembers: UserProfile[] = useMemo(() => [...assignedMembersMap.values()], [assignedMembersMap]);

    const handleAssignMember = useCallback((member: UserProfile) => {
        setAssignedMembersMap((prev) => {
            const newMap = new Map(prev);
            if (newMap.has(member.uid))
                newMap.delete(member.uid);
            else
                newMap.set(member.uid, member);
            return newMap;
        });
    }, []);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = () => {
        if (!projectId) return toast.error("No project found!");
        if (!formData.title) return toast.warning("Title is required!");
        const taskData: Partial<Task> = {
            title: formData.title, description: formData.description,
            status: formData.status, priority: formData.priority,
            projectId, creatorId: profileId,
            assignedMembers: assignedMembersIds,
            startDate: formData.startDate ? new Date(formData.startDate) : null,
            endDate: formData.endDate ? new Date(formData.endDate) : null,
            createdAt: new Date(),
            updatedAt: new Date(),
            type: formData.type ? formData.type : 'none',
            category: formData.category ? formData.category : 'none',
        };
        createTask(taskData as Task, {
            onSuccess: () => {
                setFormData(INITIAL_TASK);
                setAssignedMembersMap(new Map());
                setAddMembersActive(false);
            },
        });
    };

    return (
        <CustomForm
            onSubmit={handleSubmit}
            disabled={isPending}
            style={{ height: "calc(100vh - 130px)" }}
            isDrawer={true}
        >
            <RightPanelHeader taskTitle={"Add task"}/>
            <div className={styles.rightPanelChild}>
                <Title text={'Title:'}/>
                <FormTextInput name="title" value={formData.title} onChange={handleChange} required/>
                <Title text={'Description:'}/>
                <FormTextarea name="description" value={formData.description} onChange={handleChange}/>
                <Title text={'Members:'}/>
                <AssignMembers
                    assignedMembers={assignedMembers}
                    onSelectMembersActive={() => setAddMembersActive(!addMembersActive)}
                    maxIcons={2} iconSize={28}
                />
                {addMembersActive && (
                    <MemberSelector membersMap={projectMembersMap} selectedMembersIds={assignedMembersIds} clickAction={handleAssignMember} />
                )}
                <Title text={'Status:'}/>
                <FormSelect<TaskStatus> name="status" value={formData.status} onChange={handleChange} options={TASK_STATUSES}/>
                <Title text={'Priority:'}/>
                <FormSelect<TaskPriority> name="priority" value={formData.priority} onChange={handleChange} options={TASK_PRIORITIES}/>
                <Title text={'Type'}/>
                <FormSelect<TaskType | ''> name="type" value={formData.type} onChange={handleChange} options={TASK_TYPES}/>
                <Title text={'Category'}/>
                <FormSelect<TaskCategory | ''> name="category" value={formData.category} onChange={handleChange} options={TASK_CATEGORIES}/>
                <Title text={'Start date:'}/>
                <FormDateInput name={"startDate"} value={formData.startDate} onChange={handleChange}/>
                <Title text={'End date:'}/>
                <FormDateInput name={"endDate"} value={formData.endDate} onChange={handleChange}/>
                <CustomButton children={"Save changes"} style={{ width: "100%", marginTop: 16 }} disabled={isPending} type={'submit'}/>
            </div>
        </CustomForm>
    );
});

export default TaskAdd;