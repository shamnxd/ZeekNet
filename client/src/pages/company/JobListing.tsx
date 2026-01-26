import CompanyLayout from '../../components/layouts/CompanyLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { companyApi } from '@/api/company.api'
import type { JobPostingResponse } from '@/interfaces/job/job-posting-response.interface'
import type { JobPostingQuery } from '@/interfaces/job/job-posting-query.interface'
import { Loading } from '@/components/ui/loading'
import { toast } from 'sonner'
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  EyeOff,
  List,
  XCircle,
  RotateCcw,
  Star,
  Plus
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getStatusBadge = (status: 'active' | 'unlisted' | 'expired' | 'blocked' | 'closed') => {
  switch (status) {
    case 'active':
      return 'Live';
    case 'unlisted':
      return 'Unlisted';
    case 'expired':
      return 'Expired';
    case 'blocked':
      return 'Blocked';
    case 'closed':
      return 'Closed';
    default:
      return 'Unknown';
  }
};

const formatEmploymentTypes = (types: string[] | undefined) => {
  if (!types || types.length === 0) return 'Fulltime';
  return types.map(type =>
    type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')
  ).join(', ');
};

const CompanyJobListing = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<JobPostingResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [reopenDialogOpen, setReopenDialogOpen] = useState(false)
  const [closeDialogOpen, setCloseDialogOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [additionalVacancies, setAdditionalVacancies] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchJobs = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true)
      setError(null)

      const query: JobPostingQuery = {
        page,
        limit,
        ...(searchTerm && { search: searchTerm })
      }

      const response = await companyApi.getJobPostings(query)

      if (response.success && response.data) {
        setJobs(response.data.jobs || [])
        const paginationData = response.data.pagination
        setPagination({
          page: paginationData?.page || page,
          limit: paginationData?.limit || limit,
          total: paginationData?.total || 0,
          totalPages: paginationData?.totalPages || 0
        })
      } else {
        setError(response.message || 'Failed to fetch jobs')
      }
    } catch {
      setError('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleJobClick = (jobId: string) => {
    navigate(`/company/job-details/${jobId}`)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchJobs(newPage, pagination.limit)
    }
  }

  const handleViewJob = (jobId: string) => {
    navigate(`/company/job-details/${jobId}`)
  }

  const handleEditJob = (jobId: string) => {
    navigate(`/company/edit-job/${jobId}`)
  }

  const handleCloseJobClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setCloseDialogOpen(true);
  };

  const handleCloseJob = async () => {
    if (!selectedJobId) return;

    try {
      const response = await companyApi.closeJob(selectedJobId);

      if (response.success) {
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job.id === selectedJobId
              ? { ...job, status: 'closed' as const }
              : job
          )
        );
        toast.success('Job closed successfully', {
          description: 'All remaining candidates have been notified.'
        });
        setCloseDialogOpen(false);
        setSelectedJobId(null);
      } else {
        toast.error('Failed to close job', {
          description: response.message || 'Please try again later.'
        });
      }
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error('Failed to close job', {
        description: apiError?.response?.data?.message || 'Please try again later.'
      });
    }
  };

  const handleReopenJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setAdditionalVacancies(1);
    setReopenDialogOpen(true);
  };

  const handleReopenSubmit = async () => {
    if (!selectedJobId || additionalVacancies < 1) {
      toast.error('Invalid input', {
        description: 'Additional vacancies must be at least 1.'
      });
      return;
    }

    try {
      const response = await companyApi.reopenJob(selectedJobId, additionalVacancies);

      if (response.success) {
        toast.success('Job reopened successfully', {
          description: `Job has been reopened with ${additionalVacancies} additional ${additionalVacancies === 1 ? 'vacancy' : 'vacancies'}.`
        });
        setReopenDialogOpen(false);
        setSelectedJobId(null);
        setAdditionalVacancies(1);
        await fetchJobs(pagination.page, pagination.limit);
      } else {
        toast.error('Failed to reopen job', {
          description: response.message || 'Please try again later.'
        });
      }
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error('Failed to reopen job', {
        description: apiError?.response?.data?.message || 'Please try again later.'
      });
    }
  };

  const handleToggleJobStatus = async (jobId: string, currentStatus: 'active' | 'unlisted' | 'expired' | 'blocked' | 'closed') => {
    const newStatus = currentStatus === 'active' ? 'unlisted' : 'active'
    const statusText = newStatus === 'active' ? 'listed' : 'unlisted'

    try {
      setJobs(prevJobs =>
        prevJobs.map(job => {
          const currentJobId = job.id || job._id;
          if (currentJobId === jobId) {
            return { ...job, status: newStatus };
          }
          return job;
        })
      )

      const response = await companyApi.updateJobStatus(jobId, newStatus)

      if (response.success) {
        toast.success(`Job ${statusText} successfully`, {
          description: `The job status has been updated.`
        })
      } else {
        setJobs(prevJobs =>
          prevJobs.map(job => {
            const currentJobId = job.id || job._id;
            if (currentJobId === jobId) {
              return { ...job, status: currentStatus };
            }
            return job;
          })
        )
        toast.error('Failed to update job status', {
          description: response.message || 'Please try again later.'
        })
      }
    } catch (error: unknown) {
      setJobs(prevJobs =>
        prevJobs.map(job => {
          const currentJobId = job.id || job._id;
          if (currentJobId === jobId) {
            return { ...job, status: currentStatus };
          }
          return job;
        })
      )
      const isAxiosError = error && typeof error === 'object' && 'response' in error
      const errorMessage = isAxiosError
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'An unexpected error occurred. Please try again.'
        : 'An unexpected error occurred. Please try again.'
      toast.error('Failed to update job status', {
        description: errorMessage
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-[#56CDAD] text-[#56CDAD] bg-transparent';
      case 'unlisted':
        return 'border-[#FFB836] text-[#FFB836] bg-transparent';
      case 'expired':
        return 'border-[#7C8493] text-[#7C8493] bg-transparent';
      case 'blocked':
        return 'border-red-500 text-red-500 bg-transparent';
      case 'closed':
        return 'border-gray-600 text-gray-600 bg-transparent';
      default:
        return 'border-[#D6DDEB] text-[#7C8493] bg-transparent';
    }
  };

  return (
    <CompanyLayout>
      <div className="min-h-screen bg-white">
        <div className="px-7 py-7">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#25324B]">
              Total Jobs : {pagination.total}
            </h1>
            <Button
              className="bg-[#4640DE] hover:bg-[#4640DE]/90"
              onClick={() => navigate('/company/post-job')}
            >
              <Plus className="w-5 h-5 mr-2" />
              Post a Job
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7C8493]" />
              <Input
                type="text"
                placeholder="Search jobs by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchJobs(1, pagination.limit)
                  }
                }}
                className="pl-10 border-[#D6DDEB] rounded-lg"
              />
            </div>
          </div>

          <div className="border border-[#D6DDEB] rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-[#D6DDEB] px-5 py-4">
              <div className="grid grid-cols-6 gap-10 items-center text-sm font-medium text-[#7C8493]">
                <div className="w-[248px]">Roles</div>
                <div className="w-[111px]">Status</div>
                <div className="w-[149px]">Date Posted</div>
                <div className="w-[128px]">Job Type</div>
                <div className="w-[114px]">Applicants</div>
                <div className="w-[98px]">Views</div>
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-[#D6DDEB]">
              {loading ? (
                <div className="px-5 py-10 flex justify-center">
                  <Loading />
                </div>
              ) : error ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-red-500">{error}</p>
                  <Button onClick={() => fetchJobs(pagination.page, pagination.limit)} className="mt-2" variant="outline">
                    Retry
                  </Button>
                </div>
              ) : jobs.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-gray-500">No jobs found</p>
                </div>
              ) : (
                jobs.map((job, index) => {
                  const jobId = job.id || job._id || '';
                  const status = job.status ?? 'unlisted';
                  const unpublishReason = job.unpublishReason ?? job.unpublish_reason;
                  const employmentTypes = job.employmentTypes ?? job.employment_types ?? [];
                  const applicationCount = job.applicationCount ?? job.application_count ?? 0;
                  const viewCount = job.viewCount ?? job.view_count ?? 0;

                  return (
                    <div
                      key={jobId}
                      className={`px-5 py-5 grid grid-cols-6 gap-10 items-center ${job.isFeatured
                        ? 'bg-yellow-50 border-l-4 border-l-yellow-500'
                        : index % 2 === 0 ? 'bg-white' : 'bg-[#F8F8FD]'
                        }`}
                    >
                      <div className="w-[248px]">
                        <div className="flex items-center gap-2">
                          {job.isFeatured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                          <button
                            onClick={() => handleJobClick(jobId)}
                            className="text-sm font-medium text-[#25324B] hover:text-[#4640DE] transition-colors text-left"
                          >
                            {job.title}
                          </button>
                        </div>
                      </div>

                      <div className="w-[111px]">
                        <div className="space-y-1">
                          <Badge
                            variant="outline"
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}
                          >
                            {getStatusBadge(status)}
                          </Badge>
                          {status === 'blocked' && unpublishReason && (
                            <div className="text-[10px] text-red-600 truncate max-w-[100px]" title={unpublishReason}>
                              {unpublishReason.length > 20 ? `${unpublishReason.substring(0, 20)}...` : unpublishReason}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="w-[149px]">
                        <span className="text-sm font-medium text-[#25324B]">{job.createdAt ? formatDate(job.createdAt) : 'N/A'}</span>
                      </div>

                      <div className="w-[128px]">
                        <Badge
                          variant="outline"
                          className="border-[#4640DE] text-[#4640DE] bg-transparent px-2 py-1 rounded-full text-xs font-semibold"
                        >
                          {formatEmploymentTypes(employmentTypes)}
                        </Badge>
                      </div>

                      <div className="w-[114px]">
                        <span className="text-sm font-medium text-[#25324B]">{applicationCount.toLocaleString()}</span>
                      </div>

                      <div className="w-[98px] flex items-center justify-between">
                        <span className="text-sm font-medium text-[#25324B]">{viewCount.toLocaleString()}</span>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4 text-[#25324B]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleViewJob(jobId)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditJob(jobId)} disabled={status === 'closed' || status === 'blocked'}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {status !== 'closed' && (
                              <DropdownMenuItem onClick={() => handleCloseJobClick(jobId)} className="text-red-600">
                                <XCircle className="w-4 h-4 mr-2" />
                                Close Job
                              </DropdownMenuItem>
                            )}
                            {status === 'closed' && (job.closureType === 'auto_filled' || job.closure_type === 'auto_filled') && (
                              <DropdownMenuItem onClick={() => handleReopenJob(jobId)} className="text-green-600">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reopen Job
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleToggleJobStatus(jobId, status)}
                              disabled={status === 'blocked' || status === 'expired' || status === 'closed'}
                              className={status === 'active' ? 'text-orange-600' : 'text-green-600'}
                            >
                              {status === 'active' ? (
                                <><EyeOff className="w-4 h-4 mr-2" /> Unlist</>
                              ) : status === 'blocked' ? (
                                <><List className="w-4 h-4 mr-2" /> List (Blocked)</>
                              ) : status === 'expired' ? (
                                <><List className="w-4 h-4 mr-2" /> List (Expired)</>
                              ) : (
                                <><List className="w-4 h-4 mr-2" /> List</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                try {
                                  const response = await companyApi.toggleFeaturedJob(jobId)
                                  if (response.success) {
                                    toast.success(job.isFeatured ? 'Job removed from featured' : 'Job set as featured')
                                    await fetchJobs(pagination.page, pagination.limit)
                                  } else {
                                    toast.error('Failed to update featured status')
                                  }
                                } catch {
                                  toast.error('Failed to update featured status')
                                }
                              }}
                              disabled={status === 'blocked' || status === 'closed'}
                              className="text-yellow-600"
                            >
                              <Star className="w-4 h-4 mr-2" />
                              {job.isFeatured ? 'Remove Featured' : 'Set as Featured'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Pagination */}
            {!loading && jobs.length > 0 && (
              <div className="px-5 py-4 border-t border-[#D6DDEB]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#7C8493]">Showing {pagination.limit} jobs per page</span>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" className="p-1" onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1}>
                      <ChevronLeft className="w-4 h-4 text-[#25324B]" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        const isActive = pageNum === pagination.page;
                        return (
                          <Button key={pageNum} variant="outline" size="sm" className={`px-2 py-1 ${isActive ? 'bg-[#4640DE] text-white border-[#4640DE]' : 'text-[#515B6F] border-[#D6DDEB]'}`} onClick={() => handlePageChange(pageNum)}>
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button variant="outline" size="sm" className="p-1" onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}>
                      <ChevronRight className="w-4 h-4 text-[#25324B]" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Close Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to close this job? This action cannot be undone. All remaining candidates will be notified.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCloseDialogOpen(false); setSelectedJobId(null); }}>
              Cancel
            </Button>
            <Button onClick={handleCloseJob} variant="destructive">
              Close Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={reopenDialogOpen} onOpenChange={setReopenDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reopen Job</DialogTitle>
            <DialogDescription>
              This job was automatically closed when all vacancies were filled. Add additional vacancies to reopen the job.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="additionalVacancies">Additional Vacancies</Label>
              <Input
                id="additionalVacancies"
                type="number"
                min="1"
                value={additionalVacancies}
                onChange={(e) => setAdditionalVacancies(parseInt(e.target.value) || 1)}
                placeholder="Enter number of additional vacancies"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setReopenDialogOpen(false); setSelectedJobId(null); setAdditionalVacancies(1); }}>
              Cancel
            </Button>
            <Button onClick={handleReopenSubmit}>
              Reopen Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CompanyLayout>
  )
}

export default CompanyJobListing