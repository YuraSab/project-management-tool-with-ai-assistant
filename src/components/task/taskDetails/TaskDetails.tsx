import {useProjectControlStore} from "../../../store/projectControlStore";
import StatusText from "../../../ui/statusText/StatusText";
import styles from "./TaskDetails.module.css";

import {useCallback} from "react";
import {useProfileStore} from "../../../store/profileStore.ts";
import RightPanelHeader from "../../rightPanel/rightPanelHeader/RightPanelHeader.tsx";
import {formatDateForInput} from '../../../utils/dateFormat.ts';
import UserIconCollection from "../../usersIconsCollection/UsersIconsCollection.tsx";
import {useProjectUsers} from "../../../hooks/project/useProjectUsers.ts";
import Title from "../../../ui/title/Title.tsx";

const TaskDetails = () => {
    const selectedTask = useProjectControlStore((state) => state.selectedTask);
    const setIsRightPanelActive = useProjectControlStore((state) => state.setIsRightPanelActive);
    const setIsEditTaskActive = useProjectControlStore((state) => state.setIsEditTaskActive);
    const setIsAddTaskActive = useProjectControlStore((state) => state.setIsAddTaskActive);
    // const backgroundMode = useUserThemeStore((state) => state.backgroundMode);
    const theme = useProfileStore((state) => state.profile?.theme)
    // const { data: assignedTaskUsers } = useTaskUsers(selectedTask?.assignedMembers || []);
    // const { data: usersThemes } = useUsersThemes(selectedTask?.assignedMembers || []);

    const { data: assignedUsers } = useProjectUsers(selectedTask?.assignedMembers || []);

    const handleEditOpen = useCallback(() => {
        setIsAddTaskActive(false);
        setIsEditTaskActive(true);
    }, [setIsAddTaskActive, setIsEditTaskActive]);

    if (!selectedTask) return null;

    const startDate = formatDateForInput(selectedTask.startDate);
    const endDate = formatDateForInput(selectedTask.endDate);

    return(
        <div className={styles.main} style={{backgroundColor: theme}}>
            <RightPanelHeader taskTitle={selectedTask.title} setIsEditTaskActive={handleEditOpen} setIsRightPanelActive={setIsRightPanelActive}/>
            <Title text={'id:'}/>
            {selectedTask.id}
            <Title text={'Description:'}/>
            {selectedTask.description}
            <Title text={'Status:'}/>
            <StatusText status={selectedTask.status}/>
            <Title text={'Start date:'}/>
            {startDate}
            <Title text={'End date:'}/>
            {endDate}
            <Title text={'Assigned members:'}/>
            <UserIconCollection
                users={assignedUsers || []}
                size={30} maxIcons={6}
            />
        </div>
    )
};

export default TaskDetails;