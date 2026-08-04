import {useEffect, useMemo} from "react";
import { useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { AlignJustify, Plus, Settings } from "lucide-react";
import { switchRightPanelView } from "../../utils/panelManager";
import { useProject } from "../../hooks/project/useProject";
import { useAuthStore } from "../../store/authStore";
import { useProfileStore } from "../../store/profileStore";
import { useProjectControlStore } from "../../store/projectControlStore";
import { useAIChatStore } from "../../store/aiChatStore";
import FAB from "../../ui/FAB/FAB";
import GeminiIcon from "../../ui/icons/GeminiIcon";
import LeftPanelProject from "../../components/leftPanel/projectSidebar/ProjectSidebar";
import RightPanelProject from "../../components/rightPanel/rightPanelProject/RightPanelProject";
import KanbanBoard from "../../components/kanban/kanbanBoard/KanbanbBoard";
import Error from "../../components/error/Error";
import styles from './Project.module.css';

const Project = () => {
    const { projectId } = useParams();
    const { data: currentProject, isPending: isLoadingProject, isError } = useProject(projectId || "");

    const user = useAuthStore((state) => state.user);
    const theme = useProfileStore((state) => state.profile?.theme);
    const isAIChatOpened  = useAIChatStore((state) => state.isAIChatOpened);
    const {
        setSelectedProject,
        isRightPanelActive,
        isLeftPanelActive, setIsLeftPanelActive,
        isAddTaskActive,
        closePanels,
        showAIChat
    } = useProjectControlStore(useShallow((state) => ({
        setSelectedProject: state.setSelectedProject,
        isRightPanelActive: state.isRightPanelActive,
        isLeftPanelActive: state.isLeftPanelActive, setIsLeftPanelActive: state.setIsLeftPanelActive,
        isAddTaskActive: state.isAddTaskActive,
        closePanels: state.closePanels,
        showAIChat: state.showAIChat
    })));

    useEffect(() => {
        setSelectedProject(currentProject || null);
    }, [currentProject, setSelectedProject]);

    const canAccess = useMemo(() => {
        if (!user || !currentProject) return false;
        return currentProject.assignedMembers.includes(user.uid);
    }, [user, currentProject]);

    if (isLoadingProject) return null; // todo - loader
    if (isError || !canAccess) return <Error type={isError ? 'server_crash' : 'no_access'}/>;

    return (
        <div className={styles.main}>
            {(isLeftPanelActive || isRightPanelActive) && (
                <div className={styles.backdrop} onClick={closePanels}></div>
            )}
            {(isLeftPanelActive && !isLoadingProject ) ? (
                <LeftPanelProject/>
            ) : (
                <div onClick={() => setIsLeftPanelActive(true)} className={styles.burgerMenu}>
                    <AlignJustify size={28}/>
                </div>
            )}
            <KanbanBoard projectId={projectId}/>
            {isRightPanelActive && <RightPanelProject/>}
            <div className={`${styles.fabGroup} ${isRightPanelActive ? styles.panelOpen : ''} ${isAIChatOpened ? styles.aiChatOpen : ''}`}>
                <FAB style={{ position: "static" }} onClick={() => setIsLeftPanelActive(true)} className={styles.projectSettingsIcon}>
                    <Settings size={32} color={theme}/>
                </FAB>
                <FAB style={{ position: "static" }} onClick={() => switchRightPanelView(isAddTaskActive ? 'closeAll' : 'addTask')}>
                    <Plus size={36} color={theme}/>
                </FAB>
                {showAIChat && (
                    <FAB style={{ position: "static" }} onClick={() => switchRightPanelView(isAIChatOpened ? 'closeAll' : 'aiChat')} format={'hollow'}>
                        <GeminiIcon size={32}/>
                    </FAB>
                )}
            </div>
        </div>
    );
};

export default Project;