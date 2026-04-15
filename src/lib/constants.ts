// Application Constants

export const USER_ROLES = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  ADMIN: "admin",
} as const;

export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  RESCHEDULED: "rescheduled",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const NOTIFICATION_TYPES = {
  APPOINTMENT_CONFIRMED: "appointment_confirmed",
  APPOINTMENT_REMINDER: "appointment_reminder",
  PAYMENT_SUCCESS: "payment_success",
  PAYMENT_FAILED: "payment_failed",
  CONSULTATION_STARTED: "consultation_started",
  PRESCRIPTION_ISSUED: "prescription_issued",
} as const;
