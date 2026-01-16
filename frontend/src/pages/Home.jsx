import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { TodoProvider } from "../context/TodoContext";
import Dashboard from "../components/Dashboard";
import TodoList from "../components/TodoList";
import TodoForm from "../components/TodoForm";
import Filters from "../components/Filters";
import CategoryManager from "../components/CategoryManager";
import { Plus, Settings } from "lucide-react";
import { Navigate } from "react-router-dom";

const HomeContent = () => {
    const { user, loading } = useContext(AuthContext);
    const [showForm, setShowForm] = useState(false);
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [todoToEdit, setTodoToEdit] = useState(null);

    // If still loading auth state, show nothing or spinner.
    // However, AuthProvider handles initial loading.

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleEdit = (todo) => {
        setTodoToEdit(todo);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setTodoToEdit(null);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
                    <p className="text-gray-500 mt-1">Manage all your todos in one place</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowCategoryManager(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
                    >
                        <Settings className="h-5 w-5" />
                        Categories
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        <Plus className="h-5 w-5" />
                        New Task
                    </button>
                </div>
            </header>

            {showCategoryManager && (
                <CategoryManager onClose={() => setShowCategoryManager(false)} />
            )}

            <Dashboard />

            <Filters />

            <TodoList onEdit={handleEdit} />

            {showForm && (
                <TodoForm
                    onClose={handleCloseForm}
                    todoToEdit={todoToEdit}
                />
            )}
        </div>
    );
};

const Home = () => {
    return (
        <TodoProvider>
            <HomeContent />
        </TodoProvider>
    );
};

export default Home;
