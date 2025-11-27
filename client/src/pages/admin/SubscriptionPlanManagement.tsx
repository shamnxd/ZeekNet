import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FormDialog from '@/components/common/FormDialog'
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react'
import type { SubscriptionPlan, CreateSubscriptionPlanData, UpdateSubscriptionPlanData } from '@/api/admin.api'
import { adminApi } from '@/api/admin.api'
import { toast } from 'sonner'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { Badge } from '@/components/ui/badge'

const SubscriptionPlanManagement = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPlans, setTotalPlans] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10
  
  const [formData, setFormData] = useState<CreateSubscriptionPlanData | UpdateSubscriptionPlanData>({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    features: [],
    jobPostLimit: 0,
    featuredJobLimit: 0,
    applicantAccessLimit: 0,
  })
  const [featureInput, setFeatureInput] = useState('')
  
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = { 
        page: currentPage, 
        limit: itemsPerPage, 
        search: searchTerm || undefined 
      }
      const response = await adminApi.getAllSubscriptionPlans(params)
      
      if (response.success && response.data && response.data.plans && Array.isArray(response.data.plans)) {
        setPlans(response.data.plans)
        setTotalPages(response.data.totalPages)
        setTotalPlans(response.data.total)
      } else {
        setError(response.message || 'Failed to fetch subscription plans')
        setPlans([])
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subscription plans')
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const handleCreate = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: 30,
      features: [],
      jobPostLimit: 0,
      featuredJobLimit: 0,
      applicantAccessLimit: 0,
    })
    setFeatureInput('')
    setSelectedPlan(null)
    setCreateDialogOpen(true)
  }

  const handleEdit = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      features: [...plan.features],
      jobPostLimit: plan.jobPostLimit,
      featuredJobLimit: plan.featuredJobLimit,
      applicantAccessLimit: plan.applicantAccessLimit,
      isActive: plan.isActive,
    })
    setFeatureInput('')
    setEditDialogOpen(true)
  }

  const handleDelete = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setDeleteDialogOpen(true)
  }

  const addFeature = () => {
    if (featureInput.trim() && !formData.features?.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()]
      }))
      setFeatureInput('')
    }
  }

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter(f => f !== feature)
    }))
  }

  const handleCreateConfirm = async () => {
    if (!formData.name?.trim()) {
      toast.error('Plan name is required')
      return
    }
    if (!formData.description?.trim()) {
      toast.error('Plan description is required')
      return
    }
    if (!formData.features || formData.features.length === 0) {
      toast.error('At least one feature is required')
      return
    }

    try {
      const response = await adminApi.createSubscriptionPlan(formData as CreateSubscriptionPlanData)
      
      if (response.success && response.data) {
        setPlans(prev => [response.data!, ...prev])
        setTotalPlans(prev => prev + 1)
        toast.success('Subscription plan created successfully')
        setCreateDialogOpen(false)
      } else {
        toast.error(response.message || 'Failed to create subscription plan')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create subscription plan')
    }
  }

  const handleEditConfirm = async () => {
    if (!selectedPlan) return
    
    if (!formData.name?.trim()) {
      toast.error('Plan name is required')
      return
    }
    if (!formData.description?.trim()) {
      toast.error('Plan description is required')
      return
    }
    if (!formData.features || formData.features.length === 0) {
      toast.error('At least one feature is required')
      return
    }

    try {
      const response = await adminApi.updateSubscriptionPlan(selectedPlan.id, formData as UpdateSubscriptionPlanData)
      
      if (response.success && response.data) {
        setPlans(prev => prev.map(plan => 
          plan.id === selectedPlan.id ? response.data! : plan
        ))
        toast.success('Subscription plan updated successfully')
        setEditDialogOpen(false)
        setSelectedPlan(null)
      } else {
        toast.error(response.message || 'Failed to update subscription plan')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update subscription plan')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedPlan) return

    try {
      const response = await adminApi.deleteSubscriptionPlan(selectedPlan.id)
      
      if (response.success) {
        setPlans(prev => prev.filter(plan => plan.id !== selectedPlan.id))
        setTotalPlans(prev => Math.max(0, prev - 1))
        toast.success('Subscription plan deleted successfully')
        setDeleteDialogOpen(false)
        setSelectedPlan(null)
      } else {
        toast.error(response.message || 'Failed to delete subscription plan')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete subscription plan')
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const renderForm = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Plan Name *</label>
        <Input
          value={formData.name || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Basic Plan, Premium Plan"
          className="mt-1"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Description *</label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the subscription plan..."
          className="mt-1"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Price ($) *</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.price || 0}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            className="mt-1"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Duration (days) *</label>
          <Input
            type="number"
            min="1"
            value={formData.duration || 30}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Job Post Limit *</label>
          <Input
            type="number"
            min="0"
            value={formData.jobPostLimit || 0}
            onChange={(e) => setFormData(prev => ({ ...prev, jobPostLimit: parseInt(e.target.value) || 0 }))}
            className="mt-1"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Featured Job Limit *</label>
          <Input
            type="number"
            min="0"
            value={formData.featuredJobLimit || 0}
            onChange={(e) => setFormData(prev => ({ ...prev, featuredJobLimit: parseInt(e.target.value) || 0 }))}
            className="mt-1"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Applicant Access Limit *</label>
          <Input
            type="number"
            min="0"
            value={formData.applicantAccessLimit || 0}
            onChange={(e) => setFormData(prev => ({ ...prev, applicantAccessLimit: parseInt(e.target.value) || 0 }))}
            className="mt-1"
          />
        </div>
      </div>

      {editDialogOpen && (
        <div>
          <label className="text-sm font-medium">Status</label>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={formData.isActive ?? true}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="mr-2"
            />
            <span className="text-sm">Active</span>
          </div>
        </div>
      )}

      <div>
        <label className="text-sm font-medium">Features *</label>
        <div className="flex gap-2 mt-1">
          <Input
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            placeholder="Add a feature..."
          />
          <Button type="button" onClick={addFeature} size="sm">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {(formData.features || []).map((feature, idx) => (
            <Badge key={idx} variant="secondary" className="flex items-center gap-1">
              {feature}
              <button onClick={() => removeFeature(feature)} className="ml-1 hover:text-red-600">
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Subscription Plan Management</h1>
          <Button className="flex items-center space-x-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            <span>Add Plan</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subscription plans..."
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
                  <p className="mt-2 text-sm text-gray-500">Loading subscription plans...</p>
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
                <Button onClick={fetchPlans} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.length === 0 ? (
              <Card className="border-0 shadow-md col-span-full">
                <CardContent className="p-8 text-center text-gray-500">
                  No subscription plans found
                </CardContent>
              </Card>
            ) : (
              plans.map((plan) => (
                <Card key={plan.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {plan.isActive ? (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
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
                    </div>

                    <div className="flex items-baseline gap-1 mb-2">
                      <DollarSign className="h-5 w-5 text-cyan-600" />
                      <span className="text-3xl font-bold text-cyan-600">{plan.price}</span>
                      <span className="text-gray-500 text-sm">/ {plan.duration} days</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{plan.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Job Posts:</span>
                        <span className="font-medium">{plan.jobPostLimit}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Featured Jobs:</span>
                        <span className="font-medium">{plan.featuredJobLimit}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Applicant Access:</span>
                        <span className="font-medium">{plan.applicantAccessLimit}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">Features:</p>
                      <ul className="space-y-1">
                        {plan.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">{feature}</span>
                          </li>
                        ))}
                        {plan.features.length > 3 && (
                          <li className="text-xs text-gray-500 italic">+{plan.features.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, totalPlans)} of {totalPlans} plans
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
          title="Create Subscription Plan"
          description="Add a new subscription plan to the system."
          confirmText="Create"
        >
          {renderForm()}
        </FormDialog>

        <FormDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onConfirm={handleEditConfirm}
          title="Edit Subscription Plan"
          description="Update the subscription plan details."
          confirmText="Update"
        >
          {renderForm()}
        </FormDialog>

        <ConfirmationDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Subscription Plan"
          description={`Are you sure you want to delete "${selectedPlan?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </AdminLayout>
  )
}

export default SubscriptionPlanManagement
