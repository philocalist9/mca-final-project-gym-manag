'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/SessionProvider';
import { CalendarDays, Filter, ChevronLeft, ChevronRight, CheckCircle2, Clock, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import WorkoutHistoryComponent from './workoutHistory';

// Types for workout data
interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  restTime: number; // in seconds
  weight?: number; // in kg
  notes?: string;
  completed: boolean;
}

interface Workout {
  id: string;
  date: string;
  name: string;
  duration: number; // in minutes
  intensity: 'low' | 'medium' | 'high';
  status: 'completed' | 'upcoming' | 'skipped';
  exercises: Exercise[];
}

interface WorkoutPlan {
  id: string;
  name: string;
  duration: string; // e.g., "6 Weeks"
  frequency: string; // e.g., "3 Days a Week"
  trainer: string;
  startDate: string;
  endDate: string;
  description?: string;
}

// Helper to get formatted day names
const getDayName = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const getDateNumber = (dateString: string): string => {
  const date = new Date(dateString);
  return date.getDate().toString();
};

// Workout card component
const WorkoutCard = ({ 
  workout, 
  markWorkoutAsCompleted,
  markExerciseAsCompleted
}: { 
  workout: Workout, 
  markWorkoutAsCompleted: (id: string) => void,
  markExerciseAsCompleted: (workoutId: string, exerciseId: string) => void
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Status badge component with appropriate colors
  const StatusBadge = ({ status }: { status: Workout['status'] }) => {
    const statusConfig = {
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      upcoming: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
      skipped: { bg: 'bg-red-100', text: 'text-red-800', icon: X }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <div className={`flex items-center px-3 py-1 rounded-full ${config.bg} ${config.text}`}>
        <Icon size={14} className="mr-1" />
        <span className="text-xs font-medium capitalize">{status}</span>
      </div>
    );
  };
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate completion percentage
  const completionPercentage = 
    workout.exercises.length > 0 
      ? Math.round((workout.exercises.filter(e => e.completed).length / workout.exercises.length) * 100) 
      : 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">{workout.name}</h3>
            <StatusBadge status={workout.status} />
          </div>
          
          <p className="text-gray-600">
            {new Date(workout.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            })}
          </p>
          
          <div className="flex flex-wrap gap-4 mt-3">
            <div className="flex items-center">
              <Clock size={16} className="mr-1 text-gray-500" />
              <span className="text-sm">{workout.duration} min</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm">
                Intensity: 
                <span className={`ml-1 font-medium ${
                  workout.intensity === 'high' ? 'text-red-600' :
                  workout.intensity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {workout.intensity.charAt(0).toUpperCase() + workout.intensity.slice(1)}
                </span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          {/* Progress circle */}
          <div className="relative w-16 h-16">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="stroke-current text-gray-200"
                fill="none"
                strokeWidth="3"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`stroke-current ${
                  completionPercentage === 100 ? 'text-green-500' :
                  completionPercentage > 0 ? 'text-blue-500' : 'text-gray-200'
                }`}
                fill="none"
                strokeWidth="3"
                strokeDasharray="100"
                strokeDashoffset={100 - completionPercentage}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.5" className="text-xs font-medium" textAnchor="middle">
                {completionPercentage}%
              </text>
            </svg>
          </div>
          
          {workout.status === 'upcoming' && (
            <button 
              className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
              onClick={() => markWorkoutAsCompleted(workout.id)}
            >
              Mark as Completed
            </button>
          )}
        </div>
      </div>
      
      {/* Exercises Section Toggle */}
      <div 
        className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="font-medium">
          Exercises ({workout.exercises.length})
        </div>
        <div className={`transform transition ${expanded ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} />
        </div>
      </div>
      
      {/* Exercises List */}
      {expanded && (
        <div className="p-4 border-t border-gray-200 divide-y">
          {workout.exercises.map(exercise => (
            <div key={exercise.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
                <div>
                  <h4 className="font-medium">{exercise.name}</h4>
                  <p className="text-sm text-gray-600">Target: {exercise.muscleGroup}</p>
                </div>
                
                {workout.status === 'upcoming' && !exercise.completed && (
                  <button 
                    className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      markExerciseAsCompleted(workout.id, exercise.id);
                    }}
                  >
                    Mark as Done
                  </button>
                )}
                
                {exercise.completed && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle2 size={16} className="mr-1" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                <div>
                  <p className="text-xs text-gray-500">Sets & Reps</p>
                  <p className="font-medium">{exercise.sets} × {exercise.reps}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rest Time</p>
                  <p className="font-medium">{formatTime(exercise.restTime)}</p>
                </div>
                {exercise.weight && (
                  <div>
                    <p className="text-xs text-gray-500">Weight</p>
                    <p className="font-medium">{exercise.weight} kg</p>
                  </div>
                )}
              </div>
              
              {exercise.notes && (
                <div className="mt-3 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-md">
                  <div className="font-medium mb-1">Trainer Notes:</div>
                  {exercise.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function WorkoutsPage() {
  const { session } = useSession();
  
  // State for data
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // State for UI
  const [activeTab, setActiveTab] = useState<'this-week' | 'all-workouts' | 'plan-details'>('this-week');
  const [selectedDay, setSelectedDay] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filterMuscleGroup, setFilterMuscleGroup] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'upcoming' | 'skipped'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'duration' | 'intensity'>('name');
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay();
    // Get the date of Monday of the current week
    return new Date(today.setDate(today.getDate() - day + (day === 0 ? -6 : 1)));
  });
  
  // Get week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date.toISOString().split('T')[0];
  });
  
  // Navigate between weeks
  const previousWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() - 7);
    setWeekStart(newStart);
  };
  
  const nextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStart(newStart);
  };
  
  // Get today's date string
  const today = new Date().toISOString().split('T')[0];

  // Check if a date is today
  const isToday = (dateString: string): boolean => {
    return dateString === today;
  };

  // Fetch workouts data
  useEffect(() => {
    const fetchWorkoutData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        
        // Generate 4 weeks of mock data
        const mockWorkouts: Workout[] = [];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 14); // Start 2 weeks ago
        
        for (let i = 0; i < 28; i++) {
          const workoutDate = new Date(startDate);
          workoutDate.setDate(startDate.getDate() + i);
          const dateString = workoutDate.toISOString().split('T')[0];
          
          // Skip some days to simulate rest days
          if (i % 3 === 0) continue;
          
          // Create workout for this day
          const isPast = workoutDate < new Date();
          const status: 'completed' | 'upcoming' | 'skipped' = 
            isPast ? (Math.random() > 0.3 ? 'completed' : 'skipped') : 'upcoming';
          
          const workout: Workout = {
            id: `workout-${i}`,
            date: dateString,
            name: `Workout ${String.fromCharCode(65 + (i % 4))}`, // A, B, C, D
            duration: 45 + Math.floor(Math.random() * 30), // 45-75 minutes
            intensity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
            status,
            exercises: []
          };
          
          // Add exercises to the workout
          const exercisesCount = 3 + Math.floor(Math.random() * 4); // 3-6 exercises
          const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
          const exerciseNames = [
            'Bench Press', 'Squats', 'Deadlifts', 'Pull-ups', 'Push-ups', 
            'Shoulder Press', 'Bicep Curls', 'Tricep Extensions', 'Lunges', 
            'Leg Press', 'Lat Pulldown', 'Plank', 'Crunches'
          ];
          
          for (let j = 0; j < exercisesCount; j++) {
            const muscleGroup = muscleGroups[Math.floor(Math.random() * muscleGroups.length)];
            const exerciseName = exerciseNames[Math.floor(Math.random() * exerciseNames.length)];
            
            workout.exercises.push({
              id: `exercise-${i}-${j}`,
              name: exerciseName,
              muscleGroup,
              sets: 3 + Math.floor(Math.random() * 3), // 3-5 sets
              reps: 8 + Math.floor(Math.random() * 8), // 8-15 reps
              restTime: 30 + Math.floor(Math.random() * 90), // 30-120 seconds
              weight: 20 + Math.floor(Math.random() * 50), // 20-70 kg
              notes: Math.random() > 0.5 ? 'Focus on form and controlled movement' : undefined,
              completed: status === 'completed'
            });
          }
          
          mockWorkouts.push(workout);
        }
        
        // Create mock workout plan
        const mockPlan: WorkoutPlan = {
          id: 'plan-1',
          name: 'Muscle Gain – Intermediate',
          duration: '6 Weeks',
          frequency: '3 Days a Week',
          trainer: 'Alex Johnson',
          startDate: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString().split('T')[0],
          endDate: new Date(new Date().setDate(new Date().getDate() + 28)).toISOString().split('T')[0],
          description: 'A program designed to build muscle mass with progressive overload. Focus on compound movements with adequate rest periods.'
        };
        
        setWorkouts(mockWorkouts);
        setWorkoutPlan(mockPlan);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setIsLoading(false);
      }
    };
    
    fetchWorkoutData();
  }, []);

  // Filter workouts
  const filteredWorkouts = workouts
    .filter(workout => {
      // Filter by day
      if (activeTab === 'this-week') {
        return weekDates.includes(workout.date);
      }
      return true;
    })
    .filter(workout => {
      // Filter by status
      if (filterStatus !== 'all') {
        return workout.status === filterStatus;
      }
      return true;
    })
    .filter(workout => {
      // Filter by muscle group
      if (filterMuscleGroup !== 'all') {
        return workout.exercises.some(exercise => exercise.muscleGroup === filterMuscleGroup);
      }
      return true;
    });

  // Sort workouts
  const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'duration') {
      return a.duration - b.duration;
    }
    if (sortBy === 'intensity') {
      const intensityValue = { low: 0, medium: 1, high: 2 };
      return intensityValue[a.intensity] - intensityValue[b.intensity];
    }
    return 0;
  });

  // Get workouts for a specific day
  const getWorkoutsForDay = (date: string) => {
    return workouts.filter(workout => workout.date === date);
  };

  // Get today's workouts
  const todaysWorkouts = workouts.filter(workout => workout.date === today);

  // Mark a workout as completed
  const markWorkoutAsCompleted = (workoutId: string) => {
    setWorkouts(prevWorkouts => 
      prevWorkouts.map(workout => 
        workout.id === workoutId 
          ? { 
              ...workout, 
              status: 'completed',
              exercises: workout.exercises.map(exercise => ({ ...exercise, completed: true }))
            } 
          : workout
      )
    );
  };

  // Mark an exercise as completed
  const markExerciseAsCompleted = (workoutId: string, exerciseId: string) => {
    setWorkouts(prevWorkouts => 
      prevWorkouts.map(workout => 
        workout.id === workoutId 
          ? { 
              ...workout, 
              exercises: workout.exercises.map(exercise => 
                exercise.id === exerciseId 
                  ? { ...exercise, completed: true } 
                  : exercise
              )
            } 
          : workout
      )
    );
    
    // If all exercises are completed, mark the workout as completed
    const workoutIndex = workouts.findIndex(w => w.id === workoutId);
    if (workoutIndex !== -1) {
      const allExercisesCompleted = workouts[workoutIndex].exercises.every(
        (e, i, arr) => e.id === exerciseId ? true : e.completed
      );
      
      if (allExercisesCompleted) {
        markWorkoutAsCompleted(workoutId);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Workouts</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'this-week' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('this-week')}
        >
          This Week
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'all-workouts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('all-workouts')}
        >
          All Workouts
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'plan-details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('plan-details')}
        >
          Plan Details
        </button>
      </div>

      {/* This Week View */}
      {activeTab === 'this-week' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Weekly Schedule</h2>
            <div className="flex items-center">
              <button 
                className="p-2 text-gray-500 hover:text-gray-700"
                onClick={previousWeek}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="mx-2">
                {new Date(weekDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                {new Date(weekDates[6]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <button 
                className="p-2 text-gray-500 hover:text-gray-700"
                onClick={nextWeek}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Week days selection */}
          <div className="grid grid-cols-7 gap-2 mb-8">
            {weekDates.map(date => {
              const dayWorkouts = getWorkoutsForDay(date);
              const hasWorkout = dayWorkouts.length > 0;
              const statusColors = {
                completed: 'bg-green-100 text-green-800',
                upcoming: 'bg-blue-100 text-blue-800',
                skipped: 'bg-red-100 text-red-800'
              };
              
              return (
                <button 
                  key={date} 
                  className={`
                    flex flex-col items-center p-3 rounded-lg border
                    ${isToday(date) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}
                    ${date === selectedDay ? 'ring-2 ring-blue-500' : ''}
                  `}
                  onClick={() => setSelectedDay(date)}
                >
                  <span className="text-sm font-medium">{getDayName(date)}</span>
                  <span className={`text-xl mt-1 ${isToday(date) ? 'font-bold text-blue-600' : ''}`}>
                    {getDateNumber(date)}
                  </span>
                  
                  {hasWorkout && (
                    <div className="mt-2 w-full">
                      {dayWorkouts.map((workout, idx) => (
                        <div 
                          key={idx}
                          className={`
                            text-xs px-2 py-1 mt-1 rounded-full text-center truncate
                            ${statusColors[workout.status]}
                          `}
                        >
                          {workout.name}
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected day workouts */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {new Date(selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            
            {getWorkoutsForDay(selectedDay).length > 0 ? (
              <div className="space-y-6">
                {getWorkoutsForDay(selectedDay).map(workout => (
                  <WorkoutCard 
                    key={workout.id} 
                    workout={workout} 
                    markWorkoutAsCompleted={markWorkoutAsCompleted}
                    markExerciseAsCompleted={markExerciseAsCompleted}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-500">No workouts scheduled for this day</p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  Add Workout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Workouts View */}
      {activeTab === 'all-workouts' && (
        <div>
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-semibold">All Workouts</h2>
            
            {/* Filter and sort options */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <label htmlFor="filter-status" className="mr-2 text-sm">Status:</label>
                <select 
                  id="filter-status"
                  className="p-2 border rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                >
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="skipped">Skipped</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <label htmlFor="filter-muscle" className="mr-2 text-sm">Muscle:</label>
                <select 
                  id="filter-muscle"
                  className="p-2 border rounded-md"
                  value={filterMuscleGroup}
                  onChange={(e) => setFilterMuscleGroup(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="Chest">Chest</option>
                  <option value="Back">Back</option>
                  <option value="Legs">Legs</option>
                  <option value="Shoulders">Shoulders</option>
                  <option value="Arms">Arms</option>
                  <option value="Core">Core</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <label htmlFor="sort-by" className="mr-2 text-sm">Sort:</label>
                <select 
                  id="sort-by"
                  className="p-2 border rounded-md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="name">Name</option>
                  <option value="duration">Duration</option>
                  <option value="intensity">Intensity</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Workouts list */}
          <div className="space-y-6">
            {sortedWorkouts.length > 0 ? (
              sortedWorkouts.map(workout => (
                <WorkoutCard 
                  key={workout.id} 
                  workout={workout} 
                  markWorkoutAsCompleted={markWorkoutAsCompleted}
                  markExerciseAsCompleted={markExerciseAsCompleted}
                />
              ))
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-500">No workouts found with the current filters</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plan Details View */}
      {activeTab === 'plan-details' && workoutPlan && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">{workoutPlan.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Plan Duration</p>
                  <p className="font-medium">{workoutPlan.duration}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Frequency</p>
                  <p className="font-medium">{workoutPlan.frequency}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Trainer</p>
                  <p className="font-medium">{workoutPlan.trainer}</p>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">
                    {new Date(workoutPlan.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-medium">
                    {new Date(workoutPlan.endDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
            
            {workoutPlan.description && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-gray-700">{workoutPlan.description}</p>
              </div>
            )}
            
            <div className="mt-8 flex gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Change Plan
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">
                Join New Plan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Workout Plans</h2>
          <p className="text-sm text-gray-500">View and manage your workout plans.</p>
        </div>
        
        <div className="space-y-4">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} markWorkoutAsCompleted={markWorkoutAsCompleted} markExerciseAsCompleted={markExerciseAsCompleted} />
          ))}
        </div>
        
        <WorkoutHistoryComponent />
      </div>
    </div>
  );
} 