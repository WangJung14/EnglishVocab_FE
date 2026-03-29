export interface DashboardData {
  totalLessonsCompleted: number;
  totalTopicsCompleted: number;
  currentStreak: number;
  longestStreak: number;
}

export interface StatsData {
  totalLessonsStarted: number;
  totalLessonsCompleted: number;
  completionRate: number;
  averageScore: number;
  totalWordsLearned: number;
  reviewCount: number;
}
