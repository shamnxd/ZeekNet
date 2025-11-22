import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  Plus,
  ChevronDown
} from 'lucide-react'
import { useAppSelector } from '@/hooks/useRedux'
import { companyApi } from '@/api/company.api'
import { NotificationBell } from '@/components/notifications/NotificationBell'

const CompanyHeader = () => {
  const navigate = useNavigate()
  const { name } = useAppSelector((state) => state.auth)
  const [companyName, setCompanyName] = useState(name || 'ZeekNet')
  const [companyLogo, setCompanyLogo] = useState<string | null>(null)
  const [companyEmail, setCompanyEmail] = useState<string | null>(null)
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
        setCompanyName(profile.company_name || name || 'ZeekNet')
        setCompanyLogo(profile.logo || null)
        setCompanyEmail(contact?.email || profile.email || null)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200" style={{ boxShadow: 'inset 0px -1px 0px 0px rgba(214, 221, 235, 1)' }}>
      <div className="flex items-center justify-between px-7 py-3" style={{ gap: '545px' }}>
        {}
        <div className="flex items-center" style={{ gap: '14px' }}>
          {}
          <div className="relative" style={{ width: '41px', height: '41px' }}>
            <div className="absolute inset-0 rounded-full bg-gray-200"></div>
            {companyLogo ? (
              <div className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden">
                <img 
                  src={companyLogo} 
                  alt={companyName || 'Company Logo'} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center rounded-full" style={{ backgroundColor: '#1ED760' }}>
                <span className="text-white text-base font-bold">
                  {loading ? 'L' : (companyName || 'Z').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {}
          <div className="flex flex-col">
            <span className="text-xs font-normal" style={{ color: '#515B6F', fontSize: '14px', lineHeight: '1.6' }}>Company</span>
            <div className="flex items-center" style={{ gap: '7px' }}>
              <span className="font-bold" style={{ color: '#25324B', fontSize: '17px', lineHeight: '1.2' }}>
                {loading ? 'Loading...' : (companyName || 'ZeekNet')}
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
              backgroundColor: '#4640DE',
              padding: '10px 20px',
              gap: '8px',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
            onClick={() => navigate('/company/post-job')}
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