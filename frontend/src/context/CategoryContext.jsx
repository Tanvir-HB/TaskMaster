import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import AuthContext from "./AuthContext";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchCategories();
        } else {
            setCategories([]);
        }
    }, [user]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/categories");
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories", error);
        } finally {
            setLoading(false);
        }
    };

    const addCategory = async (categoryData) => {
        try {
            const { data } = await api.post("/categories", categoryData);
            setCategories([...categories, data]);
            toast.success("Category added!");
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || "Failed to add category";
            toast.error(message);
            return { success: false, message };
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/categories/${id}`);
            setCategories(categories.filter((c) => c._id !== id));
            toast.success("Category deleted");
            return { success: true };
        } catch (error) {
            toast.error("Failed to delete category");
            return { success: false };
        }
    };

    return (
        <CategoryContext.Provider value={{ categories, loading, addCategory, deleteCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};

export default CategoryContext;
