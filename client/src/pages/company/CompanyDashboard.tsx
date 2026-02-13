import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatATSStage } from '@/utils/formatters';
import CompanyLayout from '../../components/layouts/CompanyLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  FileText,
  Calendar
} from 'lucide-react'
import { companyApi } from '@/api/company.api'
import { toast } from 'sonner'
import FormDialog from '@/components/common/FormDialog'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Loader2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchCompanyProfileThunk } from '@/store/slices/auth.slice'
import type { CompanySideApplication } from '@/interfaces/company/company-data.interface'

const CompanyDashboard = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { companyVerificationStatus, name } = useAppSelector((state) => state.auth)
  const [rejectionReason, setRejectionReason] = useState<string | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [profileStep, setProfileStep] = useState<1 | 2 | 3>(1)
  const [profileMode, setProfileMode] = useState<'create' | 'reverify'>('create')
  const [stats, setStats] = useState<{
    activeJobs: number;
    totalJobs: number;
    totalApplications: number;
    upcomingInterviews: number;
    unreadMessages: number;
    newCandidatesCount?: number;
    todayInterviews?: Array<{
      id: string;
      candidateName: string;
      jobTitle: string;
      interviewTitle: string;
      interviewType: string;
      scheduledTime: string;
      status: string;
      seekerProfileImage?: string;
    }>;
  } | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [applications, setApplications] = useState<CompanySideApplication[]>([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [selectedPeriod] = useState<'week' | 'month' | 'year'>('week')
  const [form, setForm] = useState({
    company_name: '',
    email: '',
    website: '',
    website_link: '',
    industry: '',
    organisation: '',
    location: '',
    employees: '',
    description: '',
    about_us: '',
    logo: '',
    business_license: '',
    tax_id: ''
  })
  const [uploading, setUploading] = useState<{ logo: boolean; business_license: boolean }>({ logo: false, business_license: false })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const step1Schema = z.object({
    company_name: z.string().min(1, 'Company name is required').min(2, 'Company name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    website: z.string().min(1, 'Website is required').refine((val) => {
      try {
        new URL(val.startsWith('http') ? val : `https://${val}`)
        return true
      } catch {
        return false
      }
    }, 'Please enter a valid website URL'),
    industry: z.string().min(1, 'Industry is required'),
    organisation: z.string().min(1, 'Organisation type is required'),
  })

  const step2Schema = z.object({
    location: z.string().min(1, 'Location is required').min(2, 'Location must be at least 2 characters'),
    employees: z.string().min(1, 'Number of employees is required'),
    description: z.string().min(1, 'Company description is required').min(10, 'Description must be at least 10 characters'),
  })

  const step3Schema = z.object({
    tax_id: z.string().min(1, 'Tax ID is required').min(3, 'Tax ID must be at least 3 characters'),
    business_license: z.string().optional() // Made optional based on previous code but can be required if needed
  })


  // Helper function to convert employee count number to range
  const convertEmployeeCountToRange = (count: string | number): string => {
    const num = typeof count === 'string' ? parseInt(count) : count;
    if (isNaN(num)) return '1-10';
    if (num <= 10) return '1-10';
    if (num <= 50) return '11-50';
    if (num <= 200) return '51-200';
    if (num <= 500) return '201-500';
    if (num <= 1000) return '501-1000';
    return '1000+';
  }

  const loadProfileForReverify = useCallback(async () => {
    if (isProfileModalOpen && profileMode === 'reverify') {
      try {
        const resp = await companyApi.getCompleteProfile()
        if (resp.success && resp.data) {
          const data = resp.data!
          const p = data.profile

          // Extract location from locations array
          const locationValue = data.locations?.[0]?.location ||
            data.locations?.[0]?.city ||
            data.locations?.[0]?.address ||
            '';

          // Extract employee count - convert number to string
          const employeeValue = p.employee_count ? String(p.employee_count) : '';

          setForm({
            company_name: p.company_name || '',
            email: data.contact?.email || '',
            website: p.website_link || p.website || '',
            website_link: p.website_link || '',
            industry: p.industry || '',
            organisation: p.organisation || '',
            location: locationValue,
            employees: employeeValue,
            description: p.about_us || '',
            about_us: p.about_us || '',
            logo: p.logo || '',
            business_license: p.business_license || '',
            tax_id: p.tax_id || ''
          })

          if (p.rejection_reason) {
            setRejectionReason(p.rejection_reason)
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
        toast.error('Failed to load profile data')
      }
    }
  }, [isProfileModalOpen, profileMode])


  useEffect(() => {
    if (companyVerificationStatus === 'rejected' && !rejectionReason) {
      companyApi.getProfile().then((res) => {
        if (res.success && res.data) {
          const resData = res.data as { profile?: { rejection_reason?: string } } | { rejection_reason?: string };
          const profileData = 'profile' in resData && resData.profile ? resData.profile : ('rejection_reason' in resData ? resData : null);
          if (profileData?.rejection_reason) {
            setRejectionReason(profileData.rejection_reason)
          }
        }
      }).catch(() => { })
    }
  }, [companyVerificationStatus, rejectionReason])

  useEffect(() => {
    if (isProfileModalOpen) {
      loadProfileForReverify()
    }
  }, [isProfileModalOpen, loadProfileForReverify])

  useEffect(() => {
    const fetchStats = async () => {
      if (companyVerificationStatus === 'not_created' ||
        companyVerificationStatus === 'pending' ||
        companyVerificationStatus === 'rejected') {
        setStatsLoading(false)
        return
      }

      try {
        setStatsLoading(true)
        const response = await companyApi.getDashboardStats()
        if (response.success && response.data) {
          setStats(response.data)
        }
      } catch {
        // Silent fail - don't show toast for stats
      } finally {
        setStatsLoading(false)
      }
    }

    const fetchApplications = async () => {
      if (companyVerificationStatus === 'not_created' ||
        companyVerificationStatus === 'pending' ||
        companyVerificationStatus === 'rejected') {
        setApplicationsLoading(false)
        return
      }

      try {
        setApplicationsLoading(true)
        const response = await companyApi.getApplications({ page: 1, limit: 100 })
        if (response.success && response.data) {
          setApplications(response.data.applications || [])
        }
      } catch {
        // Silent fail for applications
      } finally {
        setApplicationsLoading(false)
      }
    }

    fetchStats()
    fetchApplications()
  }, [companyVerificationStatus])

  const getDateRange = (period: 'week' | 'month' | 'year'): string => {
    const now = new Date()
    let start: Date
    if (period === 'week') {
      start = new Date(now)
      start.setDate(now.getDate() - 7)
    } else if (period === 'month') {
      start = new Date(now)
      start.setMonth(now.getMonth() - 1)
    } else {
      start = new Date(now)
      start.setFullYear(now.getFullYear() - 1)
    }
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${formatDate(start)} - ${formatDate(now)}`
  }

  const applicationSummary = useMemo(() => {
    const summary: Record<string, number> = {
      'Full Time': 0,
      'Part-Time': 0,
      'Remote': 0,
      'Internship': 0,
      'Contract': 0,
    }
    applications.forEach(app => {
      const type = app.employmentType || 'Full Time'
      if (type in summary) {
        summary[type] = (summary[type] || 0) + 1
      }
    })
    return summary
  }, [applications])

  return (
    <CompanyLayout>
      <div className="min-h-screen">
        { }
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Good morning, {name || 'User'}</h1>
              <p className="text-sm text-gray-600">
                Here is your job listings statistic report.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg">
                <Calendar className="h-3 w-3 text-[#4640DE]" />
                <span className="text-sm font-semibold text-gray-900">{getDateRange(selectedPeriod)}</span>
              </div>
            </div>
          </div>

          {companyVerificationStatus === 'not_created' && (
            <div className="mb-4 border border-blue-200 bg-blue-50 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-md font-bold text-gray-900 mb-1">
                    Complete Your Registration
                  </h3>
                  <p className="text-xs text-gray-600">
                    Please complete your company profile setup to start using all features of ZeekNet.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="ml-4 bg-[#4640DE] hover:bg-[#3a35c7] text-white"
                  onClick={() => {
                    setProfileMode('create')
                    setProfileStep(1)
                    setValidationErrors({})
                    setForm({
                      company_name: '',
                      email: '',
                      website: '',
                      website_link: '',
                      industry: '',
                      organisation: '',
                      location: '',
                      employees: '',
                      description: '',
                      about_us: '',
                      logo: '',
                      business_license: '',
                      tax_id: ''
                    })
                    setIsProfileModalOpen(true)
                  }}
                >
                  Complete Registration
                </Button>
              </div>
            </div>
          )}

          {companyVerificationStatus && companyVerificationStatus !== 'verified' && companyVerificationStatus !== 'not_created' && (
            <div className={`mb-4 border rounded-lg p-4 ${companyVerificationStatus === 'rejected' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-md font-bold text-gray-900">
                    {companyVerificationStatus === 'rejected' ? 'Verification Rejected' : 'Verification Pending'}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {companyVerificationStatus === 'rejected'
                      ? rejectionReason
                        ? `Reason: ${rejectionReason}`
                        : 'Reason: Your submission did not meet verification requirements.'
                      : 'Your company verification is currently under review.'}
                  </p>
                </div>
                {companyVerificationStatus === 'rejected' && (
                  <Button size="sm" variant="destructive" onClick={() => {
                    setProfileMode('reverify')
                    setProfileStep(1);
                    setValidationErrors({});
                    setIsProfileModalOpen(true);
                  }}>
                    Reverify
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#FF2D55] rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold mb-1">{statsLoading ? '...' : (stats?.newCandidatesCount || 0)}</p>
                  <p className="text-sm font-medium">New candidates to review</p>
                </div>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            <div className="bg-[#A2845E] rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold mb-1">{statsLoading ? '...' : (stats?.upcomingInterviews || 0)}</p>
                  <p className="text-sm font-medium">Scheduled for today</p>
                </div>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            <div className="bg-[#34C759] rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold mb-1">{statsLoading ? '...' : (stats?.unreadMessages || 0)}</p>
                  <p className="text-sm font-medium">Unread messages</p>
                </div>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          { }
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            { }
            <div className="lg:col-span-2">
              {/* Recent Applications Table */}
              <Card className="bg-white border border-gray-200 rounded-lg h-full">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-bold text-gray-900">Recent Applications</CardTitle>
                  <Button variant="ghost" className="text-sm text-[#4640DE]" onClick={() => navigate('/company/applicants')}>
                    View All <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                        <tr>
                          <th className="px-4 py-3">Candidate</th>
                          <th className="px-4 py-3">Role</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Stage</th>
                          <th className="px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applicationsLoading ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Loading...</td>
                          </tr>
                        ) : applications.slice(0, 8).map((app) => (
                          <tr key={app.id || app._id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-4 font-medium text-gray-900 flex items-center gap-3">
                              {app.seeker_avatar ? (
                                <img src={app.seeker_avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">{(app.seeker_name?.[0] || app.name?.[0] || '?')}</div>
                              )}
                              <div>
                                <p className="font-semibold">{app.seeker_name || app.name || 'Unknown User'}</p>
                                {app.is_blocked && <span className="text-[10px] text-red-600 bg-red-100 px-1.5 py-0.5 rounded font-medium">Blocked User</span>}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-600 max-w-[150px] truncate" title={app.job_title || app.job?.title}>{app.job_title || app.job?.title || 'Unknown Role'}</td>
                            <td className="px-4 py-4 text-gray-600">
                              {app.applied_date ? new Date(app.applied_date).toLocaleDateString() :
                                app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                              ${app.stage === 'hired' ? 'bg-green-100 text-green-800' :
                                  app.stage === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'}`}>
                                {formatATSStage(app.stage || 'Applied')}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#4640DE] hover:text-[#3a35c7] hover:bg-blue-50"
                                onClick={() => navigate(`/company/applicants/${app.id || app._id}`)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {!applicationsLoading && applications.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                              No recent applications found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Job Statistics */}
            <div className="space-y-4">
              <Card className="bg-white border border-gray-200 rounded-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-gray-900">Job Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900">{statsLoading ? '...' : (stats?.totalApplications || 0)}</p>
                      <p className="text-xs text-gray-500">Applications</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900">{statsLoading ? '...' : (stats?.activeJobs || 0)}</p>
                      <p className="text-xs text-gray-500">Active Jobs</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Employment Type</p>
                  </div>
                  {!applicationsLoading && (
                    <>
                      <div className="flex items-center justify-center space-x-1 mb-4">
                        {Object.entries(applicationSummary).map(([type, count], idx) => {
                          const maxCount = Math.max(...Object.values(applicationSummary), 1)
                          const width = maxCount > 0 ? (count / maxCount) * 100 : 0
                          const colors = ['bg-[#7B61FF]', 'bg-[#56CDAD]', 'bg-[#26A4FF]', 'bg-[#FFB836]', 'bg-[#FF6550]']
                          return (
                            <div
                              key={type}
                              className={`${colors[idx % colors.length]} rounded`}
                              style={{ width: `${Math.max(10, width)}%`, height: '12px' }}
                            ></div>
                          )
                        })}
                      </div>

                      <div className="space-y-2">
                        {Object.entries(applicationSummary).map(([type, count], idx) => {
                          const colors = ['bg-[#7B61FF]', 'bg-[#56CDAD]', 'bg-[#26A4FF]', 'bg-[#FFB836]', 'bg-[#FF6550]']
                          return (
                            <div key={type} className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <div className={`w-2 h-2 ${colors[idx % colors.length]} rounded`}></div>
                                <span className="text-xs text-gray-600">{type}: {count}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <Card className="bg-white border border-gray-200 rounded-lg">
                <CardHeader className="pb-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-900">Today's Schedule</CardTitle>
                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {stats?.todayInterviews && stats.todayInterviews.length > 0 ? (
                    <div className="space-y-3">
                      {stats.todayInterviews.map((interview) => (
                        <div key={interview.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                          {interview.seekerProfileImage ? (
                            <img src={interview.seekerProfileImage} alt={interview.candidateName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200">
                              {interview.candidateName?.charAt(0) || '?'}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate" title={interview.interviewTitle}>{interview.interviewTitle}</p>
                            <p className="text-xs text-gray-600 truncate">{interview.candidateName} • <span className="text-gray-500">{interview.jobTitle}</span></p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${interview.interviewType === 'online' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                {interview.interviewType}
                              </span> • <p className="text-xs text-gray-500">{new Date(interview.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No interviews scheduled for today</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>



          {stats && (stats.newCandidatesCount || 0) > 0 && (
            <div className="mt-6">
              <Card className="bg-white border border-gray-200 rounded-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">New Candidates</CardTitle>
                    <Button
                      variant="ghost"
                      className="text-[#4640DE] font-semibold flex items-center space-x-1 text-sm"
                      onClick={() => window.location.href = '/company/applicants'}
                    >
                      <span>View All</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    You have {stats.newCandidatesCount} new candidate{stats.newCandidatesCount !== 1 ? 's' : ''} to review.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <FormDialog
        disableOutsideClick={true}
        open={isProfileModalOpen}
        onOpenChange={(open) => {
          setIsProfileModalOpen(open)
          if (!open) {
            setValidationErrors({})
            setProfileStep(1)
          }
        }}
        title={profileMode === 'reverify' ? "Reverify Company" : "Complete Registration"}
        description={profileMode === 'reverify' ? "Update required details and resubmit for verification." : "Enter your company details to complete registration."}
        submitLabel={profileStep === 3 ? (profileMode === 'reverify' ? 'Submit Reapplication' : 'Create Profile') : 'Next'}
        onSubmit={async () => {
          setValidationErrors({})
          try {
            if (profileStep === 1) {
              const result = step1Schema.safeParse({
                company_name: form.company_name,
                email: form.email,
                website: form.website,
                industry: form.industry,
                organisation: form.organisation
              })

              if (!result.success) {
                const fieldErrors: Record<string, string> = {}
                result.error.issues.forEach((error) => {
                  if (error.path[0]) fieldErrors[error.path[0] as string] = error.message
                })
                setValidationErrors(fieldErrors)
                return
              }
              setProfileStep(2)
              return
            }
            if (profileStep === 2) {
              const result = step2Schema.safeParse({
                location: form.location,
                employees: form.employees,
                description: form.description
              })

              if (!result.success) {
                const fieldErrors: Record<string, string> = {}
                result.error.issues.forEach((error) => {
                  if (error.path[0]) fieldErrors[error.path[0] as string] = error.message
                })
                setValidationErrors(fieldErrors)
                return
              }
              setProfileStep(3)
              return
            }
            if (profileStep === 3) {
              const result = step3Schema.safeParse({
                tax_id: form.tax_id,
                business_license: form.business_license
              })

              if (!result.success) {
                const fieldErrors: Record<string, string> = {}
                result.error.issues.forEach((error) => {
                  if (error.path[0]) fieldErrors[error.path[0] as string] = error.message
                })
                setValidationErrors(fieldErrors)
                return
              }

              // Proceed with backend submission
              const profileData = {
                company_name: form.company_name,
                email: form.email,
                website: form.website || form.website_link || '',
                industry: form.industry,
                organisation: form.organisation,
                location: form.location,
                employees: convertEmployeeCountToRange(form.employees),
                description: form.description,
                logo: form.logo || '',
                business_license: form.business_license || '',
                tax_id: form.tax_id,
              }

              let resp;
              if (profileMode === 'reverify') {
                resp = await companyApi.reapplyVerification(profileData)
              } else {
                resp = await companyApi.createProfile(profileData)
              }

              if (resp.success) {

                dispatch(fetchCompanyProfileThunk()).catch(() => { })

                toast.success(profileMode === 'reverify' ? 'Reverification submitted. Status set to pending.' : 'Profile created successfully!')
                setIsProfileModalOpen(false)
                setValidationErrors({})
                setProfileStep(1)
              } else {
                if (resp.errors && resp.errors.length > 0) {
                  const errorMap: Record<string, string> = {}
                  resp.errors.forEach(err => {
                    errorMap[err.field] = err.message
                  })
                  setValidationErrors(errorMap)
                  toast.error(resp.message || 'Validation failed')
                } else {
                  toast.error(resp.message || (profileMode === 'reverify' ? 'Failed to submit reverification' : 'Failed to create profile'))
                }
              }
            }
          } catch {
            toast.error(profileMode === 'reverify' ? 'Failed to submit reverification' : 'Failed to create profile')
          }
        }}

        cancelLabel="Cancel"
        maxWidth="lg"
      >
        <div className="space-y-4">
          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${profileStep >= 1 ? 'bg-[#4640DE] text-white' : 'bg-gray-200 text-gray-500'}`}>
                <span className="text-sm font-semibold">1</span>
              </div>
              <span className={`text-sm font-medium ${profileStep >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>Basic Info</span>
            </div>

            <div className={`w-12 h-0.5 ${profileStep >= 2 ? 'bg-[#4640DE]' : 'bg-gray-200'}`}></div>

            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${profileStep >= 2 ? 'bg-[#4640DE] text-white' : 'bg-gray-200 text-gray-500'}`}>
                <span className="text-sm font-semibold">2</span>
              </div>
              <span className={`text-sm font-medium ${profileStep >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>Details</span>
            </div>

            <div className={`w-12 h-0.5 ${profileStep >= 3 ? 'bg-[#4640DE]' : 'bg-gray-200'}`}></div>

            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${profileStep >= 3 ? 'bg-[#4640DE] text-white' : 'bg-gray-200 text-gray-500'}`}>
                <span className="text-sm font-semibold">3</span>
              </div>
              <span className={`text-sm font-medium ${profileStep >= 3 ? 'text-gray-900' : 'text-gray-500'}`}>Documents</span>
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {profileStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name" className="text-sm mb-3 font-semibold">Company Name *</Label>
                <Input id="company_name" value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))} className={validationErrors.company_name ? 'border-red-500' : ''} />
                {validationErrors.company_name && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.company_name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email" className="text-sm mb-3 font-semibold">Company Email *</Label>
                <Input id="email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={validationErrors.email ? 'border-red-500' : ''} />
                {validationErrors.email && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="website" className="text-sm mb-3 font-semibold">Website *</Label>
                <Input id="website" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://example.com" className={validationErrors.website ? 'border-red-500' : ''} />
                {validationErrors.website && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.website}</p>
                )}
              </div>
              <div>
                <Label htmlFor="industry" className="text-sm mb-3 font-semibold">Industry *</Label>
                <Select value={form.industry} onValueChange={(value) => setForm(p => ({ ...p, industry: value }))}>
                  <SelectTrigger className={`w-full ${validationErrors.industry ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.industry && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.industry}</p>
                )}
              </div>
              <div>
                <Label htmlFor="organisation" className="text-sm mb-3 font-semibold">Organisation Type *</Label>
                <Select value={form.organisation} onValueChange={(value) => setForm(p => ({ ...p, organisation: value }))}>
                  <SelectTrigger className={`w-full ${validationErrors.organisation ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.organisation && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.organisation}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Company Details */}
          {profileStep === 2 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-sm mb-3 font-semibold">Location *</Label>
                  <Input id="location" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g., San Francisco, CA" className={validationErrors.location ? 'border-red-500' : ''} />
                  {validationErrors.location && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.location}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="employees" className="text-sm mb-3 font-semibold">Number of Employees *</Label>
                  <Input
                    id="employees"
                    type="number"
                    value={form.employees}
                    onChange={e => setForm(p => ({ ...p, employees: e.target.value }))}
                    placeholder="e.g., 50"
                    className={validationErrors.employees ? 'border-red-500' : ''}
                  />
                  {validationErrors.employees && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.employees}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm mb-3 font-semibold">Company Description *</Label>
                <Textarea id="description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} placeholder="Tell us about your company..." className={validationErrors.description ? 'border-red-500' : ''} />
                {validationErrors.description && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.description}</p>
                )}
              </div>

              <div>
                <Label className="text-sm mb-3 font-semibold">Company Logo (Optional)</Label>
                <div className="border-2 border-dashed rounded-md p-4 text-center">
                  {form.logo ? (
                    <div className="space-y-3">
                      <img src={form.logo} alt="Company Logo" className="h-16 w-16 mx-auto rounded object-cover" />
                      <Button type="button" variant="outline" disabled={uploading.logo} onClick={() => document.getElementById('modal-logo-upload')?.click()}>
                        {uploading.logo ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</>) : (<><Upload className="h-4 w-4 mr-2" />Change Logo</>)}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-10 w-10 mx-auto text-gray-400" />
                      <Button type="button" variant="outline" disabled={uploading.logo} onClick={() => document.getElementById('modal-logo-upload')?.click()}>
                        {uploading.logo ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</>) : (<><Upload className="h-4 w-4 mr-2" />Choose File</>)}
                      </Button>
                    </div>
                  )}
                  <input id="modal-logo-upload" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    try {
                      setUploading(u => ({ ...u, logo: true }))
                      const up = await companyApi.uploadLogo(file)
                      const url = up.data?.url
                      if (up.success && url) setForm(p => ({ ...p, logo: url }))
                      toast.success('Logo uploaded successfully')
                    } catch {
                      toast.error('Failed to upload logo')
                    } finally {
                      setUploading(u => ({ ...u, logo: false }))
                    }
                  }} />
                </div>
              </div>
            </>
          )}

          {/* Step 3: Documents */}
          {profileStep === 3 && (
            <>
              <div>
                <Label htmlFor="tax_id" className="text-sm mb-3 font-semibold">Tax ID / Registration Number *</Label>
                <Input id="tax_id" value={form.tax_id} onChange={e => setForm(p => ({ ...p, tax_id: e.target.value }))} placeholder="e.g., 12-3456789" className={validationErrors.tax_id ? 'border-red-500' : ''} />
                {validationErrors.tax_id && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.tax_id}</p>
                )}
              </div>

              <div>
                <Label className="text-sm mb-3 font-semibold">Business License *</Label>
                <div className="border-2 border-dashed rounded-md p-4 text-center">
                  {form.business_license ? (
                    <div className="space-y-3">
                      <FileText className="h-10 w-10 mx-auto text-green-600" />
                      <p className="text-sm font-medium text-green-600">✓ Business license uploaded</p>
                      <div className="flex flex-col gap-2">
                        <a
                          href={form.business_license}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          View Current Document
                        </a>
                        <Button type="button" variant="outline" size="sm" disabled={uploading.business_license} onClick={() => document.getElementById('modal-bl-upload')?.click()}>
                          {uploading.business_license ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</>) : (<><Upload className="h-4 w-4 mr-2" />Change Document</>)}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-10 w-10 mx-auto text-gray-400" />
                      <Button type="button" variant="outline" disabled={uploading.business_license} onClick={() => document.getElementById('modal-bl-upload')?.click()}>
                        {uploading.business_license ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</>) : (<><Upload className="h-4 w-4 mr-2" />Upload Document</>)}
                      </Button>
                    </div>
                  )}
                  <input id="modal-bl-upload" type="file" accept=".pdf,.doc,.docx,image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    try {
                      setUploading(u => ({ ...u, business_license: true }))
                      const up = await companyApi.uploadBusinessLicense(file)
                      const url = up.data?.url
                      if (up.success && url) setForm(p => ({ ...p, business_license: url }))
                      toast.success('Business license uploaded successfully')
                    } catch {
                      toast.error('Failed to upload business license')
                    } finally {
                      setUploading(u => ({ ...u, business_license: false }))
                    }
                  }} />
                </div>
                {validationErrors.business_license && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.business_license}</p>
                )}
              </div>
            </>
          )}

          {/* Step indicator */}
          {profileStep > 1 && (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setProfileStep((prev) => (prev - 1) as 1 | 2 | 3)}
                className="text-sm"
              >
                ← Previous Step
              </Button>
            </div>
          )}
        </div>
      </FormDialog>
    </CompanyLayout>
  )
}

export default CompanyDashboard