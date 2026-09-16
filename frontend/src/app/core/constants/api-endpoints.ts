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
    me: '/patients/me',
    byId: (id: string) => `/patients/${id}`,
    profile: '/patients/profile',
    medicalRecord: (id: string) => `/patients/${id}/medical-record`,
    timeline: (id: string) => `/patients/${id}/timeline`

    // base: '/patients',
    // byId: (id: string) => `/patients/${id}`,
    // profile: '/patients/profile',
  },

  doctors: {
    base: '/doctors',
    byId: (id: string) => `/doctors/${id}`,
    profile: '/doctors/profile',
    verification: '/doctors/verification',
  },

  medicalRecords: {
    base: '/medical-records',
    getByPatientId: (patientId: string) => `/medical-records/${patientId}`,
    updateByPatientId: (patientId: string) => `/medical-records/${patientId}`,
    addAllergy: (patientId: string) => `/medical-records/${patientId}/allergies`

    // base: '/medical-records',
    // byId: (id: string) => `/medical-records/${id}`,
    // patientRecords: (patientId: string) => `/medical-records/patient/${patientId}`,
  },
  encounters: {
    base: '/encounters',
    byId: (id: string) => `/encounters/${id}`,
    byPatientId: (patientId: string) => `/encounters/patient/${patientId}`,
    byDoctorId: (doctorId: string) => `/encounters/doctor/${doctorId}`,
    updateStatus: (id: string) => `/encounters/${id}/status`,

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
    conversations: '/chat/conversations',
    messages: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
  },
  notifications: {
    base: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/mark-all-read',
  },
  reviews: {
    base: '/reviews',
    byId: (id: string) => `/reviews/${id}`,
    forDoctor: (doctorId: string) => `/reviews/doctor/${doctorId}`,
  },
  clinics: {
    base: '/clinics',
    byId: (id: string) => `/clinics/${id}`,
  },
  admin: {
    base: '/admin',
    statistics: '/admin/statistics',
    doctors: {
      pending: '/admin/doctors/pending',
      byId: (doctorId: string) => `/admin/doctors/${doctorId}`,
      approve: (doctorId: string) => `/admin/doctors/${doctorId}/approve`,
      reject: (doctorId: string) => `/admin/doctors/${doctorId}/reject`,
    },
  },
  audit: {
    base: '/audit',
    byId: (auditId: string) => `/audit/${auditId}`,
  },
  ai: {
    symptomCheck: '/ai/symptom-check',
  }
} as const;
