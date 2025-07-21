// hooks/fetchTodos.ts
import { z } from "zod";
import { Todo, TodoSchema } from "@/types/Todo";

interface FetchTodosParams {
    email: string;
    start?: number;
}

export const fetchTodos = async ({
    email,
    start = 0
}: FetchTodosParams): Promise<Todo[][]> => {
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
            throw new Error("Failed to fetch todos");}
        const data = await res.json();
        return z.array(z.array(TodoSchema)).parse(data.todos);
    } catch (err) {
        console.log('error fetching todododo')
        console.log(err)
        throw new Error("Fetching todos failed", { cause: err });
    }
};

