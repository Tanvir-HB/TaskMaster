import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post("/auth/login", {
                email,
                password,
            });
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate("/");
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed",
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post("/auth/register", {
                name,
                email,
                password,
            });
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate("/");
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed",
            };
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
            localStorage.removeItem("userInfo");
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };

    const updateProfile = async (formData) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };
            const { data } = await api.put("/auth/profile", formData, config);
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Profile update failed",
            };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
