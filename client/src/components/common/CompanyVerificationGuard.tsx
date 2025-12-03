import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { UserRole } from '@/constants/enums';
import { companyApi } from '@/api/company.api';
import { setCompanyVerificationStatus } from '@/store/slices/auth.slice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CompanyVerificationGuardProps {
  children: React.ReactNode;
}

type ProfileStatus = 'not_created' | 'pending' | 'verified' | 'rejected';

const CompanyVerificationGuard: React.FC<CompanyVerificationGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { role, isAuthenticated, companyVerificationStatus } = useAppSelector((state) => state.auth);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus | null>(companyVerificationStatus || null);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      hasCheckedRef.current = false;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (role !== UserRole.COMPANY || !isAuthenticated) {
      return;
    }

    if (location.pathname.startsWith('/company/dashboard')) {
      return;
    }

    if (companyVerificationStatus) {
      setProfileStatus(companyVerificationStatus);
      return;
    }

    if (hasCheckedRef.current) {
      return;
    }

    const checkVerificationStatus = async () => {
      try {
        const response = await companyApi.getProfile();

        if (response.success && response.data) {
          const responseData = response.data as { profile?: { is_verified: string } } | { is_verified: string };
          let profileData: { is_verified?: string } | undefined;
          
          if ('profile' in responseData && responseData.profile) {
            profileData = responseData.profile;
          } else if ('is_verified' in responseData) {
            profileData = responseData as { is_verified: string };
          }
          
          const status = (profileData?.is_verified || 'not_created') as ProfileStatus;
          setProfileStatus(status);
          dispatch(setCompanyVerificationStatus(status));
          hasCheckedRef.current = true;
        } else {
          if (response.message?.includes('Company profile not found') ||
            response.message?.includes('Please complete your profile')) {
            navigate('/company/profile-setup', { replace: true });
            return;
          }
          setProfileStatus('not_created');
          hasCheckedRef.current = true;
        }
      } catch (err: unknown) {
        const errorMessage = 
          (err && typeof err === 'object' && 'response' in err) 
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || ''
            : (err && typeof err === 'object' && 'message' in err)
            ? (err as { message: string }).message
            : '';

        if (errorMessage.includes('Company profile not found') ||
          errorMessage.includes('Please complete your profile')) {
          navigate('/company/profile-setup', { replace: true });
          return;
        }

        setProfileStatus('not_created');
        hasCheckedRef.current = true;
      }
    };

    checkVerificationStatus();
  }, [navigate, dispatch]); 

  if (role !== UserRole.COMPANY || !isAuthenticated) {
    return <>{children}</>;
  }

  if (location.pathname.startsWith('/company/dashboard')) {
    return <>{children}</>;
  }

  if (profileStatus !== 'verified') {
    return (
      <>
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Access Restricted</DialogTitle>
              <DialogDescription>
                Your company profile is currently {profileStatus}. Please complete or reverify your profile to access this section.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => navigate('/company/dashboard', { replace: true })}>
                Go to Dashboard
              </Button>
              {profileStatus === 'rejected' && (
                <Button onClick={() => navigate('/company/dashboard', { replace: true })} className="bg-cyan-600 hover:bg-cyan-700">
                  Reverify
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return <>{children}</>;
};

export default CompanyVerificationGuard;