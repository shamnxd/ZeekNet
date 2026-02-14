import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SeekerHeader from '../headers/SeekerHeader';
import SeekerSidebar from '../sidebars/SeekerSidebar';
import type { SeekerLayoutProps } from '@/interfaces/layout/seeker-layout-props.interface';
import type { Page } from '@/interfaces/layout/seeker-layout-page.type';

const SeekerLayout = ({ children }: SeekerLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('seeker-sidebar-collapsed');
    return saved !== null ? JSON.parse(saved) : (window.innerWidth < 1280 && window.innerWidth >= 1024);
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      const nextState = !isCollapsed;
      setIsCollapsed(nextState);
      localStorage.setItem('seeker-sidebar-collapsed', JSON.stringify(nextState));
    }
  };

  const getCurrentPage = (): Page => {
    const path = location.pathname;
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/applications')) return 'applications';
    if (path.includes('/messages')) return 'messages';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const currentPage = getCurrentPage();

  const handleNavigate = (page: Page) => {
    if (isMobile) setIsSidebarOpen(false);
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
      case 'messages':
        navigate('/seeker/messages');
        break;
      case 'settings':
        navigate('/seeker/settings');
        break;
    }
  };

  const sidebarWidth = isCollapsed ? '80px' : '240px';

  return (
    <div className="flex h-screen bg-[#f8f9ff] overflow-hidden relative">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed lg:relative left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out ${isMobile
          ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full')
          : 'translate-x-0'
          }`}
        style={{ width: isMobile ? '240px' : sidebarWidth }}
      >
        <SeekerSidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isCollapsed={isCollapsed}
          onToggle={toggleSidebar}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <SeekerHeader
          currentPage={currentPage}
          onMenuClick={isMobile ? toggleSidebar : undefined}
        />
        <main className="flex-1 overflow-y-auto bg-[#f8f9ff] p-4 md:p-6 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SeekerLayout;
