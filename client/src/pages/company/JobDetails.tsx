import CompanyLayout from '../../components/layouts/CompanyLayout'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { companyApi } from '@/api/company.api'
import { jobApplicationApi } from '@/api'
import { toast } from 'sonner'
import { 
  ArrowLeft,
  Plus,
  CircleCheck,
  Heart,
  Coffee,
  Car,
  Users,
  GraduationCap,
  Mountain,
  Globe,
  AlertTriangle,
  Search,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  ClipboardList,
  FilterIcon
} from 'lucide-react'
import { Input } from '@/components/ui/input'

const JobDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [jobData, setJobData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'applicants' | 'details' | 'analytics'>('details')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState<'all' | 'applied' | 'shortlisted' | 'interview' | 'offered' | 'hired' | 'rejected'>('all')
  const [viewRange, setViewRange] = useState<'7d' | '14d' | '30d'>('7d')
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) {
        toast.error('Job ID not found')
        navigate('/company/job-listing')
        return
      }

      try {
        setLoading(true)
        const response = await companyApi.getJobPosting(id)
        
        if (response.success && response.data) {
          setJobData(response.data)
        } else {
          toast.error('Failed to load job details')
          navigate('/company/job-listing')
        }
      } catch {
        toast.error('Failed to load job details')
        navigate('/company/job-listing')
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [id, navigate])

  useEffect(() => {
    const fetchApplications = async () => {
      if (!id || activeTab !== 'applicants') return

      try {
        setApplicationsLoading(true)
        const response = await jobApplicationApi.getCompanyApplications({
          job_id: id,
          limit: 100,
        })
        
        if (response.data?.data?.applications) {
          setApplications(response.data.data.applications)
        } else if (response.data?.applications) {
          setApplications(response.data.applications)
        } else if (Array.isArray(response.data?.data)) {
          setApplications(response.data.data)
        } else if (Array.isArray(response.data)) {
          setApplications(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error)
        setApplications([])
      } finally {
        setApplicationsLoading(false)
      }
    }

    fetchApplications()
  }, [id, activeTab])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [searchTerm])

  if (loading) {
    return (
      <CompanyLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loading />
        </div>
      </CompanyLayout>
    )
  }

  if (!jobData) {
    return (
      <CompanyLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Job not found</h2>
            <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/company/job-listing')}>
              Back to Job Listings
            </Button>
          </div>
        </div>
      </CompanyLayout>
    )
  }

  const responsibilities = jobData.responsibilities || []
  const whoYouAre = jobData.qualifications || []
  const niceToHaves = jobData.niceToHaves || jobData.nice_to_haves || []
  const requiredSkills = jobData.skillsRequired || jobData.skills_required || []
  const benefits = jobData.benefits || []

  const benefitsList = [
    {
      icon: Heart,
      title: 'Full Healthcare',
      description: 'We believe in thriving communities and that starts with our team being happy and healthy.'
    },
    {
      icon: Mountain,
      title: 'Unlimited Vacation',
      description: 'We believe you should have a flexible schedule that makes space for family, wellness, and fun.'
    },
    {
      icon: GraduationCap,
      title: 'Skill Development',
      description: 'We believe in always learning and leveling up our skills. Whether it\'s a conference or online course.'
    },
    {
      icon: Users,
      title: 'Team Summits',
      description: 'Every 6 months we have a full team summit where we have fun, reflect, and plan for the upcoming quarter.'
    },
    {
      icon: Coffee,
      title: 'Remote Working',
      description: 'You know how you perform your best. Work from home, coffee shop or anywhere when you feel like it.'
    },
    {
      icon: Car,
      title: 'Commuter Benefits',
      description: 'We\'re grateful for all the time and energy each team member puts into getting to work every day.'
    },
    {
      icon: Globe,
      title: 'We give back.',
      description: 'We anonymously match any donation our employees make (up to ₹50,000) so they can support the organizations they care about most—times two.'
    }
  ]

  type Applicant = {
    id: string
    name: string
    email?: string
    stage: string
    appliedDate: string
    score?: number
    avatar?: string
    experience?: string
    matchPercentage?: number
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()

  const normalizeStage = (stage: string) => {
    const value = stage.toLowerCase()
    if (value.includes('short')) return 'shortlisted'
    if (value.includes('inter')) return 'interview'
    if (value.includes('offer')) return 'offered'
    if (value.includes('hire')) return 'hired'
    if (value.includes('reject')) return 'rejected'
    return 'applied'
  }

  const applicants: Applicant[] = applications.length > 0
    ? applications.map((applicant: any, index: number) => ({
        id: applicant.id || applicant._id || `applicant-${index}`,
        name: applicant.seeker_name || applicant.name || applicant.full_name || 'Unknown Applicant',
        email: applicant.email,
        stage: applicant.stage || 'applied',
        appliedDate: applicant.applied_date || applicant.appliedAt || applicant.created_at || applicant.createdAt || new Date().toISOString(),
        score: applicant.score,
        avatar: applicant.seeker_avatar || applicant.avatar,
        experience: applicant.experience,
        matchPercentage: applicant.match_percentage,
      }))
    : []

  const stageCounts = applicants.reduce(
    (acc, applicant) => {
      const key = normalizeStage(applicant.stage) as keyof typeof acc
      acc[key] = (acc[key] || 0) + 1
      acc.total += 1
      return acc
    },
    {
      total: 0,
      applied: 0,
      shortlisted: 0,
      interview: 0,
      offered: 0,
      hired: 0,
      rejected: 0,
    }
  )

  type TrafficChannel = { label: string; value: number; color: string }
  type VisitorStat = { country: string; count: number; flag: string }

  const analyticsDefaults: {
    totalViews: number
    totalViewsChange: number
    totalApplied: number
    totalAppliedChange: number
    traffic: TrafficChannel[]
    visitors: VisitorStat[]
  } = {
    totalViews: 23564,
    totalViewsChange: 6.4,
    totalApplied: jobData.applicationCount || jobData.application_count || 132,
    totalAppliedChange: -0.4,
    traffic: [
      { label: 'Direct', value: 48, color: '#FFB836' },
      { label: 'Social', value: 23, color: '#4640DE' },
      { label: 'Organic', value: 24, color: '#C0C6F0' },
      { label: 'Other', value: 5, color: '#56CDAD' },
    ],
    visitors: [
      { country: 'USA', count: 3240, flag: '🇺🇸' },
      { country: 'France', count: 3188, flag: '🇫🇷' },
      { country: 'Italy', count: 2928, flag: '🇮🇹' },
      { country: 'Germany', count: 2624, flag: '🇩🇪' },
      { country: 'Japan', count: 2184, flag: '🇯🇵' },
      { country: 'United Kingdom', count: 1962, flag: '🇬🇧' },
    ],
  }

  const analyticsData = {
    ...analyticsDefaults,
    ...jobData.analytics,
    totalApplied: jobData.analytics?.totalApplied ?? analyticsDefaults.totalApplied,
    totalAppliedChange:
      jobData.analytics?.totalAppliedChange ?? analyticsDefaults.totalAppliedChange,
    totalViews: jobData.analytics?.totalViews ?? analyticsDefaults.totalViews,
    totalViewsChange:
      jobData.analytics?.totalViewsChange ?? analyticsDefaults.totalViewsChange,
    traffic: jobData.analytics?.traffic || analyticsDefaults.traffic,
    visitors: jobData.analytics?.visitors || analyticsDefaults.visitors,
  }

  const chartPointsByRange: Record<typeof viewRange, { label: string; views: number }[]> = {
    '7d': [
      { label: '19 Jul', views: 180 },
      { label: '20 Jul', views: 420 },
      { label: '21 Jul', views: 260 },
      { label: '22 Jul', views: 520 },
      { label: '23 Jul', views: 380 },
      { label: '24 Jul', views: 460 },
      { label: '25 Jul', views: 243 },
    ],
    '14d': [
      { label: '12 Jul', views: 120 },
      { label: '14 Jul', views: 340 },
      { label: '16 Jul', views: 220 },
      { label: '18 Jul', views: 480 },
      { label: '20 Jul', views: 420 },
      { label: '22 Jul', views: 540 },
      { label: '24 Jul', views: 243 },
    ],
    '30d': [
      { label: 'Jul 1', views: 80 },
      { label: 'Jul 7', views: 210 },
      { label: 'Jul 13', views: 330 },
      { label: 'Jul 18', views: 280 },
      { label: 'Jul 21', views: 520 },
      { label: 'Jul 24', views: 460 },
      { label: 'Jul 25', views: 243 },
    ],
  }

  const chartPoints = chartPointsByRange[viewRange]
  const maxViews = Math.max(...chartPoints.map((point) => point.views)) || 1
  const totalTraffic = analyticsData.traffic.reduce((sum: number, item: any) => sum + item.value, 0) || 1
  type TrafficSegment = TrafficChannel & { start: number; end: number }
  const trafficSegments: TrafficSegment[] = analyticsData.traffic.map(
    (segment: TrafficChannel, index: number) => {
    const start =
      analyticsData.traffic.slice(0, index).reduce((sum: number, item: any) => sum + item.value, 0) /
      totalTraffic
    const end = start + segment.value / totalTraffic
    return { ...segment, start, end }
    }
  )

  const chartWidth = 520
  const chartHeight = 220
  const chartPadding = 28
  const stepX = chartPoints.length > 1 ? (chartWidth - chartPadding * 2) / (chartPoints.length - 1) : 0
  const chartCoordinates = chartPoints.map((point, index) => {
    const x = chartPadding + index * stepX
    const y =
      chartHeight - chartPadding - (point.views / maxViews) * (chartHeight - chartPadding * 2)
    return { ...point, x, y }
  })
  const linePath = chartCoordinates
    .map((coordinate, index) => `${index === 0 ? 'M' : 'L'} ${coordinate.x} ${coordinate.y}`)
    .join(' ')
  const areaPath =
    `M ${chartPadding} ${chartHeight - chartPadding} ` +
    chartCoordinates.map((coordinate) => `L ${coordinate.x} ${coordinate.y}`).join(' ') +
    ` L ${chartPadding + stepX * (chartCoordinates.length - 1)} ${chartHeight - chartPadding} Z`
  const lastCoordinate = chartCoordinates[chartCoordinates.length - 1]

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesStage =
      stageFilter === 'all' || normalizeStage(applicant.stage) === stageFilter
    const term = debouncedSearchTerm.toLowerCase()
    const matchesSearch =
      applicant.name.toLowerCase().includes(term) ||
      (applicant.email ? applicant.email.toLowerCase().includes(term) : false)
    return matchesStage && (term ? matchesSearch : true)
  })

  type StageKey = ReturnType<typeof normalizeStage>
  const stageStyleMap = {
    applied: {
      bg: 'bg-[#F8F8FD]',
      text: 'text-[#4640DE]',
      dot: 'bg-[#4640DE]',
    },
    shortlisted: {
      bg: 'bg-[#E9EBFD]',
      text: 'text-[#25324B]',
      dot: 'bg-[#4640DE]',
    },
    interview: {
      bg: 'bg-[#FFF4E6]',
      text: 'text-[#EB8533]',
      dot: 'bg-[#EB8533]',
    },
    offered: {
      bg: 'bg-[#F3FFEB]',
      text: 'text-[#56CDAD]',
      dot: 'bg-[#56CDAD]',
    },
    hired: {
      bg: 'bg-[#E8FFF9]',
      text: 'text-[#1F8A70]',
      dot: 'bg-[#1F8A70]',
    },
    rejected: {
      bg: 'bg-[#FFECEC]',
      text: 'text-[#E5484D]',
      dot: 'bg-[#E5484D]',
    },
  } satisfies Record<StageKey, { bg: string; text: string; dot: string }>

  const renderStageBadge = (stage: string) => {
    const normalized = normalizeStage(stage)
    const styles = stageStyleMap[normalized] || stageStyleMap.applied
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles.bg} ${styles.text}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
        {stage}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatSalary = () => {
    if (jobData.salary?.min && jobData.salary?.max) {
      return `₹${jobData.salary.min.toLocaleString()}-₹${jobData.salary.max.toLocaleString()}`
    }
    return 'Salary not specified'
  }

  const getEmploymentType = () => {
    return jobData.employmentTypes?.[0] || jobData.employment_types?.[0] || 'Not specified'
  }

  return (
    <CompanyLayout>
      <div className="min-h-screen bg-white">
        {}
        <div className="border-b border-[#D6DDEB]">
          <div className="px-2 py-2 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1.5"
                  onClick={() => navigate('/company/job-listing')}
                >
                  <ArrowLeft className="w-4 h-4 text-[#25324B]" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-[#25324B] mb-1.5">{jobData.title}</h1>
                  <div className="flex items-center gap-1.5 text-base text-[#25324B]">
                    <span>{jobData.location || 'Location not specified'}</span>
                    <div className="w-0.5 h-0.5 bg-[#25324B] rounded-full"></div>
                    <span>{getEmploymentType()}</span>
                    <div className="w-0.5 h-0.5 bg-[#25324B] rounded-full"></div>
                    <span>{jobData.applicationCount || jobData.application_count || 0} applied</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="border-b border-[#D6DDEB]">
          <div className="px-7">
            <div className="flex gap-9">
              <button
                className={`py-3.5 text-sm border-b-2 transition-colors ${
                  activeTab === 'applicants'
                    ? 'font-semibold text-[#25324B] border-[#4640DE]'
                    : 'font-medium text-[#7C8493] border-transparent'
                }`}
                onClick={() => setActiveTab('applicants')}
              >
                Applicants
              </button>
              <button
                className={`py-3.5 text-sm border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'font-semibold text-[#25324B] border-[#4640DE]'
                    : 'font-medium text-[#7C8493] border-transparent'
                }`}
                onClick={() => setActiveTab('details')}
              >
                Job Details
              </button>
              <button
                className={`py-3.5 text-sm border-b-2 transition-colors ${
                  activeTab === 'analytics'
                    ? 'font-semibold text-[#25324B] border-[#4640DE]'
                    : 'font-medium text-[#7C8493] border-transparent'
                }`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
            </div>
          </div>
        </div>

        {}
        {jobData.status === 'blocked' && (
          <div className="px-7 py-4 bg-red-50 border-b border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-red-800 mb-1">
                  This job has been blocked by admin
                </h3>
                {(jobData.unpublishReason || jobData.unpublish_reason) && (
                  <p className="text-sm text-red-700">
                    Reason: {jobData.unpublishReason || jobData.unpublish_reason}
                  </p>
                )}
                <p className="text-xs text-red-600 mt-1">
                  The job is not visible to job seekers. Please review and update the job details or contact admin for more information.
                </p>
              </div>
            </div>
          </div>
        )}
        {jobData.status === 'expired' && (
          <div className="px-7 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  This job has expired
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  This job posting has expired and is no longer visible to job seekers.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="px-7 py-7">
          {activeTab === 'applicants' && (
            <div className="space-y-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full max-w-md">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C8493]" />
                      <Input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search Applicants"
                        className="pl-9 pr-4 h-11 rounded-lg border-[#D6DDEB]"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <FilterIcon className="w-4 h-4 text-[#7C8493]" />
                      <Select
                        value={stageFilter}
                        onValueChange={(value: typeof stageFilter) => setStageFilter(value)}
                      >
                        <SelectTrigger className="h-11 min-w-[190px] rounded-lg border-[#D6DDEB] bg-white">
                          <SelectValue placeholder="All stages" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Stages</SelectItem>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {applicationsLoading ? (
                    <div className="py-10 text-center">
                      <Loading />
                    </div>
                  ) : filteredApplicants.length === 0 ? (
                    <div className="py-10 text-center text-sm text-[#7C8493]">
                      {applications.length === 0 
                        ? 'No applicants have applied for this job yet.'
                        : 'No applicants match your current filters.'}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-[#F8F8FD]">
                          <tr className="text-left text-xs font-medium uppercase tracking-wide text-[#7C8493]">
                            <th className="py-4 pr-4 text-[#7C8493]"> Full Name</th>
                            <th className="py-4 pr-4 text-[#7C8493]">Score</th>
                            <th className="py-4 pr-4 text-[#7C8493]">Hiring Stage</th>
                            <th className="py-4 pr-4 text-[#7C8493]">Applied Date</th>
                            <th className="py-4 pr-6 text-[#7C8493] text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6EAF5]">
                          {filteredApplicants.map((applicant) => (
                            <tr key={applicant.id} className="hover:bg-[#F8F8FD]/60">
                              <td className="py-4 pr-4 align-middle">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    {applicant.avatar ? (
                                      <AvatarImage src={applicant.avatar} alt={applicant.name} />
                                    ) : (
                                      <AvatarFallback className="bg-[#4640DE]/10 text-[#4640DE] font-semibold">
                                        {getInitials(applicant.name)}
                                      </AvatarFallback>
                                    )}
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium text-[#25324B]">{applicant.name}</p>
                                    {applicant.email && (
                                      <p className="text-xs text-[#7C8493]">{applicant.email}</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 pr-4 align-middle">
                                <div className="flex items-center gap-1 text-sm font-semibold text-[#25324B]">
                                  <Star className="h-4 w-4 text-[#FFB836] fill-[#FFB836]" />
                                  {applicant.score ? applicant.score.toFixed(1) : '—'}
                                </div>
                              </td>
                              <td className="py-4 pr-4 align-middle">
                                {renderStageBadge(applicant.stage)}
                              </td>
                              <td className="py-4 pr-4 align-middle text-sm font-medium text-[#25324B]">
                                {formatDate(applicant.appliedDate)}
                              </td>
                              <td className="py-4 pr-6 align-middle">
                                <div className="flex items-center justify-end gap-3">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 rounded-lg border-[#CCCCF5] bg-[#E9EBFD] text-[#4640DE]"
                                    onClick={() => navigate(`/company/applicants/${applicant.id}`)}
                                  >
                                    See Application
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
 
            </div>
          )}

          {activeTab === 'details' && (
            <>
                  <div className="flex items-center justify-between mb-7">
                    <div className="flex items-center gap-5">
                      <h2 className="text-2xl font-bold text-[#25324B]">{jobData.title}</h2>
                    </div>
                    <Button variant="outline" className="border-[#CCCCF5] text-[#4640DE] text-sm px-3 py-1.5" onClick={() => navigate(`/company/edit-job/${id}`)}>
                      <Plus className="w-4 h-4 mr-1.5" />
                      Edit Job Details
                    </Button>
                  </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                <div className="lg:col-span-2 space-y-9">
                  <div>
                    <h3 className="text-xl font-semibold text-[#25324B] mb-3.5">Description</h3>
                    <p className="text-sm text-[#515B6F] leading-relaxed">{jobData.description || 'No description provided'}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#25324B] mb-3.5">Responsibilities</h3>
                    <div className="space-y-3.5">
                      {responsibilities.map((item: string, index: number) => (
                        <div key={index} className="flex items-start gap-2.5">
                          <CircleCheck className="w-5 h-5 text-[#56CDAD] mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-[#515B6F]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#25324B] mb-3.5">Who You Are</h3>
                    <div className="space-y-3.5">
                      {whoYouAre.map((item: string, index: number) => (
                        <div key={index} className="flex items-start gap-2.5">
                          <CircleCheck className="w-5 h-5 text-[#56CDAD] mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-[#515B6F]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#25324B] mb-3.5">Nice-To-Haves</h3>
                    <div className="space-y-3.5">
                      {niceToHaves.map((item: string, index: number) => (
                        <div key={index} className="flex items-start gap-2.5">
                          <CircleCheck className="w-5 h-5 text-[#56CDAD] mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-[#515B6F]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-7">
                  <Card className="border border-[#D6DDEB] rounded-lg">
                    <CardContent className="p-3.5 space-y-5">
                      <h3 className="text-xl font-semibold text-[#25324B]">About this role</h3>
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-semibold text-[#25324B]">{jobData.applicationCount || jobData.application_count || 0} applied</span>
                          <span className="text-xs text-[#7C8493]">{stageCounts.shortlisted} shortlisted</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#F8F8FD] rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-[#56CDAD] rounded-l-lg"
                            style={{
                              width: `${Math.min(100, (stageCounts.shortlisted / Math.max(1, stageCounts.total)) * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="space-y-3.5">
                        <div className="flex justify-between">
                          <span className="text-sm text-[#515B6F]">Job Posted On</span>
                          <span className="text-sm font-semibold text-[#25324B]">{formatDate(jobData.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-[#515B6F]">Last Updated</span>
                          <span className="text-sm font-semibold text-[#25324B]">{formatDate(jobData.updatedAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-[#515B6F]">Job Type</span>
                          <span className="text-sm font-semibold text-[#25324B]">{getEmploymentType()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-[#515B6F]">Salary</span>
                          <span className="text-sm font-semibold text-[#202430]">{formatSalary()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-[#515B6F]">Location</span>
                          <span className="text-sm font-semibold text-[#25324B]">{jobData.location || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-[#515B6F]">Status</span>
                          <div className="flex flex-col items-end gap-1">
                            {(() => {
                              const status = jobData.status ?? 'unlisted';
                              const statusConfig = {
                                active: { label: 'Active', color: 'text-[#56CDAD]' },
                                unlisted: { label: 'Unlisted', color: 'text-[#FFB836]' },
                                expired: { label: 'Expired', color: 'text-[#7C8493]' },
                                blocked: { label: 'Blocked', color: 'text-red-600' }
                              };
                              const config = statusConfig[status as keyof typeof statusConfig] || { label: 'Unknown', color: 'text-[#7C8493]' };
                              return (
                                <span className={`text-sm font-semibold ${config.color}`}>
                                  {config.label}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                        {jobData.status === 'blocked' && (jobData.unpublishReason || jobData.unpublish_reason) && (
                          <div className="flex justify-between pt-2 border-t border-[#D6DDEB]">
                            <span className="text-sm text-[#515B6F]">Block Reason</span>
                            <span className="text-sm font-semibold text-red-600 max-w-[60%] text-right">
                              {jobData.unpublishReason || jobData.unpublish_reason}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#D6DDEB] rounded-lg">
                    <CardContent className="p-3.5">
                      <h3 className="text-xl font-semibold text-[#25324B] mb-5">Categories</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {(jobData.categoryIds || jobData.category_ids) && (jobData.categoryIds || jobData.category_ids).length > 0 ? (
                          (jobData.categoryIds || jobData.category_ids).map((category: string, index: number) => (
                            <Badge key={index} className="bg-[#EB8533]/10 text-[#FFB836] border-0 px-2.5 py-1 rounded-full text-xs">
                              {category}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-[#515B6F]">No categories specified</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#D6DDEB] rounded-lg">
                    <CardContent className="p-3.5">
                      <h3 className="text-xl font-semibold text-[#25324B] mb-5">Required Skills</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {requiredSkills.length > 0 ? (
                          requiredSkills.map((skill: string, index: number) => (
                            <Badge 
                              key={index}
                              variant="outline" 
                              className="bg-[#F8F8FD] text-[#4640DE] border-0 px-2.5 py-1 rounded-lg text-xs"
                            >
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-[#515B6F]">No skills specified</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="w-full h-px bg-[#D6DDEB] my-7"></div>

              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-semibold text-[#25324B] mb-1.5">Perks & Benefits</h3>
                  <p className="text-sm text-[#515B6F]">This job comes with several perks and benefits</p>
                </div>

                {benefits.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
                    {benefits.map((benefit: string, index: number) => (
                      <Card key={index} className="border border-[#D6DDEB] rounded-lg">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-5">
                            <div className="w-10 h-10 bg-[#4640DE]/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Heart className="w-5 h-5 text-[#4640DE]" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-[#25324B] mb-2.5">Benefit</h4>
                              <p className="text-sm text-[#515B6F] leading-relaxed">{benefit}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
                    {benefitsList.slice(0, 3).map((benefit, index) => (
                      <Card key={index} className="border border-[#D6DDEB] rounded-lg">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-5">
                            <div className="w-10 h-10 bg-[#4640DE]/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <benefit.icon className="w-5 h-5 text-[#4640DE]" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-[#25324B] mb-2.5">{benefit.title}</h4>
                              <p className="text-sm text-[#515B6F] leading-relaxed">{benefit.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Card className="border border-[#D6DDEB]">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-sm text-[#7C8493]">Total Views</p>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-3xl font-semibold text-[#25324B]">
                          {analyticsData.totalViews.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-sm font-medium text-[#1F8A70]">
                          <ArrowUpRight className="h-4 w-4" />
                          {analyticsData.totalViewsChange}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#7C8493]">vs last day</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E9EBFD] text-[#4640DE]">
                      <Eye className="h-5 w-5" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-[#D6DDEB]">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-sm text-[#7C8493]">Total Applied</p>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-3xl font-semibold text-[#25324B]">
                          {analyticsData.totalApplied.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-sm font-medium text-[#E5484D]">
                          <ArrowDownRight className="h-4 w-4" />
                          {Math.abs(analyticsData.totalAppliedChange)}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#7C8493]">vs last day</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2FB] text-[#EB53A2]">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <Card className="border border-[#D6DDEB] xl:col-span-2">
                  <CardContent className="p-6">
                    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[#25324B]">Job Listing View stats</h3>
                      </div>
                      <Select value={viewRange} onValueChange={(value: typeof viewRange) => setViewRange(value)}>
                        <SelectTrigger className="w-36 rounded-lg border-[#D6DDEB] bg-white">
                          <SelectValue placeholder="Last 7 days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7d">Last 7 days</SelectItem>
                          <SelectItem value="14d">Last 14 days</SelectItem>
                          <SelectItem value="30d">Last 30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="relative">
                      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#C0C6F0" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#C0C6F0" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d={areaPath} fill="url(#chartGradient)" />
                        <path d={linePath} fill="none" stroke="#4640DE" strokeWidth="3" strokeLinecap="round" />
                        {chartCoordinates.map((coordinate, index) => (
                          <circle
                            key={coordinate.label}
                            cx={coordinate.x}
                            cy={coordinate.y}
                            r={index === chartCoordinates.length - 1 ? 6 : 4}
                            fill="#FFFFFF"
                            stroke="#4640DE"
                            strokeWidth="2"
                          />
                        ))}
                      </svg>
                      {lastCoordinate && (
                        <div
                          className="absolute rounded-lg bg-[#202430] px-3 py-2 text-xs text-white shadow-md"
                          style={{
                            left: Math.min(chartWidth - 120, Math.max(0, lastCoordinate.x - 40)),
                            top: Math.max(0, lastCoordinate.y - 50),
                          }}
                        >
                          <div className="font-semibold">Views</div>
                          <div>{lastCoordinate.views}</div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex justify-between text-xs text-[#7C8493]">
                      {chartCoordinates.map((coordinate) => (
                        <span key={coordinate.label} className="min-w-[40px] text-center">
                          {coordinate.label}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-5">
                  <Card className="border border-[#D6DDEB]">
                    <CardContent className="p-6 space-y-5">
                      <h3 className="text-lg font-semibold text-[#25324B]">Traffic channel</h3>
                      <div className="flex items-center gap-6">
                        <div
                          className="relative h-36 w-36 rounded-full"
                          style={{
                            background: `conic-gradient(${trafficSegments
                              .map(
                                (segment) =>
                                  `${segment.color} ${segment.start * 360}deg ${(segment.end * 360)}deg`
                              )
                              .join(', ')})`,
                          }}
                        >
                          <div className="absolute inset-6 rounded-full bg-white" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <p className="text-xs text-[#7C8493]">Views</p>
                              <p className="text-xl font-semibold text-[#25324B]">243</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {trafficSegments.map((segment) => (
                            <div key={segment.label} className="flex items-center gap-3">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: segment.color }}
                              />
                              <span className="text-sm text-[#25324B] w-20">{segment.label}</span>
                              <span className="text-sm font-semibold text-[#25324B]">
                                {segment.value}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#D6DDEB]">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-[#25324B]">Visitors by country</h3>
                      <div className="space-y-3">
                        {analyticsData.visitors.map((visitor: VisitorStat) => (
                          <div key={visitor.country} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{visitor.flag}</span>
                              <span className="text-[#25324B]">{visitor.country}</span>
                            </div>
                            <span className="font-semibold text-[#25324B]">
                              {visitor.count.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CompanyLayout>
  )
}

export default JobDetails