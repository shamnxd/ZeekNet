import { Button } from '@/components/ui/button'
import {
  LogOut,
  User,
  Bell,
  Settings,
  Menu
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { logoutThunk } from '@/store/slices/auth.slice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { name } = useAppSelector((state) => state.auth)
  const adminName = name || 'Admin'

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap()
      navigate('/admin/login')
    } catch {
      navigate('/admin/login')
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm w-full">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center space-x-4">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <Button variant="ghost" size="sm" className="relative text-slate-600 hover:text-slate-800" onClick={() => toast.info('Feature is coming')}>
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">0</span>
          </Button>

          <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-slate-600 hover:text-slate-800" onClick={() => toast.info('Feature is coming')}>
            <Settings className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2 md:space-x-3 pl-2 md:pl-4 border-l border-slate-200">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 flex-shrink-0">
                <User className="h-4 w-4 text-slate-600" />
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-medium text-slate-800 whitespace-nowrap">Welcome, {adminName}</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 border-slate-300 text-slate-600 hover:bg-slate-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
