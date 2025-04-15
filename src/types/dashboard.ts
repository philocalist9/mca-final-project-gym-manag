// Dashboard data types

export interface Workout {
  id: number;
  name: string;
  date: string;
  trainer: string;
}

export interface Activity {
  id: number;
  type: string;
  name: string;
  date: string;
}

export interface DashboardStats {
  workoutCompletions: number;
  appointmentsScheduled: number;
  daysActive: number;
  activeWorkoutPlans: number;
}

export interface DashboardData {
  stats: DashboardStats;
  upcomingWorkouts: Workout[];
  recentActivities: Activity[];
} 