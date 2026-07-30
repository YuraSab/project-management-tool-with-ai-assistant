import {useNavigate, useParams} from "react-router-dom";
import styles from "./ProjectSettings.module.css";
import {useProjectUsers} from "../../../hooks/project/useProjectUsers";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import FormTextInput from "../../../ui/input/FormTextInput";
import FormTextarea from "../../../ui/textArea/FormTextarea";
import FormDateInput from "../../../ui/input/FormDateInput";
import FormSelect from "../../../ui/select/FormSelect";
import {Project, ProjectStatus} from "../../../types/project";
import AssignMembers from "../../asignMembers/AssignMembers.tsx";
import CustomButton from "../../../ui/button/CustomButton";
import {Theme, UserProfile} from "../../../types/user.ts";
import {useProjectUpdate} from "../../../hooks/project/useProjectUpdate.ts";
import {useProjectDelete} from "../../../hooks/project/useProjectDelete.ts";
import Title from "../../../ui/title/Title.tsx";
import {useProfileStore} from "../../../store/profileStore.ts";
import {formatDateForInput} from "../../../utils/dateFormat.ts";
import {useProject} from "../../../hooks/project/useProject.ts";
import MemberSelector from "../../../ui/memberSelector/MemberSelector.tsx";
import DisabledField from "../../../ui/disabledField/DisabledField.tsx";

type FormData = Pick<Project, 'title' | 'description' | 'status'> & { startDate: string, endDate: string };

const INITIAL_PROJECT: FormData = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: ProjectStatus.Planned,
};

const ProjectSettings: React.FC = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const profile = useProfileStore((state) => state.profile);
    const { data: project} = useProject(projectId || '');
    const { data: reservedMembers} = useProjectUsers(profile?.reservedMembers || []);
    const { data: projectMembers} = useProjectUsers(project?.assignedMembers || []);
    const editProjectMutation = useProjectUpdate();
    const deleteProjectMutation = useProjectDelete();

    const [formData, setFormData] = useState<FormData>(INITIAL_PROJECT);
    const [addMembersActive, setAddMembersActive] = useState<boolean>(false);
    const [localAssignedMembersMap, setLocalAssignedMembersMap] = useState<Map<string, UserProfile>>(new Map());

    const totalMembersMap: Map<string, UserProfile> = useMemo(() => (
        new Map([...(projectMembers || []), ...(reservedMembers || [])]
            .map(m=> [m.uid, m]))
    ), [projectMembers, reservedMembers]);

    const localAssignedMembersIds: string[] = useMemo(() => ([...localAssignedMembersMap.keys()]), [localAssignedMembersMap]);
    const localAssignedMembers: UserProfile[] = useMemo(() => ([...localAssignedMembersMap.values()]), [localAssignedMembersMap]);

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title,
                description: project.description,
                startDate: formatDateForInput(project.startDate),
                endDate: formatDateForInput(project.endDate),
                status: project.status,
            });
        }
    }, [project]);

    useEffect(() => {
        if (projectMembers)
            setLocalAssignedMembersMap( new Map(projectMembers.map(m => [m.uid, m])) );
    }, [projectMembers]);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleAssignMember = useCallback((member: UserProfile) => {
        setLocalAssignedMembersMap((prev) => {
            const newPrev = new Map(prev);
            return newPrev.delete(member.uid) ? newPrev : newPrev.set(member.uid, member);
        });
    }, []);

    const handleUpdateProject = async () => {
        if (!project) return;
        editProjectMutation.mutate({
            ...formData,
            id: project.id,
            assignedMembers: localAssignedMembersIds,
            startDate: formData.startDate ? new Date(formData.startDate) : null,
            endDate: formData.startDate ? new Date(formData.endDate) : null,
        });
        setAddMembersActive(false);
    };

    const handleDeleteProject  = async () => {
        if (window.confirm("Are you sure, you wanna delete this project?")) {
            deleteProjectMutation.mutate(projectId || "");
            navigate("/projects");
        }
    };

    return(
        <div className={`${styles.settingsPanel} ${profile?.theme === Theme.Black ? styles.dark : styles.light}`} >
            <Title text={'ID:'}/>
            <DisabledField children={project?.id ?? ''} copyText={project?.id} toastValue={'Copied project ID'}/>
            <Title text={'Name:'}/>
            <FormTextInput name={"title"} value={formData.title} onChange={handleChange} placeholder={"title"}/>
            <Title text={'Description:'}/>
            <FormTextarea  name={"description"} value={formData.description} onChange={handleChange}/>
            <Title text={'Start date:'}/>
            <FormDateInput name={"startDate"} value={formData.startDate} onChange={handleChange}/>
            <Title text={'End date:'}/>
            <FormDateInput name={"endDate"} value={formData.endDate} onChange={handleChange}/>
            <Title text={'Status:'}/>
            <FormSelect<ProjectStatus> name={"status"} value={formData.status} onChange={handleChange} options={[ProjectStatus.Planned, ProjectStatus.InProgress, ProjectStatus.Completed]}/>
            <Title text={'Members:'}/>
            <AssignMembers
                assignedMembers={localAssignedMembers}
                onSelectMembersActive={() => setAddMembersActive(!addMembersActive) }
                maxIcons={2} iconSize={28}
            />
            {addMembersActive && (
                <MemberSelector membersMap={totalMembersMap} selectedMembersIds={localAssignedMembersIds} clickAction={handleAssignMember} />
            )}
            <div className={styles.buttonBlock}>
                <CustomButton children={"Save changes"} onClick={() => handleUpdateProject()} disabled={editProjectMutation.isPending}/>
                {profile?.role === "admin" && (
                    <CustomButton children={"Delete project"} onClick={() => handleDeleteProject()} customStyles={{backgroundColor: "#D10000"}}/>
                )}
            </div>
        </div>
    );
};

export default ProjectSettings;