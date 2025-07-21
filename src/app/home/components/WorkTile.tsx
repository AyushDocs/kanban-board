"use client"
import React, { CSSProperties, FC,memo, useEffect, useState } from "react";
import styl from "../styles/WorkTile.module.css";
import { useDraggable } from "@dnd-kit/core";
import { Todo } from "@/types/Todo";

interface WorkTileProps {
    todo: Todo;
}

const WorkTile: FC<WorkTileProps> = ({ todo }) => {

    const { id, title, description, priority, status, dueDate } = todo;
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });

    const style: CSSProperties = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    };

    const [dueMessage, setDueMessage] = useState<string>("");

    useEffect(() => {
        // This runs only on the client
        const now = new Date();
        const due = new Date(dueDate);
        const diffDays = Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) setDueMessage("Due today");
        else if (diffDays === 1) setDueMessage("Due tomorrow");
        else if (diffDays < 0) setDueMessage(`Overdue by ${Math.abs(diffDays)} day(s)`);
        else setDueMessage(`Due: ${due.toLocaleDateString()}`);
    }, [dueDate]);


    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={styl.container}
            style={style}
            data-status={status}
            role="listitem"
            aria-label={`Task: ${title}, Priority: ${priority}, Status: ${status}`}
        >
            <div className={styl.title}>{title}</div>
            <div className={styl.description}>{description || "No description"}</div>
            <div className={styl.detailsRow}>
                <span className={styl.priority} data-priority={priority}>
                    Priority: <b>{priority}</b>
                </span>
            </div>
            <div className={styl.dueDate}>{dueMessage}</div>
        </div>
    );
};

export default memo(WorkTile);