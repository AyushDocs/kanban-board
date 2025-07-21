import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const start = parseInt(searchParams.get('start') || '0', 10);
        const windowSize = 5;
        if (!email)
            return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });

        const firstDate = new Date(Date.UTC(2025, 6, 21));
        const lastDate = new Date(Date.UTC(2025, 6, 21 + windowSize));

        const todos = await prisma.todo.findMany({
            where: {
                userEmail: email,
                dueDate: {
                    gte: firstDate,
                    lte: lastDate,
                },
            },
            orderBy: {
                dueDate: 'asc',
            },
        });

        // Group todos by date (YYYY-MM-DD)
        const grouped: Record<string, typeof todos> = {};

        for (const todo of todos) {
            if (!todo.dueDate) continue;

            const dateKey = todo.dueDate.toISOString().slice(0, 10); // YYYY-MM-DD
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(todo);
        }

        const todosByDate = Object.values(grouped);

        return NextResponse.json({
            todos: todosByDate,
            start,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch todos', details: error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { userEmail, title, description, dueDate } = data;
        if (!userEmail || !title || !dueDate) 
            return NextResponse.json({ error: 'Missing required fields' },{ status: 400 });
    
        const user = await prisma.user.findUnique({where: { email: userEmail }});
        if (!user) 
            return NextResponse.json({ error: 'User not found' },{ status: 404 });
        const newTodo = await prisma.todo.create({
            data: {
                title,
                description,
                dueDate: new Date(dueDate),
                userEmail,
            },
        });
        return NextResponse.json(newTodo, { status: 201 });
    } catch (error) {
        console.error('Error creating todo:', error);
        return NextResponse.json({ error: 'Failed to create todo', details: error instanceof Error ? error.message : String(error) },{ status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        console.log("put function called")
        const data = await req.json();
        console.log("data recieved")
        console.log(data)
        if (!data.id)
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        const existingTodo = await prisma.todo.findUnique({
            where: { id: data.id },
        });
        console.log(existingTodo)
        if (!existingTodo) 
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        console.log("going to update todo")

        await prisma.todo.update({
            where: { id: data.id },
            data: {
                ...data,
                dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            },
        });
        console.log("updated todo")

        return NextResponse.json({status:"success"});
    } catch (error) {
        console.error('Error updating todo:', error);
        return NextResponse.json(
            { error: 'Failed to update todo', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

// Delete a Todo
export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();
        if (!id) 
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const todo = await prisma.todo.findUnique({where: { id }});

        if (!todo) 
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });

        await prisma.todo.delete({
            where: { id },
        });

        return NextResponse.json(todo);
    } catch (error) {
        console.error('Error deleting todo:', error);
        return NextResponse.json(
            { error: 'Failed to delete todo', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}