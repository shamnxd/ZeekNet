import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  User,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { logoutThunk } from '@/store/slices/auth.slice';
import { seekerApi } from '@/api/seeker.api';
import { toast } from 'sonner';
import type { SeekerSidebarProps } from '@/interfaces/layout/seeker-sidebar-props.interface';
import type { SeekerSidebarPage as Page } from '@/interfaces/ui/sidebar.types';

const menuItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard, count: null },
  { id: 'applications' as Page, label: 'My Applications', icon: FileText, count: null },
  { id: 'messages' as Page, label: 'Messages', icon: MessageSquare, count: null },
  { id: 'profile' as Page, label: 'My Public Profile', icon: User, count: null },
];

function SeekerSidebar({ currentPage, onNavigate, isCollapsed = false, onToggle }: SeekerSidebarProps) {
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
      } catch {

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
    <div className={`bg-gradient-to-b from-white to-[#f8f9ff] h-full flex flex-col border-r border-[#e5e7eb] shadow-sm transition-all duration-300 relative ${isCollapsed ? 'w-20' : 'w-[240px]'}`}>
      {/* Toggle Button */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 bg-white border border-[#e5e7eb] rounded-full p-1 shadow-sm hover:bg-gray-50 z-50 hidden lg:block"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}

      <div className={`p-6 border-b border-[#e5e7eb] ${isCollapsed ? 'px-4 flex justify-center' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src="/blue.png" alt="ZeekNet Logo" className="w-full h-full object-contain" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-[20px] text-[#1f2937] leading-tight whitespace-nowrap">
                ZeekNet
              </h1>
            </div>
          )}
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto overflow-x-hidden py-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <nav className="space-y-2">
          <div className="mb-6">
            {!isCollapsed && (
              <h3 className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider mb-3 px-3">
                Main Menu
              </h3>
            )}
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    title={isCollapsed ? item.label : ''}
                    className={`w-full flex items-center transition-all duration-200 group relative ${isCollapsed ? 'justify-center p-3 rounded-xl' : 'justify-between px-3 py-3 rounded-xl'} text-[14px] font-medium ${isActive
                      ? 'bg-gradient-to-r from-[#4640de] to-[#6366f1] text-white shadow-lg shadow-[#4640de]/25'
                      : 'text-[#374151] hover:bg-[#f3f4f6] hover:text-[#1f2937]'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#6b7280] group-hover:text-[#4640de]'}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && item.count && (
                      <span className={`text-[12px] px-2 py-1 rounded-full ${isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#e5e7eb] text-[#6b7280] group-hover:bg-[#4640de] group-hover:text-white'
                        }`}>
                        {item.count}
                      </span>
                    )}
                    {isCollapsed && item.count && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-[#4640de] rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            {!isCollapsed && (
              <h3 className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider mb-3 px-3">
                Account
              </h3>
            )}
            <div className="space-y-1">
              <button
                onClick={() => onNavigate('settings')}
                title={isCollapsed ? 'Settings' : ''}
                className={`w-full flex items-center transition-all duration-200 group ${isCollapsed ? 'justify-center p-3 rounded-xl' : 'gap-3 px-3 py-3 rounded-xl'} text-[14px] font-medium ${currentPage === 'settings'
                  ? 'bg-gradient-to-r from-[#4640de] to-[#6366f1] text-white shadow-lg shadow-[#4640de]/25'
                  : 'text-[#374151] hover:bg-[#f3f4f6] hover:text-[#1f2937]'
                  }`}
              >
                <SettingsIcon className={`w-5 h-5 flex-shrink-0 ${currentPage === 'settings' ? 'text-white' : 'text-[#6b7280] group-hover:text-[#4640de]'}`} />
                {!isCollapsed && <span>Settings</span>}
              </button>

              <button
                title={isCollapsed ? 'Help Center' : ''}
                className={`w-full flex items-center transition-all duration-200 group ${isCollapsed ? 'justify-center p-3 rounded-xl' : 'gap-3 px-3 py-3 rounded-xl'} text-[14px] font-medium text-[#374151] hover:bg-[#f3f4f6] hover:text-[#1f2937]`}
              >
                <HelpCircle className={`w-5 h-5 flex-shrink-0 text-[#6b7280] group-hover:text-[#4640de]`} />
                {!isCollapsed && <span>Help Center</span>}
              </button>
            </div>
          </div>
        </nav>
      </div>

      <div className={`p-4 border-t border-[#e5e7eb] bg-gradient-to-r from-[#f8f9ff] to-white flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center flex-col gap-4' : 'gap-3'}`}>
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-[#f3f4f6]">
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
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[14px] text-[#1f2937] leading-tight truncate">
              {name || 'User'}
            </p>
            <p className="text-[12px] text-[#6b7280] truncate">
              {email || 'No email'}
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`text-[#6b7280] hover:text-[#ef4444] hover:bg-red-50 rounded-lg transition-all duration-200 ${isCollapsed ? 'p-2' : 'p-2'}`}
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default SeekerSidebar;
