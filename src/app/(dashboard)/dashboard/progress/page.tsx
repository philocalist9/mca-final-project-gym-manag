'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/SessionProvider';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';

// Types
interface Measurement {
  id: string;
  date: string;
  chest: number;
  waist: number;
  biceps: number;
  thighs: number;
  shoulders: number;
  bodyFat?: number;
}

interface WorkoutLog {
  id: string;
  date: string;
  name: string;
  duration: number;
  muscles: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

interface WeightLog {
  date: string;
  weight: number;
}

interface ProgressData {
  currentWeight: number;
  targetWeight: number;
  totalWorkouts: number;
  daysActive: number;
  currentStreak: number;
  lastWorkout: WorkoutLog | null;
  measurements: Measurement[];
  weightHistory: WeightLog[];
  workoutLogs: WorkoutLog[];
  achievements: Achievement[];
}

// PRNG function for consistent random data
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export default function ProgressTrackerPage() {
  const { session } = useSession();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'measurements' | 'achievements'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [newMeasurement, setNewMeasurement] = useState<Omit<Measurement, 'id' | 'date'>>({
    chest: 0,
    waist: 0,
    biceps: 0,
    thighs: 0,
    shoulders: 0,
    bodyFat: undefined,
  });
  const [measurementDate, setMeasurementDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Format date function
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format date for chart display (shorter format)
  const formatChartDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Load mock data for the progress tracker
  useEffect(() => {
    const generateMockData = (): ProgressData => {
      // Generate dates for the past 90 days
      const today = new Date();
      const dates: string[] = [];
      for (let i = 90; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }

      // Generate weight history with slight variations around a downward trend
      const startWeight = 75; // Starting weight in kg
      const targetWeight = 68; // Target weight in kg
      const weightHistory: WeightLog[] = dates.map((date, index) => {
        // Create a downward trend with some randomness
        const progress = index / dates.length;
        const trend = startWeight - (startWeight - targetWeight) * progress;
        const noise = seededRandom(index) * 1.5 - 0.75; // Random variation
        return {
          date,
          weight: parseFloat((trend + noise).toFixed(1))
        };
      });

      // Create workout logs (not every day)
      const workoutNames = [
        'Full Body Workout', 'Chest Day', 'Leg Day', 'Back & Biceps',
        'Shoulders & Triceps', 'Cardio Session', 'HIIT Training',
        'Core Strength', 'Upper Body', 'Lower Body'
      ];
      
      const muscleGroups = [
        'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'
      ];

      const workoutLogs: WorkoutLog[] = [];
      // Add workouts on average 3-4 times per week
      for (let i = 0; i < dates.length; i++) {
        // Workout with ~50% probability, ensuring some gaps
        if (seededRandom(i * 1000) > 0.5) {
          const nameIndex = Math.floor(seededRandom(i * 500) * workoutNames.length);
          
          // Random muscle groups for this workout (1-3 groups)
          const workoutMuscles: string[] = [];
          const numMuscles = Math.floor(seededRandom(i * 700) * 3) + 1;
          
          for (let j = 0; j < numMuscles; j++) {
            const muscleIndex = Math.floor(seededRandom(i * 800 + j) * muscleGroups.length);
            if (!workoutMuscles.includes(muscleGroups[muscleIndex])) {
              workoutMuscles.push(muscleGroups[muscleIndex]);
            }
          }
          
          workoutLogs.push({
            id: `workout-${i}`,
            date: dates[i],
            name: workoutNames[nameIndex],
            duration: Math.floor(seededRandom(i * 200) * 60) + 30, // 30-90 minutes
            muscles: workoutMuscles
          });
        }
      }

      // Generate measurements (every 2 weeks)
      const measurements: Measurement[] = [];
      for (let i = 0; i < dates.length; i += 14) {
        measurements.push({
          id: `measurement-${i}`,
          date: dates[i],
          chest: 100 - progress(i, 0, 5),
          waist: 85 - progress(i, 0, 8),
          biceps: 35 + progress(i, 0, 2),
          thighs: 55 - progress(i, 0, 3),
          shoulders: 110 + progress(i, 0, 2),
          bodyFat: seededRandom(i * 300) > 0.4 ? 20 - progress(i, 0, 5) : undefined
        });
      }

      // Calculate progress-based metrics
      const currentWeight = weightHistory[weightHistory.length - 1].weight;
      const totalWorkouts = workoutLogs.length;
      
      // Count unique active days
      const uniqueWorkoutDays = new Set(workoutLogs.map(w => w.date.split('T')[0])).size;
      
      // Calculate streak
      let currentStreak = 0;
      let tempStreak = 0;
      
      // Start from yesterday and go backwards
      for (let i = dates.length - 2; i >= 0; i--) {
        const date = dates[i];
        const hasWorkout = workoutLogs.some(w => w.date === date);
        
        if (hasWorkout) {
          tempStreak++;
        } else {
          // Break streak and update if it's the highest
          if (tempStreak > currentStreak) {
            currentStreak = tempStreak;
          }
          tempStreak = 0;
        }
      }
      
      // If still in a streak at the end of the loop
      if (tempStreak > currentStreak) {
        currentStreak = tempStreak;
      }
      
      // Get last workout
      const sortedWorkouts = [...workoutLogs].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const lastWorkout = sortedWorkouts.length > 0 ? sortedWorkouts[0] : null;

      // Create achievements
      const achievements: Achievement[] = [
        {
          id: 'achievement-1',
          title: '50 Workouts Completed',
          description: 'You\'ve completed 50 workouts! Keep up the great work!',
          icon: '💪',
          unlocked: totalWorkouts >= 50,
          unlockedAt: totalWorkouts >= 50 ? dates[Math.floor(dates.length * 0.7)] : undefined
        },
        {
          id: 'achievement-2',
          title: 'Goal Weight Reached',
          description: 'Congratulations on reaching your target weight!',
          icon: '🎯',
          unlocked: currentWeight <= targetWeight,
          unlockedAt: currentWeight <= targetWeight ? dates[dates.length - 1] : undefined
        },
        {
          id: 'achievement-3',
          title: '7-Day Streak',
          description: 'You\'ve worked out for 7 days in a row. Amazing consistency!',
          icon: '🔥',
          unlocked: currentStreak >= 7,
          unlockedAt: currentStreak >= 7 ? dates[dates.length - 8] : undefined
        },
        {
          id: 'achievement-4',
          title: 'First Month Done',
          description: 'You\'ve been with us for a month. Here\'s to many more!',
          icon: '🕒',
          unlocked: dates.length >= 30,
          unlockedAt: dates.length >= 30 ? dates[29] : undefined
        },
        {
          id: 'achievement-5',
          title: 'Logged Progress 5 Times',
          description: 'You\'ve logged your measurements 5 times. Tracking leads to success!',
          icon: '📈',
          unlocked: measurements.length >= 5,
          unlockedAt: measurements.length >= 5 ? measurements[4].date : undefined
        }
      ];

      return {
        currentWeight,
        targetWeight,
        totalWorkouts,
        daysActive: uniqueWorkoutDays,
        currentStreak,
        lastWorkout,
        measurements,
        weightHistory,
        workoutLogs,
        achievements
      };
    };

    // Helper for generating progress
    function progress(index: number, min: number, max: number): number {
      const progressFactor = index / 90; // 90 days total
      const randomFactor = seededRandom(index * 100) * 0.4 - 0.2; // Add some randomness
      return (min + (max - min) * progressFactor + randomFactor).toFixed(1) as unknown as number;
    }

    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const data = generateMockData();
      setProgressData(data);
      setIsLoading(false);
    }, 800);
  }, []);

