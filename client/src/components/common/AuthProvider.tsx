import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { initializeAuthThunk } from '@/store/slices/auth.slice';
import { Loading } from '@/components/ui/loading';
import { store } from '@/store/store';

// be - in
interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      const currentState = store.getState();
      const { token } = currentState.auth;
      
      if (token) {
        await dispatch(initializeAuthThunk());
      } else {
        await dispatch(initializeAuthThunk());
      }
    };

    if (!isInitialized) {
      initializeAuth();
    }
  }, [dispatch, isInitialized]);

  if (!isInitialized) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default AuthProvider;