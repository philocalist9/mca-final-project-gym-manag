import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'John D.', sessions: 45 },
  { name: 'Sarah M.', sessions: 38 },
  { name: 'Mike R.', sessions: 42 },
  { name: 'Lisa K.', sessions: 35 },
  { name: 'David S.', sessions: 40 },
]

export default function TrainerEngagementChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 60,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            dataKey="name" 
            type="category"
            width={80}
          />
          <Tooltip formatter={(value: number) => [value, 'Sessions']} />
          <Bar 
            dataKey="sessions" 
            fill="#4F46E5"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 