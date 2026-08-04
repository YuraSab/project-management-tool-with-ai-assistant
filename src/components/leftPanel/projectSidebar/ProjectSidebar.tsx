import React, { lazy, Suspense } from "react";
import { AlignJustify, Settings } from "lucide-react";
import { Role } from "../../../types/user";
import { useProjectControlStore } from "../../../store/projectControlStore";
import { useProfileStore } from "../../../store/profileStore";
import styles from "./ProjectSidebar.module.css";

const LeftPanelInfoBlock = lazy(() => import("../projectFilters/ProjectFilters"));
const LeftPanelSettings = lazy(() => import("../projectSettings/ProjectSettings"));

const ProjectSidebar: React.FC = () => {
    const profile = useProfileStore((state) => state.profile);
    const setIsLeftPanelActive = useProjectControlStore((state) => state.setIsLeftPanelActive);
    const isProjectSettingsActive = useProjectControlStore((state) => state.isProjectSettingsActive);
    const setIsProjectSettingsActive = useProjectControlStore((state) => state.setIsProjectSettingsActive);

    return (
        <aside className={styles.main} style={{backgroundColor: profile?.theme}}>
            <nav className={styles.navigation}>
                <button
                    className={styles.iconBtn}
                    onClick={() => setIsLeftPanelActive(false)}
                    type={"button"}
                >
                    <AlignJustify size={28}/>
                </button>
                {profile?.role !== Role.Member && (
                    <button
                        className={styles.iconBtn}
                        onClick={setIsProjectSettingsActive}
                        type={"button"}
                    >
                        <Settings size={28}/>
                    </button>
                )}
            </nav>
            <div className={`${styles.contentArea} hideScrollbar`}>
                <Suspense fallback={null}>
                    {isProjectSettingsActive ? <LeftPanelSettings/> : <LeftPanelInfoBlock/>}
                </Suspense>
            </div>
        </aside>
    );
};

export default ProjectSidebar;