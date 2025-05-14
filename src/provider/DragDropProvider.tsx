"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { ReactNode } from "react";

export type ColumnType = {
    columnName: string;
    todo: {
        id: string;
        title: string;
        description: string;
    }[];
};

export const DragDropProvider = ({
    children,
    columns,
    setColumns,
}: {
    children: ReactNode;
    setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
    columns: ColumnType[];
}) => {
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const sourceColumn = columns.find((column) =>
            column.todo.some((todo) => todo.id === active.id)
        );
        const endColumn = columns.find((column) => column.columnName === over.id);

        if (!sourceColumn || !endColumn) return;

        if (sourceColumn.columnName !== endColumn.columnName) {
            setColumns((prev) => {
                const newColumns = prev.map((column) => {
                    if (column.columnName === sourceColumn.columnName) {
                        const updatedTodos = column.todo.filter(
                            (todo) => todo.id !== active.id
                        );
                        return { ...column, todo: updatedTodos };
                    } else if (column.columnName === endColumn.columnName) {
                        const movedTodo = sourceColumn.todo.find(
                            (todo) => todo.id === active.id
                        );
                        return { ...column, todo: [...column.todo, movedTodo!] };
                    }
                    return column;
                });
                return newColumns;
            });
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
            {children}
        </DndContext>
    );
};
