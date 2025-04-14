'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/SessionProvider';
import Link from 'next/link';

// Dashboard stat card component
const StatCard = ({ title, value, icon, color, link }: { 
  title: string; 
  value: number | string; 
  icon: React.ReactNode; 
  color: string;
  link: string;
}) => (
  <Link 
    href={link} 
    className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow dark:bg-gray-800`}
  >
    <div className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-medium text-gray-900 dark:text-white">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </Link>
);

// Type definitions for data
interface Client {
  id: number;
  name: string;
  goal: string;
  nextSession: string;
  progress: string;
}

interface Session {
  id: number;
  clientName: string;
  time: string;
  type: string;
}

const TrainerDashboardPage = () => {
  const { session } = useSession();
  const [stats, setStats] = useState({
    activeClients: 0,
    sessionsToday: 0,
    totalSessionsWeek: 0,
    clientsWithGoals: 0,
  });
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data
  useEffect(() => {
    const fetchTrainerDashboard = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // For now, we'll use dummy data
        setTimeout(() => {
          setStats({
            activeClients: 15,
            sessionsToday: 4,
            totalSessionsWeek: 22,
            clientsWithGoals: 12,
          });
          
          setUpcomingSessions([
            { id: 1, clientName: 'John Smith', time: 'Today, 3:00 PM', type: 'Personal Training' },
            { id: 2, clientName: 'Sarah Johnson', time: 'Today, 5:30 PM', type: 'Fitness Assessment' },
            { id: 3, clientName: 'Mike Williams', time: 'Tomorrow, 9:00 AM', type: 'Strength Training' },
            { id: 4, clientName: 'Emily Davis', time: 'Tomorrow, 4:15 PM', type: 'HIIT Session' },
          ]);
          
          setClients([
            { id: 1, name: 'John Smith', goal: 'Weight loss', nextSession: 'Today, 3:00 PM', progress: 'On track' },
            { id: 2, name: 'Sarah Johnson', goal: 'Muscle gain', nextSession: 'Today, 5:30 PM', progress: 'Exceeding' },
            { id: 3, name: 'Mike Williams', goal: 'Marathon prep', nextSession: 'Tomorrow, 9:00 AM', progress: 'Needs focus' },
            { id: 4, name: 'Emily Davis', goal: 'Toning', nextSession: 'Tomorrow, 4:15 PM', progress: 'On track' },
            { id: 5, name: 'Alex Rodriguez', goal: 'Rehabilitation', nextSession: 'Thu, 2:00 PM', progress: 'Behind schedule' },
          ]);
          
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching trainer dashboard data:', err);
        setError('Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    fetchTrainerDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-indigo-600 border-indigo-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trainer Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Welcome back, {session?.user?.name}! Here's an overview of your clients and schedule.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Clients"
          value={stats.activeClients}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          link="/dashboard/clients"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          }
        />
        <StatCard
          title="Sessions Today"
          value={stats.sessionsToday}
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          link="/dashboard/schedule"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          }
        />
        <StatCard
          title="Sessions This Week"
          value={stats.totalSessionsWeek}
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          link="/dashboard/schedule"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          }
        />
        <StatCard
          title="Clients With Goals"
          value={stats.clientsWithGoals}
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
          link="/dashboard/clients"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          }
        />
      </div>

      {/* Main content - upcoming sessions and client list */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Sessions */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Sessions</h2>
            <Link href="/dashboard/schedule" className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              View schedule
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-2 rounded-md">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{session.clientName}</p>
                    <div className="flex justify-between">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{session.time}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{session.type}</p>
                    </div>
                  </div>
                  <div className="ml-2">
                    <Link href={`/dashboard/sessions/${session.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">No upcoming sessions</p>
                <Link href="/dashboard/schedule/create" className="mt-2 inline-block text-sm text-indigo-600 dark:text-indigo-400">
                  Schedule a session
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Client Progress */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Client Progress Tracking</h2>
            <Link href="/dashboard/clients" className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              View all clients
            </Link>
          </div>

          <div className="overflow-hidden">
            {clients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Client
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Goal
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Next Session
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Progress
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Link href={`/dashboard/clients/${client.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                            {client.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {client.goal}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {client.nextSession}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${client.progress === 'On track' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                            client.progress === 'Exceeding' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 
                            client.progress === 'Behind schedule' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                            {client.progress}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">No clients found</p>
                <Link href="/dashboard/clients/create" className="mt-2 inline-block text-sm text-indigo-600 dark:text-indigo-400">
                  Add new client
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/sessions/create"
            className="relative group bg-white dark:bg-gray-800 p-6 focus:ring-2 focus:ring-indigo-500 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Schedule Session
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create a new training session
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/clients/create"
            className="relative group bg-white dark:bg-gray-800 p-6 focus:ring-2 focus:ring-indigo-500 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Add New Client
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Register a new client
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/workouts/create"
            className="relative group bg-white dark:bg-gray-800 p-6 focus:ring-2 focus:ring-indigo-500 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Create Workout
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Design a new workout plan
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/reports"
            className="relative group bg-white dark:bg-gray-800 p-6 focus:ring-2 focus:ring-indigo-500 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Client Reports
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Generate progress reports
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboardPage; 