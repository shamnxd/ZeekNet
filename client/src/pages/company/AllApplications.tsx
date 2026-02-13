import CompanyLayout from '../../components/layouts/CompanyLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loading } from '@/components/ui/loading'
import { ScoreBadge } from '@/components/ui/score-badge'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Search,
  Filter,
  Calendar,
  User,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageCircle,
  ArrowUpDown
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { jobApplicationApi } from '@/api'
import { chatApi } from '@/api/chat.api'
import { ATSStage, ATSStageDisplayNames, STAGE_TAILWIND } from '@/constants/ats-stages'
import type { Application } from '@/interfaces/application/application.interface'
import type { ApiError } from '@/types/api-error.type'
import { companyApi } from '@/api/company.api'
import type { JobPostingResponse } from '@/interfaces/job/job-posting-response.interface'

const AllApplications = () => {
  const navigate = useNavigate()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [stage, setStage] = useState<string>('all')
  const [minScore, setMinScore] = useState<string>('')
  const [maxScore, setMaxScore] = useState<string>('')
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [showShortlistConfirm, setShowShortlistConfirm] = useState(false)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [jobs, setJobs] = useState<JobPostingResponse[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string>('all')

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await companyApi.getJobPostings({ limit: 100 })
        setJobs(res.data?.jobs || [])
      } catch (error) {
        console.error('Failed to fetch jobs', error)
      }
    }
    fetchJobs()
  }, [])

  const fetchApplications = useCallback(async (page: number = 1, limit: number = 10, search: string = '', stageFilter?: string, jobIdFilter?: string) => {
    try {
      setLoading(true)

      const params: Record<string, unknown> = { page, limit, search }

      if (stageFilter && stageFilter !== 'all') {
        params.stage = stageFilter
      }

      if (jobIdFilter && jobIdFilter !== 'all') {
        params.job_id = jobIdFilter
      }

      if (minScore) params.min_score = parseInt(minScore)
      if (maxScore) params.max_score = parseInt(maxScore)
      if (sortBy) params.sort_by = sortBy === 'score' ? 'score' : 'applied_date'
      if (sortOrder) params.sort_order = sortOrder

      const res = await jobApplicationApi.getCompanyApplications(params)
      const data = res?.data?.data || res?.data
      const list = (data?.applications || []).map((a: { id: string; seeker_id: string; seeker_name?: string; seeker_full_name?: string; seeker_avatar?: string; job_id: string; job_title: string; score: number; stage: string; applied_date: string; is_blocked?: boolean }) => ({
        _id: a.id,
        seeker_id: a.seeker_id,
        seeker_name: a.seeker_name || a.seeker_full_name || 'Candidate',
        seeker_avatar: a.seeker_avatar,
        job_id: a.job_id,
        job_title: a.job_title,
        score: a.score,
        stage: a.stage,
        applied_date: a.applied_date,
        is_blocked: a.is_blocked,
        resume_url: undefined,
      })) as Application[]

      setApplications(list)
      setPagination({
        page: data?.pagination?.page || page,
        limit: data?.pagination?.limit || limit,
        total: data?.pagination?.total || list.length,
        totalPages: data?.pagination?.totalPages || Math.ceil((data?.pagination?.total || list.length) / (data?.pagination?.limit || limit)),
      })
    } catch {
      toast.error('Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }, [minScore, maxScore, sortBy, sortOrder])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 400)

    return () => {
      clearTimeout(timer)
    }
  }, [searchQuery])

  useEffect(() => {
    fetchApplications(pagination.page, pagination.limit, debouncedSearchQuery, stage, selectedJobId)
  }, [pagination.page, pagination.limit, stage, debouncedSearchQuery, selectedJobId, fetchApplications])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPagination((p) => ({ ...p, page: 1 }))
  }

  const handleLimitChange = (value: string) => {
    const nextLimit = Number(value) || 10
    setPagination((p) => ({ ...p, page: 1, limit: nextLimit }))
    fetchApplications(1, nextLimit, debouncedSearchQuery, stage, selectedJobId)
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
    const upperStage = stage.toUpperCase() as ATSStage
    const label = ATSStageDisplayNames[upperStage] || stage
    const style = STAGE_TAILWIND[upperStage] || { text: 'text-gray-500', border: 'border-gray-300', bgLight: 'bg-gray-50' }

    return (
      <Badge
        variant="outline"
        className={`bg-transparent px-2.5 py-1 rounded-full text-xs font-semibold ${style.text} outline outline-1 ${style.border}`}
      >
        {label}
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
      fetchApplications(newPage, pagination.limit, debouncedSearchQuery, stage, selectedJobId)
    }
  }

  const handleSeeApplication = (applicationId: string) => {
    navigate(`/company/applicants/${applicationId}`)
  }

  const handleChatWithApplicant = async (seekerId: string) => {
    try {
      const conversation = await chatApi.createConversation({ participantId: seekerId })
      navigate(`/company/messages?chat=${conversation.id}`)
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Unable to start chat')
    }
  }


  const handleSelectAll = () => {
    if (selectedApplications.size === applications.length) {
      setSelectedApplications(new Set())
    } else {
      setSelectedApplications(new Set(applications.map(app => app._id).filter((id): id is string => id !== undefined)))
    }
  }

  const handleSelectApplication = (applicationId: string) => {
    setSelectedApplications(prev => {
      const newSet = new Set(prev)
      if (newSet.has(applicationId)) {
        newSet.delete(applicationId)
      } else {
        newSet.add(applicationId)
      }
      return newSet
    })
  }


  const toggleSort = () => {
    if (sortBy === 'date') {
      setSortBy('score')
      setSortOrder('desc')
    } else if (sortBy === 'score' && sortOrder === 'desc') {
      setSortOrder('asc')
    } else {
      setSortBy('date')
      setSortOrder('desc')
    }
  }


  const executeBulkShortlist = async () => {
    const selectedApps = applications.filter(app => app._id && selectedApplications.has(app._id))


    const unchangeableApps = selectedApps.filter(app => app.stage === ATSStage.HIRED || app.stage === ATSStage.REJECTED)
    if (unchangeableApps.length > 0) {
      toast.error(`Cannot change ${unchangeableApps.length} application(s) in hired or rejected stage`)
      setShowShortlistConfirm(false)
      return
    }

    const invalidApps = selectedApps.filter(app => app.stage !== ATSStage.IN_REVIEW)
    if (invalidApps.length > 0) {
      toast.error(`Cannot shortlist ${invalidApps.length} application(s). Only 'In Review' applications can be shortlisted.`)
      setShowShortlistConfirm(false)
      return
    }

    if (selectedApps.length === 0) {
      toast.error('Please select at least one application')
      setShowShortlistConfirm(false)
      return
    }

    try {
      setBulkActionLoading(true)
      await jobApplicationApi.bulkUpdateApplicationStage({
        application_ids: Array.from(selectedApplications),
        stage: ATSStage.SHORTLISTED
      })
      toast.success(`${selectedApps.length} application(s) moved to shortlisted`)


      setApplications(prev => prev.map(app => {
        const appId = app._id
        return appId && selectedApplications.has(appId)
          ? { ...app, stage: ATSStage.SHORTLISTED }
          : app
      }))
      setSelectedApplications(new Set())
      setShowShortlistConfirm(false)
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to update applications')
    } finally {
      setBulkActionLoading(false)
    }
  }

  const executeBulkReject = async () => {
    const selectedApps = applications.filter(app => app._id && selectedApplications.has(app._id))


    const unchangeableApps = selectedApps.filter(app => app.stage === ATSStage.HIRED || app.stage === ATSStage.REJECTED)
    if (unchangeableApps.length > 0) {
      toast.error(`Cannot change ${unchangeableApps.length} application(s) in hired or rejected stage`)
      setShowRejectConfirm(false)
      return
    }

    if (selectedApps.length === 0) {
      toast.error('Please select at least one application')
      setShowRejectConfirm(false)
      return
    }

    try {
      setBulkActionLoading(true)
      await jobApplicationApi.bulkUpdateApplicationStage({
        application_ids: Array.from(selectedApplications),
        stage: ATSStage.REJECTED
      })
      toast.success(`${selectedApps.length} application(s) rejected`)


      setApplications(prev => prev.map(app => {
        const appId = app._id
        return appId && selectedApplications.has(appId)
          ? { ...app, stage: ATSStage.REJECTED }
          : app
      }))
      setSelectedApplications(new Set())
      setShowRejectConfirm(false)
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to update applications')
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleBulkShortlist = () => {
    setShowShortlistConfirm(true)
  }

  const handleBulkReject = () => {
    setShowRejectConfirm(true)
  }

  const getEnabledStages = () => {
    if (selectedJobId && selectedJobId !== 'all') {
      const job = jobs.find(j => j.id === selectedJobId)
      return job?.enabled_stages || Object.values(ATSStage)
    }

    // Union of all enabled stages
    const allStages = new Set<string>()
    jobs.forEach(job => {
      job.enabled_stages?.forEach((s: string) => allStages.add(s))
    })

    if (allStages.size === 0) return Object.values(ATSStage)

    // Return in correct order
    return Object.values(ATSStage).filter(s => allStages.has(s))
  }

  return (
    <CompanyLayout>
      <div className="min-h-screen bg-white">
        <div className="px-7 py-7">
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
              <Select value={selectedJobId} onValueChange={(v) => { setSelectedJobId(v); setPagination(p => ({ ...p, page: 1 })); setStage('all'); }}>
                <SelectTrigger className="w-[200px] border-[#D6DDEB] rounded-lg">
                  <SelectValue placeholder="All Jobs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs.map(job => (
                    <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={stage} onValueChange={(v) => setStage(v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All stages</SelectItem>
                  {getEnabledStages().map((stageValue) => (
                    <SelectItem key={stageValue} value={stageValue}>
                      {ATSStageDisplayNames[stageValue]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Min Score"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                className="w-[100px] border-[#D6DDEB] rounded-lg"
                min="0"
                max="100"
              />
              <Input
                type="number"
                placeholder="Max Score"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                className="w-[100px] border-[#D6DDEB] rounded-lg"
                min="0"
                max="100"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSort}
                className="border-[#D6DDEB] text-[#7C8493] hover:bg-[#F8F8FD] rounded-lg"
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                {sortBy === 'score' ? 'Score' : 'Date'} {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>

          { }
          {selectedApplications.size > 0 && (() => {
            const selectedApps = applications.filter(app => app._id && selectedApplications.has(app._id))


            const hasRejectedOrHired = selectedApps.some(app =>
              app.stage === ATSStage.REJECTED || app.stage === ATSStage.HIRED
            )


            const cannotShortlist = selectedApps.some(app => app.stage !== ATSStage.IN_REVIEW)


            const cannotReject = hasRejectedOrHired

            return (
              <div className="mt-4 flex items-center gap-3 p-3 bg-[#F8F8FD] rounded-lg border border-[#D6DDEB]">
                <span className="text-sm text-[#25324B] font-medium">
                  {selectedApplications.size} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkShortlist}
                  disabled={bulkActionLoading || cannotShortlist}
                  className="border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Move to Shortlisted
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkReject}
                  disabled={bulkActionLoading || cannotReject}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject
                </Button>
              </div>
            )
          })()}
        </div>

        { }
        <div className="px-7 py-5">
          <div className="border border-[#D6DDEB] rounded-lg overflow-hidden">
            { }
            <div className="bg-white border-b border-[#D6DDEB] px-5 py-4">
              <div className="grid gap-4 items-center" style={{ gridTemplateColumns: '40px minmax(200px, 2fr) 100px minmax(120px, 1fr) minmax(130px, 1fr) minmax(150px, 1.5fr) 200px' }}>
                <div>
                  <Checkbox
                    checked={selectedApplications.size === applications.length && applications.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#7C8493]" />
                  <span className="text-sm font-medium text-[#7C8493]">Full Name</span>
                </div>
                <div className="flex items-center gap-2">
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

            { }
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
                    className={`px-5 py-4 grid gap-4 items-center ${index % 2 === 0 ? 'bg-white' : 'bg-[#F8F8FD]'
                      }`}
                    style={{ gridTemplateColumns: '40px minmax(200px, 2fr) 100px minmax(120px, 1fr) minmax(130px, 1fr) minmax(150px, 1.5fr) 200px' }}
                  >
                    {/* Checkbox Column */}
                    <div>
                      {!application.is_blocked && (
                        <Checkbox
                          checked={application._id ? selectedApplications.has(application._id) : false}
                          onCheckedChange={() => application._id && handleSelectApplication(application._id)}
                        />
                      )}
                    </div>

                    {/* Candidate Name Column */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        {application.seeker_avatar ? (
                          <AvatarImage src={application.seeker_avatar} alt={application.seeker_name} />
                        ) : null}
                        <AvatarFallback className="bg-[#4640DE]/10 text-[#4640DE] text-sm font-semibold">
                          {getInitials(application.seeker_name || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#25324B]">
                          {application.seeker_name}
                        </span>
                        {application.is_blocked && (
                          <span className="text-[10px] text-red-600 bg-red-100 px-1.5 py-0.5 rounded font-medium w-fit mt-0.5">
                            Blocked User
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Score Column */}
                    <div className="flex items-center">
                      <ScoreBadge score={application.score} />
                    </div>

                    {/* Stage Column */}
                    <div>
                      {getStageBadge(application.stage || ATSStage.IN_REVIEW)}
                    </div>

                    {/* Applied Date Column */}
                    <span className="text-sm font-medium text-[#25324B]">
                      {formatDate(application.applied_date)}
                    </span>

                    {/* Job Role Column */}
                    <span className="text-sm font-medium text-[#25324B]">
                      {application.job_title}
                    </span>

                    {/* Action Column */}
                    <div className="flex items-center justify-end gap-2">
                      {!application.is_blocked && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#4640DE] text-[#4640DE] bg-white hover:bg-[#4640DE] hover:text-white rounded-lg text-xs px-3 py-1.5"
                            onClick={() => application.seeker_id && handleChatWithApplicant(application.seeker_id)}
                            title="Chat with applicant"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#4640DE] text-[#4640DE] bg-[#CCCCF5] hover:bg-[#4640DE] hover:text-white rounded-lg text-xs px-3 py-1.5"
                            onClick={() => application._id && handleSeeApplication(application._id)}
                          >
                            <Eye className="w-4 h-4 mr-1.5" />
                            See Application
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          { }
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
                        className={`px-2 py-1 ${isActive
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

      { }
      <Dialog open={showShortlistConfirm} onOpenChange={setShowShortlistConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Shortlisted</DialogTitle>
            <DialogDescription>
              Are you sure you want to move {selectedApplications.size} application(s) to shortlisted stage?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShortlistConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={executeBulkShortlist}
              disabled={bulkActionLoading}
              className="bg-[#4640DE] hover:bg-[#4640DE]/90"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectConfirm} onOpenChange={setShowRejectConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Applications</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject {selectedApplications.size} application(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={executeBulkReject}
              disabled={bulkActionLoading}
              variant="destructive"
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CompanyLayout>
  )
}

export default AllApplications

