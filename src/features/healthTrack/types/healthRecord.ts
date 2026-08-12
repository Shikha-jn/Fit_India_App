export type PeriodsCycleStatus =
      | "None/Regular"
      | "Follicular Phase"
      | "Ovulation"
      | "Letual Phase"
      | "Menstruation (Period)"
      | "Postmartum"
      | "Irregular"

export interface HealthRecord {
      _id: string;
      date: string;
      client: string;
      __v: number;
      calorieBurned: number;
      calorieIntake: number;
      createdAt: string;
      notes: string;
      periodsCycleStatus: PeriodsCycleStatus;
      updatedAt: string;
      waterIntake: number;
      weight?: number;
}

export interface HealthRecordResponse {
      success: boolean;
      message: string;
      data: HealthRecord;
}

export interface HealthLogPayload {
      calorieIntake: number;
      calorieBurned: number;
      waterIntake: number;
      weight: number;
      periodsCycleStatus: PeriodsCycleStatus;
      notes: string;
      date: string;
}