const DAY_MS = 24 * 60 * 60 * 1000;

export interface PlanExpiryInfo {
      hasExpiry: boolean;
      isExpired: boolean;
      isExpiringSoon: boolean;
      daysLeft: number;
}

/** Treats "expiring soon" as within 7 days. */
export function getPlanExpiryInfo(activePlanExpiresAt?: string): PlanExpiryInfo {
      if (!activePlanExpiresAt) {
            return { hasExpiry: false, isExpired: false, isExpiringSoon: false, daysLeft: 0 };
      }
      const diff = new Date(activePlanExpiresAt).getTime() - Date.now();
      const daysLeft = Math.ceil(diff / DAY_MS);

      return {
            hasExpiry: true,
            isExpired: diff <= 0,
            isExpiringSoon: diff > 0 && daysLeft <= 7,
            daysLeft,
      };
}