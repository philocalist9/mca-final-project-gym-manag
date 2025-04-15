'use client';

import { PlusIcon } from '@heroicons/react/24/outline'
import UsersTable from '@/components/admin/UsersTable'
import AddUserModal from '@/components/admin/AddUserModal'
import { useState } from 'react'

export default function UsersPage() {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all users in the system
          </p>
        </div>
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add User
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <UsersTable />
      </div>

      <AddUserModal 
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
    </div>
  )
} 