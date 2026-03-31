import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { NotificationBell } from '../notifications/NotificationBell';
import { Menu } from 'lucide-react';
import type { SeekerHeaderProps } from '@/interfaces/ui/seeker-header-props.interface';

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  profile: 'My Profile',
  applications: 'My Applications',
  messages: 'Messages',
  settings: 'Settings',
};

function SeekerHeader({ currentPage, onMenuClick }: SeekerHeaderProps) {
  const navigate = useNavigate()
  return (
    <div className="bg-white/80 backdrop-blur-sm h-[76px] border-b border-[#e5e7eb] flex items-center justify-between px-4 md:px-8 xl:px-11 py-4 shadow-sm w-full">
      <div className="flex items-center gap-3 md:gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        )}
        <h1 className="text-[20px] md:text-[22px] text-[#1f2937] leading-tight font-bold">
          {pageTitles[currentPage] || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="seekerOutline"
          className="hidden sm:flex font-bold"
          onClick={() => navigate('/')}
        >
          Back to homepage
        </Button>

        <NotificationBell />
      </div>
    </div>
  );
}

export default SeekerHeader;
