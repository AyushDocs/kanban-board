// app/actions/updateTodo.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function updateTodoDueDate(id: string, dueDate: string) {
    try {
        const res = await fetch('http://localhost:3000/api/todo', {
            method: 'PUT',
            body: JSON.stringify({ id, dueDate:new Date(dueDate) }),
        });

        if (!res.ok) throw new Error('Failed to update todo');

        revalidatePath('/home');

        return { success: true };
    } catch (error) {
        console.log(error)
        return { success: false, error: 'Update failed' };
    }
}