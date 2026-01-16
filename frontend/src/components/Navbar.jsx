import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { LogOut, CheckSquare, Menu, X } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const assetBaseUrl = apiBaseUrl.replace(/\/api\/?$/, "");

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <CheckSquare className="h-8 w-8 text-indigo-600" />
                            <span className="text-xl font-bold text-gray-900">
                                TaskMaster
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <Link to="/profile" className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                                        {user.profilePicture ? (
                                            <img
                                                src={user.profilePicture.startsWith("http") ? user.profilePicture : `${assetBaseUrl}${user.profilePicture}`}
                                                alt={user.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-500 font-bold bg-indigo-100 text-indigo-600">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-gray-700 font-medium">{user.name}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-gray-900 p-2"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                                        {user.profilePicture ? (
                                            <img
                                                src={user.profilePicture.startsWith("http") ? user.profilePicture : `${assetBaseUrl}${user.profilePicture}`}
                                                alt={user.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-500 font-bold bg-indigo-100 text-indigo-600">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-gray-700 font-medium">{user.name}</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="space-y-2 p-2">
                                <Link
                                    to="/login"
                                    className="block w-full text-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium border border-gray-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block w-full text-center bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md font-medium transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

