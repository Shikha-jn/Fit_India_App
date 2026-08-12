

export type WebinarStatus =
  | "scheduled"
  | "ongoing"
  | "completed"
  | "cancelled";

export interface Webinar {
  _id: string;
  title: string;
  description: string;
  scheduleTime: string;
  trainer: Trainer;
  participants: string[];
  meetingLink: string;
  status: WebinarStatus;
  capacity: number;
  bannerImage: string;
  discountedPrice: number;
  originalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebinarResponse {
  success: boolean;
  message: string;
  data: Webinar[];
}

export interface Trainer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
}

export type WebinarFilter = 'all' | WebinarStatus

export interface ScheduleWebinarPayload {
  title: string;
  description: string;
  scheduleTime: string; // ISO string
  capacity: number;
  originalPrice: number;
  discountedPrice: number;
  meetingLink: string;
  bannerImage: string;
}