  // Get monthly workout counts for bar chart
  const getMonthlyWorkoutData = () => {
    if (!progressData) return [];
    
    const monthlyData: { [key: string]: number } = {};
    progressData.workoutLogs.forEach(workout => {
      const date = new Date(workout.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      monthlyData[monthYear] += 1;
    });
    
    return Object.keys(monthlyData).map(key => ({
      month: key,
      workouts: monthlyData[key]
    }));
  };

  // Get muscle focus data for pie chart
  const getMuscleGroupData = () => {
    if (!progressData) return [];
    
    const muscleCount: { [key: string]: number } = {};
    progressData.workoutLogs.forEach(workout => {
      workout.muscles.forEach(muscle => {
        if (!muscleCount[muscle]) {
          muscleCount[muscle] = 0;
        }
        muscleCount[muscle] += 1;
      });
    });
    
    return Object.keys(muscleCount).map(key => ({
      name: key,
      value: muscleCount[key]
    }));
  };

  // Handle adding a new measurement
  const handleAddMeasurement = () => {
    if (!progressData) return;
    
    const measurement: Measurement = {
      id: `measurement-${Date.now()}`,
      date: measurementDate,
      ...newMeasurement
    };
    
    // Add the new measurement
    setProgressData({
      ...progressData,
      measurements: [...progressData.measurements, measurement].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    });
    
    // Reset form
    setNewMeasurement({
      chest: 0,
      waist: 0,
      biceps: 0,
      thighs: 0,
      shoulders: 0,
      bodyFat: undefined
    });
  };

  // Handle measurement input changes
  const handleMeasurementChange = (field: keyof typeof newMeasurement, value: string) => {
    setNewMeasurement(prev => ({
      ...prev,
      [field]: value === '' ? undefined : Number(value)
    }));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // No data state
  if (!progressData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h2 className="text-xl font-semibold mb-4">No Progress Data Available</h2>
        <p className="text-gray-600 text-center">Start logging your workouts and measurements to track your progress.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Progress Tracker</h1>
      
      {/* Tabs Navigation */}
      <div className="mb-6 flex border-b">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'charts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('charts')}
        >
          Progress Charts
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'measurements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('measurements')}
        >
          Measurements
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'achievements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Weight Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Weight</h3>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{progressData.currentWeight} kg</p>
                  <p className="text-sm text-gray-500 mt-1">Target: {progressData.targetWeight} kg</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  progressData.currentWeight <= progressData.targetWeight
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {progressData.currentWeight <= progressData.targetWeight
                    ? 'Goal Reached!'
                    : `${(progressData.currentWeight - progressData.targetWeight).toFixed(1)} kg to go`
                  }
                </div>
              </div>
            </div>
            
            {/* Workout Stats Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Workout Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Workouts</p>
                  <p className="text-2xl font-bold">{progressData.totalWorkouts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Days Active</p>
                  <p className="text-2xl font-bold">{progressData.daysActive}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Streak</p>
                  <p className="text-2xl font-bold flex items-center">
                    {progressData.currentStreak} <span className="ml-1 text-yellow-500">🔥</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Last Workout Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Last Workout</h3>
              {progressData.lastWorkout ? (
                <div>
                  <p className="font-medium">{progressData.lastWorkout.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(progressData.lastWorkout.date)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {progressData.lastWorkout.muscles.map((muscle, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No workouts recorded yet</p>
              )}
            </div>
          </div>

          {/* Recent Weight Trend */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold mb-4">Recent Weight Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressData.weightHistory.slice(-30)} // Last 30 days
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatChartDate}
                    tick={{ fontSize: 12 }}
                    interval="preserveEnd"
                  />
                  <YAxis 
                    domain={[
                      Math.floor(Math.min(...progressData.weightHistory.map(w => w.weight)) - 2),
                      Math.ceil(Math.max(...progressData.weightHistory.map(w => w.weight)) + 2)
                    ]}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} kg`, 'Weight']}
                    labelFormatter={(label) => formatDate(String(label))}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  {/* Target Weight Line */}
                  <Line 
                    type="monotone" 
                    dataKey={() => progressData.targetWeight}
                    stroke="#10B981" 
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Recent Achievements */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Achievements</h3>
              <button 
                className="text-blue-600 text-sm hover:underline"
                onClick={() => setActiveTab('achievements')}
              >
                View All
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {progressData.achievements
                .filter(a => a.unlocked)
                .slice(0, 3)
                .map(achievement => (
                  <div 
                    key={achievement.id}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center w-full md:w-auto"
                  >
                    <div className="text-4xl mr-4">{achievement.icon}</div>
                    <div>
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {achievement.unlockedAt && formatDate(achievement.unlockedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              {progressData.achievements.filter(a => a.unlocked).length === 0 && (
                <p className="text-gray-500 italic">No achievements unlocked yet. Keep going!</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <div className="space-y-8">
          {/* Weight Trend Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Weight Trend</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressData.weightHistory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatChartDate}
                    tick={{ fontSize: 12 }}
                    interval="preserveEnd"
                  />
                  <YAxis 
                    domain={[
                      Math.floor(Math.min(...progressData.weightHistory.map(w => w.weight)) - 2),
                      Math.ceil(Math.max(...progressData.weightHistory.map(w => w.weight)) + 2)
                    ]}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} kg`, 'Weight']}
                    labelFormatter={(label) => formatDate(String(label))}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    name="Weight"
                    dataKey="weight" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 5 }}
                  />
                  {/* Target Weight Line */}
                  <Line 
                    type="monotone" 
                    name="Target Weight"
                    dataKey={() => progressData.targetWeight}
                    stroke="#10B981" 
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Monthly Workout Count */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Monthly Workout Count</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getMonthlyWorkoutData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value} workouts`, 'Count']} />
                  <Legend />
                  <Bar name="Workouts" dataKey="workouts" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Muscle Group Focus */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Muscle Group Focus</h3>
            <div className="h-72 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getMuscleGroupData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getMuscleGroupData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [`${value} workouts`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {/* Measurements Tab */}
      {activeTab === 'measurements' && (
        <div className="space-y-8">
          {/* Add New Measurement Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Log New Measurements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={measurementDate}
                  onChange={(e) => setMeasurementDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chest (cm)
                </label>
                <input
                  type="number"
                  value={newMeasurement.chest || ''}
                  onChange={(e) => handleMeasurementChange('chest', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waist (cm)
                </label>
                <input
                  type="number"
                  value={newMeasurement.waist || ''}
                  onChange={(e) => handleMeasurementChange('waist', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biceps (cm)
                </label>
                <input
                  type="number"
                  value={newMeasurement.biceps || ''}
                  onChange={(e) => handleMeasurementChange('biceps', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thighs (cm)
                </label>
                <input
                  type="number"
                  value={newMeasurement.thighs || ''}
                  onChange={(e) => handleMeasurementChange('thighs', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shoulders (cm)
                </label>
                <input
                  type="number"
                  value={newMeasurement.shoulders || ''}
                  onChange={(e) => handleMeasurementChange('shoulders', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Body Fat % (optional)
                </label>
                <input
                  type="number"
                  value={newMeasurement.bodyFat || ''}
                  onChange={(e) => handleMeasurementChange('bodyFat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <button
              onClick={handleAddMeasurement}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Save Measurements
            </button>
          </div>
          
          {/* Measurements History */}
          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">Measurement History</h3>
            {progressData.measurements.length > 0 ? (
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 border-b">Date</th>
                    <th className="px-4 py-2 border-b">Chest</th>
                    <th className="px-4 py-2 border-b">Waist</th>
                    <th className="px-4 py-2 border-b">Biceps</th>
                    <th className="px-4 py-2 border-b">Thighs</th>
                    <th className="px-4 py-2 border-b">Shoulders</th>
                    <th className="px-4 py-2 border-b">Body Fat %</th>
                  </tr>
                </thead>
                <tbody>
                  {progressData.measurements
                    .slice()
                    .reverse()
                    .map((measurement) => (
                      <tr key={measurement.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border-b">{formatDate(measurement.date)}</td>
                        <td className="px-4 py-3 border-b">{measurement.chest} cm</td>
                        <td className="px-4 py-3 border-b">{measurement.waist} cm</td>
                        <td className="px-4 py-3 border-b">{measurement.biceps} cm</td>
                        <td className="px-4 py-3 border-b">{measurement.thighs} cm</td>
                        <td className="px-4 py-3 border-b">{measurement.shoulders} cm</td>
                        <td className="px-4 py-3 border-b">
                          {measurement.bodyFat !== undefined ? `${measurement.bodyFat}%` : '-'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 italic">No measurements recorded yet</p>
            )}
          </div>
          
          {/* Measurement Trends */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Measurement Trends</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressData.measurements}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatChartDate}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} cm`, '']}
                    labelFormatter={(label) => formatDate(String(label))}
                  />
                  <Legend />
                  <Line type="monotone" name="Chest" dataKey="chest" stroke="#3B82F6" dot={{ r: 3 }} />
                  <Line type="monotone" name="Waist" dataKey="waist" stroke="#EF4444" dot={{ r: 3 }} />
                  <Line type="monotone" name="Biceps" dataKey="biceps" stroke="#10B981" dot={{ r: 3 }} />
                  <Line type="monotone" name="Thighs" dataKey="thighs" stroke="#F59E0B" dot={{ r: 3 }} />
                  <Line type="monotone" name="Shoulders" dataKey="shoulders" stroke="#8B5CF6" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {progressData.achievements.map(achievement => (
              <div 
                key={achievement.id}
                className={`border rounded-lg p-6 transition ${
                  achievement.unlocked
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="text-5xl mb-4">{achievement.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
                <p className="text-gray-600 mb-4">{achievement.description}</p>
                {achievement.unlocked ? (
                  <div className="mt-auto">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Unlocked on {formatDate(achievement.unlockedAt || '')}
                    </div>
                  </div>
                ) : (
                  <div className="mt-auto">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                      Locked
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 