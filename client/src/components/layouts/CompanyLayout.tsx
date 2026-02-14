import { useState, useEffect } from 'react'
import CompanyHeader from '../headers/CompanyHeader'
import CompanySidebar from '../sidebars/CompanySidebar'
import type { CompanyLayoutProps } from '@/interfaces/layout/company-layout-props.interface';

const CompanyLayout = ({ children }: CompanyLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('company-sidebar-collapsed')
    return saved !== null ? JSON.parse(saved) : window.innerWidth < 1280 && window.innerWidth >= 1024
  })
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)

      // Auto-collapse logic for tablets if no manual state is set
      // Actually, it's better to let the user control it once they've interacted
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
      localStorage.setItem('company-sidebar-collapsed', JSON.stringify(nextState))
    }
  }

  const sidebarWidth = isCollapsed ? '80px' : '235px'

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out ${isMobile
          ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full')
          : 'translate-x-0'
          }`}
        style={{ width: isMobile ? '235px' : sidebarWidth }}
      >
        <CompanySidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      </div>

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isMobile ? 'ml-0' : (isCollapsed ? 'ml-[80px]' : 'ml-[235px]')
          }`}
      >
        <div
          className="fixed top-0 right-0 z-20 transition-all duration-300 ease-in-out border-b"
          style={{
            left: isMobile ? '0' : (isCollapsed ? '80px' : '235px')
          }}
        >
          <CompanyHeader onMenuClick={isMobile ? toggleSidebar : undefined} />
        </div>

        <main className="flex-1 p-6 mt-16 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default CompanyLayout
