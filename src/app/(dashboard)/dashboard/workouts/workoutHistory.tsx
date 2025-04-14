'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, ChevronDown, ChevronUp, Search, Filter, Activity } from 'lucide-react';

// Types for workout history
interface WorkoutHistoryEntry {
  id: string;
  date: string;
  name: string;
  duration: number; // in minutes
  intensity: 'low' | 'medium' | 'high';
  muscleGroups: string[];
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    notes?: string;
  }[];
  notes?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
}

// Mock data generator
const generateMockWorkoutHistory = (): WorkoutHistoryEntry[] => {
  const exercises = [
    { name: 'Bench Press', muscleGroup: 'Chest' },
    { name: 'Squats', muscleGroup: 'Legs' },
    { name: 'Deadlifts', muscleGroup: 'Back' },
    { name: 'Pull-ups', muscleGroup: 'Back' },
    { name: 'Shoulder Press', muscleGroup: 'Shoulders' },
    { name: 'Bicep Curls', muscleGroup: 'Arms' },
    { name: 'Tricep Extensions', muscleGroup: 'Arms' },
    { name: 'Leg Press', muscleGroup: 'Legs' },
    { name: 'Lat Pulldown', muscleGroup: 'Back' },
    { name: 'Crunches', muscleGroup: 'Core' },
    { name: 'Leg Raises', muscleGroup: 'Core' },
    { name: 'Plank', muscleGroup: 'Core' },
  ];

  const workoutNames = [
    'Full Body Workout',
    'Upper Body Focus',
    'Lower Body Day',
    'Push Day',
    'Pull Day',
    'Leg Day',
    'Core and Cardio',
    'Strength Training',
    'High Intensity Training',
    'Recovery Session',
  ];

  const history: WorkoutHistoryEntry[] = [];

  // Generate 30 workout entries for the past 60 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    
    // Randomly select 3-6 exercises
    const selectedExercises = [...exercises]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3 + Math.floor(Math.random() * 4));
    
    // Track muscle groups
    const muscleGroups = [...new Set(selectedExercises.map(e => e.muscleGroup))];
    
    // Create workout exercises with progression
    const workoutExercises = selectedExercises.map(exercise => {
      const sets = 3 + Math.floor(Math.random() * 3);
      const reps = 8 + Math.floor(Math.random() * 8);
      const weight = exercise.name !== 'Plank' ? 20 + Math.floor(Math.random() * 80) : undefined;
      
      return {
        name: exercise.name,
        sets,
        reps,
        weight,
        notes: Math.random() > 0.7 ? 'Increase weight next time' : undefined,
      };
    });
    
    // Create workout entry
    const workout: WorkoutHistoryEntry = {
      id: `workout-${i}`,
      date: date.toISOString().split('T')[0],
      name: workoutNames[Math.floor(Math.random() * workoutNames.length)],
      duration: 30 + Math.floor(Math.random() * 60),
      intensity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      muscleGroups,
      exercises: workoutExercises,
      notes: Math.random() > 0.7 ? 'Felt strong today, might increase weights next session.' : undefined,
      rating: Math.random() > 0.3 ? (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5 : undefined,
    };
    
    history.push(workout);
  }
  
  // Sort by date (newest first)
  return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const WorkoutHistoryComponent = () => {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<WorkoutHistoryEntry[]>([]);
  const [expandedWorkouts, setExpandedWorkouts] = useState<{[key: string]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMuscleGroup, setFilterMuscleGroup] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('all');
  
  useEffect(() => {
    // Simulate API call to fetch workout history
    setIsLoading(true);
    setTimeout(() => {
      const data = generateMockWorkoutHistory();
      setWorkoutHistory(data);
      setFilteredHistory(data);
      setIsLoading(false);
    }, 800);
  }, []);
  
  useEffect(() => {
    // Apply filters when search term, muscle group filter or timeframe changes
    let filtered = [...workoutHistory];
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(workout => 
        workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.exercises.some(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply muscle group filter
    if (filterMuscleGroup) {
      filtered = filtered.filter(workout => 
        workout.muscleGroups.includes(filterMuscleGroup)
      );
    }
    
    // Apply timeframe filter
    if (selectedTimeframe !== 'all') {
      const today = new Date();
      const cutoffDate = new Date();
      
      if (selectedTimeframe === 'week') {
        cutoffDate.setDate(today.getDate() - 7);
      } else if (selectedTimeframe === 'month') {
        cutoffDate.setMonth(today.getMonth() - 1);
      }
      
      filtered = filtered.filter(workout => 
        new Date(workout.date) >= cutoffDate
      );
    }
    
    setFilteredHistory(filtered);
  }, [searchTerm, filterMuscleGroup, selectedTimeframe, workoutHistory]);
  
  const toggleWorkoutExpanded = (workoutId: string) => {
    setExpandedWorkouts(prev => ({
      ...prev,
      [workoutId]: !prev[workoutId]
    }));
  };
  
  const getAllMuscleGroups = () => {
    const groups = new Set<string>();
    workoutHistory.forEach(workout => {
      workout.muscleGroups.forEach(group => groups.add(group));
    });
    return Array.from(groups).sort();
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Get intensity color
  const getIntensityColor = (intensity: 'low' | 'medium' | 'high') => {
    switch (intensity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Render star rating
  const renderRating = (rating?: 1 | 2 | 3 | 4 | 5) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => (
          <svg 
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <Activity className="mr-2 h-5 w-5 text-blue-500" />
        Workout History
      </h2>
      
      {/* Filters and Search */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search workouts or exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={filterMuscleGroup || ''}
            onChange={(e) => setFilterMuscleGroup(e.target.value || null)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Muscle Groups</option>
            {getAllMuscleGroups().map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-5 w-5 text-gray-500" />
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as 'week' | 'month' | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-500 mb-1">Total Workouts</h3>
          <p className="text-2xl font-bold">{filteredHistory.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-500 mb-1">Average Duration</h3>
          <p className="text-2xl font-bold">
            {filteredHistory.length > 0 
              ? `${Math.round(filteredHistory.reduce((acc, workout) => acc + workout.duration, 0) / filteredHistory.length)} min`
              : '0 min'}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-500 mb-1">Most Trained</h3>
          <p className="text-2xl font-bold">
            {filteredHistory.length > 0 
              ? (() => {
                  const counts: {[key: string]: number} = {};
                  filteredHistory.forEach(workout => {
                    workout.muscleGroups.forEach(group => {
                      counts[group] = (counts[group] || 0) + 1;
                    });
                  });
                  const sortedGroups = Object.entries(counts).sort((a, b) => b[1] - a[1]);
                  return sortedGroups.length > 0 ? sortedGroups[0][0] : 'None';
                })()
              : 'None'}
          </p>
        </div>
      </div>
      
      {/* Workout History List */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No workouts match your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map(workout => (
            <div 
              key={workout.id} 
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Workout Header */}
              <div 
                className="p-4 flex flex-wrap justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => toggleWorkoutExpanded(workout.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{workout.name}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getIntensityColor(workout.intensity)}`}>
                      {workout.intensity.charAt(0).toUpperCase() + workout.intensity.slice(1)}
                    </span>
                    {renderRating(workout.rating)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(workout.date)}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {workout.muscleGroups.map(group => (
                      <span 
                        key={group}
                        className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {group}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                      {workout.duration} min
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex">
                  {expandedWorkouts[workout.id] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
              
              {/* Workout Details (expandable) */}
              {expandedWorkouts[workout.id] && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <h4 className="font-medium mb-3">Exercises</h4>
                  <div className="space-y-3">
                    {workout.exercises.map((exercise, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-md shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{exercise.name}</p>
                            <p className="text-sm text-gray-500">
                              {exercise.sets} sets × {exercise.reps} reps 
                              {exercise.weight && ` • ${exercise.weight} kg`}
                            </p>
                          </div>
                          
                          {/* Progress indicators could go here in a real app */}
                        </div>
                        
                        {exercise.notes && (
                          <div className="mt-2 text-sm text-gray-700 italic">
                            Note: {exercise.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {workout.notes && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                      <h4 className="text-sm font-medium text-yellow-800 mb-1">Workout Notes</h4>
                      <p className="text-sm text-yellow-800">{workout.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutHistoryComponent; 