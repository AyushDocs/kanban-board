"use client"
import React, { FC,memo } from "react";
import styl from "../styles/Columns.module.css";
import WorkTile from "./WorkTile";
import { useDroppable } from "@dnd-kit/core";
import { Todo } from "@/types/Todo";

interface ColumnProps {
    id: string;
    todos: Todo[];
}

const Column:FC<ColumnProps> = ({ id,todos }) => {
    const { setNodeRef, isOver } = useDroppable({ id });
    const style = {
        background: isOver ? "hsl(180.03deg 2.2% 27.32%)" : "hsl(180.03deg 2.2% 17.32%)",
    };

    return (
        <div id={id} ref={setNodeRef} style={style} className={styl.column}>
            {todos.length==0 ? 
            <div className="placeholder">Drop tasks here</div>
            :todos.map((todo) => (
                <WorkTile key={todo.id} todo={todo} />
            ))}
        </div>
    );
};

export default memo(Column);


