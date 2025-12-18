import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import FormDialog from '@/components/common/FormDialog'
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import type { JobRole } from '@/api/admin.api'
import { adminApi } from '@/api/admin.api'
import { toast } from 'sonner'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import type { ApiError } from '@/types/api-error.type'

const JobRoleManagement = () => {
  const [jobRoles, setJobRoles] = useState<JobRole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedJobRole, setSelectedJobRole] = useState<JobRole | null>(null)
  const [jobRoleName, setJobRoleName] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalJobRoles, setTotalJobRoles] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10
  
  const fetchJobRoles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = { 
        page: currentPage, 
        limit: itemsPerPage, 
        search: searchTerm || undefined 
      }
      const response = await adminApi.getAllJobRoles(params)
      
      if (response.success && response.data && response.data.jobRoles && Array.isArray(response.data.jobRoles)) {
        const mappedJobRoles = response.data.jobRoles.map(role => ({
          id: role.id,
          name: role.name,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        }))
        setJobRoles(mappedJobRoles)
        setTotalPages(response.data.totalPages)
        setTotalJobRoles(response.data.total)
      } else {
        setError(response.message || 'Failed to fetch job roles')
        setJobRoles([])
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setError(apiError?.response?.data?.message || 'Failed to fetch job roles')
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm])

  useEffect(() => {
    fetchJobRoles()
  }, [fetchJobRoles])

  const handleCreate = () => {
    setJobRoleName('')
    setSelectedJobRole(null)
    setCreateDialogOpen(true)
  }

  const handleEdit = (jobRole: JobRole) => {
    setSelectedJobRole(jobRole)
    setJobRoleName(jobRole.name)
    setEditDialogOpen(true)
  }

  const handleDelete = (jobRole: JobRole) => {
    setSelectedJobRole(jobRole)
    setDeleteDialogOpen(true)
  }

  const handleCreateConfirm = async () => {
    if (!jobRoleName.trim()) {
      toast.error('Job role name is required')
      return
    }

    try {
      const response = await adminApi.createJobRole({ name: jobRoleName.trim() })
      
      if (response.success && response.data) {
        
        const newJobRole = {
          id: response.data.id,
          name: response.data.name,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        }
        setJobRoles(prev => [newJobRole, ...prev])
        setTotalJobRoles(prev => prev + 1)
        toast.success('Job role created successfully')
        setCreateDialogOpen(false)
        setJobRoleName('')
      } else {
        toast.error(response.message || 'Failed to create job role')
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to create job role')
    }
  }

  const handleEditConfirm = async () => {
    if (!selectedJobRole || !jobRoleName.trim()) {
      toast.error('Job role name is required')
      return
    }

    try {
      const response = await adminApi.updateJobRole(selectedJobRole.id, { name: jobRoleName.trim() })
      
      if (response.success && response.data) {
        
        setJobRoles(prev => prev.map(role => 
          role.id === selectedJobRole.id 
            ? { ...role, name: response.data!.name, updatedAt: response.data!.updatedAt }
            : role
        ))
        toast.success('Job role updated successfully')
        setEditDialogOpen(false)
        setJobRoleName('')
        setSelectedJobRole(null)
      } else {
        toast.error(response.message || 'Failed to update job role')
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to update job role')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedJobRole) return

    try {
      const response = await adminApi.deleteJobRole(selectedJobRole.id)
      
      if (response.success) {
        
        setJobRoles(prev => prev.filter(role => role.id !== selectedJobRole.id))
        setTotalJobRoles(prev => Math.max(0, prev - 1))
        toast.success('Job role deleted successfully')
        setDeleteDialogOpen(false)
        setSelectedJobRole(null)
      } else {
        toast.error(response.message || 'Failed to delete job role')
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to delete job role')
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Job Roles Management</h1>
          <Button className="flex items-center space-x-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            <span>Add Job Role</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search job roles..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading job roles...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-8">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchJobRoles} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Created</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobRoles.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-gray-500">
                          No job roles found
                        </td>
                      </tr>
                    ) : (
                      jobRoles.map((jobRole) => (
                         <tr key={jobRole.id} className="border-b border-border/50 hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <p className="font-medium text-gray-800">{jobRole.name}</p>
                          </td>
                          <td className="p-4 text-sm text-gray-700">
                            {new Date(jobRole.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleEdit(jobRole)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(jobRole)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, totalJobRoles)} of {totalJobRoles} job roles
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center space-x-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 p-0 ${
                      currentPage === page 
                        ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <FormDialog
          isOpen={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onConfirm={handleCreateConfirm}
          title="Create Job Role"
          description="Add a new job role to the system."
          confirmText="Create"
        >
          <div>
            <label className="text-sm font-medium">Job Role Name</label>
            <Input
              value={jobRoleName}
              onChange={(e) => setJobRoleName(e.target.value)}
              placeholder="e.g., Software Engineer, Product Manager, Data Analyst"
              className="mt-1"
            />
          </div>
        </FormDialog>

        <FormDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onConfirm={handleEditConfirm}
          title="Edit Job Role"
          description="Update the job role name."
          confirmText="Update"
        >
          <div>
            <label className="text-sm font-medium">Job Role Name</label>
            <Input
              value={jobRoleName}
              onChange={(e) => setJobRoleName(e.target.value)}
              placeholder="e.g., Software Engineer, Product Manager, Data Analyst"
              className="mt-1"
            />
          </div>
        </FormDialog>

        <ConfirmationDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Job Role"
          description={`Are you sure you want to delete "${selectedJobRole?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </AdminLayout>
  )
}

export default JobRoleManagement

