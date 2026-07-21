import {NavLink} from "react-router-dom";
import styles from "./ProjectCard.module.css";
import {Project} from "../../types/project.ts";
import {useProjectControlStore} from "../../store/projectControlStore.ts";
import React, {useCallback} from "react";
import {useShallow} from "zustand/react/shallow";
import {useProfileStore} from "../../store/profileStore.ts";
import {HighlightColor} from "../../types/user.ts";

interface ProjectCardProps {
    project: Project
}

const ProjectCard = React.memo(({project}: ProjectCardProps) => {
    const {
        currentSelectedProjectId,  setSelectedProject,
        closePanels, clearFiltersAndSorts,
    } = useProjectControlStore(useShallow((state) => ({
        currentSelectedProjectId: state.selectedProject?.id, setSelectedProject: state.setSelectedProject,
        closePanels: state.closePanels, clearFiltersAndSorts: state.clearFiltersAndSorts,
    })));
    const highlightColor = useProfileStore((state) => state.profile.highlightColor);

    const activeTheme = highlightColor ?? HighlightColor.Purple;

    const handleSelect = useCallback(() => {
        if (project.id !== currentSelectedProjectId) {
            clearFiltersAndSorts();
            closePanels();
        }
        setSelectedProject(project);
    }, [project, currentSelectedProjectId, clearFiltersAndSorts, closePanels, setSelectedProject]);

    return (
        <NavLink
            to={`/projects/${project.id}`}
            onClick={handleSelect}
        >
            <div className={`${styles.element} ${styles[activeTheme]}`}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
            </div>
        </NavLink>
    );
});

export default ProjectCard;