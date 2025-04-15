'use client';

import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { redirect } from 'next/navigation'
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
  const { data, status } = useSession()
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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // In a real app, fetch data here
    // For now, use mock data
    setLoading(false)
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!data) {
    redirect('/login')
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-white">Loading dashboard data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome to your admin dashboard</p>
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
        <h2 className="text-xl font-semibold text-white mb-4 mt-8">Admin Features</h2>
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