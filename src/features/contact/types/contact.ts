export interface Contact {
      fullName: string;
      phone: string;
      email: string;
      interestedProgram: string;
      healthConcerns: string;
}

export const INTERESTED_PROGRAMS = [
      'General Wellness Query',
      'Hormonal Wellness & Care',
      'Weight Correction & Nutrition',
      'Strength & Flexibility Training',
      'Post-Pregnancy Recovery',
] as const;