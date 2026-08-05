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

export interface UserData {
      _id: string;
      name: string;
      email: string;
      phone: string;
      role: "client" | "trainer" | "admin";
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

export interface LoginResponse {
      success: boolean;
      message: string;
      token: string;
      role: "client" | "trainer" | "admin";
      data: UserData;
}