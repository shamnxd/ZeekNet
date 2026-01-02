import { Types } from 'mongoose';

export const generateId = (): string => {
  return new Types.ObjectId().toString();
};
