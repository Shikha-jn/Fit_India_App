// Shared interfaces (as provided) -------------------------------------------

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
      role: 'client' | 'trainer' | 'admin';
      profileImage: string;
      status: 'active' | 'inactive';
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
      role: 'client' | 'trainer' | 'admin';
      data: UserData;
}

// Register-screen specific types --------------------------------------------

/** The two roles a person can self-register as (admin is provisioned separately). */
export type RegisterableRole = Extract<UserData['role'], 'client' | 'trainer'>;

/** Local image picked from the device, before upload. */
export interface PickedImage {
      uri: string;
      fileName?: string;
      type?: string;
}

/** Form state held by the Register screen. */
export interface RegisterFormState {
      role: RegisterableRole;
      profileImage: PickedImage | null;
      name: string;
      phone: string;
      email: string;
      password: string;
      age: string;
      height: string;
      currentWeight: string;
      fitnessGoal: string;
      medicalConditions: string[];
}

/** Payload shape sent to the register API — mirrors UserData's relevant fields + password. */
export type RegisterPayload = Pick<
      UserData,
      'name' | 'email' | 'phone' | 'role' | 'age' | 'height' | 'currentWeight' | 'fitnessGoal' | 'medicalConditions'
> & {
      password: string;
      profileImage?: PickedImage | null;
};

export const FITNESS_GOALS: string[] = [
      'General Wellness',
      'Weight Loss',
      'Weight Gain',
      'Muscle Gain',
      'PCOS Management',
      'Postpartum Recovery',
];

export const MEDICAL_CONDITIONS: string[] = [
      'PCOS',
      'PCOD',
      'Thyroid',
      'Pregnancy',
      'Postpartum',
      'None',
];

export type LoginRoleGroup = 'client' | 'trainer';

export interface LoginFormState {
      roleGroup: LoginRoleGroup;
      email: string;
      password: string;
}

export interface LoginPayload {
      roleGroup: LoginRoleGroup;
      email: string;
      password: string;
}