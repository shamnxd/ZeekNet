import { useState, useEffect } from 'react'
import AdminHeader from '../headers/AdminHeader'
import AdminSidebar from '../sidebars/AdminSidebar'
import type { AdminLayoutProps } from '@/interfaces/layout/admin-layout-props.interface';

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed')
    return saved !== null ? JSON.parse(saved) : (window.innerWidth < 1280 && window.innerWidth >= 1024)
  })
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setIsCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen)
    } else {
      const nextState = !isCollapsed
      setIsCollapsed(nextState)
      localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(nextState))
    }
  }

  const sidebarWidth = isCollapsed ? '80px' : '256px'

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out ${isMobile
          ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full')
          : 'translate-x-0'
          }`}
        style={{ width: isMobile ? '256px' : sidebarWidth }}
      >
        <AdminSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      </div>

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isMobile ? 'ml-0' : (isCollapsed ? 'ml-[80px]' : 'ml-[256px]')
          }`}
      >
        <div
          className="fixed top-0 right-0 z-20 transition-all duration-300 ease-in-out border-b"
          style={{
            left: isMobile ? '0' : (isCollapsed ? '80px' : '256px')
          }}
        >
          <AdminHeader onMenuClick={isMobile ? toggleSidebar : undefined} />
        </div>

        <main className="flex-1 p-6 bg-gray-50 mt-16 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
