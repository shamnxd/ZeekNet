export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const getErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError;
  return apiError.response?.data?.message || apiError.message || 'An unexpected error occurred';
};
