import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useContext } from "react";
import TodoContext from "../context/TodoContext";

const Dashboard = () => {
    const { stats } = useContext(TodoContext);

    const data = [
        { name: "Completed", value: stats.completed },
        { name: "Pending", value: stats.pending },
    ];

    const COLORS = ["#10B981", "#EF4444"]; // Emerald-500, Red-500

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Task Overview</h2>

            <div className="flex flex-col items-center">
                <div className="h-64 w-full relative">
                    {stats.completed === 0 && stats.pending === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400">No tasks yet</div>
                    ) : (
                        <>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-gray-800">
                                    {Math.round((stats.completed / (stats.completed + stats.pending)) * 100)}%
                                </span>
                                <span className="text-sm text-gray-500 font-medium">Completed</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Custom Legend */}
                {(stats.completed > 0 || stats.pending > 0) && (
                    <div className="flex gap-6 mt-[-10px] mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[0] }}></div>
                            <span className="text-sm font-medium text-gray-600">Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[1] }}></div>
                            <span className="text-sm font-medium text-gray-600">Pending</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-red-50 p-2 rounded text-red-700 font-medium">High: {stats.byPriority?.high || 0}</div>
                <div className="bg-yellow-50 p-2 rounded text-yellow-700 font-medium">Medium: {stats.byPriority?.medium || 0}</div>
                <div className="bg-green-50 p-2 rounded text-green-700 font-medium">Low: {stats.byPriority?.low || 0}</div>
            </div>
        </div>
    );
};

export default Dashboard;
