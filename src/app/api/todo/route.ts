import { NextRequest, NextResponse } from 'next/server';
import { Todo } from '@/schema/entity/Todo';
import { Between } from 'typeorm';
import { dbSource } from '@/schema';

export async function GET(req: NextRequest) {
    try {
        const todoRepo = (await dbSource()).todoRepository
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const start = parseInt(searchParams.get('start') || '0', 10);
        const windowSize = 5;
        if (!email)
            return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });

        const firstDate = new Date('7/20/25');
        const lastDate = new Date(firstDate);
        lastDate.setDate(firstDate.getDate() + windowSize);
        const todos = await todoRepo.find({
            where: {
                userEmail: email,
                dueDate: Between(firstDate, lastDate),
            },
            order: { dueDate: 'ASC' },
        });
        // Group todos by date (YYYY-MM-DD)
        const grouped: Record<string, Todo[]> = {};
        for (const todo of todos) {
            const dateKey = todo.dueDate?.toISOString().slice(0, 10);
            if (!dateKey) continue;
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(todo);
        }
        const todosByDate = Object.values(grouped);
        console.log(todosByDate)
        return NextResponse.json({
            todos: todosByDate,
            start,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch todos', details: error }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const db = await dbSource();

        const userRepo = db.userRepository;
        const todoRepo = db.todoRepository;
        const data = await req.json();
        const user = await userRepo.findOneBy({ email: data.userEmail });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 400 });
        const newTodo = todoRepo.create(data);
        await todoRepo.save(newTodo);
        return NextResponse.json(newTodo, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create todo', details: error }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const db = await dbSource();
        const todoRepo = db.todoRepository;
        const data = (await req.json()) as Partial<Todo>;

        let todo: Partial<Todo> | null = await todoRepo.findOneBy({ id: data.id });
        if (todo == null) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        todo = { ...todo, ...data };
        await todoRepo.save(todo);
        return NextResponse.json(todo);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update todo', details: error }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const db = await dbSource();
        const todoRepo = db.todoRepository;
        const { id } = await req.json();
        const todo = await todoRepo.findOneBy({ id });
        if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        await todoRepo.remove(todo);
        return NextResponse.json(todo);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete todo', details: error }, { status: 500 });
    }
}
