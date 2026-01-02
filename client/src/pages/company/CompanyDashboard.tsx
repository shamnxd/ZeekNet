import { useState, useEffect } from 'react'
import CompanyLayout from '../../components/layouts/CompanyLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  FileText,
  TrendingUp,
  Calendar,
  Eye
} from 'lucide-react'
import { companyApi } from '@/api/company.api'
import { toast } from 'sonner'
import FormDialog from '@/components/common/FormDialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Loader2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchCompanyProfileThunk } from '@/store/slices/auth.slice'
import type { CompanyDashboardStats } from '@/interfaces/company/company-dashboard-stats.interface'

const CompanyDashboard = () => {
  const dispatch = useAppDispatch()
  const { companyVerificationStatus } = useAppSelector((state) => state.auth)
  const [rejectionReason, setRejectionReason] = useState<string | null>(null)
  const [reverifyOpen, setReverifyOpen] = useState(false)
  const [reverifyStep, setReverifyStep] = useState<1 | 2>(1)
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
  const [dashboardStats, setDashboardStats] = useState<CompanyDashboardStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [period, setPeriod] = useState<'week' | 'month'>('week')
  const [activeTab, setActiveTab] = useState<'overview' | 'views' | 'applied'>('overview')

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoadingStats(true)
        const response = await companyApi.getDashboardStats(period)
        console.log('Dashboard stats response:', response)
        if (response.success && response.data) {
          console.log('Setting dashboard stats:', response.data)
          setDashboardStats(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setIsLoadingStats(false)
      }
    }
    fetchDashboardStats()
  }, [period])

  // Debug: Log dashboard stats whenever it changes
  useEffect(() => {
    console.log('Dashboard stats updated:', dashboardStats)
    console.log('Is loading:', isLoadingStats)
  }, [dashboardStats, isLoadingStats])


  const loadProfileForReverify = async () => {
    if (reverifyOpen && !form.company_name) {
      try {
        const resp = await companyApi.getCompleteProfile()
        if (resp.success && resp.data) {
          const data = resp.data!
          const p = data.profile
          setForm({
            company_name: p.company_name || '',
            email: data.contact?.email || '',
            website: p.website || p.website_link || '',
            website_link: p.website_link || '',
            industry: p.industry || '',
            organisation: p.organisation || '',
            location: data.locations[0]?.city || '',
            employees: (p.employee_count || p.employees || '') as string,
            description: p.description || '',
            about_us: p.about_us || '',
            logo: p.logo || '',
            business_license: p.business_license || '',
            tax_id: p.tax_id || ''
          })
          if (p.rejection_reason) {
            setRejectionReason(p.rejection_reason)
          }
        }
      } catch {
        toast.error('Failed to load profile data')
      }
    }
  }


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


  return (
    <CompanyLayout>
      <div className="min-h-screen">
        { }
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Good morning, Maria</h1>
              <p className="text-sm text-gray-600">
                Here is your job listings statistic report from July 19 - July 25.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg">
                <Calendar className="h-3 w-3 text-[#4640DE]" />
                <span className="text-sm font-semibold text-gray-900">Jul 19 - Jul 25</span>
              </div>
            </div>
          </div>

          {companyVerificationStatus && companyVerificationStatus !== 'verified' && (
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
                    setReverifyStep(1);
                    setValidationErrors({});
                    setReverifyOpen(true);
                    loadProfileForReverify();
                  }}>
                    Reverify
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* New Candidates */}
            <div className="bg-[#FF2D55] rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold mb-1">
                    {isLoadingStats ? '...' : (dashboardStats?.stats.newCandidates ?? 0)}
                  </p>
                  <p className="text-sm font-medium">New candidates to review</p>
                </div>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* Schedule for Today */}
            <div className="bg-[#A2845E] rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold mb-1">{isLoadingStats ? '...' : dashboardStats?.stats.scheduledToday || 0}</p>
                  <p className="text-sm font-medium">Schedule for today</p>
                </div>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* Messages Received */}
            <div className="bg-[#34C759] rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold mb-1">{isLoadingStats ? '...' : dashboardStats?.stats.messagesReceived || 0}</p>
                  <p className="text-sm font-medium">Messages received</p>
                </div>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Job Statistics */}
            <div className="lg:col-span-2">
              <Card className="bg-white border border-gray-200 rounded-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">Job statistics</CardTitle>
                      <CardDescription className="text-sm text-gray-600">Showing Jobstatistic Jul 19-25</CardDescription>
                    </div>
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPeriod('week')}
                        className={`text-xs font-semibold ${period === 'week' ? 'bg-white text-[#4640DE]' : 'text-gray-600'}`}
                      >
                        Week
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPeriod('month')}
                        className={`text-xs font-semibold ${period === 'month' ? 'bg-white text-[#4640DE]' : 'text-gray-600'}`}
                      >
                        Month
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Tabs */}
                    <div className="flex space-x-6 border-b border-gray-200">
                      <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-1 font-semibold text-sm ${activeTab === 'overview' ? 'border-b-2 border-[#4640DE] text-[#4640DE]' : 'text-gray-600'}`}
                      >
                        Overview
                      </button>
                      <button
                        onClick={() => setActiveTab('views')}
                        className={`pb-1 font-semibold text-sm ${activeTab === 'views' ? 'border-b-2 border-[#4640DE] text-[#4640DE]' : 'text-gray-600'}`}
                      >
                        Jobs View
                      </button>
                      <button
                        onClick={() => setActiveTab('applied')}
                        className={`pb-1 font-semibold text-sm ${activeTab === 'applied' ? 'border-b-2 border-[#4640DE] text-[#4640DE]' : 'text-gray-600'}`}
                      >
                        Jobs Applied
                      </button>
                    </div>

                    {/* Chart and Legend */}
                    <div className="space-y-3">
                      {/* Chart */}
                      <div className="h-48 flex items-end space-x-3">
                        {(dashboardStats?.charts.jobStats || []).map((stat, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                            <div className="w-full flex flex-col space-y-0.5">
                              <div
                                className="bg-[#FFCC00] rounded-t"
                                style={{ height: `${(stat.views / 150) * 150}px` }}
                              ></div>
                              <div
                                className="bg-[#AF52DE] rounded-b"
                                style={{ height: `${(stat.applied / 50) * 150}px` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{stat.day}</span>
                          </div>
                        ))}
                      </div>

                      {/* Chart Legend */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-[#FFCC00] rounded"></div>
                          <span className="text-xs text-gray-600">Job View</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-[#AF52DE] rounded"></div>
                          <span className="text-xs text-gray-600">Job Applied</span>
                        </div>
                      </div>
                    </div>

                    {/* Job View & Applied Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Card className="bg-white border border-gray-200 rounded-lg">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-gray-900">Job Views</h3>
                            <div className="w-6 h-6 bg-[#FFB836] rounded-full flex items-center justify-center">
                              <Eye className="h-3 w-3 text-white" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-2xl font-bold text-gray-900">{dashboardStats?.stats.jobViews.total || 0}</p>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-600">This Week</span>
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-2 w-2 text-[#7B61FF]" />
                                <span className="text-xs text-[#7B61FF] font-medium">{dashboardStats?.stats.jobViews.percentageChange.toFixed(1) || 0}%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border border-gray-200 rounded-lg">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-gray-900">Job Applied</h3>
                            <div className="w-6 h-6 bg-[#7B61FF] rounded-full flex items-center justify-center">
                              <FileText className="h-3 w-3 text-white" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-2xl font-bold text-gray-900">{dashboardStats?.stats.jobApplied.total || 0}</p>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-600">This Week</span>
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-2 w-2 text-red-500" />
                                <span className="text-xs text-red-500 font-medium">{dashboardStats?.stats.jobApplied.percentageChange.toFixed(1) || 0}%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Job Open Card */}
              <Card className="bg-white border border-gray-200 rounded-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-gray-900">Job Open</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-gray-900 mb-1">{dashboardStats?.stats.jobsOpen || 0}</p>
                    <p className="text-sm text-gray-600">Jobs Opened</p>
                  </div>
                </CardContent>
              </Card>

              {/* Applicants Summary Card */}
              <Card className="bg-white border border-gray-200 rounded-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-gray-900">Applicants Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <p className="text-4xl font-bold text-gray-900 mb-1">{dashboardStats?.stats.totalApplicants || 0}</p>
                    <p className="text-sm text-gray-600">Applicants</p>
                  </div>

                  {/* Color Bars */}
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    <div className="w-8 h-3 bg-[#7B61FF] rounded"></div>
                    <div className="w-4 h-3 bg-[#56CDAD] rounded"></div>
                    <div className="w-2 h-3 bg-[#26A4FF] rounded"></div>
                    <div className="w-1 h-3 bg-[#FFB836] rounded"></div>
                    <div className="w-1 h-3 bg-[#FF6550] rounded"></div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-[#7B61FF] rounded"></div>
                        <span className="text-xs text-gray-600">Full Time : {dashboardStats?.applicantsByType.fullTime || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-[#56CDAD] rounded"></div>
                        <span className="text-xs text-gray-600">Part-Time : {dashboardStats?.applicantsByType.partTime || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-[#26A4FF] rounded"></div>
                        <span className="text-xs text-gray-600">Remote : {dashboardStats?.applicantsByType.remote || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-[#FFB836] rounded"></div>
                        <span className="text-xs text-gray-600">Internship : {dashboardStats?.applicantsByType.internship || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-[#FF6550] rounded"></div>
                        <span className="text-xs text-gray-600">Contract : {dashboardStats?.applicantsByType.contract || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Job Updates Section */}
          <div className="mt-6">
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">Job Updates</CardTitle>
                  <Button variant="ghost" className="text-[#4640DE] font-semibold flex items-center space-x-1 text-sm">
                    <span>View All</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Job Updates */}
                  {(dashboardStats?.recentJobs || []).map((job, index) => (
                    <Card key={index} className="bg-white border border-gray-200 rounded-lg">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{job.title[0]}</span>
                            </div>
                            <Badge className="bg-green-100 text-green-600 border-green-200 text-xs">{job.employmentType}</Badge>
                          </div>

                          {/* Job Info */}
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">{job.title}</h3>
                            <div className="flex items-center space-x-1 text-gray-600">
                              <span className="text-xs">{job.location}</span>
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="space-y-1">
                            <div className="flex space-x-0.5">
                              {[...Array(5)].map((_, i) => {
                                const segments = 5;
                                const filledSegments = Math.ceil((job.hiredCount / job.totalVacancies) * segments);
                                return (
                                  <div
                                    key={i}
                                    className={`h-1 flex-1 rounded ${i < filledSegments ? 'bg-green-500' : 'bg-gray-200'}`}
                                  ></div>
                                );
                              })}
                            </div>
                            <p className="text-xs text-gray-600">
                              <span className="font-medium text-gray-900">{job.hiredCount}</span> hired, <span className="font-medium text-gray-900">{job.appliedCount}</span> applied of {job.totalVacancies} capacity
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <FormDialog
        open={reverifyOpen}
        onOpenChange={(open) => {
          setReverifyOpen(open)
          if (!open) {
            setValidationErrors({})
            setReverifyStep(1)
          }
        }}
        title="Reverify Company"
        description="Update required details and resubmit for verification."
        submitLabel={reverifyStep === 1 ? 'Next' : 'Submit'}
        onSubmit={async () => {
          if (reverifyStep === 1) {
            setReverifyStep(2)
            return
          }
          try {
            setValidationErrors({})
            const resp = await companyApi.reapplyVerification({
              company_name: form.company_name,
              email: form.email,
              website: form.website || form.website_link || '',
              industry: form.industry,
              organisation: form.organisation,
              location: form.location,
              employees: form.employees,
              description: form.description,
              logo: form.logo || '',
              business_license: form.business_license || '',
              tax_id: form.tax_id,
            })
            if (resp.success) {

              dispatch(fetchCompanyProfileThunk()).catch(() => { })

              toast.success('Reverification submitted. Status set to pending.')
              setReverifyOpen(false)
              setValidationErrors({})
            } else {
              if (resp.errors && resp.errors.length > 0) {
                const errorMap: Record<string, string> = {}
                resp.errors.forEach(err => {
                  errorMap[err.field] = err.message
                })
                setValidationErrors(errorMap)
                toast.error(resp.message || 'Validation failed')
              } else {
                toast.error(resp.message || 'Failed to submit reverification')
              }
            }
          } catch {
            toast.error('Failed to submit reverification')
          }
        }}

        cancelLabel="Cancel"
        maxWidth="lg"
      >
        <div className="space-y-4">
          {reverifyStep === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name" className="text-sm mb-3 font-semibold">Company Name</Label>
                <Input id="company_name" value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm mb-3 font-semibold">Company Email</Label>
                <Input id="email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="website" className="text-sm mb-3 font-semibold">Website</Label>
                <Input id="website" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://example.com" />
              </div>
              <div>
                <Label htmlFor="industry" className="text-sm mb-3 font-semibold">Industry</Label>
                <Input id="industry" value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="organisation" className="text-sm mb-3 font-semibold">Organisation Type</Label>
                <Input id="organisation" value={form.organisation} onChange={e => setForm(p => ({ ...p, organisation: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="location" className="text-sm mb-3 font-semibold">Location</Label>
                <Input id="location" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="employees" className="text-sm mb-3 font-semibold">Employees</Label>
                <Select value={form.employees} onValueChange={(value) => setForm(p => ({ ...p, employees: value }))}>
                  <SelectTrigger className={`w-full ${validationErrors.employees ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select Employee Count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10</SelectItem>
                    <SelectItem value="11-50">11-50</SelectItem>
                    <SelectItem value="51-200">51-200</SelectItem>
                    <SelectItem value="201-500">201-500</SelectItem>
                    <SelectItem value="501-1000">501-1000</SelectItem>
                    <SelectItem value="1000+">1000+</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.employees && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.employees}</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="description" className="text-sm mb-3 font-semibold">Company Description</Label>
                <Textarea id="description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} className={validationErrors.description ? 'border-red-500' : ''} />
                {validationErrors.description && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.description}</p>
                )}
              </div>

              <div>
                <Label htmlFor="tax_id" className="text-sm mb-3 font-semibold">Tax ID</Label>
                <Input id="tax_id" value={form.tax_id} onChange={e => setForm(p => ({ ...p, tax_id: e.target.value }))} className={validationErrors.tax_id ? 'border-red-500' : ''} />
                {validationErrors.tax_id && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.tax_id}</p>
                )}
              </div>

              <div className="grid grid-cols-1   gap-4">
                <div>
                  <Label className="text-sm mb-3 font-semibold">Company Logo</Label>
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
                <div>
                  <Label className="text-sm mb-3 font-semibold">Business License</Label>
                  <div className="border-2 border-dashed rounded-md p-4 text-center">
                    {form.business_license ? (
                      <div className="space-y-3">
                        <FileText className="h-10 w-10 mx-auto text-green-600" />
                        <Button type="button" variant="outline" disabled={uploading.business_license} onClick={() => document.getElementById('modal-bl-upload')?.click()}>
                          {uploading.business_license ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</>) : (<><Upload className="h-4 w-4 mr-2" />Change Document</>)}
                        </Button>
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
                </div>
              </div>
            </>
          )}
        </div>
      </FormDialog>
    </CompanyLayout>
  )
}

export default CompanyDashboard