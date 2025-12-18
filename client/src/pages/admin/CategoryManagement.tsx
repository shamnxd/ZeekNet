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
import type { JobCategory } from '@/api/admin.api'
import { adminApi } from '@/api/admin.api'
import { toast } from 'sonner'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import type { ApiError } from '@/types/api-error.type'

const CategoryManagement = () => {
  const [categories, setCategories] = useState<JobCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | null>(null)
  const [categoryName, setCategoryName] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCategories, setTotalCategories] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10
  
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = { 
        page: currentPage, 
        limit: itemsPerPage, 
        search: searchTerm || undefined 
      }
      const response = await adminApi.getAllJobCategories(params)
      
      if (response.success && response.data && response.data.categories && Array.isArray(response.data.categories)) {
        const mappedCategories = response.data.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
        }))
        setCategories(mappedCategories)
        setTotalPages(response.data.totalPages)
        setTotalCategories(response.data.total)
      } else {
        setError(response.message || 'Failed to fetch categories')
        setCategories([])
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setError(apiError?.response?.data?.message || 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleCreate = () => {
    setCategoryName('')
    setSelectedCategory(null)
    setCreateDialogOpen(true)
  }

  const handleEdit = (category: JobCategory) => {
    setSelectedCategory(category)
    setCategoryName(category.name)
    setEditDialogOpen(true)
  }

  const handleDelete = (category: JobCategory) => {
    setSelectedCategory(category)
    setDeleteDialogOpen(true)
  }

  const handleCreateConfirm = async () => {
    if (!categoryName.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      const response = await adminApi.createJobCategory({ name: categoryName.trim() })
      
      if (response.success && response.data) {
        
        const newCategory = {
          id: response.data.id,
          name: response.data.name,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        }
        setCategories(prev => [newCategory, ...prev])
        setTotalCategories(prev => prev + 1)
        toast.success('Category created successfully')
        setCreateDialogOpen(false)
        setCategoryName('')
      } else {
        toast.error(response.message || 'Failed to create category')
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to create category')
    }
  }

  const handleEditConfirm = async () => {
    if (!selectedCategory || !categoryName.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      const response = await adminApi.updateJobCategory(selectedCategory.id, { name: categoryName.trim() })
      
      if (response.success && response.data) {
        
        setCategories(prev => prev.map(cat => 
          cat.id === selectedCategory.id 
            ? { ...cat, name: response.data!.name, updatedAt: response.data!.updatedAt }
            : cat
        ))
        toast.success('Category updated successfully')
        setEditDialogOpen(false)
        setCategoryName('')
        setSelectedCategory(null)
      } else {
        toast.error(response.message || 'Failed to update category')
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to update category')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return

    try {
      const response = await adminApi.deleteJobCategory(selectedCategory.id)
      
      if (response.success) {
        
        setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id))
        setTotalCategories(prev => Math.max(0, prev - 1))
        toast.success('Category deleted successfully')
        setDeleteDialogOpen(false)
        setSelectedCategory(null)
      } else {
        toast.error(response.message || 'Failed to delete category')
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to delete category')
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
          <h1 className="text-2xl font-bold text-foreground">Job Categories</h1>
          <Button className="flex items-center space-x-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
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
                  <p className="mt-2 text-sm text-gray-500">Loading categories...</p>
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
                <Button onClick={fetchCategories} variant="outline">
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
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-gray-500">
                          No categories found
                        </td>
                      </tr>
                    ) : (
                      categories.map((category) => (
                        <tr key={category.id} className="border-b border-border/50 hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <p className="font-medium text-gray-800">{category.name}</p>
                          </td>
                          <td className="p-4 text-sm text-gray-700">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleEdit(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(category)}
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
              Showing {startIndex + 1} to {Math.min(endIndex, totalCategories)} of {totalCategories} categories
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
          title="Create Category"
          description="Add a new category to the system."
          confirmText="Create"
        >
          <div>
            <label className="text-sm font-medium">Category Name</label>
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Technology, Finance, Healthcare"
              className="mt-1"
            />
          </div>
        </FormDialog>

        <FormDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onConfirm={handleEditConfirm}
          title="Edit Category"
          description="Update the category name."
          confirmText="Update"
        >
          <div>
            <label className="text-sm font-medium">Category Name</label>
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Technology, Finance, Healthcare"
              className="mt-1"
            />
          </div>
        </FormDialog>

        <ConfirmationDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Category"
          description={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </AdminLayout>
  )
}

export default CategoryManagement