import { useState, useCallback } from 'react';

export interface Toast {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function toast({ title, description, variant = 'default' }: Toast) {
  // Simple console-based toast for now
  // In a real app, this would integrate with a toast UI component
  const message = description ? `${title}: ${description}` : title;
  
  if (variant === 'destructive') {
    console.error(message);
  } else {
    console.log(message);
  }
  
  // You can replace this with actual toast notification logic
  // For example, using a toast library or custom implementation
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toastData: Toast) => {
    toast(toastData);
    setToasts(prev => [...prev, toastData]);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.slice(1));
    }, 3000);
  }, []);

  return {
    toast: showToast,
    toasts,
  };
}
