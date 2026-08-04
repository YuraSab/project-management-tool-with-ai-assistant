import React, { ReactNode } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import styles from '../kanbanBoard/KanbanBoard.module.css';

type DroppableColumnBodyProps = {
    droppableId: string,
    children: ReactNode,
};

export const DroppableColumnBody: React.FC<DroppableColumnBodyProps> = ({ droppableId, children }) => (
    <Droppable droppableId={droppableId}>
        {(provided) => (
            <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={styles.statusColumn}
            >
                {children}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
);
