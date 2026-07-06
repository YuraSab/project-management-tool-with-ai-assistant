import React, {useCallback, useMemo, useState} from "react";
import {Project, ProjectStatus} from "../../types/project";
import CustomForm from "../../ui/form/CustomForm";
import FormLayout from "../../layouts/formLayout/FormLayout";
import {useNavigate} from "react-router-dom";
import {useProfileStore} from "../../store/profileStore.ts";
import {UserProfile} from "../../types/user.ts";
import {useCreateProject} from "../../hooks/project/useCreateProject.ts";
import Title from "../../ui/title/Title.tsx";
import FormTextInput from "../../ui/input/FormTextInput.tsx";
import FormTextarea from "../../ui/textArea/FormTextarea.tsx";
import FormDateInput from "../../ui/input/FormDateInput.tsx";
import FormSelect from "../../ui/select/FormSelect.tsx";
import FormButtonSubmit from "../../ui/button/FormButtonSubmit.tsx";
import AssignMembers from "../../components/asignMembers/AssignMembers.tsx";
import {useProjectUsers} from "../../hooks/project/useProjectUsers.ts";
import styles from './CreateProject.module.css';
import MemberSelector from "../../ui/memberSelector/MemberSelector.tsx";

type FormData = Pick<Project, 'title' | 'description' | 'status'> & { startDate: string, endDate: string };

const INITIAL_FORM_DATA: FormData = {
    title: "",
    description: "",
    startDate: '',
    endDate: '',
    status: ProjectStatus.Planned,
};

const CreateProject = () => {
    const navigate = useNavigate();
    const profile = useProfileStore((state) => state.profile);
    const { data: reservedMembers} = useProjectUsers(profile.reservedMembers);
    const { mutate: createProject, isPending} = useCreateProject();

    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const [assignedMembersMap, setAssignedMembersMap] = useState<Map<string, UserProfile>>(new Map());
    const [addMembersActive, setAddMembersActive] = useState<boolean>(false);

    const reservedMembersMap: Map<string, UserProfile> =  useMemo(() => (
        new Map([...reservedMembers || []]
            .map(m => [m.uid, m]))
    ) , [reservedMembers]);

    const assignedMembersIds: string[] = useMemo(() => (
        [...assignedMembersMap.keys() || []]
    ), [assignedMembersMap]);

    const assignedMembers: UserProfile[] = useMemo(() => (
        [...assignedMembersMap.values() || []]
    ), [assignedMembersMap]);

    const handleFilterMember = useCallback((member: UserProfile) => {
        setAssignedMembersMap((prev) => {
            const newPrev = new Map(prev);
            return newPrev.delete(member.uid) ? newPrev : newPrev.set(member.uid, member);
        });
    }, []);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }, []);

    const handleCreate = () => {
        if ( !formData.title.trim() )
            return alert("Please fill all the required fields!");
        createProject({
            ...formData,
            assignedMembers: [...assignedMembersIds, profile.uid],
            startDate: formData.startDate ? new Date(formData.startDate) : null,
            endDate: formData.endDate ? new Date(formData.endDate) : null,
        }, {
            onSuccess: () => navigate("/projects"),
            onError: () => alert('Failed to create project. Please try again.')
        });
    };

    return (
        <FormLayout>
            <CustomForm onSubmit={handleCreate} disabled={isPending} className={styles.main}>
                <Title text={'Title:'}/>
                <FormTextInput name={"title"} value={formData.title} onChange={handleChange} required/>
                <Title text={'Description:'}/>
                <FormTextarea name={"description"} value={formData.description} onChange={handleChange}/>
                <Title text={'Start Date:'}/>
                <FormDateInput name={"startDate"} value={formData.startDate} onChange={handleChange}/>
                <Title text={'End Date:'}/>
                <FormDateInput name={"endDate"} value={formData.endDate} onChange={handleChange}/>
                <Title text={'Members:'}/>
                <AssignMembers
                    assignedMembers={assignedMembers}
                    onSelectMembersActive={() => setAddMembersActive(!addMembersActive)}
                    maxIcons={6} iconSize={28}
                />
                {addMembersActive && (
                    <MemberSelector membersMap={reservedMembersMap} selectedMembersIds={assignedMembersIds} clickAction={handleFilterMember} />
                )}
                <Title text={'Status:'}/>
                <FormSelect<ProjectStatus> name={"status"} value={formData.status} onChange={handleChange} options={[ProjectStatus.Planned, ProjectStatus.InProgress, ProjectStatus.Completed]}/>
                <div className={styles.buttonBlock}>
                    <FormButtonSubmit text={"Create Project"} customStyles={{width: 240}}/>
                </div>
            </CustomForm>
        </FormLayout>
    )
}

export default CreateProject;