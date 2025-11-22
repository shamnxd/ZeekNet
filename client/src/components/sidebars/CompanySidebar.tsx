import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  MessageSquare, 
  Building2, 
  Users, 
  ClipboardList, 
  Calendar,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  Plus
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { logoutThunk } from '@/store/slices/auth.slice'
import { companyApi } from '@/api/company.api'

const CompanySidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { name, email } = useAppSelector((state) => state.auth)
  const [companyName, setCompanyName] = useState(name || 'Company')
  const [companyLogo, setCompanyLogo] = useState<string | null>(null)
  const [companyEmail, setCompanyEmail] = useState(email || 'company@email.com')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompanyProfile()
  }, [])

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true)
      const response = await companyApi.getCompleteProfile()
      if (response.success && response.data) {
        const { profile, contact } = response.data
        setCompanyName(profile.company_name || name || 'Company')
        setCompanyLogo(profile.logo || null)
        setCompanyEmail(contact?.email || profile.email || email || 'company@email.com')
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

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
      title: 'Job Listing',
      href: '/company/job-listing',
      icon: ClipboardList
    },
    {
      title: 'My Schedule',
      href: '/company/schedule',
      icon: Calendar
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
    <div className="flex h-full w-[235px] flex-col bg-[#F8F8FD] border-r border-[#D3D6DB]">
      {}
      <div className="flex-1 overflow-y-auto">
        {}
        <div className="flex flex-col items-center gap-6 px-0 py-6">
          {}
          <div className="flex items-center gap-1.5 pr-12">
            <div className="w-[28px] h-[28px]">
              <img src="/blue.png" alt="ZeekNet Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-bold text-[#202430] leading-5 tracking-[-0.01em]">ZeekNet</h1>
          </div>

          {}
          <div className="flex flex-col justify-center gap-6 w-full">
            {}
            <div className="flex flex-col">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href 
                return (
                  <div key={item.href} className="flex items-center gap-2.5">
                    {isActive && (
                      <div className="w-1 h-6 bg-[#4640DE] rounded-sm"></div>
                    )}
                    
                    {}
                    <div 
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full cursor-pointer ${
                        isActive 
                          ? "bg-[#E9EBFD]" 
                          : "hover:bg-gray-100"
                      }`}
                      style={{ width: isActive ? '204px' : '217px', paddingLeft: isActive ? '14px' : '27px' }}
                      onClick={() => handleNavigation(item.href)}
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <item.icon className={`w-5 h-5 ${
                          isActive ? "text-[#4640DE]" : "text-[#7C8493]"
                        }`} />
                      </div>
                      <span className={`text-sm font-medium ${
                        isActive ? "text-[#4640DE]" : "text-[#7C8493]"
                      }`}>
                        {item.title}
                      </span>
                      {item.badge && (
                        <div className="ml-auto w-5 h-5 bg-[#4640DE] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">{item.badge}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {}
            <div className="w-full h-px bg-[#CCCCF5]"></div>

            {}
            <div className="flex flex-col gap-5">
              {}
              <div className="flex gap-2 pl-7">
                <h3 className="text-xs font-semibold text-[#202430] uppercase tracking-[0.04em] opacity-50">SETTINGS</h3>
              </div>

              {}
              <div className="flex flex-col">
                {settingsItems.map((item) => (
                  <div 
                    key={item.href} 
                    className="flex items-center gap-3 px-3 py-2.5 pl-7 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => handleNavigation(item.href)}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#7C8493]" />
                    </div>
                    <span className="text-sm font-medium text-[#7C8493]">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="flex-shrink-0 px-7 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          {}
          {companyLogo ? (
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
              <img 
                src={companyLogo} 
                alt={companyName || 'Company Logo'} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {loading ? 'C' : (companyName || 'Company').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          {}
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-[#25324B] leading-5">
              {loading ? 'Loading...' : (companyName || 'Company')}
            </p>
            <p className="text-xs text-[#515B6F] opacity-50 leading-5">
              {loading ? 'Loading...' : (companyEmail || 'company@email.com')}
            </p>
          </div>
        </div>
        
        {}
        <div className="mt-3">
          <Button
            variant="ghost"
            className="w-full justify-start h-7 text-[#7C8493] hover:bg-red-50 hover:text-red-600 px-0"
            onClick={handleLogout}
          >
            <LogOut className="h-3 w-3 mr-2" />
            <span className="text-xs">Log out</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CompanySidebar