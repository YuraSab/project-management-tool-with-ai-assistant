import {useParams} from "react-router-dom"
import {
    TASK_CATEGORIES,
    TASK_PRIORITIES,
    TASK_STATUSES,
    TASK_TYPES,
    TaskPriority,
    TaskStatus
} from "../../../types/task"
import CheckBoxStatus from "../../../ui/checkbox/CheckBoxStatus"
import DateInput from "../../../ui/input/DateInput"
import CustomSelect, {sortOptions} from "../../../ui/select/CustomSelect"
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
import NoStatusCheckBox from "../../../ui/checkbox/NoStatusCheckBox.tsx";
import AssignMembersFilter from "../../asignMembers/AssignMembersFilter.tsx";
import CustomMultiSelector from "../../../ui/customMultiSelector/CustomMultiSelector.tsx";
import SelectorBlock from "../../../ui/selectorBlock/SelectorBlock.tsx";
import CustomButton from "../../../ui/button/CustomButton.tsx";
import {toast} from "../../../utils/toaster.ts";

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
            <NoStatusCheckBox text={'No priority'} checked={showNoPriorityTasks} onChange={setShowNoPriorityTasks} customStyles={{ marginTop: 14 }}/>
            <Title text={'Assigned members'}/>
            <AssignMembersFilter
                projectAssignedMembers={projectMembers || []}
                localAssignedMembersIds={localAssignedMembersIds}
                onSelectMembersActive={() => setAddMembersActive(!addMembersActive)}
                uniqueText={"Select members"} maxIcons={3} iconSize={28}
            />
            {addMembersActive && (
                <MemberSelector membersMap={projectMembersMap} selectedMembersIds={localAssignedMembersIds || []} clickAction={handleMemberClick}/>
            )}
            <NoStatusCheckBox text={'Unassigned'} checked={showUnassignedTasks} onChange={setShowUnassignedTasks} customStyles={{ marginTop: 14 }}/>
            <Title text={'Types'}/>
            <SelectorBlock children={'Types'} onSelectorActive={() => setTaskTypesActive((prev) => !prev)}/>
            {taskTypesActive && (
                <CustomMultiSelector options={TASK_TYPES} selectedOptions={typesFilter} onChange={setTypesFilter}/>
            )}
            <Title text={'Categories'}/>
            <SelectorBlock children={'Categories'} onSelectorActive={() => setTaskCategoriesActive((prev) => !prev)}/>
            {taskCategoriesActive && (
                <CustomMultiSelector options={TASK_CATEGORIES} selectпгdOptions={categoriesFilter} onChange={setCategoriesFilter}/>
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
            <NoStatusCheckBox text={'Task counter'} checked={showTaskCounter} onChange={setShowTaskCounter} customStyles={{ marginTop: 8 }}/>
            <NoStatusCheckBox text={'AI Chat'} checked={showAIChat} onChange={setShowAIChat} customStyles={{ marginTop: 8 }}/>
            <CustomButton children={"Clear filters"} onClick={handleClearFilters} customStyles={{ margin: '12px 0' }}/>
        </div>
    );
};
export default ProjectFilters;