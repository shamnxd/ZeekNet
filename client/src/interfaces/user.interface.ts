
import { type User } from '@/interfaces/admin/admin-user.interface';

export interface UserWithDisplayData extends User {
  name: string
  appliedJobs: number
  accountStatus: 'Active' | 'Blocked'
  emailVerification: 'Verified' | 'Unverified'
  joinedDate: string
  avatar: string
}
