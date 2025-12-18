import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { NotificationBell } from '../notifications/NotificationBell';
import type { SeekerHeaderProps } from '@/interfaces/ui/seeker-header-props.interface';
import { MessageCircle } from 'lucide-react';

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  profile: 'My Profile',
  applications: 'My Applications',
  settings: 'Settings',
};

function SeekerHeader({ currentPage }: SeekerHeaderProps) {
  const navigate = useNavigate()
  return (
    <div className="bg-white/80 backdrop-blur-sm h-[76px] border-b border-[#e5e7eb] flex items-center justify-between px-8 xl:px-11 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-[22px] text-[#1f2937] leading-tight" style={{ fontWeight: '700' }}>
            {pageTitles[currentPage] || 'Dashboard'}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="seekerOutline"
          style={{ fontWeight: '700' }}
          onClick={() => navigate('/seeker/messages')}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </Button>

        <Button
          variant="seekerOutline"
          style={{ fontWeight: '700' }}
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