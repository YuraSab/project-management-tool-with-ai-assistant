import React, {memo} from "react";
import {Draggable} from '@hello-pangea/dnd';
import {Task} from '../../../types/task';
import KanbanCard from '../kanbanCard/KanbanCard';

type KanbanDraggableCardProps = {
    task: Task;
    index: number;
    handleOnTaskClick: (task: Task) => void;
};

const KanbanDraggableCard: React.FC<KanbanDraggableCardProps> = ({task, index, handleOnTaskClick}) => (
    <Draggable draggableId={task.id.toString()} index={index}>
        {(provided) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={"w-full"}
            >
                <KanbanCard task={task} handleOnTaskClick={handleOnTaskClick}/>
            </div>
        )}
    </Draggable>
);

KanbanDraggableCard.displayName = "KanbanDraggableCard";

export default memo(KanbanDraggableCard);