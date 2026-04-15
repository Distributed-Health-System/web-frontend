// API Service Layer
// Configure your microservices endpoints here

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    register: `${API_BASE_URL}/auth/register`,
  },
  patient: {
    profile: `${API_BASE_URL}/patients`,
    appointments: `${API_BASE_URL}/patients/appointments`,
    reports: `${API_BASE_URL}/patients/reports`,
  },
  doctor: {
    profile: `${API_BASE_URL}/doctors`,
    availability: `${API_BASE_URL}/doctors/availability`,
    appointments: `${API_BASE_URL}/doctors/appointments`,
  },
  appointment: {
    list: `${API_BASE_URL}/appointments`,
    create: `${API_BASE_URL}/appointments`,
    cancel: `${API_BASE_URL}/appointments/cancel`,
  },
  payment: {
    process: `${API_BASE_URL}/payments/process`,
    status: `${API_BASE_URL}/payments/status`,
  },
  telemedicine: {
    session: `${API_BASE_URL}/telemedicine/session`,
    token: `${API_BASE_URL}/telemedicine/token`,
  },
  ai: {
    symptomCheck: `${API_BASE_URL}/ai/symptoms`,
  },
};
