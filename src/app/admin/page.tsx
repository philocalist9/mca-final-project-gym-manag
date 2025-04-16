'use client';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/components/SessionProvider'
import { UserRole } from '@/models/ClientUser'
import AdminSummaryCards from '@/components/admin/AdminSummaryCards'
import RevenueChart from '@/components/admin/RevenueChart'
import UserActivityChart from '@/components/admin/UserActivityChart'
import MembershipStats from '@/components/admin/MembershipStats'
import AdminAnalytics from '@/components/admin/AdminAnalytics'

interface MemberStats {
  totalMembers: number
  activeMembers: number
  newMembersThisMonth: number
}

interface TrainerStats {
  totalTrainers: number
  activeTrainers: number
  trainersWithAppointments: number
}

export default function AdminDashboard() {
  const { session, status } = useSession()
  const router = useRouter()
  const [memberStats, setMemberStats] = useState<MemberStats>({
    totalMembers: 1230,
    activeMembers: 1100,
    newMembersThisMonth: 45
  })
  const [trainerStats, setTrainerStats] = useState<TrainerStats>({
    totalTrainers: 22,
    activeTrainers: 18,
    trainersWithAppointments: 15
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== UserRole.OWNER) {
      router.push('/dashboard')
    } else {
      setIsLoading(false)
    }
  }, [status, session, router])

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!session || session.user.role !== UserRole.OWNER) {
    return null
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Owner Dashboard</h1>
        <p className="text-gray-400">Welcome to your gym management dashboard</p>
      </div>

      <AdminSummaryCards 
        memberStats={memberStats}
        trainerStats={trainerStats}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RevenueChart />
        <UserActivityChart />
      </div>

      <MembershipStats />

      <AdminAnalytics />

      {/* Quick Links to Admin Features */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 mt-8">Management Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="/admin/users" className="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition">
            <span className="text-3xl mr-4">👥</span>
            <span className="text-white font-medium">User Management</span>
          </a>
          <a href="/admin/trainers" className="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition">
            <span className="text-3xl mr-4">🧑‍🏫</span>
            <span className="text-white font-medium">Trainer Management</span>
          </a>
          <a href="/admin/memberships" className="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition">
            <span className="text-3xl mr-4">💳</span>
            <span className="text-white font-medium">Membership Management</span>
          </a>
          <a href="/admin/plans" className="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition">
            <span className="text-3xl mr-4">📦</span>
            <span className="text-white font-medium">Plan/Package Management</span>
          </a>
          <a href="/admin/appointments" className="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition">
            <span className="text-3xl mr-4">📅</span>
            <span className="text-white font-medium">Appointments</span>
          </a>
          <a href="/admin/roles" className="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition">
            <span className="text-3xl mr-4">🔐</span>
            <span className="text-white font-medium">Role Management</span>
          </a>
        </div>
      </div>
    </div>
  )
} 