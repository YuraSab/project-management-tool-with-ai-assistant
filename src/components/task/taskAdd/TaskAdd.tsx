import React, {useCallback, useMemo, useState} from "react";
import { Task, TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES, TASK_TYPES, TaskCategory, TaskPriority, TaskStatus, TaskType} from "../../../types/task";
import {useParams} from "react-router-dom";
import CustomForm from "../../../ui/form/CustomForm";
import FormTextInput from "../../../ui/input/FormTextInput";
import FormTextarea from "../../../ui/textArea/FormTextarea";
import RightPanelHeader from "../../rightPanel/rightPanelHeader/RightPanelHeader";
import AssignMembers from "../../asignMembers/AssignMembers.tsx";
import FormSelect from "../../../ui/select/FormSelect";
import styles from "./TaskAdd.module.css";
import FormDateInput from "../../../ui/input/FormDateInput";
import {useProject} from "../../../hooks/project/useProject";
import Title from "../../../ui/title/Title.tsx";
import {useProjectUsers} from "../../../hooks/project/useProjectUsers.ts";
import {useCreateTask} from "../../../hooks/task/useCreateTask.ts";
import {UserProfile} from "../../../types/user.ts";
import MemberSelector from "../../../ui/memberSelector/MemberSelector.tsx";
import CustomButton from "../../../ui/button/CustomButton.tsx";
import {useProfileStore} from "../../../store/profileStore.ts";

type FormData = Pick<Task, 'title'| 'description'| 'status' | 'priority'> & {
    startDate: string, endDate: string, type: TaskType | '', category: TaskCategory | ''
};

const INITIAL_TASK: FormData = {
    title: '', description: '',
    status: "todo", priority: 'none',
    startDate: '', endDate: '',
    type: '', category: '',
};

const TaskAdd = React.memo(() => {
    const {projectId} = useParams();

    const profileId = useProfileStore((state) => state.profile.uid);
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
            return newMap.delete((member.uid)) ? newMap : newMap.set(member.uid, member);
        });
    }, []);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }, []);

    const handleSubmit = () => {
        if (!projectId) return alert("No project found!");
        if (!formData.title) return alert("Title is required!");
        const taskData: Partial<Task> = {
            title: formData.title, description: formData.description,
            status: formData.status, priority: formData.priority,
            projectId, creatorId: profileId,
            assignedMembers: assignedMembersIds,
            startDate: formData.startDate ? new Date(formData.startDate) : null,
            endDate: formData.endDate ? new Date(formData.endDate) : null,
            createdAt: new Date(),
        };
        if (formData.type) taskData.type = formData.type;
        if (formData.category) taskData.category = formData.category;
        createTask(taskData as Task, {
            onSuccess: () => {
                setFormData(INITIAL_TASK);
                setAssignedMembersMap(new Map());
                setAddMembersActive(false);
            }
        });
    };

    return (
        <CustomForm onSubmit={handleSubmit} disabled={isPending} style={{margin: 15, height: "calc(100vh - 130px)"}}>
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
                <CustomButton children={"Save changes"} customStyles={{ width: "100%", marginTop: 16 }} disabled={isPending} type={'submit'}/>
            </div>
        </CustomForm>
    );
});

export default TaskAdd;