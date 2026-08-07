export interface Trainer {
      _id: string;
      name: string;
      email: string;
      phone: string;
      role: "trainer";
      profileImage: string;
      specialization: string[];
      experience: number;
      certifications: string[];
      clients: string[];
      availability: string[];
      createdAt: string;
      updatedAt: string;
      __v: number;
      isVerified: boolean;
}

export interface TrainerResponse {
      success: boolean;
      message: string;
      data: Trainer;
}