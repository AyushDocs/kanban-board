import { NextRequest, NextResponse } from 'next/server';
export interface Todo {
    id: string;
    title: string;
    description: string;
}

const todos: Todo[] = [];

export async function GET(req: NextRequest) {
    console.log(req.url)
    return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
    const data = await req.json();
    const newTodo = { ...data, id: Date.now().toString() };
    todos.push(newTodo);
    return NextResponse.json(newTodo, { status: 201 });
}

export async function PUT(req: NextRequest) {
    const data = await req.json();
    const idx = todos.findIndex((t) => t.id === data.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    todos[idx] = { ...todos[idx], ...data };
    return NextResponse.json(todos[idx]);
}

export async function DELETE(req: NextRequest) {
    const { id } = await req.json();
    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const removed = todos.splice(idx, 1);
    return NextResponse.json(removed[0]);
}
