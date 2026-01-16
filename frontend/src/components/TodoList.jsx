import { useContext } from "react";
import TodoContext from "../context/TodoContext";
import TodoItem from "./TodoItem";
import { Loader } from "lucide-react";

const TodoList = ({ onEdit }) => {
    const { todos, loading, page, setPage, totalPages } = useContext(TodoContext);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (todos.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <div className="text-gray-400 mb-2">No tasks found</div>
                <p className="text-sm text-gray-500">Create a new task to get started!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                {todos.map((todo) => (
                    <TodoItem key={todo._id} todo={todo} onEdit={onEdit} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="flex items-center px-4 text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TodoList;
