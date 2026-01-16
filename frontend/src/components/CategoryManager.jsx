import { useState, useContext } from "react";
import CategoryContext from "../context/CategoryContext";
import { presetIcons } from "../utils/icons";
import * as LucideIcons from "lucide-react";
import { X, Check } from "lucide-react";

const CategoryManager = ({ onClose }) => {
    const { categories, addCategory, deleteCategory } = useContext(CategoryContext);
    const [name, setName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState(presetIcons[0]);
    const [color, setColor] = useState("#a855f7");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await addCategory({ name, icon: selectedIcon, color });
        if (success) {
            setName("");
            // Optional: Close or keep open for more additions
        }
    };

    const DynamicIcon = ({ name, size = 20, className }) => {
        const Icon = LucideIcons[name] || LucideIcons.HelpCircle;
        return <Icon size={size} className={className} />;
    };

    return (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full mx-auto text-gray-900 border border-gray-100">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold">Manage Categories</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-[70vh]">
                    {/* Left: Create Form */}
                    <div className="space-y-6">
                        <h4 className="font-semibold text-lg text-indigo-600">Create New Category</h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                                    placeholder="e.g., Work, Gym"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Icon
                                </label>
                                <div className="grid grid-cols-6 gap-2 h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                                    {presetIcons.map((iconName) => (
                                        <button
                                            key={iconName}
                                            type="button"
                                            onClick={() => setSelectedIcon(iconName)}
                                            className={`p-2 rounded-lg flex items-center justify-center transition-all ${selectedIcon === iconName
                                                ? "bg-indigo-600 text-white shadow-md"
                                                : "hover:bg-gray-200 text-gray-500"
                                                }`}
                                        >
                                            <DynamicIcon name={iconName} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Picker (Simple) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Accent Color
                                </label>
                                <div className="flex gap-3">
                                    {["#a855f7", "#06b6d4", "#ec4899", "#22c55e", "#eab308", "#ef4444"].map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setColor(c)}
                                            className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-gray-900' : 'border-transparent'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-200"
                            >
                                Add Category
                            </button>
                        </form>
                    </div>

                    {/* Right: List of Categories */}
                    <div className="border-l border-gray-200 pl-6 flex flex-col h-full">
                        <h4 className="font-semibold text-lg text-gray-800 mb-4">Existing Categories</h4>
                        <div className="flex-1 overflow-y-auto space-y-3">
                            {categories.length === 0 && <p className="text-gray-500">No categories yet.</p>}
                            {categories.map((cat) => (
                                <div key={cat._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-gray-50" style={{ color: cat.color }}>
                                            <DynamicIcon name={cat.icon} />
                                        </div>
                                        <span className="font-medium text-gray-700">{cat.name}</span>
                                    </div>
                                    <button
                                        onClick={() => deleteCategory(cat._id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryManager;
