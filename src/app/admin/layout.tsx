'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '🏠' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Trainers', href: '/admin/trainers', icon: '🧑‍🏫' },
  { label: 'Memberships', href: '/admin/memberships', icon: '💳' },
  { label: 'Appointments', href: '/admin/appointments', icon: '📅' },
  { label: 'Workout Plans', href: '/admin/plans', icon: '🏋‍♂' },
  { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
  { label: 'System Logs', href: '/admin/logs', icon: '🔔' },
  { label: 'Packages', href: '/admin/packages', icon: '📦' },
  { label: 'Role Management', href: '/admin/roles', icon: '👮‍♂' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col py-6 px-4">
        <div className="mb-8 text-2xl font-bold text-white tracking-wide">Gym Admin</div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors
                ${pathname === item.href ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 text-xs text-gray-500">&copy; {new Date().getFullYear()} Gym Sync</div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-gray-900">
        {children}
      </main>
    </div>
  );
} 