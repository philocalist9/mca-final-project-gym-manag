'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Mon', active: 4000 },
  { name: 'Tue', active: 3000 },
  { name: 'Wed', active: 5000 },
  { name: 'Thu', active: 2780 },
  { name: 'Fri', active: 1890 },
  { name: 'Sat', active: 2390 },
  { name: 'Sun', active: 3490 },
]

export default function UserActivityChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Weekly User Activity</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="active" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 