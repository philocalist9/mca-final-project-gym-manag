import { 
  CogIcon,
  UserPlusIcon,
  UserMinusIcon,
  LockClosedIcon,
  LockOpenIcon
} from '@heroicons/react/24/outline'

export default function RolesPage() {
  // TODO: Replace with real data from API
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Member',
      status: 'active',
      lastActive: '2024-04-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Trainer',
      status: 'active',
      lastActive: '2024-04-15'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Admin',
      status: 'active',
      lastActive: '2024-04-15'
    },
    {
      id: 4,
      name: 'Bob Brown',
      email: 'bob@example.com',
      role: 'Member',
      status: 'locked',
      lastActive: '2024-04-10'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage user roles and permissions
        </p>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">All Roles</option>
          <option value="member">Member</option>
          <option value="trainer">Trainer</option>
          <option value="admin">Admin</option>
        </select>
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="locked">Locked</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CogIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Last active: {user.lastActive}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <div className="flex space-x-2">
                      {user.role !== 'Admin' && (
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Promote to Admin"
                        >
                          <UserPlusIcon className="h-5 w-5" />
                        </button>
                      )}
                      {user.role === 'Trainer' && (
                        <button
                          type="button"
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Demote to Member"
                        >
                          <UserMinusIcon className="h-5 w-5" />
                        </button>
                      )}
                      {user.status === 'active' ? (
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-900"
                          title="Lock Account"
                        >
                          <LockClosedIcon className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="text-green-600 hover:text-green-900"
                          title="Unlock Account"
                        >
                          <LockOpenIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
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