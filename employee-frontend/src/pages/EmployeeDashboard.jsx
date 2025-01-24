import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', employees: 30 },
  { name: 'Feb', employees: 20 },
  { name: 'Mar', employees: 27 },
  { name: 'Apr', employees: 50 },
  { name: 'May', employees: 40 },
  { name: 'Jun', employees: 60 },
];

const EmployeeDashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Employee Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold">Total Employees</h3>
          <p className="text-2xl font-bold">150</p>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Employee Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="employees" stroke="#4A90E2" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
