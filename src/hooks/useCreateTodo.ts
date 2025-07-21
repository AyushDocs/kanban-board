import { Todo, TodoSchema } from '@/types/Todo';
import { useSession } from 'next-auth/react';
import { useState, useCallback, FormEvent } from 'react';

const useCreateTodo = () => {
    const {data}=useSession()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createdTodo, setCreatedTodo] = useState<Todo[][] | null>(null);

    const createTodo = useCallback(async (e:FormEvent) => {
        e.preventDefault()
        setLoading(true);
        setError(null);
        setCreatedTodo(null);
        const formData = new FormData(e.target as HTMLFormElement);
        if (!data || !data.user || !data.user.email) {
            setLoading(false)
            setError('user not logged in')
            return;
        }
        const requestBody = {
            id:0,
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            userEmail: data?.user?.email,
            status: formData.get("status") as string,
            priority: formData.get("priority") as string,
            dueDate: formData.get("dueDate") as string,
        };
        let todo:Todo|undefined;
        try {
            todo = TodoSchema.parse(requestBody);
        } catch (error) {
            setError(JSON.stringify(error))
            setLoading(false)
            return;
        }
        try {
            const res = await fetch('/api/todo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todo),
            });
            if (!res.ok) {
                setLoading(false)
                setError(await res.text())
            }
            const data = await res.json();
            setCreatedTodo(data);
            setLoading(false)
            return data;
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Unknown error');
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, [data]);

    return { createTodo, loading, error, createdTodo };
};

export default useCreateTodo;
