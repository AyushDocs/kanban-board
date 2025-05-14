import React from "react";
import styl from "../styles/Columns.module.css";
import WorkTile from "./WorkTile";
import { useDroppable } from "@dnd-kit/core";

const Column = ({ id,todos }: { id: string,todos:{id:string;title:string;description:string}[] }) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    const style = {
        background: isOver ? "hsl(180.03deg 2.2% 27.32%)" : "hsl(180.03deg 2.2% 17.32%)",
    };

    return (
        <div ref={setNodeRef} style={style} className={styl.column}>
            {todos.length==0 ? 
            <div className="placeholder">Drop tasks here</div>
            :todos.map((todo) => (
                <WorkTile key={todo.id} id={todo.id} title={todo.title} />
            ))}
        </div>
    );
};

export default Column;
