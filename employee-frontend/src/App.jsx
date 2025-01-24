import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes';
import { useAuth } from './context/AuthContext';
import EmployeeList from './pages/EmployeeList';

function App() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen">
            {/* Static Navbar */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-blue-800 z-20">
                <div className="h-full px-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <h1 className="text-white text-xl font-semibold">Employee Dashboard</h1>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 text-white bg-white/20 rounded-lg hover:bg-white/30"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Sidebar */}
            <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-blue-800 z-10">
                <div className="p-4">
                    <Sidebar />
                </div>
            </aside>

            {/* Main Content - 125% Width */}
            <main className="pt-16 pl-64 w-full">
                <div style={{ width: '175%' }} className="min-h-[calc(100vh-64px)] bg-gray-50">
                    <AppRoutes />
                </div>
            </main>
        </div>
    );
}

export default App;
