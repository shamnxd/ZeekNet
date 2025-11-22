import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, User, Settings as SettingsIcon, HelpCircle, LogOut, Bookmark } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { logoutThunk } from '@/store/slices/auth.slice';
import { seekerApi } from '@/api/seeker.api';
import { toast } from 'sonner';

type Page = 'dashboard' | 'profile' | 'applications' | 'settings';

interface SeekerSidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const menuItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard, count: null },
  { id: 'applications' as Page, label: 'My Applications', icon: FileText, count: 12 },
  { id: 'profile' as Page, label: 'My Public Profile', icon: User, count: null },
];

const quickActions = [
  { id: 'saved', label: 'Saved Jobs', icon: Bookmark, count: 8 }
];

export function SeekerSidebar({ currentPage, onNavigate }: SeekerSidebarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { name, email } = useAppSelector((state) => state.auth);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeekerProfile = async () => {
      try {
        setLoading(true);
        const response = await seekerApi.getProfile();
        if (response.data && response.data.avatarUrl) {
          setProfileImage(response.data.avatarUrl);
        }
      } catch (error) {
        console.log('Failed to fetch seeker profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeekerProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk());
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-[#f8f9ff] w-[240px] h-full flex flex-col border-r border-[#e5e7eb] shadow-sm">
      
      <div className="p-6 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center overflow-hidden">
            <img src="/blue.png" alt="ZeekNet Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-[20px] text-[#1f2937] leading-tight">
              ZeekNet
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          <div className="mb-6">
            <h3 className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider mb-3 px-3">
              Main Menu
            </h3>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-[#4640de] to-[#6366f1] text-white shadow-lg shadow-[#4640de]/25'
                        : 'text-[#374151] hover:bg-[#f3f4f6] hover:text-[#1f2937]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#6b7280] group-hover:text-[#4640de]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count && (
                      <span className={`text-[12px] px-2 py-1 rounded-full ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-[#e5e7eb] text-[#6b7280] group-hover:bg-[#4640de] group-hover:text-white'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider mb-3 px-3">
              Quick Actions
            </h3>
            <div className="space-y-1">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-[14px] font-medium text-[#374151] hover:bg-[#f3f4f6] hover:text-[#1f2937] transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <action.icon className="w-5 h-5 text-[#6b7280] group-hover:text-[#4640de]" />
                    <span>{action.label}</span>
                  </div>
                  {action.count && (
                    <span className="text-[12px] px-2 py-1 rounded-full bg-[#e5e7eb] text-[#6b7280] group-hover:bg-[#4640de] group-hover:text-white">
                      {action.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider mb-3 px-3">
              Account
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => onNavigate('settings')}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 group ${
                  currentPage === 'settings'
                    ? 'bg-gradient-to-r from-[#4640de] to-[#6366f1] text-white shadow-lg shadow-[#4640de]/25'
                    : 'text-[#374151] hover:bg-[#f3f4f6] hover:text-[#1f2937]'
                }`}
              >
                <SettingsIcon className={`w-5 h-5 ${currentPage === 'settings' ? 'text-white' : 'text-[#6b7280] group-hover:text-[#4640de]'}`} />
                <span>Settings</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium text-[#374151] hover:bg-[#f3f4f6] hover:text-[#1f2937] transition-all duration-200 group">
                <HelpCircle className="w-5 h-5 text-[#6b7280] group-hover:text-[#4640de]" />
                <span>Help Center</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      <div className="p-4 border-t border-[#e5e7eb] bg-gradient-to-r from-[#f8f9ff] to-white flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-[#f3f4f6]">
            {loading ? (
              <div className="w-full h-full bg-gradient-to-br from-[#e5e7eb] to-[#d1d5db] animate-pulse" />
            ) : profileImage ? (
              <img 
                src={profileImage} 
                alt={name || 'Profile'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#4640de] to-[#6366f1] flex items-center justify-center text-white font-bold text-sm">
                {name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[14px] text-[#1f2937] leading-tight truncate">
            {name || 'User'}
          </p>
          <p className="text-[12px] text-[#6b7280] truncate">
            {email || 'No email'}
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-[#6b7280] hover:text-[#ef4444] hover:bg-red-50 rounded-lg transition-all duration-200"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default SeekerSidebar;