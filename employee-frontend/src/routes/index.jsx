import { Routes, Route } from 'react-router-dom';
import EmployeeList from '../pages/EmployeeList';
import Dashboard from '../pages/EmployeeDashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<EmployeeList />} />
            <Route path="/employee-list" element={<EmployeeList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/employee-dashboard" element={<Dashboard />} />

        </Routes>
    );
} 