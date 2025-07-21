import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import styl from "./styles/page.module.css";
import { DragDropProvider } from "@/provider/DragDropProvider";
import AddTodo from "../components/AddTodo";
import { fetchTodos } from "@/hooks/fetchTodos";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
const Home = async () => {
    // const session = await getServerSession();
    // if (!session || !session?.user?.email) {
    //     redirect("/api/auth/signin");
    // }

    try {
        // const todos = await fetchTodos({ email: session.user.email });
        const todos = await fetchTodos({ email: "ayushalokdubey@gmail.com" });
        if(todos.length==0)
            return <div>No more Todos</div>
        return (
            <div className={styl.container}>
                <FaArrowLeft className={styl.arrow + " " + styl.left} />
                <div className={styl.columnContainer}>
                    <DragDropProvider todos={todos}>
                        
                    </DragDropProvider>
                </div>
                <FaArrowRight className={styl.arrow + " " + styl.right} />
                <AddTodo />
            </div>
        );
    } catch (error) {
        console.log(error)
        if (error instanceof Error) return <div>{error.message}</div>;
        else return <div>Error Fetching data</div>;
    }
};

export default Home;
