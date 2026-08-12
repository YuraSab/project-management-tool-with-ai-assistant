import React, {useCallback, useEffect, useMemo, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Role, Theme, UserProfile } from "../../../types/user";
import { Project, ProjectStatus } from "../../../types/project";
import { formatDateForInput } from "../../../utils/dateFormat";
import { useProject } from "../../../hooks/project/useProject";
import { useProjectUsers } from "../../../hooks/project/useProjectUsers";
import { useProjectUpdate } from "../../../hooks/project/useProjectUpdate";
import { useProjectDelete } from "../../../hooks/project/useProjectDelete";
import { useProfileStore } from "../../../store/profileStore";
import { Title, FormTextInput, FormDateInput, DisabledField, FormTextarea, FormSelect, CustomButton, MemberSelector } from '../../../ui';
import AssignMembers from "../../asignMembers/AssignMembers";
import styles from "./ProjectSettings.module.css";

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

    const totalMembersMap = useMemo<Map<string, UserProfile>>(() => (
        new Map([...(projectMembers || []), ...(reservedMembers || [])].map(m => [m.uid, m]))
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
            endDate: formData.endDate ? new Date(formData.endDate) : null,
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
                <CustomButton onClick={() => handleUpdateProject()} disabled={editProjectMutation.isPending}>Save changes</CustomButton>
                {profile?.role === Role.Admin && (
                    <CustomButton onClick={() => handleDeleteProject()} style={{backgroundColor: "#D10000"}}>Delete project</CustomButton>
                )}
            </div>
        </div>
    );
};

export default ProjectSettings;