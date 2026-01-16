import { useContext } from "react";
import TodoContext from "../context/TodoContext";
import { Search, Filter } from "lucide-react";

const Filters = () => {
    const { search, setSearch, priorityFilter, setPriorityFilter, statusFilter, setStatusFilter } = useContext(TodoContext);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex gap-4">
                <div className="relative">
                    <Filter className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-gray-400" />
                    <select
                        className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none cursor-pointer"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="All">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <select
                    className="pl-4 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
        </div>
    );
};

export default Filters;
