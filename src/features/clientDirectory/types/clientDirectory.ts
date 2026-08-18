export interface WorkoutPlan {
      _id: string;
      day: string;
      activity: string;
      details: string;
}

export interface DietPlan {
      _id: string;
      mealName: string;
      description: string;
}

export interface Client {
      _id: string;
      name: string;
      email: string;
      phone: string;
      role: "client";
      profileImage: string;
      status: "active" | "inactive";
      age: number;
      height: number;
      currentWeight: number;
      targetWeight: number;
      medicalConditions: string[];
      fitnessGoal: string;
      assignedTrainer: string;
      trialsUsed: boolean;
      attendance: string[];
      webinarsRegistered: string[];
      workoutPlan: WorkoutPlan[];
      dietPlan: DietPlan[];
      createdAt: string;
      updatedAt: string;
      __v: number;
      activePlan: string;
      activePlanExpiresAt: string;
}

export interface ClientsResponse {
      success: boolean;
      message: string;
      data: Client[];
}

export type ClientStatusFilter = 'all' | Client['status'];

export const DAYS_OF_WEEK = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;

export type MealType = (typeof MEAL_TYPES)[number];