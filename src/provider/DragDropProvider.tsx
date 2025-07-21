"use client";

import { updateTodoDueDate } from "@/app/actions/updateTodoDueDate";
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

export const DragDropProvider: FC<PropsWithChildren<{ todos: Todo[][] }>> =({
    todos,
}) => {
    const [Todos, setTodos] = useState(todos);
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        //if still dragging , return
        if (!over) return;
        console.log('inside drag function')
        let sourceColumn:number=-1,sourceRow:number=-1;
        for(let i=0;i<Todos.length;i++)
            for(let j=0;j<Todos[i].length;j++)
                if(Todos[i][j].id==active.id){
                    sourceColumn=i;
                    sourceRow=j;
                    break;
                }
        let endColumn: number = -1, endRow: number = 0;
        console.log(over)
        for(let i=0;i<Todos.length;i++)
            if(Todos[i][0].dueDate==over.id){
                endColumn=i;
                break;
            }
        const targetContainer = document.getElementById(over.id as string);
        if (!targetContainer) return;
        const rect = targetContainer.getBoundingClientRect();
        const todoItems = Array.from(targetContainer.children) as HTMLElement[];
        if (todoItems.length === 0) 
            endRow = 0;
        else {
            // Get Y position of the drop
            const dropY = over.rect?.top ?? rect.top + rect.height / 2;

            // Loop through each todo item to find where to insert
            for (let i = 0; i < todoItems.length; i++) {
                const itemRect = todoItems[i].getBoundingClientRect();
                const itemCenterY = itemRect.top + itemRect.height / 2;

                // If drop point is below center of current item, continue
                if (dropY > itemCenterY) {
                    endRow = i + 1; // Insert after this item
                } else {
                    break; // Found insertion point
                }
            }
        }
        console.log(sourceColumn,endColumn,sourceRow,endRow)
        if (sourceColumn==-1 || endColumn==-1 || endRow==-1 || endColumn==-1) return;
        if (sourceColumn==endColumn) return;

        // Optimistic update: Move the todo immediately
        const movedTodo = Todos[sourceColumn][sourceRow];
        const newTodos = Todos.map(col => [...col]);
        newTodos[sourceColumn].splice(sourceRow, 1);
        newTodos[endColumn].splice(endRow, 0, movedTodo);

        setTodos(newTodos);
        updateTodoDueDate(Todos[sourceColumn][sourceRow].id, Todos[endColumn][0].dueDate)
        .then(result => {
            if (!result.success) {
              // Rollback on failure
                setTodos(prev => {
                    const rollback = prev.map(col => [...col]);
                    rollback[sourceColumn].splice(sourceRow, 0, movedTodo);
                    rollback[endColumn].splice(endRow, 1);
                    return rollback;
                });
            }
        })
        .catch(error => {
            console.error('Update failed:', error);
            setTodos(prev => {
                const rollback = prev.map(col => [...col]);
                rollback[sourceColumn].splice(sourceRow, 0, movedTodo);
                rollback[endColumn].splice(endRow, 1);
                return rollback;
            });
        })
        
    };

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
        >
            {Todos.map((todos, index) => (
                <Column
                    todos={todos}
                    key={index}
                    id={todos.length>0 ? todos[0].dueDate.toString():"" }
                />
            ))}
        </DndContext>
    );
};
