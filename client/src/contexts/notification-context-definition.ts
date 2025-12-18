import { createContext } from 'react';
import type { NotificationContextType } from '@/interfaces/notification/notification-context.interface';

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
