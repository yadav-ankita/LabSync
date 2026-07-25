import React from "react";
import { Navigate } from "react-router-dom";
import Login from "./components/StudentLogin";
import StudentDashboard from "./pages/Student/StudentDashboard";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import StudentRegister from "./components/StudentRegister";
import StudentLogin from "./components/StudentLogin";
import ProtectedRoute from "./components/ProtectedRoute";
export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/student-register" element={<StudentRegister/>} /> */}
                <Route path="/student-login" element={<StudentLogin/>} />
                <Route path="/student-dashboard" element={
                    <ProtectedRoute><StudentDashboard /></ProtectedRoute>                
                    } />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/student-login" replace />} />
            </Routes>
        </>
    );

}