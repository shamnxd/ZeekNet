import { useState } from 'react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import FormDialog from '@/components/common/FormDialog'
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  DollarSign
} from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { Badge } from '@/components/ui/badge'

interface PricePlan {
  id: string
  name: string
  price: number
  duration: number 
  description: string
  features: string[]
  maxJobPostings?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const PricePlanManagement = () => {
  const [plans, setPlans] = useState<PricePlan[]>([
    {
      id: '1',
      name: 'Free',
      price: 0,
      duration: 30,
      description: 'Perfect for getting started',
      features: [
        '1 active job post',
        'Limited applicant views',
        'Basic analytics'
      ],
      maxJobPostings: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Basic',
      price: 29,
      duration: 30,
      description: 'Ideal for small businesses',
      features: [
        '5 active job posts',
        'Unlimited applicant views',
        'Automated email notifications',
        'Email support'
      ],
      maxJobPostings: 5,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Pro',
      price: 79,
      duration: 30,
      description: 'For growing companies with high hiring needs',
      features: [
        '20 active job posts',
        'Automated email notifications',
        'Featured jobs',
        'Advanced analytics',
        'Priority support'
      ],
      maxJobPostings: 20,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ])

  const [loading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PricePlan | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    description: '',
    features: '',
    maxJobPostings: '',
    isActive: true,
  })

  const handleCreate = () => {
    setFormData({
      name: '',
      price: '',
      duration: '',
      description: '',
      features: '',
      maxJobPostings: '',
      isActive: true,
    })
    setSelectedPlan(null)
    setCreateDialogOpen(true)
  }

  const handleEdit = (plan: PricePlan) => {
    setSelectedPlan(plan)
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      description: plan.description,
      features: plan.features.join('\n'),
      maxJobPostings: plan.maxJobPostings?.toString() || '',
      isActive: plan.isActive,
    })
    setEditDialogOpen(true)
  }

  const handleDelete = (plan: PricePlan) => {
    setSelectedPlan(plan)
    setDeleteDialogOpen(true)
  }

  const handleCreateConfirm = async () => {
    if (!formData.name.trim() || !formData.price || !formData.duration) {
      toast.error('Name, price, and duration are required')
      return
    }

    try {
      const newPlan: PricePlan = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        description: formData.description.trim(),
        features: formData.features.split('\n').filter(f => f.trim()),
        maxJobPostings: formData.maxJobPostings ? parseInt(formData.maxJobPostings) : undefined,
        isActive: formData.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setPlans(prev => [newPlan, ...prev])
      toast.success('Price plan created successfully')
      setCreateDialogOpen(false)
      resetForm()
    } catch (err: any) {
      toast.error(err.message || 'Failed to create price plan')
    }
  }

  const handleEditConfirm = async () => {
    if (!selectedPlan || !formData.name.trim() || !formData.price || !formData.duration) {
      toast.error('Name, price, and duration are required')
      return
    }

    try {
      const updatedPlan: PricePlan = {
        ...selectedPlan,
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        description: formData.description.trim(),
        features: formData.features.split('\n').filter(f => f.trim()),
        maxJobPostings: formData.maxJobPostings ? parseInt(formData.maxJobPostings) : undefined,
        isActive: formData.isActive,
        updatedAt: new Date().toISOString(),
      }

      setPlans(prev => prev.map(plan => 
        plan.id === selectedPlan.id ? updatedPlan : plan
      ))
      toast.success('Price plan updated successfully')
      setEditDialogOpen(false)
      resetForm()
      setSelectedPlan(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update price plan')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedPlan) return

    try {
      setPlans(prev => prev.filter(plan => plan.id !== selectedPlan.id))
      toast.success('Price plan deleted successfully')
      setDeleteDialogOpen(false)
      setSelectedPlan(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete price plan')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      duration: '',
      description: '',
      features: '',
      maxJobPostings: '',
      isActive: true,
    })
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPlans = filteredPlans.slice(startIndex, endIndex)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Price Plans</h1>
          <Button className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            <span>Create Plan</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plans..."
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
                  <p className="mt-2 text-sm text-gray-500">Loading plans...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 font-medium text-muted-foreground">Plan Name</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Price</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Job Postings</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Features</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPlans.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">
                          No price plans found
                        </td>
                      </tr>
                    ) : (
                      paginatedPlans.map((plan) => (
                        <tr key={plan.id} className="border-b border-border/50 hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-800">{plan.name}</p>
                              <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4 text-gray-600" />
                              <span className="font-semibold text-gray-800">{plan.price === 0 ? '0' : plan.price.toLocaleString()}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-700">
                            {plan.maxJobPostings ? `${plan.maxJobPostings} active` : 'Unlimited'}
                          </td>
                          <td className="p-4">
                            <div className="space-y-1 max-w-xs">
                              {plan.features.slice(0, 3).map((feature, idx) => (
                                <p key={idx} className="text-sm text-gray-600">• {feature}</p>
                              ))}
                              {plan.features.length > 3 && (
                                <p className="text-xs text-gray-500">+{plan.features.length - 3} more</p>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge 
                              variant="outline" 
                              className={plan.isActive 
                                ? 'bg-green-100 text-green-700 border-green-200' 
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                              }
                            >
                              {plan.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleEdit(plan)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(plan)}
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

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredPlans.length)} of {filteredPlans.length} plans
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

        {/* Create Dialog */}
        <FormDialog
          isOpen={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false)
            resetForm()
          }}
          onConfirm={handleCreateConfirm}
          title="Create Price Plan"
          description="Add a new price plan to the system."
          confirmText="Create"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Plan Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Free, Basic, Pro"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-sm font-medium">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="29"
                  className="mt-1"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="duration" className="text-sm font-medium">Duration (Days) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="30"
                  className="mt-1"
                  min="1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Plan description..."
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="features" className="text-sm font-medium">Features (one per line)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="5 active job posts&#10;Unlimited applicant views&#10;Automated email notifications&#10;Email support"
                className="mt-1"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="maxJobPostings" className="text-sm font-medium">Max Job Postings</Label>
              <Input
                id="maxJobPostings"
                type="number"
                value={formData.maxJobPostings}
                onChange={(e) => setFormData({ ...formData, maxJobPostings: e.target.value })}
                placeholder="Leave empty for unlimited"
                className="mt-1"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited job postings</p>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive" className="text-sm font-medium">Active Status</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
        </FormDialog>

        {/* Edit Dialog */}
        <FormDialog
          isOpen={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false)
            resetForm()
            setSelectedPlan(null)
          }}
          onConfirm={handleEditConfirm}
          title="Edit Price Plan"
          description="Update the price plan details."
          confirmText="Update"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-sm font-medium">Plan Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Free, Basic, Pro"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price" className="text-sm font-medium">Price ($) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="29"
                  className="mt-1"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="edit-duration" className="text-sm font-medium">Duration (Days) *</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="30"
                  className="mt-1"
                  min="1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Plan description..."
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-features" className="text-sm font-medium">Features (one per line)</Label>
              <Textarea
                id="edit-features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="5 active job posts&#10;Unlimited applicant views&#10;Automated email notifications&#10;Email support"
                className="mt-1"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="edit-maxJobPostings" className="text-sm font-medium">Max Job Postings</Label>
              <Input
                id="edit-maxJobPostings"
                type="number"
                value={formData.maxJobPostings}
                onChange={(e) => setFormData({ ...formData, maxJobPostings: e.target.value })}
                placeholder="Leave empty for unlimited"
                className="mt-1"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited job postings</p>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-isActive" className="text-sm font-medium">Active Status</Label>
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
        </FormDialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false)
            setSelectedPlan(null)
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Price Plan"
          description={`Are you sure you want to delete "${selectedPlan?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </AdminLayout>
  )
}

export default PricePlanManagement

