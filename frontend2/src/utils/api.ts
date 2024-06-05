// frontend-nextjs/utils/api.ts

import axios from 'axios';
import { addNotification } from '../../store/notificationSlice';


// Replace with your actual Django backend URL (use environment variables in production)
const apiUrl = 'http://localhost:8000/api';

// Helper function to get the authorization token
const getAuthToken = () => {
  // Adapt based on your token storage (localStorage or cookies)
  return localStorage.getItem('token');
};

// --- Authentication API ---
export const authApi = {
  register: async (userData: any) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/register/`, userData);
      return response.data;
    } catch (error) {
      throw new Error('Registration failed.');
    }
  },
  login: async (credentials: any) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/token/`, credentials);
      return response.data;
    } catch (error) {
      throw new Error('Invalid credentials.');
    }
  },
  refreshToken: async (refreshToken: any) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/token/refresh/`, {
        refresh: refreshToken,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to refresh token.');
    }
  },
  logout: async () => {
    try {
      const response = await axios.post(`${apiUrl}/auth/logout/`);
      return response.data;
    } catch (error) {
      throw new Error('Logout failed.');
    }
  },
};

// --- User API ---
export const userApi = {
  getProfile: async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${apiUrl}/users/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user profile.');
    }
  },
  updateProfile: async (updatedProfileData: any) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(`${apiUrl}/users/me/`, updatedProfileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update profile.');
    }
  },
  setupAgenda: async (agendaData: any) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${apiUrl}/users/me/agenda/`, agendaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;  // return the response data
    } catch (error) {
      throw new Error('Failed to update agenda.');
    }
  },
};
// --- Course API ---
export const courseApi = {
  // ... (other course API functions)

  fetchCourses: async () => {
    try {
      const response = await axios.get(`${apiUrl}/courses/`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch courses.');
    }
  },
  fetchCourseDetails: async (courseId: any) => {
    try {
      const response = await axios.get(`${apiUrl}/courses/${courseId}/`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch details for course ${courseId}.`);
    }
  },
  // ... (other course API functions)
};

// --- Module API ---
export const moduleApi = {
  fetchModules: async (courseId: any) => {
    try {
      const response = await axios.get(`${apiUrl}/courses/${courseId}/modules/`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch modules for course ${courseId}.`);
    }
  },
  // ... (other module API functions)
};

// --- Quiz API ---
export const quizApi = {
  fetchQuiz: async (quizId: any) => {
    try {
      const response = await axios.get(`${apiUrl}/quizzes/${quizId}/`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch quiz ${quizId}.`);
    }
  },
  fetchQuizQuestions: async (quizId: any) => {
    try {
      const response = await axios.get(`${apiUrl}/quizzes/${quizId}/questions/`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch questions for quiz ${quizId}.`);
    }
  },
  submitQuiz: async (quizId: any, selectedAnswers: any) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${apiUrl}/quizzes/${quizId}/submit/`,
        { answers: selectedAnswers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to submit quiz ${quizId}.`);
    }
  },
  submitAnswer: async (questionId: any, answer: any) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${apiUrl}/questions/${questionId}/submit/`,
        { answer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to submit answer for question ${questionId}.`);
    }
  }
};

// --- Enrollment API ---
export const enrollmentApi = {
  fetchEnrollments: async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${apiUrl}/enrollments/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch enrollments.');
    }
  },
  enrollInCourse: async (courseId: any) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${apiUrl}/enrollments/`,
        { course: courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to enroll in course ${courseId}.`);
    }
  },
  unenrollFromCourse: async (courseId: any) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${apiUrl}/enrollments/${courseId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error(`Failed to unenroll from course ${courseId}.`);
    }
  },
  updateProgress: async (enrollmentId: any, progress: any) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${apiUrl}/enrollments/${enrollmentId}/`,
        { progress },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update progress for enrollment ${enrollmentId}.`);
    }
  },
  rateCourse: async (enrollmentId: any, rating: any) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${apiUrl}/enrollments/${enrollmentId}/rate/`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to rate course for enrollment ${enrollmentId}.`);
    }
  }
};

