import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Person as PersonIcon
} from '@mui/icons-material';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            text: 'Profile',
            icon: <PersonIcon className="h-5 w-5" />,
            path: '/profile'
        },
        {
            text: 'Employee Dashboard',
            icon: <DashboardIcon className="h-5 w-5" />,
            path: '/employee-dashboard'
        },
        {
            text: 'Employee List',
            icon: <PeopleIcon className="h-5 w-5" />,
            path: '/employee-list'
        },
        {
            text: 'Timesheet',
            icon: <PeopleIcon className="h-5 w-5" />,
            path: '/timesheet'
        },
        {
            text: 'Projects',
            icon: <PeopleIcon className="h-5 w-5" />,
            path: '/projects'
        },
      
    ];

    return (
        <nav className="text-white bg-blue-800">
            {/* <div className="mb-6 text-xl font-semibold">
                Employee Portal
            </div> */}
            {menuItems.map((item) => (
                <div
                    key={item.text}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center px-4 py-3 cursor-pointer rounded-lg mb-1
                        ${location.pathname === item.path 
                            ? 'bg-blue-600' 
                            : 'hover:bg-blue-600'
                        }`}
                >
                    <span className="mr-3">{item.icon}</span>
                    <span className="text-sm">{item.text}</span>
                </div>
            ))}
        </nav>
    );
} 