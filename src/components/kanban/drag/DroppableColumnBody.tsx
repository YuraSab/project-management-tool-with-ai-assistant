import { Droppable } from '@hello-pangea/dnd';
import { ReactNode } from 'react';
import styles from '../kanbanBoard/KanbanBoard.module.css';

type DroppableColumnBodyProps = {
  droppableId: string;
  children: ReactNode;
};

export const DroppableColumnBody = ({ droppableId, children }: DroppableColumnBodyProps) => (
  <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
            className={styles.statusColumn}
          // style={{
          //   width: "100%",
          //   display: "flex",
          //   flexDirection: "column",
          //   flex: "1 1 auto",
          //   minHeight: 0
          // }}
        >
          {children}
          {provided.placeholder}
        </div>
      )}
  </Droppable>
);
