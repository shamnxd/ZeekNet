interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  token?: string;
}

export const createSuccessResponse = <T>(message: string, data: T, token?: string): ApiResponse<T> => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  if (token) {
    response.token = token;
  }

  return response;
};

export const createErrorResponse = <T>(message: string, data: T = null as T): ApiResponse<T> => {
  return {
    success: false,
    message,
    data,
  };
};