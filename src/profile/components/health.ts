import { COLORS } from '../../theme/theme';

export interface BmiResult {
      value: number;
      status: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
      color: string;
}

/** height in cm, weight in kg */
export function calculateBmi(heightCm: number, weightKg: number): BmiResult | null {
      if (!heightCm || !weightKg) return null;
      const heightM = heightCm / 100;
      const value = weightKg / (heightM * heightM);

      let status: BmiResult['status'];
      let color: string;
      if (value < 18.5) {
            status = 'Underweight';
            color = COLORS.info;
      } else if (value < 25) {
            status = 'Normal';
            color = COLORS.success;
      } else if (value < 30) {
            status = 'Overweight';
            color = COLORS.warning;
      } else {
            status = 'Obese';
            color = COLORS.error;
      }

      return { value: Math.round(value * 10) / 10, status, color };
}

export interface PlanExpiryInfo {
      hasExpiry: boolean;
      isExpired: boolean;
      isExpiringSoon: boolean;
      daysLeft: number;
      progressRatio: number; // 0..1, how much of a 30-day window remains
}

export function getPlanExpiryInfo(activePlanExpiresAt?: string): PlanExpiryInfo {
      if (!activePlanExpiresAt) {
            return {
                  hasExpiry: false,
                  isExpired: false,
                  isExpiringSoon: false,
                  daysLeft: 0,
                  progressRatio: 0,
            };
      }
      const diffMs = new Date(activePlanExpiresAt).getTime() - Date.now();
      const daysLeft = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
      const progressRatio = Math.max(0, Math.min(1, daysLeft / 30));

      return {
            hasExpiry: true,
            isExpired: diffMs <= 0,
            isExpiringSoon: diffMs > 0 && daysLeft <= 7,
            daysLeft,
            progressRatio,
      };
}

/** e.g. "Aug 16, 2026" */
export function formatLongDate(iso?: string): string {
      if (!iso) return '—';
      const date = new Date(iso);
      return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
      });
}