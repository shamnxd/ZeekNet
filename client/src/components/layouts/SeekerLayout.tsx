import { useLocation, useNavigate } from 'react-router-dom';
import SeekerHeader from '../headers/SeekerHeader';
import SeekerSidebar from '../sidebars/SeekerSidebar';
import type { SeekerLayoutProps } from '@/interfaces/layout/seeker-layout-props.interface';
import type { Page } from '@/interfaces/layout/seeker-layout-page.type';

const SeekerLayout = ({ children }: SeekerLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentPage = (): Page => {
    const path = location.pathname;
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/applications')) return 'applications';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const currentPage = getCurrentPage();

  const handleNavigate = (page: Page) => {
    switch (page) {
      case 'dashboard':
        navigate('/seeker/dashboard');
        break;
      case 'profile':
        navigate('/seeker/profile');
        break;
      case 'applications':
        navigate('/seeker/applications');
        break;
      case 'settings':
        navigate('/seeker/settings');
        break;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9ff] overflow-hidden">
      <SeekerSidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SeekerHeader currentPage={currentPage} />
        <main className="flex-1 overflow-y-auto bg-[#f8f9ff]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SeekerLayout;