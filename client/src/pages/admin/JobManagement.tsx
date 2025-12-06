import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Eye, 
  Trash2, 
  Search, 
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Building2,
  IndianRupee
} from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { toast } from 'sonner'
import { adminApi } from '@/api/admin.api'
import type { JobPostingResponse } from '@/types/job'
import ReasonActionDialog from '@/components/common/ReasonActionDialog'
import { useDebounce } from '@/hooks/useDebounce'

const unpublishReasons = [
  { value: 'expired', label: 'Position is filled or job expired' },
  { value: 'incomplete', label: 'Job information is incomplete or inaccurate' },
  { value: 'violation', label: 'Posting violates terms or guidelines' },
  { value: 'request', label: 'Company requested removal' },
  { value: 'spam', label: 'Suspected spam or fraudulent posting' },
  { value: 'other', label: 'Other (please specify)' }
];

const JobManagement = () => {
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [reasonJob, setReasonJob] = useState<JobPostingResponse|null>(null);
  const [jobs, setJobs] = useState<JobPostingResponse[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearchTerm = useDebounce(searchInput, 500)
  const [filters, setFilters] = useState<{
    search: string
    status: 'all' | 'active' | 'inactive' | 'blocked' | 'unlisted' | 'expired'
  }>({
    search: '',
    status: 'all'
  })
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    jobId: string | null
    jobTitle: string
  }>({
    isOpen: false,
    jobId: null,
    jobTitle: ''
  })

  useEffect(() => {
    setFilters(prev => ({ ...prev, search: debouncedSearchTerm }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [debouncedSearchTerm])

  useEffect(() => {
    fetchJobs()
  }, [pagination.page, filters])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getAllJobs({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        ...(filters.status !== 'all' && filters.status !== 'inactive' && { status: filters.status }),
      })
      
      if (response.success && response.data && Array.isArray(response.data.jobs)) {
        setJobs(response.data.jobs)
        setPagination(prev => ({
          ...prev,
          total: response.data!.pagination.total,
          totalPages: response.data!.pagination.totalPages
        }))
      } else {
        toast.error(response.message || 'Failed to fetch jobs')
        setJobs([])
      }
    } catch {
      toast.error('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleViewJob = (jobId: string) => {
    navigate(`/admin/jobs/${jobId}`)
  }

  const handleToggleStatus = async (jobId: string, currentStatus: 'active' | 'unlisted' | 'expired' | 'blocked') => {
    try {
      const newStatus = currentStatus === 'active' ? 'unlisted' : 'active'
      const response = await adminApi.updateJobStatus(jobId, newStatus, undefined)
      
      if (response.success) {
        setJobs(jobs.map(job => 
          (job.id || job._id) === jobId 
            ? { ...job, status: newStatus }
            : job
        ))
        toast.success(`Job ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
      } else {
        toast.error(response.message || 'Failed to update job status')
      }
    } catch {
      toast.error('Failed to update job status')
    }
  }

  const handleDeleteJob = async () => {
    if (!deleteDialog.jobId) return

    try {
      const response = await adminApi.deleteJob(deleteDialog.jobId)
      
      if (response.success) {
        setJobs(jobs.filter(job => (job.id || job._id) !== deleteDialog.jobId))
        setPagination(prev => ({
          ...prev,
          total: prev.total - 1,
          totalPages: Math.ceil((prev.total - 1) / prev.limit)
        }))
        setDeleteDialog({ isOpen: false, jobId: null, jobTitle: '' })
        toast.success('Job deleted successfully')
      } else {
        toast.error(response.message || 'Failed to delete job')
      }
    } catch {
      toast.error('Failed to delete job')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatSalary = (salary: { min: number; max: number }) => {
    return `₹${salary.min.toLocaleString()} - ₹${salary.max.toLocaleString()}`
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Job Management</h1>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              Total: {pagination.total}
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-200">
              Active: {jobs.filter(job => job.status === 'active').length}
            </Badge>
          </div>
        </div>

        {}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search jobs by title..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as typeof filters.status }))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="unlisted">Unlisted</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle>All Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{job.title}</div>
                              <div className="text-sm text-gray-500">
                                {(job.employmentTypes || []).join(', ')}
                              </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{(job as any).companyName || job.company_name || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{job.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <IndianRupee className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{formatSalary(job.salary ?? { min: 0, max: 0 })}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={job.status === 'active' ? "default" : "secondary"}
                            className={
                              job.status === 'active' ? "bg-green-100 text-green-800 border-green-200" :
                              job.status === 'blocked' ? "bg-red-100 text-red-800 border-red-200" :
                              job.status === 'expired' ? "bg-orange-100 text-orange-800 border-orange-200" :
                              "bg-gray-100 text-gray-800 border-gray-200"
                            }
                          >
                            {job.status === 'active' ? 'Active' :
                             job.status === 'blocked' ? 'Blocked' :
                             job.status === 'expired' ? 'Expired' :
                             job.status === 'unlisted' ? 'Unlisted' : 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{(job as any).applications ?? job.application_count ?? 0} applications</div>
                            <div className="text-gray-500">{(job as any).viewCount ?? job.view_count ?? 0} views</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{formatDate(job.createdAt ?? '')}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewJob(job.id || job._id || '')}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {job.status === 'active' ? (
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setReasonJob(job);
                                    setReasonDialogOpen(true);
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Unpublish
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  onClick={() => handleToggleStatus(job.id || job._id || '', job.status ?? 'unlisted')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => setDeleteDialog({
                                  isOpen: true,
                                  jobId: job.id || job._id || null,
                                  jobTitle: job.title
                                })}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {jobs.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">No jobs found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, jobId: null, jobTitle: '' })}
        onConfirm={handleDeleteJob}
        title="Delete Job"
        description={`Are you sure you want to delete "${deleteDialog.jobTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
      <ReasonActionDialog
        open={reasonDialogOpen}
        onOpenChange={setReasonDialogOpen}
        title="Unpublish Job"
        description={reasonJob ? `Please select a reason for unpublishing '${reasonJob.title}'.` : ''}
        reasonOptions={unpublishReasons}
        onConfirm={async reason => {
          if (!reasonJob) return;
          
          try {
            const response = await adminApi.updateJobStatus(reasonJob.id || reasonJob._id || '', 'blocked', reason);
            
            if (response.success) {
              setJobs(jobs.map(job => 
                (job.id || job._id) === (reasonJob.id || reasonJob._id)
                  ? { ...job, status: 'blocked', unpublish_reason: reason }
                  : job
              ));
              toast.success(`Unpublished ${reasonJob?.title}`);
            } else {
              toast.error(response.message || 'Failed to unpublish job');
            }
          } catch {
            toast.error('Failed to unpublish job');
          }
          setReasonDialogOpen(false);
          setReasonJob(null);
        }}
        actionLabel="Unpublish"
        confirmVariant="destructive"
      />
    </AdminLayout>
  )
}

export default JobManagement