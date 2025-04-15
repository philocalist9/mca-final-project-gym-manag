import { 
  CreditCardIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

export default function MembershipsPage() {
  // TODO: Replace with real data from API
  const memberships = [
    {
      id: 1,
      memberName: 'John Doe',
      planName: 'Premium',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      autoRenew: true,
      paymentStatus: 'paid'
    },
    {
      id: 2,
      memberName: 'Jane Smith',
      planName: 'Basic',
      startDate: '2024-03-01',
      endDate: '2024-06-01',
      status: 'active',
      autoRenew: false,
      paymentStatus: 'paid'
    },
    {
      id: 3,
      memberName: 'Mike Johnson',
      planName: 'Premium',
      startDate: '2024-02-01',
      endDate: '2024-05-01',
      status: 'expired',
      autoRenew: false,
      paymentStatus: 'unpaid'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Membership Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage all gym memberships
        </p>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="pending">Pending</option>
        </select>
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">All Plans</option>
          <option value="premium">Premium</option>
          <option value="basic">Basic</option>
        </select>
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">Payment Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      {/* Memberships Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {memberships.map((membership) => (
            <li key={membership.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CreditCardIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{membership.memberName}</h4>
                      <p className="text-sm text-gray-500">Plan: {membership.planName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      membership.status === 'active' ? 'bg-green-100 text-green-800' :
                      membership.status === 'expired' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {membership.status}
                    </span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      membership.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {membership.paymentStatus}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Start: {membership.startDate}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      End: {membership.endDate}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    {membership.autoRenew ? (
                      <span className="flex items-center">
                        <ArrowPathIcon className="h-4 w-4 mr-1" />
                        Auto-renew enabled
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-600">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        Auto-renew disabled
                      </span>
                    )}
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