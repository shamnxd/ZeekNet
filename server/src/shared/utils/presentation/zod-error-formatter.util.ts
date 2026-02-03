import { ZodError } from 'zod';
export function formatZodErrors(error: ZodError): string {
  const errorMessages = error.errors.map(
    (e) => `${e.path.join('.')}: ${e.message}`,
  ).join(', ');
  
  return `Invalid data: ${errorMessages}`;
}