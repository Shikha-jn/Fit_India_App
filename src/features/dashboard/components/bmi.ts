export interface BmiResult {
      value: number;
      status: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
      color: string;
}

import { COLORS } from '../../../theme/theme';

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

/** e.g. "8/16/2026" */
export function formatShortDate(iso?: string): string {
      if (!iso) return '—';
      const date = new Date(iso);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}