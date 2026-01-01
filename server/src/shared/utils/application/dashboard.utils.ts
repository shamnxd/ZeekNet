import { env } from 'src/infrastructure/config/env';

export function getDashboardLink(role: string): string {
  const baseUrl = env.FRONTEND_URL || 'http://localhost:3000';
  switch (role) {
  case 'admin':
    return `${baseUrl}/admin/dashboard`;
  case 'company':
    return `${baseUrl}/company/dashboard`;
  case 'seeker':
    return `${baseUrl}/seeker/dashboard`;
  default:
    return `${baseUrl}/seeker/dashboard`;
  }
}
