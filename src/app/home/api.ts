import { z } from "zod";
import { Todo, TodoSchema } from "@/types/Todo";

interface FetchTodosParams {
    email: string;
    start?: number;
}

export const fetchTodos = async ({ email, start = 0 }: FetchTodosParams): Promise<Todo[][]> => {
    const params = new URLSearchParams({
        email,
        start: start.toString(),
        window: '5',
    });

    try {
        const res = await fetch(`http://localhost:3000/api/todo?${params.toString()}`, {
            cache: "no-store",
        });
        if (!res.ok) {
            console.log('error')
            throw new Error("Failed to fetch todos");
        }
        const data = await res.json();
        return z.array(z.array(TodoSchema)).parse(data.todos);
    } catch (err) {
        console.log('error fetching todododo')
        console.log(err)
        throw new Error("Fetching todos failed", { cause: err });
    }
};

type CreateTodoParams = {
    title: string;
    description: string;
    userEmail: string;
    status: string;
    priority: string;
    dueDate: string;
}
export const createTodo = async (data: CreateTodoParams) => {
    let todo: Todo | undefined;
    try {
        todo = TodoSchema.parse(data);
    } catch (error) {
        console.error("todo schema is not proper");
        console.error(error);
        return;
    }
    try {
        const res = await fetch('/api/todo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo),
        });
        if (!res.ok) {
            console.error("error while creating todo: " + data.title)
            return;
        }
        const parsedData = await res.json();
        return parsedData;
    } catch (err) {
        console.error("error while creating todo [api failure]: " + data.title)
        console.error(err)
        return;
    }
};

type UpdateTodoParams = {
    todo: Partial<Todo>;
    id: string | number;
}
export const updateTodo = async ({ todo, id }: UpdateTodoParams) => {
    try {
        const res = await fetch('/api/todo', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...todo, id }),
        });
        if (!res.ok) {
            console.error('Failed to update todo'); 
            return;
        }
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("error while creating todo [api failure]: " + todo.title)
        console.error(err)
        return;
    }
};

