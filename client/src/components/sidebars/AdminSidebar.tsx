import { useNavigate, useLocation } from 'react-router-dom'
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
  Menu,
  Tag,
  PackageCheck,
} from 'lucide-react'
import { useAppDispatch } from '@/hooks/useRedux'
import { logoutThunk } from '@/store/slices/auth.slice'

const AdminSidebar = () => {
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
    <div className="w-64 bg-slate-800 h-[100vh] relative">
      {}
      <div className="absolute top-4 right-4 z-10">
        <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg">
            <img src="/white.png" alt="ZeekNet Logo" className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">ZeekNet</h2>
          </div>
        </div>
      </div>
      
      {}
      <nav className="p-4">
        <div className="space-y-1">
          {generalItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                className={`w-full justify-start h-10 text-white hover:bg-slate-700 ${
                  isActive ? "bg-slate-600 text-white" : ""
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon className="h-4 w-4 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
              </Button>
            )
          })}
        </div>
      </nav>

      {}
      <div className="px-4 pb-2">
        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-2">MANAGE JOBS</p>
        <div className="space-y-1">
          {manageJobsItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                className={`w-full justify-start h-10 text-white hover:bg-slate-700 ${
                  isActive ? "bg-slate-600 text-white" : ""
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon className="h-4 w-4 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
      
      {}
      <div className="absolute bottom-0 w-64 p-4 space-y-1">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              className={`w-full justify-start h-10 text-white hover:bg-slate-700 ${
                isActive ? "bg-slate-600 text-white" : ""
              }`}
              onClick={item.path === '/logout' ? handleLogout : () => handleNavigation(item.path)}
            >
              <Icon className="h-4 w-4 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default AdminSidebar