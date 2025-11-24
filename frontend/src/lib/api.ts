const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private backendUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string, backendUrl: string, token: string | null = null) {
    this.baseUrl = baseUrl;
    this.backendUrl = backendUrl;
    this.token = localStorage.getItem('inzozi_token') || null;
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('inzozi_token', token);
    } else {
      localStorage.removeItem('inzozi_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.backendUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: 'An error occurred',
        }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      // Log detailed error information for debugging
      console.error(`API Error at ${url}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch: Network error or CORS issue');
    }
  }

  // Auth endpoints
  async signup(data: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'teacher' | 'admin';
  }) {
    const response = await this.request<{
      user: { id: string; name: string; email: string; role: string };
      token: string;
      message: string;
    }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.token);
    return response;
  }

  async login(data: { email: string; password: string }) {
    const response = await this.request<{
      user: { id: string; name: string; email: string; role: string };
      token: string;
      message: string;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.token);
    return response;
  }

  async getCurrentUser() {
    return this.request<{ user: { id: string; name: string; email: string; role: string } }>(
      '/api/auth/me'
    );
  }

  // Student endpoints
  async getStudentProfile() {
    return this.request<{
      user: { id: string; name: string; email: string };
      profile: {
        id: string;
        grade: string | null;
        attendance: number;
        performance: string | null;
        interests: string[];
      };
    }>('/api/student/profile');
  }

  async submitQuiz(interests: string[]) {
    return this.request<{
      message: string;
      quizResult: { id: string; interests: string[] };
    }>('/api/student/quiz', {
      method: 'POST',
      body: JSON.stringify({ interests }),
    });
  }

  async getQuizResults() {
    return this.request<{
      interests: string[];
      latestResult: { id: string; interests: string[]; completedAt: string } | null;
    }>('/api/student/quiz/results');
  }

  // Teacher endpoints
  async getTeacherProfile() {
    return this.request<{
      user: { id: string; name: string; email: string };
      profile: {
        id: string;
        points: number;
        level: number;
        achievements: Array<{ id: string; title: string; description: string }>;
        students: Array<{
          id: string;
          studentName: string;
          performance: string;
          feedback: string;
        }>;
      };
    }>('/api/teacher/profile');
  }

  async submitFeedback(data: {
    studentName: string;
    performance: 'Excellent' | 'Very Good' | 'Good' | 'Needs Improvement';
    feedback: string;
  }) {
    return this.request<{
      message: string;
      feedback: { id: string };
      pointsEarned: number;
      newPoints: number;
      newLevel: number;
    }>('/api/teacher/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getStudents() {
    return this.request<{
      students: Array<{
        id: string;
        name: string;
        attendance: string;
        performance: string;
      }>;
    }>('/api/teacher/students');
  }

  async getStudentQuizSummaries() {
    return this.request<{
      summaries: Array<{
        studentId: string;
        studentName: string;
        interests: string[];
        completedAt: string;
      }>;
    }>('/api/teacher/students/quiz-summaries');
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request<{
      totalUsers: number;
      students: number;
      teachers: number;
      totalDonations: number;
      activeCases: number;
    }>('/api/admin/stats');
  }

  async getRoleDistribution() {
    return this.request<{
      students: { count: number; percentage: string };
      teachers: { count: number; percentage: string };
      admins: { count: number; percentage: string };
    }>('/api/admin/users/role-distribution');
  }

  async getAtRiskStudents() {
    return this.request<{
      students: Array<{
        name: string;
        grade: string;
        attendance: string;
        performance: string;
        severity: string;
      }>;
    }>('/api/admin/students/at-risk');
  }
}

export const apiClient = new ApiClient(API_BASE_URL, API_BACKEND_URL);


