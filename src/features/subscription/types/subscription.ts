export interface Plan {
      _id: string;
      name: string;
      price: number;
      durationDays: number;
      description: string;
      features: string[];
      createdAt: string;
      updatedAt: string;
      __v: number;
}

export interface PlansResponse {
      success: boolean;
      message: string;
      data: Plan[];
}