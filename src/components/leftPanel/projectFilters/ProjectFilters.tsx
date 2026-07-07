import {useParams} from "react-router-dom"
import {SortOption, TASK_PRIORITIES, TASK_STATUSES, TaskPriority, TaskStatus} from "../../../types/task"
import CheckBoxStatus from "../../../ui/checkbox/CheckBoxStatus"
import DateInput from "../../../ui/input/DateInput"
import CustomSelect, {sortOptions} from "../../../ui/select/CustomSelect"
import AssignMembers from "../../asignMembers/AssignMembers"
import {useProjectControlStore} from "../../../store/projectControlStore"
import styles from "./ProjectFilters.module.css";
import React, {useCallback, useEffect, useMemo, useState} from "react"
import {useProjectUsers} from "../../../hooks/project/useProjectUsers"
import {useProject} from "../../../hooks/project/useProject"
import {UserProfile} from "../../../types/user.ts";
import {useShallow} from "zustand/react/shallow";
import Title from "../../../ui/title/Title.tsx";
import MemberSelector from "../../../ui/memberSelector/MemberSelector.tsx";
import TextInput from "../../../ui/input/TextInput.tsx";
import FormSelect from "../../../ui/select/FormSelect.tsx";
import {ProjectStatus} from "../../../types/project.ts";

const ProjectFilters: React.FC = () => {
    const { projectId } = useParams();
    const { data: project } = useProject(projectId || '');
    const { data: projectMembers} = useProjectUsers(project?.assignedMembers || []);
    const {
        statusFilter, setStatusFilter,
        startDateFilter, setStartDateFilter,
        endDateFilter, setEndDateFilter,
        priorityFilter, setPriorityFilter,
        sortValue, setSortValue,
        setUserFilter, setUsersFilter,
        searchTermFilter, setSearchTermFilter
    } = useProjectControlStore(useShallow((state) => ({
        statusFilter: state.statusFilter, setStatusFilter: state.setStatusFilter,
        startDateFilter: state.startDateFilter, setStartDateFilter: state.setStartDateFilter,
        endDateFilter: state.endDateFilter, setEndDateFilter: state.setEndDateFilter,
        priorityFilter: state.priorityFilter, setPriorityFilter: state.setPriorityFilter,
        sortValue: state.sortValue, setSortValue: state.setSortValue,
        setUserFilter: state.setUserFilter, setUsersFilter: state.setUsersFilter,
        searchTermFilter: state.searchTermFilter, setSearchTermFilter: state.setSearchTermFilter
    })));
    const [addMembersActive, setAddMembersActive] = useState<boolean>(false);
    const [localAssignedMembersIds, setLocalAssignedMembersIds] = useState<string[]>([]);

    useEffect(() => {
        if (projectMembers && projectMembers.length > 0) {
            setLocalAssignedMembersIds(projectMembers.map(m => m.uid));
            setUsersFilter(projectMembers);
        }
    }, [projectMembers, setUsersFilter]);

    const handleMemberClick = useCallback((member: UserProfile) => {
        setUserFilter(member);
        setLocalAssignedMembersIds((prev) => prev.includes(member.uid)
            ? prev.filter((mId) => mId !== member.uid)
            : [...prev, member.uid]
        );
    }, [setUserFilter, setLocalAssignedMembersIds]);

    const projectMembersMap = useMemo<Map<string, UserProfile>>(() => (
        new Map(projectMembers
            ? projectMembers.map(m => [m.uid, m])
            : []
        )
    ), [projectMembers]);

    return(
        <div className={styles.filterSortPanel}>
            <Title text={'Status'}/>
            <div className={styles.checkboxBlock}>
                {TASK_STATUSES.map((status) => (
                    <CheckBoxStatus<TaskStatus>
                        status={status}
                        checked={statusFilter.includes(status)}
                        setStatusFilter={setStatusFilter}
                        key={status}
                    />
                ))}
            </div>
            <Title text={'Priority'}/>
            <div className={styles.checkboxBlock}>
                {TASK_PRIORITIES.map((priority) => (
                    <CheckBoxStatus<TaskPriority>
                        status={priority}
                        checked={priorityFilter.includes(priority)}
                        setStatusFilter={setPriorityFilter}
                        key={priority}
                    />
                ))}
            </div>
            <Title text={'Assigned members'}/>
            <AssignMembers
                assignedMembers={projectMembers || []}
                onSelectMembersActive={() => setAddMembersActive(!addMembersActive)}
                uniqueText={"Select members"} maxIcons={3} iconSize={28}
            />
            {addMembersActive && (
                <MemberSelector membersMap={projectMembersMap} selectedMembersIds={localAssignedMembersIds || []} clickAction={handleMemberClick}/>
            )}
            <Title text={'From'}/>
            <DateInput value={startDateFilter} onChange={setStartDateFilter}/>
            <Title text={'To'}/>
            <DateInput value={endDateFilter} onChange={setEndDateFilter}/>
            <Title text={'Sort by'}/>
            <CustomSelect value={sortValue} onChange={setSortValue} options={sortOptions}/>
            <Title text={'Search'}/>
            <TextInput name={'search'} value={searchTermFilter} onChange={setSearchTermFilter}/>
        </div>
    );
};
export default ProjectFilters;