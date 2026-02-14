import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  Settings,
  Grid3X3,
  User,
  Globe,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Tag,
  PackageCheck,
} from 'lucide-react'
import { useAppDispatch } from '@/hooks/useRedux'
import { logoutThunk } from '@/store/slices/auth.slice'

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const AdminSidebar = ({ isCollapsed = false, onToggle }: AdminSidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  const generalItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/admin/payments',
      label: 'Payments',
      icon: FileText,
    },
    {
      path: '/admin/companies',
      label: 'Company',
      icon: Building2,
    },
    {
      path: '/admin/seekers',
      label: 'Candidate',
      icon: Users,
    }
  ]

  const manageJobsItems = [
    {
      path: '/admin/jobs',
      label: 'Jobs',
      icon: Briefcase,
    },
    {
      path: '/admin/job-categories',
      label: 'Job Category',
      icon: Grid3X3,
    },
    {
      path: '/admin/skills',
      label: 'Skills',
      icon: Tag,
    },
    {
      path: '/admin/job-roles',
      label: 'Job Roles',
      icon: User,
    },
    {
      path: '/admin/subscription-plans',
      label: 'Subscription Plans',
      icon: PackageCheck,
    },
  ]

  const bottomItems = [
    {
      path: '/',
      label: 'Visit Website',
      icon: Globe,
    },
    {
      path: '/admin/settings',
      label: 'Settings',
      icon: Settings,
    },
    {
      path: '/logout',
      label: 'Log Out',
      icon: LogOut,
    }
  ]

  const handleNavigation = (path: string) => {
    if (path === '/admin/settings') {
      toast.info('Feature is coming')
      return
    }
    navigate(path)
  }

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap()
      navigate('/admin/login')
    } catch {
      navigate('/admin/login')
    }
  }

  return (
    <div className={`bg-slate-800 h-full relative border-r border-slate-700 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Toggle Button */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 bg-slate-800 border border-slate-700 text-white rounded-full p-1 shadow-sm hover:bg-slate-700 z-50 hidden md:block"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}

      {/* Header Container */}
      <div className={`p-6 border-b border-slate-700 transition-all duration-300 ${isCollapsed ? 'px-4 flex justify-center' : ''}`}>
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
            <img src="/white.png" alt="ZeekNet Logo" className="h-8 w-8" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-white whitespace-nowrap">ZeekNet</h2>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-4 mb-6">
          <div className="space-y-1">
            {generalItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon

              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  title={isCollapsed ? item.label : ''}
                  className={`w-full h-10 text-white hover:bg-slate-700 transition-all duration-300 ${isActive ? "bg-slate-600" : ""} ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />
                  {!isCollapsed && <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>}
                </Button>
              )
            })}
          </div>
        </nav>

        <div className="px-4 mb-6">
          {!isCollapsed && (
            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-2 px-2">MANAGE JOBS</p>
          )}
          <div className="space-y-1">
            {manageJobsItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon

              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  title={isCollapsed ? item.label : ''}
                  className={`w-full h-10 text-white hover:bg-slate-700 transition-all duration-300 ${isActive ? "bg-slate-600" : ""} ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />
                  {!isCollapsed && <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 px-4 space-y-1">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <Button
              key={item.path}
              variant="ghost"
              title={isCollapsed ? item.label : ''}
              className={`w-full h-10 text-white hover:bg-slate-700 transition-all duration-300 ${isActive ? "bg-slate-600" : ""} ${isCollapsed ? 'justify-center' : 'justify-start'}`}
              onClick={item.path === '/logout' ? handleLogout : () => handleNavigation(item.path)}
            >
              <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default AdminSidebar
