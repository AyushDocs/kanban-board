"use client";

import Column from "@/app/home/components/Column";
import { Todo } from "@/types/Todo";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { FC, PropsWithChildren, useState } from "react";

export type ColumnType = {
    columnName: string;
    todo: {
        id: string;
        title: string;
        description: string;
    }[];
};

export const DragDropProvider: FC<PropsWithChildren<{ todos: Todo[][] }>> = ({
    todos,
}) => {
    const [Todos, setTodos] = useState(todos);
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        
        const sourceColumn = Todos.find((column) =>
            column.some((todo) => todo.id === active.id)
        );
        // const endColumn = Todos.find((column) => column[0].dueDate === over.id);
        console.log(active,over)
        const endColumn=Todos[0]
        if (!sourceColumn || !endColumn) return;

        if (sourceColumn[0].dueDate !== endColumn[0].dueDate) {
            setTodos((prev) => {
                if (!prev) return prev;
                const newColumns = prev.map((column) => {
                    if (column[0].dueDate !== sourceColumn[0].dueDate) {
                        const updatedTodos = column.filter(
                            (todo) => todo.id !== active.id
                        );
                        return { ...column, todo: updatedTodos };
                    } else if (column[0].dueDate === endColumn[0].dueDate) {
                        const movedTodo = sourceColumn.find(
                            (todo) => todo.id === active.id
                        );
                        return { ...column, todo: [...column, movedTodo!] };
                    }
                    return column;
                });
                return newColumns;
            });
        }
    };

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
        >
            {todos.map((todos, index) => (
                <Column
                    todos={todos}
                    key={index}
                    id={todos[0].dueDate.toString()}
                />
            ))}
        </DndContext>
    );
};
