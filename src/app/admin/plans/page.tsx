import { 
  CubeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function PlansPage() {
  // TODO: Replace with real data from API
  const plans = [
    {
      id: 1,
      name: 'Premium Plan',
      price: 5000,
      duration: '12 months',
      features: ['Unlimited access', 'Personal trainer', 'Diet plan', 'Locker access'],
      status: 'active',
      members: 120
    },
    {
      id: 2,
      name: 'Basic Plan',
      price: 3000,
      duration: '6 months',
      features: ['Unlimited access', 'Group classes'],
      status: 'active',
      members: 85
    },
    {
      id: 3,
      name: 'Student Plan',
      price: 2000,
      duration: '3 months',
      features: ['Unlimited access', 'Student ID required'],
      status: 'inactive',
      members: 45
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plan Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage gym membership plans
          </p>
        </div>
        <Link
          href="/admin/plans/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add New Plan
        </Link>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CubeIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-500">{plan.duration}</p>
                  </div>
                </div>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {plan.status}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{plan.price.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {plan.members} active members
                </p>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">Features</h4>
                <ul className="mt-2 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-2 text-sm text-gray-500">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 flex space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PencilIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                  Edit
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <TrashIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 