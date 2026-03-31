import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Plus,
  ChevronDown,
  Menu
} from 'lucide-react'
import { useAppSelector } from '@/hooks/useRedux'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { toast } from 'sonner'

interface CompanyHeaderProps {
  onMenuClick?: () => void;
}

const CompanyHeader = ({ onMenuClick }: CompanyHeaderProps) => {
  const navigate = useNavigate()
  const { name, companyVerificationStatus, companyLogo, companyName } = useAppSelector((state) => state.auth)

  const isVerified = companyVerificationStatus === 'verified'
  const displayName = companyName || name || 'ZeekNet'

  return (
    <header className="bg-white border-b border-gray-200 w-full" style={{ boxShadow: 'inset 0px -1px 0px 0px rgba(214, 221, 235, 1)' }}>
      <div className="flex items-center justify-between px-4 md:px-7 py-3">
        { }
        <div className="flex items-center gap-3 md:gap-4">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          )}

          <div className="flex items-center" style={{ gap: '14px' }}>
            <div className="relative" style={{ width: '41px', height: '41px' }}>
              <div className="absolute inset-0 rounded-full bg-gray-200"></div>
              <div className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden" style={{ backgroundColor: '#1ED760' }}>
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-base font-bold">
                    {(displayName || 'Z').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-normal" style={{ color: '#515B6F', fontSize: '14px', lineHeight: '1.6' }}>Company</span>
              <div className="flex items-center" style={{ gap: '7px' }}>
                <span className="font-bold truncate max-w-[150px]" style={{ color: '#25324B', fontSize: '17px', lineHeight: '1.2' }}>
                  {displayName}
                </span>
                <ChevronDown className="h-5 w-5" style={{ color: '#25324B' }} />
              </div>
            </div>
          </div>
        </div>

        { }
        <div className="flex items-center gap-4 md:gap-7">
          <NotificationBell />

          <Button
            className="flex items-center justify-center text-white rounded-lg font-bold px-3 md:px-5 py-2 md:py-2.5"
            style={{
              backgroundColor: isVerified ? '#4640DE' : '#9CA3AF',
              gap: '8px',
              fontSize: '14px',
              lineHeight: '1.6',
              cursor: isVerified ? 'pointer' : 'not-allowed',
              opacity: isVerified ? 1 : 0.6
            }}
            onClick={() => {
              if (!isVerified) {
                toast.error('Profile Verification Required', {
                  description: 'Please complete and verify your company profile before posting jobs.',
                })
                navigate('/company/profile')
                return
              }
              navigate('/company/post-job')
            }}
            disabled={!isVerified}
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Post a job</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default CompanyHeader
