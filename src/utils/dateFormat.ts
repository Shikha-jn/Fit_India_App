const DAY_MS = 24 * 60 * 60 * 1000;

/** e.g. "Fri, 14 Aug" */
export function formatWebinarDate(iso: string): string {
      const date = new Date(iso);
      return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
      });
}

/** e.g. "7:30 PM" */
export function formatWebinarTime(iso: string): string {
      const date = new Date(iso);
      return date.toLocaleTimeString('en-IN', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
      });
}

/** e.g. "Starts in 3d 4h" / "Starts in 45m" / "Started" */
export function formatCountdown(iso: string): string {
      const diff = new Date(iso).getTime() - Date.now();
      if (diff <= 0) return 'Starting soon';

      const days = Math.floor(diff / DAY_MS);
      const hours = Math.floor((diff % DAY_MS) / (60 * 60 * 1000));
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));

      if (days > 0) return `Starts in ${days}d ${hours}h`;
      if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
      return `Starts in ${minutes}m`;
}