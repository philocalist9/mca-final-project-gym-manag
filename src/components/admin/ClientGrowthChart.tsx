import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', clients: 800 },
  { month: 'Feb', clients: 900 },
  { month: 'Mar', clients: 1000 },
  { month: 'Apr', clients: 1100 },
  { month: 'May', clients: 1150 },
  { month: 'Jun', clients: 1230 },
]

export default function ClientGrowthChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => [value, 'Clients']} />
          <Line 
            type="monotone" 
            dataKey="clients" 
            stroke="#4F46E5" 
            strokeWidth={2}
            dot={{ fill: '#4F46E5' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 