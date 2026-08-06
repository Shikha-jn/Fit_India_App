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
  trainer: string;
  participants: string[];
  meetingLink: string;
  status: WebinarStatus;
  capacity: number;
  bannerImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebinarResponse {
  success: boolean;
  message: string;
  data: Webinar[];
}