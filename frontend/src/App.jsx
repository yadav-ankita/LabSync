import React from "react";
import { Navigate } from "react-router-dom";
import StudentDashboard from "./pages/Student/StudentDashboard";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import StudentRegister from "./components/StudentRegister";
import StudentLogin from "./components/StudentLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import { LabInchargeDashboard } from "./pages/LabIncharge/LabInchargeDashboard";
import { LabAdminDashboard } from "./pages/LabAdmin/LabAdminDashboard";
import Login from "./components/Login";
export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                {<Route path="/student-register" element={<StudentRegister />} />}
                <Route path="/student-login" element={<StudentLogin />} />
                {/* <Route path="/student-dashboard" 
                 element={
                    <ProtectedRoute><StudentDashboard /></ProtectedRoute>                
                    } /> */}
                <Route path="/student-dashboard"
                    element={
                        <StudentDashboard />
                    } />
                <Route path="/labIncharge-dashboard" 
                element=
                {
                 <ProtectedRoute><LabInchargeDashboard /></ProtectedRoute>
                 } 
                />
                <Route path="/labAdmin-dashboard" element={<LabAdminDashboard />} />
                <Route  path="/login" element={<Login/>}/>
                
            </Routes>
        </>
    );

}