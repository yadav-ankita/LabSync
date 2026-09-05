import StudentDashboard from "./pages/Student/StudentDashboard";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import StudentRegister from "./components/StudentRegister";
import StudentLogin from "./components/StudentLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import { LabInchargeDashboard } from "./pages/LabIncharge/LabInchargeDashboard";
import { LabAdminDashboard } from "./pages/LabAdmin/LabAdminDashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import HodDashbaord from "./pages/HOD/HodDashbaord";
export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/login"
                  element={<Login />}
                />
                <Route 
                 path="/register"  
                 element={<Register/>}
                 />
                <Route
                    path="/student-register"
                    element={<StudentRegister />}
                />
                <Route
                    path="/student-login"
                    element={<StudentLogin />}
                />
                <Route
                    path="/student-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/labIncharge-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["faculty"]}>
                            <LabInchargeDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/labAdmin-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "hod"]}>
                            <LabAdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                 path="/HOD-dashboard"
                 element={
                    <ProtectedRoute allowedRoles={["hod"]}>
                        <HodDashbaord />
                    </ProtectedRoute>
                 } 
                />
            </Routes>
        </>
    );
}