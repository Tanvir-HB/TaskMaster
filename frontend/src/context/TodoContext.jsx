import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import AuthContext from "./AuthContext";

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ completed: 0, pending: 0, byPriority: { high: 0, medium: 0, low: 0 } });

    // Filters
    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTodos = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data } = await api.get("/todos", {
                params: {
                    search,
                    priority: priorityFilter,
                    status: statusFilter,
                    page,
                }
            });
            setTodos(data.todos);
            setTotalPages(data.pages);

            // Also fetch stats
            const statsRes = await api.get("/todos/stats");
            setStats(statsRes.data);
        } catch (error) {
            toast.error("Failed to fetch todos");
        }
        setLoading(false);
    };

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            fetchTodos();
        }, 500);
        return () => clearTimeout(timer);
    }, [user, search, priorityFilter, statusFilter, page]);

    const addTodo = async (todoData) => {
        try {
            await api.post("/todos", todoData);
            toast.success("Todo added!");
            fetchTodos();
            return { success: true };
        } catch (error) {
            toast.error("Failed to add todo");
            return { success: false };
        }
    };

    const updateTodo = async (id, todoData) => {
        try {
            await api.put(`/todos/${id}`, todoData);
            toast.success("Todo updated!");
            fetchTodos();
            return { success: true };
        } catch (error) {
            toast.error("Failed to update todo");
            return { success: false };
        }
    };

    const deleteTodo = async (id) => {
        try {
            await api.delete(`/todos/${id}`);
            toast.success("Todo deleted!");
            fetchTodos();
        } catch (error) {
            toast.error("Failed to delete todo");
        }
    };

    return (
        <TodoContext.Provider
            value={{
                todos,
                loading,
                stats,
                search,
                setSearch,
                priorityFilter,
                setPriorityFilter,
                statusFilter,
                setStatusFilter,
                page,
                setPage,
                totalPages,
                addTodo,
                updateTodo,
                deleteTodo,
            }}
        >
            {children}
        </TodoContext.Provider>
    );
};

export default TodoContext;
