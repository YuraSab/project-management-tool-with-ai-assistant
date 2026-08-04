import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Project, ProjectStatus, ProjectStatuses } from "../../types/project";
import { UserProfile } from "../../types/user";
import { toast } from "../../utils/toaster";
import { useProjectUsers } from "../../hooks/project/useProjectUsers";
import { useCreateProject } from "../../hooks/project/useCreateProject";
import { useProfileStore } from "../../store/profileStore";
import Title from "../../ui/title/Title";
import CustomForm from "../../ui/form/CustomForm";
import FormTextInput from "../../ui/input/FormTextInput";
import FormDateInput from "../../ui/input/FormDateInput";
import FormTextarea from "../../ui/textArea/FormTextarea";
import FormSelect from "../../ui/select/FormSelect";
import CustomButton from "../../ui/button/CustomButton";
import MemberSelector from "../../ui/memberSelector/MemberSelector";
import AssignMembers from "../../components/asignMembers/AssignMembers";
import styles from './CreateProject.module.css';

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
    const { data: reservedMembers} = useProjectUsers(profile?.reservedMembers || []);
    const { mutate: createProject, isPending} = useCreateProject();

    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const [assignedMembersMap, setAssignedMembersMap] = useState<Map<string, UserProfile>>(new Map());
    const [addMembersActive, setAddMembersActive] = useState<boolean>(false);

    const reservedMembersMap = new Map((reservedMembers ?? []).map(m => [m.uid, m]));
    const assignedMembers = [...assignedMembersMap.values()];
    const assignedMembersIds = [...assignedMembersMap.keys()];

    const handleToggleMember = useCallback((member: UserProfile) => {
        setAssignedMembersMap((prev) => {
            const next = new Map(prev);
            if (next.has(member.uid))
                next.delete(member.uid);
            else
                next.set(member.uid, member);
            return next;
        });
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreate = () => {
        if (!profile)
            return toast.error("No profile found!");
        if (!formData.title.trim())
            return toast.error("Please fill all the required fields!");
        createProject({
            ...formData,
            assignedMembers: [...assignedMembersIds, profile.uid],
            startDate: formData.startDate ? new Date(formData.startDate) : null,
            endDate: formData.endDate ? new Date(formData.endDate) : null,
        }, {
            onSuccess: () => navigate("/projects")
        });
    };

    return (
        <CustomForm onSubmit={handleCreate} disabled={isPending} className={styles.mainBlock}>
            <Title text={'Title'}/>
            <FormTextInput name={"title"} value={formData.title} onChange={handleChange} required/>
            <Title text={'Description'}/>
            <FormTextarea name={"description"} value={formData.description} onChange={handleChange}/>
            <Title text={'Start Date'}/>
            <FormDateInput name={"startDate"} value={formData.startDate} onChange={handleChange}/>
            <Title text={'End Date'}/>
            <FormDateInput name={"endDate"} value={formData.endDate} onChange={handleChange}/>
            <Title text={'Members'}/>
            <AssignMembers
                assignedMembers={assignedMembers} maxIcons={6} iconSize={28}
                onSelectMembersActive={() => setAddMembersActive(!addMembersActive)}
            />
            {addMembersActive && (
                <MemberSelector membersMap={reservedMembersMap} selectedMembersIds={assignedMembersIds} clickAction={handleToggleMember} />
            )}
            <Title text={'Status'}/>
            <FormSelect<ProjectStatus>
                name={"status"} options={[...ProjectStatuses]}
                value={formData.status} onChange={handleChange}
            />
            <div className={styles.buttonBlock}>
                <CustomButton type={'submit'} disabled={isPending}>
                    { isPending ? 'Creating...' : 'Create Project' }
                </CustomButton>
            </div>
        </CustomForm>
    );
};

export default CreateProject;