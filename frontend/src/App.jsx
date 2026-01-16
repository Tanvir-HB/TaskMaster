import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CategoryProvider } from "./context/CategoryContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CategoryProvider>
          <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              {/* <Route path="/verify-email/:token" element={<VerifyEmail />} /> */}
            </Routes>
            <ToastContainer position="bottom-right" theme="light" />
          </div>
        </CategoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
