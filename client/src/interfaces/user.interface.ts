// User-related interfaces
import { type User } from '@/api/admin.api'

export interface UserWithDisplayData extends User {
  name: string
  appliedJobs: number
  accountStatus: 'Active' | 'Blocked'
  emailVerification: 'Verified' | 'Unverified'
  joinedDate: string
  avatar: string
}
