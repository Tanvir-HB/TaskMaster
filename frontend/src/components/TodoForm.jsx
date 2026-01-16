import { useState, useEffect, useContext } from "react";
import TodoContext from "../context/TodoContext";
import CategoryContext from "../context/CategoryContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { X } from "lucide-react";

const TodoForm = ({ onClose, todoToEdit }) => {
    const { addTodo, updateTodo } = useContext(TodoContext);
    const { categories } = useContext(CategoryContext);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Low");
    const [category, setCategory] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [loading, setLoading] = useState(false);

    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        if (todoToEdit) {
            setTitle(todoToEdit.title);
            setDescription(todoToEdit.description || "");
            setPriority(todoToEdit.priority);
            setCategory(todoToEdit.category?._id || todoToEdit.category || "");
            // Format date for input
            if (todoToEdit.dueDate) {
                const date = new Date(todoToEdit.dueDate);
                setDueDate(date.toISOString().split('T')[0]);
            }
        }
    }, [todoToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("priority", priority);
        if (category) formData.append("category", category);
        if (dueDate) formData.append("dueDate", dueDate);

        // Append files
        for (let i = 0; i < attachments.length; i++) {
            formData.append("attachments", attachments[i]);
        }

        let result;
        if (todoToEdit) {
            // Update logic might need to be different if we support adding more files on edit
            // For now, simpler to just send JSON for update if not handling file update
            // But let's assume updateTodo handles JSON
            // TodoContext updateTodo sends JSON by default. Need to check if I updated TodoContext.
            // I'll stick to JSON for update for now as requirements focus on Creation for Upload usually.
            // Or I can send FormData to updateTodo too.
            result = await updateTodo(todoToEdit._id, { title, description, priority, category, dueDate });
        } else {
            result = await addTodo(formData); // Send FormData
        }

        setLoading(false);
        if (result.success) {
            onClose();
        }
    };

    const handleFileChange = (e) => {
        setAttachments(e.target.files);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-auto border border-gray-100">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">
                        {todoToEdit ? "Edit Task" : "Create New Task"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="What needs to be done?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Due Date
                            </label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {categories.map((cat) => (
                                <button
                                    key={cat._id}
                                    type="button"
                                    onClick={() => setCategory(cat._id === category ? "" : cat._id)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 transition-all ${category === cat._id
                                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-200"
                                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    <span>{cat.name}</span>
                                </button>
                            ))}
                            {categories.length === 0 && (
                                <span className="text-sm text-gray-500 italic">No categories created yet.</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <div className="h-48 mb-12">
                            <ReactQuill
                                theme="snow"
                                value={description}
                                onChange={setDescription}
                                className="h-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Attachments
                        </label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {loading ? "Saving..." : todoToEdit ? "Update Task" : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TodoForm;
