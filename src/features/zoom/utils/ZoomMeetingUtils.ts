import { MeetingStatus } from '../types/zoomMetting';

/** How long a session is considered "live" after its startTime. */
const SESSION_LENGTH_MINUTES = 60;
/** How early the join button/reminder becomes relevant. */
export const JOIN_WINDOW_MINUTES = 5;

export function getMeetingStatus(startTime: string): MeetingStatus {
      const start = new Date(startTime).getTime();
      const now = Date.now();
      const end = start + SESSION_LENGTH_MINUTES * 60 * 1000;

      if (now < start) return 'scheduled';
      if (now >= start && now <= end) return 'live';
      return 'completed';
}

/** e.g. "8/12/26, 10:34 PM" */
export function formatCreatedAt(iso: string): string {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return '\u2014';
      const datePart = `${date.getMonth() + 1}/${date.getDate()}/${String(
            date.getFullYear(),
      ).slice(2)}`;
      const timePart = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
      });
      return `${datePart}, ${timePart}`;
}

/** e.g. "Thursday, August 13, 2026" */
export function formatSessionDate(iso: string): string {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return '\u2014';
      return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
      });
}

/** e.g. "10:36 AM" */
export function formatSessionTime(iso: string): string {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return '\u2014';
      return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
      });
}

/** Minutes until session start (negative once it's begun). */
export function minutesUntilStart(startTime: string): number {
      return Math.round((new Date(startTime).getTime() - Date.now()) / 60000);
}