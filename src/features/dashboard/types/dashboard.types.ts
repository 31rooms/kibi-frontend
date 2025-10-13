export interface DashboardUser {
  email?: string;
  phoneNumber?: string;
  profileComplete?: boolean;
  firstName?: string;
  lastName?: string;
}

export interface DashboardStats {
  coursesCount: number;
  progressPercentage: number;
  completedLessons: number;
}
