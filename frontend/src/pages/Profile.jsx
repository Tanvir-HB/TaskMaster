import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import { User, Camera, Save } from "lucide-react";

const Profile = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const assetBaseUrl = apiBaseUrl.replace(/\/api\/?$/, "");

    useEffect(() => {
        if (user) {
            setName(user.name);
            if (user.profilePicture) {
                if (user.profilePicture.startsWith("http")) {
                    setPreview(user.profilePicture);
                } else {
                    setPreview(`${assetBaseUrl}${user.profilePicture}`);
                }
            }
        }
    }, [user, assetBaseUrl]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        if (file) {
            formData.append("profilePicture", file);
        }

        const result = await updateProfile(formData);
        setLoading(false);

        if (result.success) {
            toast.success("Profile updated successfully!");
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile Settings</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-2 border-indigo-100">
                                {preview ? (
                                    <img src={preview} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg">
                                <Camera size={18} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                        <p className="text-sm text-gray-500">Allowed: JPG, PNG (Max 5MB)</p>
                    </div>

                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-md disabled:opacity-50"
                    >
                        {loading ? "Saving..." : <><Save size={18} /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;

