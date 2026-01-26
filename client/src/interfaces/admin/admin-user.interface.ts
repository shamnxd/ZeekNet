export interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  seekerProfile?: import('../seeker/seeker.interface').SeekerProfile;
}

export interface GetAllUsersParams {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  isBlocked?: boolean | string;
}
