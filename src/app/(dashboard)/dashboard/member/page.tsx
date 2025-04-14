'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/SessionProvider';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

// Type definitions for our data
interface Workout {
  id: number;
  name: string;
  date: string;
  trainer: string;
}

interface Activity {
  id: number;
  type: string;
  name: string;
  date: string;
}

interface Message {
  id: number;
  from: string;
  content: string;
  date: string;
}

const MemberDashboardPage = () => {
  const { session, status } = useSession();
  const [stats, setStats] = useState({
    workoutCompletions: 0,
    caloriesBurned: 0,
    daysActive: 0,
    activeWorkoutPlans: 0,
  });
  const [upcomingWorkouts, setUpcomingWorkouts] = useState<Workout[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [trainerMessages, setTrainerMessages] = useState<Message[]>([]);
  const [weightData, setWeightData] = useState<{ date: string; weight: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Debug session state
  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [session, status]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (status !== 'authenticated') {
        console.log('Not authenticated, skipping data fetch');
        return;
      }

      try {
        console.log('Fetching dashboard data for user:', session?.user?.email);
        // In a real app, you would fetch this data from your API
        // For now, we'll use dummy data
        setStats({
          workoutCompletions: 12,
          caloriesBurned: 3500,
          daysActive: 8,
          activeWorkoutPlans: 3,
        });
        
        setUpcomingWorkouts([
          { id: 1, name: 'Chest & Triceps', date: 'Today, 6:00 PM', trainer: 'Alex Smith' },
          { id: 2, name: 'Leg Day', date: 'Tomorrow, 7:30 AM', trainer: 'Emma Johnson' },
          { id: 3, name: 'Back & Biceps', date: 'Thu, 6:00 PM', trainer: 'Alex Smith' },
        ]);
        
        setRecentActivities([
          { id: 1, type: 'workout', name: 'Completed 30 min Cardio', date: '2 hours ago' },
          { id: 2, type: 'appointment', name: 'Nutrition Consultation', date: 'Yesterday' },
          { id: 3, type: 'progress', name: 'Logged weight: 78.5kg', date: '2 days ago' },
          { id: 4, type: 'workout', name: 'Completed Chest Day', date: '3 days ago' },
        ]);

        setTrainerMessages([
          { id: 1, from: 'Alex Smith', content: 'Great progress on your bench press! Let\'s aim for 5 more reps next session.', date: '2 hours ago' },
          { id: 2, from: 'Emma Johnson', content: 'Your nutrition plan has been updated based on your recent progress.', date: '1 day ago' },
        ]);

        setWeightData([
          { date: 'Jan 1', weight: 80 },
          { date: 'Jan 8', weight: 79.5 },
          { date: 'Jan 15', weight: 79 },
          { date: 'Jan 22', weight: 78.5 },
          { date: 'Jan 29', weight: 78 },
        ]);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [session, status]);

  if (status === 'loading') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-[#2A5C99] border-[#2A5C99]/20 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Please log in to view your dashboard</h3>
          </div>
        </div>
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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="pb-5 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {session?.user?.name}!</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Here's an overview of your fitness journey.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Workouts This Week"
          value={stats.workoutCompletions}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          link="/dashboard/member/workouts"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          }
        />
        <StatCard
          title="Calories Burned"
          value={`${stats.caloriesBurned} kcal`}
          color="bg-[#FF7A45]/10 text-[#FF7A45] dark:bg-[#FF7A45]/20 dark:text-[#FF7A45]"
          link="/dashboard/member/progress"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          }
        />
        <StatCard
          title="Days Active"
          value={stats.daysActive}
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          link="/dashboard/member/progress"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          }
        />
        <StatCard
          title="Active Plans"
          value={stats.activeWorkoutPlans}
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          link="/dashboard/member/workouts"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          }
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Workouts */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Workouts</h2>
            <Link href="/dashboard/member/workouts" className="text-sm text-[#2A5C99] hover:text-[#2A5C99]/80 dark:text-[#2A5C99] dark:hover:text-[#2A5C99]/80">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingWorkouts.length > 0 ? (
              upcomingWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="bg-[#2A5C99]/10 text-[#2A5C99] dark:bg-[#2A5C99]/20 dark:text-[#2A5C99] p-2 rounded-md">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{workout.name}</p>
                    <div className="flex justify-between">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{workout.date}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">with {workout.trainer}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">No upcoming workouts</p>
                <Link href="/dashboard/member/workouts" className="mt-2 inline-block text-sm text-[#2A5C99] dark:text-[#2A5C99]">
                  Schedule a workout
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Weight Progress Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Weight Progress</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#2A5C99" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
            <Link href="/dashboard/member/progress" className="text-sm text-[#2A5C99] hover:text-[#2A5C99]/80 dark:text-[#2A5C99] dark:hover:text-[#2A5C99]/80">
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center 
                      ${activity.type === 'workout' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 
                        activity.type === 'appointment' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                        'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {activity.type === 'workout' ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                      ) : activity.type === 'appointment' ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
              </div>
            )}
          </div>
        </div>

        {/* Trainer Messages */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Trainer Messages</h2>
            <Link href="/dashboard/member/messages" className="text-sm text-[#2A5C99] hover:text-[#2A5C99]/80 dark:text-[#2A5C99] dark:hover:text-[#2A5C99]/80">
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {trainerMessages.length > 0 ? (
              trainerMessages.map((message) => (
                <div key={message.id} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-[#FF7A45]/10 text-[#FF7A45] dark:bg-[#FF7A45]/20 dark:text-[#FF7A45] flex items-center justify-center">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{message.from}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{message.content}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{message.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">No messages from trainers</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboardPage; 