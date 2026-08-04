import React, {useCallback, useEffect, useMemo, useState} from "react"
import { useParams } from "react-router-dom"
import { useShallow } from "zustand/react/shallow";
import { UserProfile } from "../../../types/user";
import {
    TASK_CATEGORIES,
    TASK_PRIORITIES,
    TASK_STATUSES,
    TASK_TYPES, TaskCategory,
    TaskPriority,
    TaskStatus,
    TaskType
} from "../../../types/task"
import { toast } from "../../../utils/toaster";
import { useProject } from "../../../hooks/project/useProject"
import { useProjectUsers } from "../../../hooks/project/useProjectUsers"
import { useProjectControlStore } from "../../../store/projectControlStore"
import Title from "../../../ui/title/Title";
import TextInput from "../../../ui/input/TextInput";
import DateInput from "../../../ui/input/DateInput"
import CustomSelect, { sortOptions } from "../../../ui/select/CustomSelect"
import CustomMultiSelector from "../../../ui/customMultiSelector/CustomMultiSelector";
import CheckBoxStatus from "../../../ui/checkbox/CheckBoxStatus"
import NoStatusCheckBox from "../../../ui/checkbox/NoStatusCheckBox";
import CustomButton from "../../../ui/button/CustomButton";
import MemberSelector from "../../../ui/memberSelector/MemberSelector";
import SelectorBlock from "../../../ui/selectorBlock/SelectorBlock";
import AssignMembersFilter from "../../asignMembers/AssignMembersFilter";
import styles from "./ProjectFilters.module.css";

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
        searchTermFilter, setSearchTermFilter,
        setIsInitialLoad,
        showUnassignedTasks, setShowUnassignedTasks,
        showNoPriorityTasks, setShowNoPriorityTasks,
        showTaskCounter, setShowTaskCounter,
        typesFilter, setTypesFilter,
        categoriesFilter, setCategoriesFilter,
        clearFiltersAndSorts,
        showAIChat, setShowAIChat
    } = useProjectControlStore(useShallow((state) => ({
        statusFilter: state.statusFilter, setStatusFilter: state.setStatusFilter,
        startDateFilter: state.startDateFilter, setStartDateFilter: state.setStartDateFilter,
        endDateFilter: state.endDateFilter, setEndDateFilter: state.setEndDateFilter,
        priorityFilter: state.priorityFilter, setPriorityFilter: state.setPriorityFilter,
        sortValue: state.sortValue, setSortValue: state.setSortValue,
        setUserFilter: state.setUserFilter, setUsersFilter: state.setUsersFilter,
        searchTermFilter: state.searchTermFilter, setSearchTermFilter: state.setSearchTermFilter,
        setIsInitialLoad: state.setIsInitialLoad,
        showUnassignedTasks: state.showUnassignedTasks, setShowUnassignedTasks: state.setShowUnassignedTasks,
        showNoPriorityTasks: state.showNoPriorityTasks, setShowNoPriorityTasks: state.setShowNoPriorityTasks,
        showTaskCounter: state.showTaskCounter, setShowTaskCounter: state.setShowTaskCounter,
        typesFilter: state.typesFilter, setTypesFilter: state.setTypesFilter,
        categoriesFilter: state.categoriesFilter, setCategoriesFilter: state.setCategoriesFilter,
        clearFiltersAndSorts: state.clearFiltersAndSorts,
        showAIChat: state.showAIChat, setShowAIChat: state.setShowAIChat,
    })));
    const [addMembersActive, setAddMembersActive] = useState<boolean>(false);
    const [localAssignedMembersIds, setLocalAssignedMembersIds] = useState<string[]>([]);
    const [taskTypesActive, setTaskTypesActive] = useState<boolean>(false);
    const [taskCategoriesActive, setTaskCategoriesActive] = useState<boolean>(false);

    useEffect(() => {
        if (projectMembers && projectMembers.length > 0) {
            setLocalAssignedMembersIds(projectMembers.map(m => m.uid));
            setUsersFilter(projectMembers);
            setIsInitialLoad(false);
        }
    }, [projectMembers, setUsersFilter, setIsInitialLoad]);

    const handleMemberClick = useCallback((member: UserProfile) => {
        setUserFilter(member);
        setLocalAssignedMembersIds((prev) => prev.includes(member.uid)
            ? prev.filter((mId) => mId !== member.uid)
            : [...prev, member.uid]
        );
    }, [setUserFilter, setLocalAssignedMembersIds]);

    const handleClearFilters = useCallback(() => {
        if (!projectMembers) return ;
        clearFiltersAndSorts();
        setLocalAssignedMembersIds(projectMembers.map(m => m.uid));
        setUsersFilter(projectMembers);
        toast.info('Filters cleared')
    }, [clearFiltersAndSorts, setUsersFilter, projectMembers]);

    const projectMembersMap = useMemo<Map<string, UserProfile>>(() => (
        new Map(projectMembers
            ? projectMembers.map(m => [m.uid, m])
            : []
        )
    ), [projectMembers]);

    return (
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
            <NoStatusCheckBox text={'No priority'} checked={showNoPriorityTasks} onChange={setShowNoPriorityTasks} style={{ marginTop: 14 }}/>
            <Title text={'Assigned members'}/>
            <AssignMembersFilter
                projectAssignedMembers={projectMembers || []}
                localAssignedMembersIds={localAssignedMembersIds}
                onSelectMembersActive={() => setAddMembersActive(!addMembersActive)}
                uniqueText={"Select members"} maxIcons={2} iconSize={28}
            />
            {addMembersActive && (
                <MemberSelector membersMap={projectMembersMap} selectedMembersIds={localAssignedMembersIds || []} clickAction={handleMemberClick}/>
            )}
            <NoStatusCheckBox text={'Unassigned'} checked={showUnassignedTasks} onChange={setShowUnassignedTasks} style={{ marginTop: 14 }}/>
            <Title text={'Types'}/>
            <SelectorBlock children={'Types'} onSelectorActive={() => setTaskTypesActive((prev) => !prev)}/>
            {taskTypesActive && (
                <CustomMultiSelector options={TASK_TYPES} selectedOptions={typesFilter} onChange={(value) => setTypesFilter(value as TaskType)}/>
            )}
            <Title text={'Categories'}/>
            <SelectorBlock children={'Categories'} onSelectorActive={() => setTaskCategoriesActive((prev) => !prev)}/>
            {taskCategoriesActive && (
                <CustomMultiSelector options={TASK_CATEGORIES} selectedOptions={categoriesFilter} onChange={(value) => setCategoriesFilter(value as TaskCategory)}/>
            )}
            <Title text={'From'}/>
            <DateInput value={startDateFilter} onChange={setStartDateFilter}/>
            <Title text={'To'}/>
            <DateInput value={endDateFilter} onChange={setEndDateFilter}/>
            <Title text={'Sort by'}/>
            <CustomSelect value={sortValue} onChange={setSortValue} options={sortOptions}/>
            <Title text={'Search'}/>
            <TextInput name={'search'} value={searchTermFilter} onChange={setSearchTermFilter}/>
            <Title text={'Utilities'}/>
            <NoStatusCheckBox text={'Task counter'} checked={showTaskCounter} onChange={setShowTaskCounter} style={{ marginTop: 8 }}/>
            <NoStatusCheckBox text={'AI Chat'} checked={showAIChat} onChange={setShowAIChat} style={{ marginTop: 8 }}/>
            <CustomButton children={"Clear filters"} onClick={handleClearFilters} style={{ margin: '12px 0' }}/>
        </div>
    );
};
export default ProjectFilters;