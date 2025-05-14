"use client";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import Column from "./components/Column";
import styl from "./styles/page.module.css";
import { ColumnType, DragDropProvider } from "@/provider/DragDropProvider";
import { signIn, useSession } from "next-auth/react";
import Loading from "../components/Loading";
import { useRouter } from "next/navigation";
import AddTodo from "../components/AddTodo";

const Home = () => {
    const router = useRouter();
    const { data, status } = useSession();
    const [column, setColumn] = useState<ColumnType[]>([
        {
            columnName: "Monday",
            todo: [
                { id: "Monday_0", title: "todo 1", description: "do this" },
                { id: "Monday_1", title: "todo 1", description: "do this" },
            ],
        },
        {
            columnName: "Tuesday",
            todo: [
                { id: "Tuesday_0", title: "todo 1", description: "do this" },
                { id: "Tuesday_1", title: "todo 1", description: "do this" },
            ],
        },
        {
            columnName: "Wednesday",
            todo: [
                { id: "Wednesday_0", title: "todo 1", description: "do this" },
                { id: "Wednesday_1", title: "todo 1", description: "do this" },
            ],
        },
        {
            columnName: "Thursday",
            todo: [
                { id: "Thursday_0", title: "todo 1", description: "do this" },
                { id: "Thursday_1", title: "todo 1", description: "do this" },
            ],
        },
        {
            columnName: "Friday",
            todo: [
                { id: "Friday_0", title: "todo 1", description: "do this" },
                { id: "Friday_1", title: "todo 1", description: "do this" },
            ],
        },
    ]);

    useEffect(() => {
        if (status === "unauthenticated") signIn();
    }, [status, router]);
    useEffect(() => {
        if (status === "authenticated") {
            const fetchTodos = async () => {
                try {
                    const email=data.user?.email;
                    if(!email) 
                        signIn();
                    const response = await fetch("/api/todo?email=" + email);
                    const responseData = await response.json();
                    setColumn(responseData);
                } catch (error) {
                    console.error("Error fetching todos:", error);
                }
            };
            fetchTodos();
        }
    }, [status]);
    if (status === "loading") return <Loading />;
    return (
        <div className={styl.container}>
            <FaArrowLeft className={styl.arrow + " " + styl.left} />
            <div className={styl.columnContainer}>
                <DragDropProvider columns={column} setColumns={setColumn}>
                    {column.map(({ columnName, todo }, index) => (
                        <Column todos={todo} key={index} id={columnName} />
                    ))}
                </DragDropProvider>
            </div>
            <FaArrowRight className={styl.arrow + " " + styl.right} />
            <AddTodo />
        </div>
    );
};

export default Home;
