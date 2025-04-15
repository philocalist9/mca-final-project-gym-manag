'use client';

import { UserGroupIcon, UserIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/24/outline'

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

interface AdminSummaryCardsProps {
  memberStats: MemberStats
  trainerStats: TrainerStats
}

export default function AdminSummaryCards({ memberStats, trainerStats }: AdminSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Members Card */}
      <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <UserGroupIcon className="h-6 w-6 text-indigo-500" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-400 truncate">Total Members</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-white">{memberStats.totalMembers}</div>
                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-400">
                  <span>{memberStats.newMembersThisMonth} new this month</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Active Trainers Card */}
      <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <UserIcon className="h-6 w-6 text-indigo-500" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-400 truncate">Active Trainers</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-white">{trainerStats.activeTrainers}</div>
                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-400">
                  <span>of {trainerStats.totalTrainers} total</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Card */}
      <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CurrencyDollarIcon className="h-6 w-6 text-indigo-500" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-400 truncate">Monthly Revenue</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-white">$24,000</div>
                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-400">
                  <span>+12% from last month</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments Card */}
      <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CalendarIcon className="h-6 w-6 text-indigo-500" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-400 truncate">Trainers with Appointments</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-white">{trainerStats.trainersWithAppointments}</div>
                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-400">
                  <span>active schedules</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
} 