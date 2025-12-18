import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useRedux';
import { logoutThunk } from '@/store/slices/auth.slice';
import { socketService } from '@/services/socket.service';
import { toast } from 'sonner';
import type { UserBlockedData } from '@/types/socket.types';

const UserBlockHandler: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleUserBlocked = (data: UserBlockedData) => {
      console.log('User blocked event received:', data);
      toast.error('Your account has been blocked', {
        description: data.reason || 'Your account has been blocked by the administrator. You will be logged out.',
        duration: 5000,
      });

      setTimeout(() => {
        dispatch(logoutThunk()).then(() => {
          navigate('/');
        });
      }, 1500);
    };

    socketService.onUserBlocked(handleUserBlocked);

    return () => {
      socketService.offUserBlocked();
    };
  }, [dispatch, navigate]);

  return null;
};

export default UserBlockHandler;
