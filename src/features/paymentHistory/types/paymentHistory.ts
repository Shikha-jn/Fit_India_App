export type PaymentMethod = "razorpay" | "cash";

export type PaymentStatus =
      | "captured"
      | "pending"
      | "failed"
      | "refunded";

export interface Payment {
      _id: string;

      client: string;

      amount: number;

      currency: string;

      orderId: string;

      paymentMethod: PaymentMethod;

      status: PaymentStatus;

      planName: string;

      createdAt: string;

      updatedAt: string;

      __v: number;

      billingStartDate?: string;

      billingEndDate?: string;

      paymentId?: string;

      signature?: string;
}

export interface PaymentsResponse {
      success: boolean;
      message: string;
      data: Payment[];
}