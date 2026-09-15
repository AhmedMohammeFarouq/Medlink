export const API_ENDPOINTS = {
  // Currently Active in Backend
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    refreshToken: '/auth/refresh-token',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
  },
  users: {
    me: '/users/me',
    updateProfile: '/users/me',
    changePassword: '/users/me/password',
    deleteAccount: '/users/me',
    sessions: '/users/me/sessions',
    revokeSession: (sessionId: string) => `/users/me/sessions/${sessionId}`,
    revokeAllSessions: '/users/me/sessions',
    // Admin user management endpoints
    getAll: '/users',
    getById: (userId: string) => `/users/${userId}`,
    updateByAdmin: (userId: string) => `/users/${userId}`,
    deleteByAdmin: (userId: string) => `/users/${userId}`,
    restoreByAdmin: (userId: string) => `/users/${userId}/restore`,
  },

  // Future Backend Endpoints (Module-ready contracts)
  appointments: {
    base: '/appointments',
    byId: (id: string) => `/appointments/${id}`,
    myAppointments: '/appointments/my',
    cancel: (id: string) => `/appointments/${id}/cancel`,
    confirm: (id: string) => `/appointments/${id}/confirm`,
    reschedule: (id: string) => `/appointments/${id}/reschedule`,
  },
  patients: {
    base: '/patients',
    byId: (id: string) => `/patients/${id}`,
    profile: '/patients/profile',
  },
  doctors: {
    base: '/doctors',
    byId: (id: string) => `/doctors/${id}`,
    profile: '/doctors/profile',
    verification: '/doctors/verification',
  },
  medicalRecords: {
    base: '/medical-records',
    byId: (id: string) => `/medical-records/${id}`,
    patientRecords: (patientId: string) => `/medical-records/patient/${patientId}`,
  },
  encounters: {
    base: '/encounters',
    byId: (id: string) => `/encounters/${id}`,
  },
  prescriptions: {
    base: '/prescriptions',
    byId: (id: string) => `/prescriptions/${id}`,
  },
  medications: {
    base: '/medications',
    byId: (id: string) => `/medications/${id}`,
  },
  documents: {
    base: '/documents',
    upload: '/documents/upload',
    byId: (id: string) => `/documents/${id}`,
  },
  consent: {
    base: '/consent',
    byId: (id: string) => `/consent/${id}`,
  },
  chat: {
    createRoom: '/chat/rooms/create',
    myRooms: '/chat/rooms/myRooms',
    roomById: (roomId: string) => `/chat/rooms/myRooms/${roomId}`,
    closeRoom: (roomId: string) => `/chat/rooms/myRooms/${roomId}/close`,
    messages: (roomId: string) => `/chat/rooms/myRooms/${roomId}/messages`,
    markRead: (roomId: string) => `/chat/rooms/myRooms/${roomId}/read`,
  },
  notifications: {
    base: '/notifications',
    markRead: (id: string) => `/notifications/readOne/${id}`,
    markAllRead: '/notifications/readAll',
  },
  reviews: {
    base: '/reviews',
    byId: (id: string) => `/reviews/${id}`,
  },
  clinics: {
    base: '/clinics',
    byId: (id: string) => `/clinics/${id}`,
  },
  admin: {
    base: '/admin',
    stats: '/admin/stats',
  },
  ai: {
    symptomCheck: '/ai/symptom-check',
  }
} as const;
