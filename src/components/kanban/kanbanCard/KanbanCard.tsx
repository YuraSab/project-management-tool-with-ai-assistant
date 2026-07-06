import { useProjectControlStore } from "../../../store/projectControlStore";
import { Task } from "../../../types/task";
import UserIconCollection from "../../usersIconsCollection/UsersIconsCollection";
import styles from "./Kanban.module.css";
import {useProfileStore} from "../../../store/profileStore.ts";
import {Theme} from "../../../types/user.ts";
import {useProjectUsers} from "../../../hooks/project/useProjectUsers.ts";

interface KanbanCardProps {
    task: Task,
    handleOnTaskClick: (task: Task) => void,
} 

const KanbanCard = ({ task, handleOnTaskClick }: KanbanCardProps) => {
    const { data: assignedMembersProfiles } = useProjectUsers(task.assignedMembers); // todo - make some hook for UserIconCollection and pass there ids only
    const isLeftPanelActive = useProjectControlStore((state) => state.isLeftPanelActive);
    const isRightPanelActive = useProjectControlStore((state) => state.isRightPanelActive);
    const theme = useProfileStore((state) => state.profile.theme);
    return (
        <div className={styles.cardMain  + " w-full"} onClick={() => handleOnTaskClick(task)} style={{backgroundColor: theme, color: theme === Theme.Black ? Theme.White : Theme.Black}} >
            <h3 className={`text-lg font-semibold ${styles.title}`}>{task.title}</h3>            
             <p className={`text-sm text-gray-600 ${styles.description}`}>
                {task.description}
            </p>
            { assignedMembersProfiles && <UserIconCollection size={(isLeftPanelActive && isRightPanelActive) ? 24 : 28} users={assignedMembersProfiles} fontSize={(isLeftPanelActive && isRightPanelActive) ? 16 : 18}/> }
        </div>
    );
};

export default KanbanCard;