export interface JobApplication {
  id?: number;
  jobId?: string;
  companyName: string;
  role: string;
  jobDescription?: string;
  appliedDateTime?: string;
  resumeVersion?: string;
  jobLinkUrl?: string;
  emailUsed?: string;
  status?: string;
  platform?: string;
  notes?: string;
  salary?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalApplications: number;
  statusCounts: { [key: string]: number };
  applicationsThisWeek: number;
  applicationsThisMonth: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  email: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  username: string;
  fullName: string;
}

export interface MessageResponse {
  message: string;
  success: boolean;
}
