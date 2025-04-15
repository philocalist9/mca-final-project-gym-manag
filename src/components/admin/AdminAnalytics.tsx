'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 120000 },
  { month: 'Feb', revenue: 110000 },
  { month: 'Mar', revenue: 130000 },
  { month: 'Apr', revenue: 125000 },
  { month: 'May', revenue: 140000 },
  { month: 'Jun', revenue: 135000 },
];

const plansData = [
  { name: 'Basic', value: 400 },
  { name: 'Premium', value: 300 },
  { name: 'Elite', value: 100 },
];
const COLORS = ['#6366f1', '#10b981', '#f59e42'];

const growthData = [
  { month: 'Jan', clients: 100 },
  { month: 'Feb', clients: 120 },
  { month: 'Mar', clients: 150 },
  { month: 'Apr', clients: 180 },
  { month: 'May', clients: 210 },
  { month: 'Jun', clients: 250 },
];

const trainerEngagement = [
  { trainer: 'Amit', sessions: 40 },
  { trainer: 'Priya', sessions: 32 },
  { trainer: 'Rahul', sessions: 28 },
  { trainer: 'Sara', sessions: 35 },
];

export default function AdminAnalytics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Revenue by Month */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 text-white">Revenue by Month</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={revenueData}>
            <XAxis dataKey="month" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip contentStyle={{ background: '#1e293b', color: '#fff' }} />
            <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Active Plans Distribution */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 text-white">Active Plans Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={plansData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {plansData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip contentStyle={{ background: '#1e293b', color: '#fff' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Client Growth Trend */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 text-white">Client Growth Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={growthData}>
            <XAxis dataKey="month" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip contentStyle={{ background: '#1e293b', color: '#fff' }} />
            <Line type="monotone" dataKey="clients" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Trainer Engagement */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 text-white">Trainer Engagement</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={trainerEngagement}>
            <XAxis dataKey="trainer" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip contentStyle={{ background: '#1e293b', color: '#fff' }} />
            <Bar dataKey="sessions" fill="#f59e42" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 