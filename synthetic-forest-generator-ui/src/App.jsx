import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TreeGenApp from "./pages/TreeGenApp";

function Protected({ children }) {
    const { token } = useAuth();
    if (!token) return <Navigate to="/login" replace />;
    return children;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected */}
                <Route
                    path="/projects"
                    element={
                        <Protected>
                            <TreeGenApp />
                        </Protected>
                    }
                />

                {/* default */}
                <Route path="*" element={<Navigate to="/login" />} />

            </Routes>
        </BrowserRouter>
    );
}
