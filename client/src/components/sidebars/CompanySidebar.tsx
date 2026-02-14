import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Home,
  MessageSquare,
  Building2,
  Users,
  ClipboardList,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  Search,
  KanbanSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { logoutThunk } from '@/store/slices/auth.slice'
import { toast } from 'sonner'

interface CompanySidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const CompanySidebar = ({ isCollapsed = false, onToggle }: CompanySidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { companyVerificationStatus } = useAppSelector((state) => state.auth)

  const isVerified = companyVerificationStatus === 'verified'
  const canAccessSettings = isVerified
  const canAccessHelpCenter = true

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/company/dashboard',
      icon: Home,
    },
    {
      title: 'Post a Job',
      href: '/company/post-job',
      icon: Plus
    },
    {
      title: 'Find Candidates',
      href: '/company/candidates',
      icon: Search
    },
    {
      title: 'Messages',
      href: '/company/messages',
      icon: MessageSquare,
      badge: 1
    },
    {
      title: 'Company Profile',
      href: '/company/profile',
      icon: Building2
    },
    {
      title: 'All Applicants',
      href: '/company/applicants',
      icon: Users
    },
    {
      title: 'ATS Pipeline',
      href: '/company/ats',
      icon: KanbanSquare
    },
    {
      title: 'Job Listing',
      href: '/company/job-listing',
      icon: ClipboardList
    },
    {
      title: 'Plans & Billing',
      href: '/company/billing',
      icon: CreditCard
    }
  ]

  const settingsItems = [
    {
      title: 'Settings',
      href: '/company/settings',
      icon: Settings
    },
    {
      title: 'Help Center',
      href: '/company/help',
      icon: HelpCircle
    }
  ]

  const handleNavigation = (path: string) => {
    if (path === '/company/dashboard') {
      navigate(path)
      return
    }

    if (companyVerificationStatus === 'not_created') {
      toast.error('Complete Registration Required', {
        description: 'Please complete your company profile setup first.',
      })
      navigate('/company/dashboard')
      return
    }

    if (companyVerificationStatus === 'pending' || companyVerificationStatus === 'rejected') {
      toast.error('Verification Required', {
        description: companyVerificationStatus === 'pending'
          ? 'Your company profile is under review. Please wait for verification.'
          : 'Your company profile was rejected. Please reverify from the dashboard.',
      })
      navigate('/company/dashboard')
      return
    }

    if (path === '/company/post-job' && !isVerified) {
      toast.error('Profile Verification Required', {
        description: 'Please complete and verify your company profile before posting jobs.',
      })
      navigate('/company/profile')
      return
    }

    if (path === '/company/help') {
      toast.info('Coming Soon', {
        description: 'Help center is under development.',
      })
      return
    }

    navigate(path)
  }

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap()
      navigate('/auth/login')
    } catch {
      navigate('/auth/login')
    }
  }

  return (
    <div className={`flex h-full flex-col bg-[#F8F8FD] border-r border-[#D3D6DB] transition-all duration-300 relative ${isCollapsed ? 'w-[80px]' : 'w-[235px]'}`}>
      {/* Toggle Button */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 bg-white border border-[#D3D6DB] rounded-full p-1 shadow-sm hover:bg-gray-50 z-50 hidden md:block"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className={`flex flex-col items-center gap-6 py-6 ${isCollapsed ? 'px-2' : 'px-0'}`}>
          {/* Logo Section */}
          <div className={`flex items-center gap-1.5 transition-all duration-300 ${isCollapsed ? 'pr-0' : 'pr-12'}`}>
            <div className="w-[28px] h-[28px] flex-shrink-0">
              <img src="/blue.png" alt="ZeekNet Logo" className="w-full h-full object-cover" />
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-[#202430] leading-5 tracking-[-0.01em] whitespace-nowrap">ZeekNet</h1>
            )}
          </div>

          <div className="flex flex-col justify-center gap-6 w-full">
            <div className="flex flex-col">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href
                const isDisabled = item.href !== '/company/dashboard' && !isVerified
                return (
                  <div key={item.href} className="flex items-center gap-2.5">
                    {isActive && (
                      <div className="w-1 h-6 bg-[#4640DE] rounded-sm flex-shrink-0"></div>
                    )}

                    <div
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${isDisabled
                        ? 'cursor-not-allowed opacity-60'
                        : 'cursor-pointer hover:bg-gray-100'
                        } ${isActive ? "bg-[#E9EBFD]" : ""} ${isCollapsed ? 'justify-center mx-auto' : 'w-full'}`}
                      style={{
                        width: isCollapsed ? '44px' : (isActive ? '204px' : '217px'),
                        paddingLeft: isCollapsed ? '10px' : (isActive ? '14px' : '27px')
                      }}
                      onClick={() => handleNavigation(item.href)}
                      title={isCollapsed ? item.title : ''}
                    >
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <item.icon className={`w-5 h-5 ${isActive ? "text-[#4640DE]" : isDisabled ? "text-[#9CA3AF]" : "text-[#7C8493]"
                          }`} />
                      </div>
                      {!isCollapsed && (
                        <span className={`text-sm font-medium whitespace-nowrap ${isActive ? "text-[#4640DE]" : isDisabled ? "text-[#9CA3AF]" : "text-[#7C8493]"
                          }`}>
                          {item.title}
                        </span>
                      )}
                      {!isCollapsed && item.badge && (
                        <div className="ml-auto w-5 h-5 bg-[#4640DE] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">{item.badge}</span>
                        </div>
                      )}
                      {isCollapsed && item.badge && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-[#4640DE] rounded-full"></div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className={`h-px bg-[#CCCCF5] transition-all duration-300 ${isCollapsed ? 'mx-4' : 'w-full'}`}></div>

            <div className="flex flex-col gap-5">
              {!isCollapsed && (
                <div className="flex gap-2 pl-7">
                  <h3 className="text-xs font-semibold text-[#202430] uppercase tracking-[0.04em] opacity-50">SETTINGS</h3>
                </div>
              )}

              <div className="flex flex-col">
                {settingsItems.map((item) => {
                  const isItemDisabled = item.href === '/company/settings' ? !canAccessSettings : !canAccessHelpCenter
                  return (
                    <div
                      key={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${isItemDisabled
                        ? 'cursor-not-allowed opacity-60'
                        : 'cursor-pointer hover:bg-gray-100'
                        } ${isCollapsed ? 'justify-center mx-auto' : 'pl-7'}`}
                      style={{
                        width: isCollapsed ? '44px' : '100%'
                      }}
                      onClick={() => !isItemDisabled && handleNavigation(item.href)}
                      title={isCollapsed ? item.title : ''}
                    >
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <item.icon className={`w-5 h-5 ${isItemDisabled ? 'text-[#9CA3AF]' : 'text-[#7C8493]'}`} />
                      </div>
                      {!isCollapsed && (
                        <span className={`text-sm font-medium whitespace-nowrap ${isItemDisabled ? 'text-[#9CA3AF]' : 'text-[#7C8493]'}`}>{item.title}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex-shrink-0 py-4 border-t border-gray-200 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-7'}`}>
        <Button
          variant="ghost"
          className={`w-full h-10 text-[#7C8493] hover:bg-red-50 hover:text-red-600 px-3 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          onClick={handleLogout}
          title={isCollapsed ? 'Log out' : ''}
        >
          <LogOut className={`flex-shrink-0 ${isCollapsed ? 'h-5 w-5' : 'h-4 w-4 mr-2'}`} />
          {!isCollapsed && <span className="text-sm">Log out</span>}
        </Button>
      </div>
    </div>
  )
}

export default CompanySidebar