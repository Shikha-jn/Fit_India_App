/**
 * No dedicated Attendance interface was shared for this screen. This is
 * built on `UserData.attendance: string[]` from the earlier shared
 * interface — each entry is an ISO date string representing a day the
 * user was marked present. If the backend later exposes a richer
 * attendance log (e.g. explicit check-in timestamps or absences), swap
 * `AttendanceLog` below to match and adjust `deriveAttendanceLogs`.
 */

export interface AttendanceLog {
      /** ISO date string, e.g. "2026-08-10" */
      date: string;
      dayOfWeek: string;
      timing: string;
      status: 'Present';
}

export type WeekPeriodFilter = 'all' | 'this_week' | 'last_week' | 'last_30_days';

export interface AttendanceFilters {
      fromDate: string; // dd-mm-yyyy or ''
      toDate: string; // dd-mm-yyyy or ''
      month: number | 'all'; // 0-11 or 'all'
      year: number | 'all';
      weekPeriod: WeekPeriodFilter;
}

export const DEFAULT_FILTERS: AttendanceFilters = {
      fromDate: '',
      toDate: '',
      month: 'all',
      year: 'all',
      weekPeriod: 'all',
};

// attendance

const DAY_NAMES = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
];

const MONTH_NAMES = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
];

export function deriveAttendanceLogs(attendance: string[]): AttendanceLog[] {
      return attendance
            .map((iso) => {
                  const date = new Date(iso);
                  return {
                        date: iso,
                        dayOfWeek: DAY_NAMES[date.getDay()],
                        timing: 'Daily Check-in',
                        status: 'Present' as const,
                  };
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** "Jul 16, 2026" */
export function formatLongDate(iso?: string): string {
      if (!iso) return '—';
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return '—';
      return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
      });
}

/** Parses a "dd-mm-yyyy" string into a Date, or null if invalid/empty. */
function parseDdMmYyyy(value: string): Date | null {
      if (!value) return null;
      const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
      if (!match) return null;
      const [, dd, mm, yyyy] = match;
      const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      return Number.isNaN(date.getTime()) ? null : date;
}

export function filterAttendanceLogs(
      logs: AttendanceLog[],
      filters: AttendanceFilters,
): AttendanceLog[] {
      const from = parseDdMmYyyy(filters.fromDate);
      const to = parseDdMmYyyy(filters.toDate);

      let weekStart: Date | null = null;
      let weekEnd: Date | null = null;
      const now = new Date();
      if (filters.weekPeriod === 'this_week' || filters.weekPeriod === 'last_week') {
            const day = now.getDay();
            const startOfThisWeek = new Date(now);
            startOfThisWeek.setDate(now.getDate() - day);
            startOfThisWeek.setHours(0, 0, 0, 0);
            if (filters.weekPeriod === 'this_week') {
                  weekStart = startOfThisWeek;
                  weekEnd = new Date(startOfThisWeek);
                  weekEnd.setDate(weekStart.getDate() + 6);
            } else {
                  weekEnd = new Date(startOfThisWeek);
                  weekEnd.setDate(startOfThisWeek.getDate() - 1);
                  weekStart = new Date(weekEnd);
                  weekStart.setDate(weekEnd.getDate() - 6);
            }
      }
      const last30Cutoff =
            filters.weekPeriod === 'last_30_days'
                  ? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                  : null;

      return logs.filter((log) => {
            const logDate = new Date(log.date);

            if (from && logDate < from) return false;
            if (to && logDate > to) return false;
            if (filters.month !== 'all' && logDate.getMonth() !== filters.month) return false;
            if (filters.year !== 'all' && logDate.getFullYear() !== filters.year) return false;
            if (weekStart && weekEnd && (logDate < weekStart || logDate > weekEnd)) return false;
            if (last30Cutoff && logDate < last30Cutoff) return false;

            return true;
      });
}

export function getMonthOptions() {
      return MONTH_NAMES.map((name, index) => ({ label: name, value: index }));
}

export function getYearOptions(attendance: string[]) {
      const years = new Set<number>();
      attendance.forEach((iso) => {
            const y = new Date(iso).getFullYear();
            if (!Number.isNaN(y)) years.add(y);
      });
      years.add(new Date().getFullYear());
      return Array.from(years)
            .sort((a, b) => b - a)
            .map((y) => ({ label: String(y), value: y }));
}

/** Attendance rate as a percentage of days since joining. */
export function calculateAttendanceRate(
      presentCount: number,
      joinedDate?: string,
): number {
      if (!joinedDate) return 0;
      const joined = new Date(joinedDate);
      if (Number.isNaN(joined.getTime())) return 0;
      const daysSinceJoin = Math.max(
            1,
            Math.ceil((Date.now() - joined.getTime()) / (24 * 60 * 60 * 1000)),
      );
      return Math.round((presentCount / daysSinceJoin) * 100);
}