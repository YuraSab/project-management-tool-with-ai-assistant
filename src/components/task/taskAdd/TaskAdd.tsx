import React, {useCallback, useMemo, useState} from "react";
import {Task, TaskPriority, TaskStatus} from "../../../types/task";
import {useParams} from "react-router-dom";
import CustomForm from "../../../ui/form/CustomForm";
import FormTextInput from "../../../ui/input/FormTextInput";
import FormTextarea from "../../../ui/textArea/FormTextarea";
import RightPanelHeader from "../../rightPanel/rightPanelHeader/RightPanelHeader";
import AssignMembers from "../../asignMembers/AssignMembers.tsx";
import FormSelect from "../../../ui/select/FormSelect";
import FormButtonSubmit from "../../../ui/button/FormButtonSubmit";
import styles from "./TaskAdd.module.css";
import FormDateInput from "../../../ui/input/FormDateInput";
import {useProject} from "../../../hooks/project/useProject";
import Title from "../../../ui/title/Title.tsx";
import {useProjectUsers} from "../../../hooks/project/useProjectUsers.ts";
import {useCreateTask} from "../../../hooks/task/useCreateTask.ts";
import {UserProfile} from "../../../types/user.ts";
import MemberSelector from "../../../ui/memberSelector/MemberSelector.tsx";

type FormData = Pick<Task, 'title'| 'description'| 'status' | 'priority'> & { startDate: string, endDate: string };

const INITIAL_TASK: FormData = {
    title: '', description: '',
    status: "todo", priority: 'none',
    startDate: '', endDate: '',
};

const TaskAdd = React.memo(() => {
    const {projectId} = useParams();

    const [formData, setFormData] = useState<FormData>(INITIAL_TASK);
    const [assignedMembersMap, setAssignedMembersMap] = useState<Map<string, UserProfile>>(new Map());
    const [addMembersActive, setAddMembersActive] = useState<boolean>(false);

    const { data: project} = useProject(projectId || "");
    const { data: projectMembers} = useProjectUsers(project?.assignedMembers || []);
    const { mutate: createTask, isPending } = useCreateTask();

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

        createTask({
            ...formData,
            projectId,
            assignedMembers: assignedMembersIds,
            createdAt: new Date(),
            startDate: formData.startDate ? new Date(formData.startDate) : null,
            endDate: formData.endDate ? new Date(formData.endDate) : null,
        }, {
            onSuccess: () => {
                setFormData(INITIAL_TASK);
                setAssignedMembersMap(new Map);
            }
        });
    };

    return (
        <CustomForm disabled={isPending} onSubmit={handleSubmit} style={{margin: 15, height: "calc(100vh - 130px)"}}>
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
                <FormSelect<TaskStatus> name="status" value={formData.status} onChange={handleChange} options={["todo", "in_progress", "done"]}/>
                <Title text={'Priority:'}/>
                <FormSelect<TaskPriority> name="priority" value={formData.priority} onChange={handleChange} options={["low", "medium", "high", "none"]}/>
                <Title text={'Start date:'}/>
                <FormDateInput name={"startDate"} value={formData.startDate} onChange={handleChange}/>
                <Title text={'End date:'}/>
                <FormDateInput name={"endDate"} value={formData.endDate} onChange={handleChange}/>
                <FormButtonSubmit text={"Save changes"} customStyles={{width: "100%", marginTop: 16}} disabled={isPending}/>
            </div>
        </CustomForm>
    );
});

export default TaskAdd;