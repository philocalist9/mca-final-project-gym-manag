import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const data = [
  { name: 'Basic Plan', value: 400 },
  { name: 'Premium Plan', value: 300 },
  { name: 'Pro Plan', value: 200 },
  { name: 'Elite Plan', value: 100 },
]

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444']

export default function PlansDistributionChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, 'Members']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
} 