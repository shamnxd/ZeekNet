import { useState, useCallback } from 'react';

export interface Toast {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function toast({ title, description, variant = 'default' }: Toast) {
  
  
  const message = description ? `${title}: ${description}` : title;
  
  if (variant === 'destructive') {
    console.error(message);
  } else {
    console.log(message);
  }
  
  
  
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toastData: Toast) => {
    toast(toastData);
    setToasts(prev => [...prev, toastData]);
    
    
    setTimeout(() => {
      setToasts(prev => prev.slice(1));
    }, 3000);
  }, []);

  return {
    toast: showToast,
    toasts,
  };
}
