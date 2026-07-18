import React from "react";
import Login from "./components/Login";
import StudentDashboard from "./pages/Student/StudentDashboard";
import { Route,Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
export default function App() {

    return (
       <>
        <Routes>
            <Route path="/" element={<Home />}  />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/login"  element={<Login/>}       />
        </Routes>
       </>
    );

}