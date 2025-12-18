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
import type { Skill } from '@/interfaces/job/skill.interface'
import { adminApi } from '@/api/admin.api'
import { toast } from 'sonner'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import type { ApiError } from '@/types/api-error.type'

const SkillManagement = () => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [skillName, setSkillName] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalSkills, setTotalSkills] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10
  
  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = { 
        page: currentPage, 
        limit: itemsPerPage, 
        search: searchTerm || undefined 
      }
      const response = await adminApi.getAllSkills(params)
      
      if (response.success && response.data && response.data.skills && Array.isArray(response.data.skills)) {
        const mappedSkills = response.data.skills.map(skill => ({
          id: skill.id,
          name: skill.name,
          createdAt: skill.createdAt,
          updatedAt: skill.updatedAt,
        }))
        setSkills(mappedSkills)
        setTotalPages(response.data.totalPages)
        setTotalSkills(response.data.total)
      } else {
        setError(response.message || 'Failed to fetch skills')
        setSkills([])
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setError(apiError?.response?.data?.message || 'Failed to fetch skills')
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm])

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  const handleCreate = () => {
    setSkillName('')
    setSelectedSkill(null)
    setCreateDialogOpen(true)
  }

  const handleEdit = (skill: Skill) => {
    setSelectedSkill(skill)
    setSkillName(skill.name)
    setEditDialogOpen(true)
  }

  const handleDelete = (skill: Skill) => {
    setSelectedSkill(skill)
    setDeleteDialogOpen(true)
  }

  const handleCreateConfirm = async () => {
    if (!skillName.trim()) {
      toast.error('Skill name is required')
      return
    }

    try {
      const response = await adminApi.createSkill({ name: skillName.trim() })
      
      if (response.success && response.data) {
        
        const newSkill = {
          id: response.data.id,
          name: response.data.name,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        }
        setSkills(prev => [newSkill, ...prev])
        setTotalSkills(prev => prev + 1)
        toast.success('Skill created successfully')
        setCreateDialogOpen(false)
        setSkillName('')
      } else {
        toast.error(response.message || 'Failed to create skill')
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to create skill')
    }
  }

  const handleEditConfirm = async () => {
    if (!selectedSkill || !skillName.trim()) {
      toast.error('Skill name is required')
      return
    }

    try {
      const response = await adminApi.updateSkill(selectedSkill.id, { name: skillName.trim() })
      
      if (response.success && response.data) {
        
        setSkills(prev => prev.map(skill => 
          skill.id === selectedSkill.id 
            ? { ...skill, name: response.data!.name, updatedAt: response.data!.updatedAt }
            : skill
        ))
        toast.success('Skill updated successfully')
        setEditDialogOpen(false)
        setSkillName('')
        setSelectedSkill(null)
      } else {
        toast.error(response.message || 'Failed to update skill')
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to update skill')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedSkill) return

    try {
      const response = await adminApi.deleteSkill(selectedSkill.id)
      
      if (response.success) {
        
        setSkills(prev => prev.filter(skill => skill.id !== selectedSkill.id))
        setTotalSkills(prev => Math.max(0, prev - 1))
        toast.success('Skill deleted successfully')
        setDeleteDialogOpen(false)
        setSelectedSkill(null)
      } else {
        toast.error(response.message || 'Failed to delete skill')
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to delete skill')
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
          <h1 className="text-2xl font-bold text-foreground">Skills Management</h1>
          <Button className="flex items-center space-x-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            <span>Add Skill</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills..."
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
                  <p className="mt-2 text-sm text-gray-500">Loading skills...</p>
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
                <Button onClick={fetchSkills} variant="outline">
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
                    {skills.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-gray-500">
                          No skills found
                        </td>
                      </tr>
                    ) : (
                      skills.map((skill) => (
                         <tr key={skill.id} className="border-b border-border/50 hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <p className="font-medium text-gray-800">{skill.name}</p>
                          </td>
                          <td className="p-4 text-sm text-gray-700">
                            {new Date(skill.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleEdit(skill)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(skill)}
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
              Showing {startIndex + 1} to {Math.min(endIndex, totalSkills)} of {totalSkills} skills
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
          title="Create Skill"
          description="Add a new skill to the system."
          confirmText="Create"
        >
          <div>
            <label className="text-sm font-medium">Skill Name</label>
            <Input
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g., Python, ReactJS, Data Analysis"
              className="mt-1"
            />
          </div>
        </FormDialog>

        <FormDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onConfirm={handleEditConfirm}
          title="Edit Skill"
          description="Update the skill name."
          confirmText="Update"
        >
          <div>
            <label className="text-sm font-medium">Skill Name</label>
            <Input
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g., Python, ReactJS, Data Analysis"
              className="mt-1"
            />
          </div>
        </FormDialog>

        <ConfirmationDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Skill"
          description={`Are you sure you want to delete "${selectedSkill?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </AdminLayout>
  )
}

export default SkillManagement