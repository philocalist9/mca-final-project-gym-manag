import { 
  CalendarIcon,
  UserIcon,
  UserGroupIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

export default function AppointmentsPage() {
  // TODO: Replace with real data from API
  const appointments = [
    {
      id: 1,
      clientName: 'John Doe',
      trainerName: 'Mike Johnson',
      date: '2024-04-15',
      time: '10:00 AM',
      type: 'Personal Training',
      status: 'confirmed'
    },
    {
      id: 2,
      clientName: 'Jane Smith',
      trainerName: 'Sarah Wilson',
      date: '2024-04-15',
      time: '11:30 AM',
      type: 'Yoga Session',
      status: 'pending'
    },
    {
      id: 3,
      clientName: 'Bob Brown',
      trainerName: 'Mike Johnson',
      date: '2024-04-15',
      time: '2:00 PM',
      type: 'CrossFit Training',
      status: 'cancelled'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all gym appointments
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">All Trainers</option>
          <option value="mike">Mike Johnson</option>
          <option value="sarah">Sarah Wilson</option>
        </select>
        <input
          type="date"
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Calendar View */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Today's Appointments
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <li key={appointment.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CalendarIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">
                          {appointment.type}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {appointment.date} at {appointment.time}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {appointment.clientName}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {appointment.trainerName}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
} 