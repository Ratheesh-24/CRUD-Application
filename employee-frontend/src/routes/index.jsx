import { Routes, Route } from 'react-router-dom';
import EmployeeList from '../pages/EmployeeList';
import Dashboard from '../pages/EmployeeDashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Timesheet from '../pages/Timesheet';
import Profile from '../pages/Profile';
import Projects from '../pages/Projects';
export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<EmployeeList />} />
            <Route path="/employee-list" element={<EmployeeList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/employee-dashboard" element={<Dashboard />} />
            <Route path="/timesheet" element={<Timesheet />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/projects" element={<Projects />} />

        </Routes>
    );
} 