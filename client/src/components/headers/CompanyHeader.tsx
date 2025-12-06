import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  Plus,
  ChevronDown
} from 'lucide-react'
import { useAppSelector } from '@/hooks/useRedux'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { toast } from 'sonner'

const CompanyHeader = () => {
  const navigate = useNavigate()
  const { name, email, companyVerificationStatus } = useAppSelector((state) => state.auth)
  
  const isVerified = companyVerificationStatus === 'verified'
  const companyName = name || 'ZeekNet'
  const companyEmail = email || null

  return (
    <header className="bg-white border-b border-gray-200" style={{ boxShadow: 'inset 0px -1px 0px 0px rgba(214, 221, 235, 1)' }}>
      <div className="flex items-center justify-between px-7 py-3" style={{ gap: '545px' }}>
        {}
        <div className="flex items-center" style={{ gap: '14px' }}>
          {}
          <div className="relative" style={{ width: '41px', height: '41px' }}>
            <div className="absolute inset-0 rounded-full bg-gray-200"></div>
            <div className="absolute inset-0 flex items-center justify-center rounded-full" style={{ backgroundColor: '#1ED760' }}>
              <span className="text-white text-base font-bold">
                {(companyName || 'Z').charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {}
          <div className="flex flex-col">
            <span className="text-xs font-normal" style={{ color: '#515B6F', fontSize: '14px', lineHeight: '1.6' }}>Company</span>
            <div className="flex items-center" style={{ gap: '7px' }}>
              <span className="font-bold" style={{ color: '#25324B', fontSize: '17px', lineHeight: '1.2' }}>
                {companyName}
              </span>
              <ChevronDown className="h-5 w-5" style={{ color: '#25324B' }} />
            </div>
            {companyEmail && (
              <span className="text-xs font-normal" style={{ color: '#515B6F', fontSize: '12px', lineHeight: '1.4', marginTop: '2px' }}>
                {companyEmail}
              </span>
            )}
          </div>
        </div>

        {}
        <div className="flex items-center justify-center" style={{ gap: '27px' }}>
          <NotificationBell />

          {}
          <Button 
            className="flex items-center justify-center text-white rounded-lg font-bold"
            style={{ 
              backgroundColor: isVerified ? '#4640DE' : '#9CA3AF',
              padding: '10px 20px',
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
            Post a job
          </Button>
        </div>
      </div>
    </header>
  )
}

export default CompanyHeader