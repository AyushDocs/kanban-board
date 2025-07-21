import { Todo } from '@/types/Todo';
import { useState, useCallback } from 'react';

const useUpdateTodo = () => {
    const [Loading, setLoading] = useState(false);
    const [ErrorDetails, setErrorDetails] = useState<string | null>(null);
    const [updatedTodo, setUpdatedTodo] = useState<Todo | null>(null);
    const updateTodo = useCallback(async (todo: Partial<Todo> & { id: number | string }) => {
        setLoading(true);
        setErrorDetails(null);
        setUpdatedTodo(null);
        try {
            const res = await fetch('/api/todo', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todo),
            });
            if (!res.ok) throw new Error('Failed to update todo');
            const data = await res.json();
            setUpdatedTodo(data);
            return data;
        } catch (err) {
            if (err instanceof Error) {
                setErrorDetails(err.message);
            } else {
                setErrorDetails('Unknown error');
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateTodo, Loading, ErrorDetails, updatedTodo };
};

export default useUpdateTodo;
