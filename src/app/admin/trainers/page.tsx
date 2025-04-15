import { 
  UserGroupIcon,
  CheckIcon,
  XMarkIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function TrainersPage() {
  // TODO: Replace with real data from API
  const trainers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      clients: 12,
      rating: 4.8,
      status: 'active',
      specialization: 'Weight Training'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      clients: 8,
      rating: 4.9,
      status: 'active',
      specialization: 'Yoga'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      clients: 15,
      rating: 4.7,
      status: 'pending',
      specialization: 'CrossFit'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trainer Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage trainers, their profiles, and client assignments
          </p>
        </div>
        <Link
          href="/admin/trainers/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add New Trainer
        </Link>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">All Specializations</option>
          <option value="weight">Weight Training</option>
          <option value="yoga">Yoga</option>
          <option value="crossfit">CrossFit</option>
        </select>
      </div>

      {/* Trainers Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {trainers.map((trainer) => (
            <li key={trainer.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserGroupIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{trainer.name}</h4>
                      <p className="text-sm text-gray-500">{trainer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {trainer.status}
                    </span>
                    <div className="flex space-x-2">
                      {trainer.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900">
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      <Link
                        href={`/admin/trainers/${trainer.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Specialization: {trainer.specialization}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      Clients: {trainer.clients}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    Rating: {trainer.rating}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 