import {useParams} from "react-router-dom";
import {useProjectControlStore} from "../../store/projectControlStore";
import {AlignJustify, Plus} from "lucide-react";
import LeftPanelProject from "../../components/leftPanel/projectSidebar/ProjectSidebar.tsx";
import KanbanBoard from "../../components/kanban/kanbanBoard/KanbanbBoard";
import RightPanelProject from "../../components/rightPanel/rightPanelProject/RightPanelProject";
import {useProject} from "../../hooks/project/useProject";
import {useAuthStore} from "../../store/authStore.ts";
import React, {useEffect, useMemo} from "react";
import Error from "../../components/error/Error.tsx";
import FAB from "../../ui/FAB/FAB.tsx";
import {useProfileStore} from "../../store/profileStore.ts";
import {useShallow} from "zustand/react/shallow";
import styles from './Project.module.css';
import GeminiIcon from "../../ui/icons/GeminiIcon.tsx";
import {useAIChatStore} from "../../store/aiChatStore.ts";
import {switchRightPanelView} from "../../utils/panelManager.ts";

const Project = () => {
    const { projectId } = useParams();
    const { data: currentProject, isPending: isLoadingProject } = useProject(projectId || "");

    const user = useAuthStore((state) => state.user);
    const setSelectedProject = useProjectControlStore((state) => state.setSelectedProject);
    const isAIChatOpened  = useAIChatStore((state) => state.isAIChatOpened);
    const theme = useProfileStore((state) => state.profile.theme);
    const {
        selectedTask,
        isRightPanelActive, setIsLeftPanelActive,
        isLeftPanelActive,
        isAddTaskActive,
        showAIChat,
    } = useProjectControlStore(useShallow((state) => ({
        selectedTask: state.selectedTask,
        isRightPanelActive: state.isRightPanelActive, setIsLeftPanelActive: state.setIsLeftPanelActive,
        isLeftPanelActive: state.isLeftPanelActive,
        isAddTaskActive: state.isAddTaskActive,
        showAIChat: state.showAIChat,
    })));

    const canAccess = useMemo(() =>
        user && currentProject?.assignedMembers.includes(user.uid)
    , [user, currentProject]);

    useEffect(() => {
        setSelectedProject(currentProject || null)
    }, [currentProject, setSelectedProject]);

    if ( !isLoadingProject && !canAccess ) return <Error type={'no_access'}/>;

    return (
        <div className={styles.main}>
            {
                isLeftPanelActive && !isLoadingProject
                    ? <LeftPanelProject/>
                    : (
                        <div onClick={() => setIsLeftPanelActive(true)} className={styles.burgerMenu}>
                            <AlignJustify size={28}/>
                        </div>
                    )
            }
            <KanbanBoard projectId={projectId}/>
            { isRightPanelActive && (isRightPanelActive || !isLoadingProject && (isAddTaskActive || selectedTask !== null)) && (
                <RightPanelProject/>
            )}
            <FAB style={{ visibility: showAIChat ? 'visible' : 'hidden', right: isRightPanelActive ? (isAIChatOpened ? 436 : 376) : 36, bottom: 100 }} type={'hollow'} onClick={() => switchRightPanelView(isAIChatOpened ? 'closeAll' : 'aiChat')}><GeminiIcon size={32}/></FAB>
            <FAB style={{ right: isRightPanelActive ? (isAIChatOpened ? 436 : 376) : 36 }} onClick={() => switchRightPanelView(isAddTaskActive ? 'closeAll' : 'addTask')}><Plus size={36} color={theme}/></FAB>
        </div>
    );
};

export default Project;