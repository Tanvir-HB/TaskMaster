import { useContext } from "react";
import TodoContext from "../context/TodoContext";
import { Trash2, Edit2, Calendar, Flag, CheckCircle, Circle } from "lucide-react";
import * as LucideIcons from "lucide-react";

const TodoItem = ({ todo, onEdit }) => {
    const { deleteTodo, updateTodo } = useContext(TodoContext);

    const priorityColors = {
        High: "text-red-600 bg-red-50",
        Medium: "text-yellow-600 bg-yellow-50",
        Low: "text-green-600 bg-green-50",
    };

    const formattedDate = todo.dueDate
        ? new Date(todo.dueDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })
        : null;

    return (
        <div className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-4 flex items-start gap-4">
            <button
                onClick={() => updateTodo(todo._id, { completed: !todo.completed })}
                className="mt-1 text-gray-400 hover:text-indigo-600 transition-colors"
            >
                {todo.completed ? (
                    <CheckCircle className="h-6 w-6 text-indigo-600" />
                ) : (
                    <Circle className="h-6 w-6" />
                )}
            </button>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                    <h3 className={`text-lg font-medium text-gray-900 truncate ${todo.completed ? "line-through text-gray-400" : ""}`}>
                        {todo.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[todo.priority]}`}>
                        {todo.priority}
                    </span>
                    {todo.category && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                            {(() => {
                                const Icon = LucideIcons[todo.category.icon] || LucideIcons.HelpCircle;
                                return <Icon size={12} style={{ color: todo.category.color }} />;
                            })()}
                            <span style={{ color: todo.category.color }} className="font-medium">{todo.category.name}</span>
                        </div>
                    )}
                </div>

                {/* Render description as HTML but strip tags for preview or just show generic */}
                <div className="mt-1 text-sm text-gray-500 line-clamp-2" dangerouslySetInnerHTML={{ __html: todo.description }}></div>

                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    {formattedDate && (
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formattedDate}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(todo)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <Edit2 className="h-4 w-4" />
                </button>
                <button
                    onClick={() => deleteTodo(todo._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default TodoItem;
