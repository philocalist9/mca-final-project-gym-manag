interface SummaryCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  trend: string
}

export default function SummaryCard({ title, value, icon: Icon, trend }: SummaryCardProps) {
  const isPositiveTrend = trend.startsWith('+')

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  isPositiveTrend ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
} 