// --- Forum API ---
export const forumApi = {
  fetchForumPosts: async (courseId: any) => {
    try {
      const response = await axios.get(`${apiUrl}/courses/${courseId}/forums/`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch forum posts for course ${courseId}.`);
    }
  },
  createForumPost: async (courseId: any, threadData: any) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${apiUrl}/courses/${courseId}/forums/threads/`,
        threadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create a forum post in course ${courseId}.`);
    }
  },
  fetchForumThreads: async (forumId: any) => {
    try {
      const response = await axios.get(`${apiUrl}/forums/${forumId}/threads/`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch threads for forum ${forumId}.`);
    }
  },
  createForumThread: async (forumId: any, threadData: any) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${apiUrl}/forums/${forumId}/threads/`,
        threadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create a thread in forum ${forumId}.`);
    }
  },
  fetchForumPostsForThread: async (threadId: any) => {
    try {
      const response = await axios.get(`${apiUrl}/threads/${threadId}/posts/`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch posts for thread ${threadId}.`);
    }
  },
  createForumPostForThread: async (threadId: any, postData: any) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${apiUrl}/threads/${threadId}/posts/`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create a post in thread ${threadId}.`);
    }
  },
  reportForumPost: async (postId: any, reason: any) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${apiUrl}/moderation/`,
        { postId, reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to report post ${postId}.`);
    }
  },
  // ... other forum API functions
};

// --- Resource API ---
export const resourceApi = {
  fetchResources: async (moduleId: any, searchQuery: any) => {
    try {
      let url = `${apiUrl}/resources/`;
      if (moduleId) {
        url += `?module=${moduleId}`;
      }
      if (searchQuery) {
        url += moduleId ? `&search=${searchQuery}` : `?search=${searchQuery}`;
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch resources.');
    }
  },
  uploadResource: async (formData: any, onUploadProgress: any) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${apiUrl}/resources/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to upload resource.');
    }
  },
  // ... other resource API functions
};

// --- Assignment API ---
export const assignmentApi = {
  fetchAssignments: async (courseId: any) => {
    try {
      const response = await axios.get(`${apiUrl}/courses/${courseId}/assignments/`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch assignments for course ${courseId}.`);
    }
  },
  fetchAssignmentDetails: async (assignmentId: any) => {
    try {
      const response = await axios.get(`${apiUrl}/assignments/${assignmentId}/`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch details for assignment ${assignmentId}.`);
    }
  },
  submitAssignment: async (assignmentId: any, submissionData: any) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${apiUrl}/assignments/${assignmentId}/submit/`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to submit assignment ${assignmentId}.`);
    }
  },
  // ... other assignment API functions
};

// --- Grade API ---
export const gradeApi = {
  fetchGrades: async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${apiUrl}/grades/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch grades.');
    }
  },
  // ... other grade API functions
};

// --- Notification API ---
export const notificationApi = {
  fetchNotifications: async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${apiUrl}/notifications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch notifications.');
    }
  },
  addNotification: async (notificationData: any) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${apiUrl}/notifications/`, notificationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to add notification.');
    }
  },
  deleteNotification: async (notificationId: any) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${apiUrl}/notifications/${notificationId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return notificationId;
    } catch (error) {
      throw new Error('Failed to delete notification.');
    }
  },
  // ... other notification API functions
};

  // --- Error Handling ---
  const handleApiError = (error: { response: { data: { detail: any; }; }; request: any; message: any; }, defaultMessage: string | undefined) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.detail || defaultMessage);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Request Error:', error.request);
      throw new Error('No response received from the server.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
      throw new Error(defaultMessage);
    }
    
  };

  export { handleApiError }; 

