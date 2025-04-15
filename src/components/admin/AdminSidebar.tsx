'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  UserGroupIcon, 
  UserIcon, 
  CreditCardIcon,
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  ShieldCheckIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'
import { UserRole } from '@/models/ClientUser'
import { authUtils } from '@/lib/authUtils'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
  { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Trainers', href: '/admin/trainers', icon: UserIcon },
  { name: 'Memberships', href: '/admin/memberships', icon: CreditCardIcon },
  { name: 'Appointments', href: '/admin/appointments', icon: CalendarIcon },
  { name: 'Workout Plans', href: '/admin/workout-plans', icon: ClipboardDocumentListIcon },
  { name: 'Packages', href: '/admin/packages', icon: CubeIcon },
  { name: 'Roles', href: '/admin/roles', icon: ShieldCheckIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const userRole = authUtils.getUserRole()

  return (
    <div className="flex flex-col h-full bg-gray-800 w-64">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Gym Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              pathname === item.href
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 ${
                pathname === item.href ? 'text-white' : 'text-gray-400 group-hover:text-white'
              }`}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {userRole?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{userRole}</p>
          </div>
        </div>
        <button
          onClick={() => authUtils.logout()}
          className="mt-4 w-full flex items-center px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
        >
          <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  )
} 