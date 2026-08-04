import React, {useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { HighlightColor } from "../../types/user";
import { Project } from "../../types/project";
import { useProfileStore } from "../../store/profileStore";
import { useProjectControlStore } from "../../store/projectControlStore";
import styles from "./ProjectCard.module.css";

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
    const highlightColor = useProfileStore((state) => state.profile?.highlightColor);
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
            className={({ isActive }) =>
                `${styles.element} ${styles[activeTheme]} ${isActive ? styles.active : ''}`
            }
        >
            <h3>{project.title}</h3>
            <p>{project.description}</p>
        </NavLink>
    );
});

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;