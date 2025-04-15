'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/SessionProvider';
import {
  BarChart,
  LineChart,
  Calendar,
  Users,
  Dumbbell,
  Bell,
  RefreshCw,
  ChevronDown,
  Search,
  Plus,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText
} from 'lucide-react';

// Types
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  joinDate: string;
  lastCheckIn: string;
  workoutPlan: string | null;
  renewalDate: string;
  renewalProbability: number;
  progress: {
    recentWeight: number;
    previousWeight: number;
    recentBodyFat: number;
    previousBodyFat: number;
    workoutCompletionRate: number;
  };
}

interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
}

interface WorkoutPlan {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focus: string;
  duration: number;
  clientCount: number;
  createdAt: string;
}

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  change: number;
  color: string;
}

// Dashboard Component
export default function TrainerDashboard2Page() {
  const { session } = useSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'workouts' | 'appointments' | 'progress' | 'notifications'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would be API calls
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

        // Mock data
        const mockClients: Client[] = Array(15).fill(null).map((_, i) => ({
          id: `client-${i + 1}`,
          name: `Client ${i + 1}`,
          email: `client${i + 1}@example.com`,
          phone: `+1 555-${100 + i}`,
          active: Math.random() > 0.2,
          joinDate: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
          lastCheckIn: new Date(Date.now() - Math.random() * 1000000000).toISOString().split('T')[0],
          workoutPlan: Math.random() > 0.3 ? `Workout Plan ${Math.floor(Math.random() * 5) + 1}` : null,
          renewalDate: new Date(Date.now() + Math.random() * 10000000000).toISOString().split('T')[0],
          renewalProbability: Math.random(),
          progress: {
            recentWeight: 70 + Math.random() * 30,
            previousWeight: 70 + Math.random() * 30,
            recentBodyFat: 15 + Math.random() * 10,
            previousBodyFat: 15 + Math.random() * 10,
            workoutCompletionRate: Math.random() * 100
          }
        }));

        const mockAppointments: Appointment[] = Array(8).fill(null).map((_, i) => ({
          id: `appointment-${i + 1}`,
          clientId: `client-${Math.floor(Math.random() * 15) + 1}`,
          clientName: `Client ${Math.floor(Math.random() * 15) + 1}`,
          date: new Date(Date.now() + (i * 86400000)).toISOString().split('T')[0],
          time: `${9 + Math.floor(Math.random() * 8)}:00`,
          duration: 60,
          status: ['pending', 'confirmed', 'completed', 'cancelled'][Math.floor(Math.random() * 4)] as 'pending' | 'confirmed' | 'completed' | 'cancelled',
          notes: ''
        }));

        const mockWorkoutPlans: WorkoutPlan[] = Array(5).fill(null).map((_, i) => ({
          id: `plan-${i + 1}`,
          name: `Workout Plan ${i + 1}`,
          difficulty: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)] as 'beginner' | 'intermediate' | 'advanced',
          focus: ['Strength', 'Cardio', 'Hypertrophy', 'Weight Loss', 'General Fitness'][Math.floor(Math.random() * 5)],
          duration: 4 + Math.floor(Math.random() * 8),
          clientCount: Math.floor(Math.random() * 10),
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0]
        }));

        setClients(mockClients);
        setAppointments(mockAppointments);
        setWorkoutPlans(mockWorkoutPlans);

        // Set stats
        setStats([
          {
            title: 'Total Clients',
            value: mockClients.filter(c => c.active).length,
            icon: <Users className="h-6 w-6" />,
            change: 5.2,
            color: 'bg-blue-500'
          },
          {
            title: "Today's Appointments",
            value: mockAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
            icon: <Calendar className="h-6 w-6" />,
            change: 0,
            color: 'bg-green-500'
          },
          {
            title: 'Active Workout Plans',
            value: mockWorkoutPlans.length,
            icon: <Dumbbell className="h-6 w-6" />,
            change: 12.5,
            color: 'bg-purple-500'
          },
          {
            title: 'Renewal Predictions',
            value: mockClients.filter(c => c.renewalProbability > 0.7).length,
            icon: <RefreshCw className="h-6 w-6" />,
            change: -2.4,
            color: 'bg-amber-500'
          },
          {
            title: 'Progress Alerts',
            value: mockClients.filter(c => Math.abs(c.progress.recentWeight - c.progress.previousWeight) > 2).length,
            icon: <Bell className="h-6 w-6" />,
            change: 7.1,
            color: 'bg-red-500'
          }
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Filter clients based on search query
  const filteredClients = searchQuery ? 
    clients.filter(client => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) 
    : clients;

  // Get today's appointments
  const todayAppointments = appointments.filter(
    app => app.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Trainer Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your clients, appointments, and workout plans</p>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          {['overview', 'clients', 'workouts', 'appointments', 'progress', 'notifications'].map((tab) => (
            <li key={tab} className="mr-2">
              <button
                onClick={() => setActiveTab(tab as any)}
                className={`inline-block p-4 rounded-t-lg ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                    : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                      </div>
                      <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center">
                      {stat.change > 0 ? (
                        <span className="text-green-500 text-xs flex items-center">
                          +{stat.change}% <span className="ml-1">↑</span>
                        </span>
                      ) : (
                        <span className="text-red-500 text-xs flex items-center">
                          {stat.change}% <span className="ml-1">↓</span>
                        </span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Today's Appointments */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Today's Appointments</h2>
                {todayAppointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {todayAppointments.map((appointment) => (
                          <tr key={appointment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{appointment.clientName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{appointment.time}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{appointment.duration} min</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                                View
                              </button>
                              <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                                Complete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No appointments scheduled for today.</p>
                )}
              </div>

              {/* Client Progress Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Client Progress Summary</h2>
                  <button className="text-sm text-blue-600 dark:text-blue-400">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="text-md font-medium mb-2">Workout Completion Rate</h3>
                    <div className="h-48 flex items-center justify-center text-gray-400">
                      [Bar Chart Visualization Placeholder]
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="text-md font-medium mb-2">Weight Progress</h3>
                    <div className="h-48 flex items-center justify-center text-gray-400">
                      [Line Chart Visualization Placeholder]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clients Tab */}
          {activeTab === 'clients' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between">
                <h2 className="text-lg font-semibold mb-2 md:mb-0">Manage Clients</h2>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search clients..."
                      className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <button className="flex items-center justify-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    <span>Add Client</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Workout Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Check-in</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredClients.slice(0, 10).map((client) => (
                      <tr key={client.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              {client.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{client.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{client.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{client.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            client.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {client.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {client.workoutPlan || 'Not assigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {client.lastCheckIn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                            View
                          </button>
                          <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3">
                            Edit
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing 1 to {Math.min(10, filteredClients.length)} of {filteredClients.length} clients
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm">Previous</button>
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 bg-blue-600 text-white rounded-md text-sm">1</button>
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would be implemented here */}
          {activeTab !== 'overview' && activeTab !== 'clients' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex justify-center items-center h-64">
              <p className="text-gray-500 dark:text-gray-400">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} functionality is coming soon!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 