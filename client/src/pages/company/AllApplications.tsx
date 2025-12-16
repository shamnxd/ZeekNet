import CompanyLayout from '../../components/layouts/CompanyLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loading } from '@/components/ui/loading'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { 
  Search,
  Filter,
  Star,
  Calendar,
  User,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageCircle
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { jobApplicationApi } from '@/api'
import { chatApi } from '@/api/chat.api'

interface Application {
  _id: string
  seeker_id: string
  seeker_name: string
  seeker_avatar?: string
  job_id: string
  job_title: string
  score?: number
  stage: 'applied' | 'shortlisted' | 'interview' | 'rejected' | 'hired'
  applied_date: string
  resume_url?: string
}

const AllApplications = () => {
  const navigate = useNavigate()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [stage, setStage] = useState<string>('all')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const fetchApplications = async (page: number = 1, limit: number = 10, search: string = '', stageFilter?: string) => {
    try {
      setLoading(true)

      const res = await jobApplicationApi.getCompanyApplications({ page, limit, search, stage: stageFilter && stageFilter !== 'all' ? stageFilter as 'applied' | 'shortlisted' | 'interview' | 'rejected' | 'hired' : undefined })
      const data = res?.data?.data || res?.data
      const list = (data?.applications || []).map((a: any) => ({
        _id: a.id,
        seeker_id: a.seeker_id,
        seeker_name: a.seeker_name || a.seeker_full_name || 'Candidate',
        seeker_avatar: a.seeker_avatar, 
        job_id: a.job_id,
        job_title: a.job_title,
        score: a.score,
        stage: a.stage,
        applied_date: a.applied_date,
        resume_url: undefined,
      })) as Application[]

      setApplications(list)
      setPagination({
        page: data?.pagination?.page || page,
        limit: data?.pagination?.limit || limit,
        total: data?.pagination?.total || list.length,
        totalPages: data?.pagination?.totalPages || Math.ceil((data?.pagination?.total || list.length) / (data?.pagination?.limit || limit)),
      })
    } catch (error) {
      toast.error('Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 400)

    return () => {
      clearTimeout(timer)
    }
  }, [searchQuery])

  useEffect(() => {
    fetchApplications(pagination.page, pagination.limit, debouncedSearchQuery, stage)
  }, [pagination.page, stage, debouncedSearchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPagination((p) => ({ ...p, page: 1 }))
  }

  const handleLimitChange = (value: string) => {
    const nextLimit = Number(value) || 10
    setPagination((p) => ({ ...p, page: 1, limit: nextLimit }))
    fetchApplications(1, nextLimit, debouncedSearchQuery, stage)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const getStageBadge = (stage: string) => {
    const stageMap: Record<string, { label: string; className: string }> = {
      applied: { label: 'Applied', className: 'border-[#4640DE] text-[#4640DE]' },
      shortlisted: { label: 'Shortlisted', className: 'border-[#4640DE] text-[#4640DE]' },
      interview: { label: 'Interview', className: 'border-[#FFB836] text-[#FFB836]' },
      rejected: { label: 'Rejected', className: 'border-red-500 text-red-500' },
      hired: { label: 'Hired', className: 'border-[#56CDAD] text-[#56CDAD]' },
    }
    
    const stageInfo = stageMap[stage] || stageMap.applied
    return (
      <Badge
        variant="outline"
        className={`${stageInfo.className} bg-transparent px-2.5 py-1 rounded-full text-xs font-semibold`}
      >
        {stageInfo.label}
      </Badge>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchApplications(newPage, pagination.limit, debouncedSearchQuery, stage)
    }
  }

  const handleSeeApplication = (applicationId: string) => {
    navigate(`/company/applicants/${applicationId}`)
  }

  const handleChatWithApplicant = async (seekerId: string) => {
    try {
      const conversation = await chatApi.createConversation({ participantId: seekerId })
      navigate(`/company/messages?chat=${conversation.id}`)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Unable to start chat')
    }
  }

  return (
    <CompanyLayout>
      <div className="min-h-screen bg-white">
        <div className="px-7 py-7 border-b border-[#D6DDEB]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#25324B]">
              Total Applicants : {pagination.total}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7C8493]" />
              <Input
                type="text"
                placeholder="Search Applicants"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 border-[#D6DDEB] rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={stage} onValueChange={(v) => setStage(v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All stages</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="px-7 py-5">
          <div className="border border-[#D6DDEB] rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-white border-b border-[#D6DDEB] px-5 py-4">
              <div className="grid grid-cols-6 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#7C8493]" />
                  <span className="text-sm font-medium text-[#7C8493]">Full Name</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#7C8493]" />
                  <span className="text-sm font-medium text-[#7C8493]">Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#7C8493]" />
                  <span className="text-sm font-medium text-[#7C8493]">Hiring Stage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#7C8493]" />
                  <span className="text-sm font-medium text-[#7C8493]">Applied Date</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#7C8493]" />
                  <span className="text-sm font-medium text-[#7C8493]">Job Role</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm font-medium text-[#7C8493]">Action</span>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#D6DDEB]">
              {loading ? (
                <div className="px-5 py-10 flex justify-center">
                  <Loading />
                </div>
              ) : applications.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-[#7C8493]">No applications found</p>
                </div>
              ) : (
                applications.map((application, index) => (
                  <div
                    key={application._id}
                    className={`px-5 py-4 grid grid-cols-6 gap-4 items-center ${
                      index % 2 === 0 ? 'bg-white' : 'bg-[#F8F8FD]'
                    }`}
                  >
                    {/* Full Name */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        {application.seeker_avatar ? (
                          <AvatarImage src={application.seeker_avatar} alt={application.seeker_name} />
                        ) : null}
                        <AvatarFallback className="bg-[#4640DE]/10 text-[#4640DE] text-sm font-semibold">
                          {getInitials(application.seeker_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-[#25324B]">
                        {application.seeker_name}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-[#FFB836] fill-[#FFB836]" />
                      <span className="text-sm font-medium text-[#25324B]">
                        {application.score?.toFixed(1) || '0.0'}
                      </span>
                    </div>

                    {/* Hiring Stage */}
                    <div>
                      {getStageBadge(application.stage)}
                    </div>

                    {/* Applied Date */}
                    <span className="text-sm font-medium text-[#25324B]">
                      {formatDate(application.applied_date)}
                    </span>

                    {/* Job Role */}
                    <span className="text-sm font-medium text-[#25324B]">
                      {application.job_title}
                    </span>

                    {/* Action */}
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#4640DE] text-[#4640DE] bg-white hover:bg-[#4640DE] hover:text-white rounded-lg text-xs px-3 py-1.5"
                        onClick={() => handleChatWithApplicant(application.seeker_id)}
                        title="Chat with applicant"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#4640DE] text-[#4640DE] bg-[#CCCCF5] hover:bg-[#4640DE] hover:text-white rounded-lg text-xs px-3 py-1.5"
                        onClick={() => handleSeeApplication(application._id)}
                      >
                        <Eye className="w-4 h-4 mr-1.5" />
                        See Application
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          {!loading && applications.length > 0 && (
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#7C8493]">View</span>
                <Select value={String(pagination.limit)} onValueChange={handleLimitChange}>
                  <SelectTrigger className="w-[90px] h-8">
                    <SelectValue placeholder={String(pagination.limit)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs font-medium text-[#7C8493]">Applicants per page</span>
              </div>

              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="p-1"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="w-4 h-4 text-[#25324B]" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    const isActive = pageNum === pagination.page
                    
                    return (
                      <Button 
                        key={pageNum}
                        variant="outline" 
                        size="sm" 
                        className={`px-2 py-1 ${
                          isActive 
                            ? 'bg-[#4640DE] text-white border-[#4640DE]' 
                            : 'text-[#515B6F] border-[#D6DDEB]'
                        }`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="p-1"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  <ChevronRight className="w-4 h-4 text-[#25324B]" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </CompanyLayout>
  )
}

export default AllApplications

