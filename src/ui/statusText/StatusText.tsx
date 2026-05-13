import { ProjectStatus } from "../../types/project";
import { TaskPriority, TaskStatus } from "../../types/task";
import styles from "./StatusText.module.css";

// todo - divide for status and priority
interface StatusTextProps {
    status: TaskStatus | ProjectStatus | TaskPriority
}
const statusLabels: { [key in TaskStatus | ProjectStatus | TaskPriority ]: string } = {
    todo: "Todo",
    in_progress: "In progress",
    done: "Done",
    planned: "Planned",
    completed: "Completed",
    low: "Low",
    medium: "Medium",
    high: "High",
    none: "None",
}
const statusClasses: { [key in TaskStatus | ProjectStatus | TaskPriority]: string } = {
    todo: styles.blue,
    planned: styles.blue,
    in_progress: styles.yellow,
    completed: styles.green,
    done: styles.green,
    low: styles.green,
    medium: styles.yellow,
    high: styles.red,
    none: styles.gray,
}

const StatusText = ({ status }: StatusTextProps) => {
    return(
        <span className={`${styles.textBlock} ${statusClasses[status]}`}>
            {statusLabels[status]}
        </span>
    )
}

export default StatusText;