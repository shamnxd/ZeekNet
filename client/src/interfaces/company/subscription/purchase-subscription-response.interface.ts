export interface PurchaseSubscriptionResponse {
  subscription: {
    id: string;
    companyId: string;
    planId: string;
    startDate: string;
    expiryDate: string;
    isActive: boolean;
    jobPostsUsed: number;
    featuredJobsUsed: number;
    applicantAccessUsed: number;
    planName?: string;
    jobPostLimit?: number;
    featuredJobLimit?: number;
  };
  paymentOrder: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    invoiceId?: string;
    transactionId?: string;
    paymentMethod: string;
    createdAt: string;
  };
}
