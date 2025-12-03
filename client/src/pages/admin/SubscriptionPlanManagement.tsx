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
  IndianRupee,
  
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
    yearlyDiscount: 0,
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
      yearlyDiscount: 0,
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
      yearlyDiscount: plan.yearlyDiscount || 0,
      isActive: plan.isActive,
      isPopular: plan.isPopular,
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
        toast.success('Subscription plan created successfully')
        setCreateDialogOpen(false)
        await fetchPlans()
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
        toast.success('Subscription plan updated successfully')
        setEditDialogOpen(false)
        setSelectedPlan(null)
        await fetchPlans()
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
    <div className="max-h-[calc(90vh-200px)] overflow-y-auto pr-2">
      <div className="space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <div className="pb-2 border-b">
            <h3 className="text-base font-semibold text-gray-900">Basic Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Plan Name *</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Basic Plan, Premium Plan"
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the subscription plan..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="space-y-4">
          <div className="pb-2 border-b">
            <h3 className="text-base font-semibold text-gray-900">Pricing</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Price (₹) *</label>
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

            <div>
              <label className="text-sm font-medium">Yearly Discount (%) *</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.yearlyDiscount || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, yearlyDiscount: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) }))}
                className="mt-1"
                placeholder="0-100"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Annual Price: (Monthly × 12) × (1 - Discount/100)</p>
        </div>

        {/* Plan Limits Section */}
        <div className="space-y-4">
          <div className="pb-2 border-b">
            <h3 className="text-base font-semibold text-gray-900">Plan Limits</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="text-sm font-medium">Applicant Limit *</label>
              <Input
                type="number"
                min="0"
                value={formData.applicantAccessLimit || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, applicantAccessLimit: parseInt(e.target.value) || 0 }))}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-4">
          <div className="pb-2 border-b">
            <h3 className="text-base font-semibold text-gray-900">Features</h3>
          </div>
          
          <div>
            <label className="text-sm font-medium">Add Features *</label>
            <div className="flex gap-2 mt-1">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                placeholder="Type a feature and press Add..."
              />
              <Button type="button" onClick={addFeature} size="sm" className="whitespace-nowrap">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {(formData.features || []).map((feature, idx) => (
                <Badge key={idx} variant="default" className="flex items-center gap-1 py-1 px-1 text-white">
                  <span>{feature}</span>
                  <button 
                    onClick={() => removeFeature(feature)} 
                    className="ml-1 hover:text-red-600 font-bold text-base"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            {(!formData.features || formData.features.length === 0) && (
              <p className="text-xs text-muted-foreground mt-2">No features added yet. Add at least one feature.</p>
            )}
          </div>
        </div>

        {/* Settings Section */}
        <div className="space-y-4">
          <div className="pb-2 border-b">
            <h3 className="text-base font-semibold text-gray-900">Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <input
                type="checkbox"
                id="isPopular"
                checked={Boolean((formData as any)?.isPopular ?? false)}
                onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                className="h-4 w-4"
              />
              <label htmlFor="isPopular" className="text-sm font-medium cursor-pointer">
                Mark as Popular Plan
              </label>
            </div>

            {editDialogOpen && (
              <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={Boolean(((formData as any)?.isActive) ?? true)}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4"
                />
                <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                  Active Plan
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Subscription Plans</h1>
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
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 font-medium text-muted-foreground">Plan Name</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Price</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Discount</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Job Posts</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Features</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-500">
                          No subscription plans found
                        </td>
                      </tr>
                    ) : (
                      plans.map((plan) => (
                        <tr key={plan.id} className="border-b border-border/50 hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div>
                                <p className="font-medium text-gray-800">{plan.name}</p>
                                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                              </div>
                              {plan.isPopular && (
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 whitespace-nowrap">
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-1">
                              <IndianRupee className="h-4 w-4 text-gray-600" />
                              <span className="font-semibold text-gray-800">{plan.price === 0 ? '0' : plan.price.toLocaleString()}</span>
                              <span className="text-xs text-gray-500">/ {plan.duration} days</span>
                            </div>
                          </td>
                          <td className="p-4">
                            {plan.yearlyDiscount > 0 ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {plan.yearlyDiscount}% off
                              </Badge>
                            ) : (
                              <span className="text-sm text-gray-500">No discount</span>
                            )}
                          </td>
                          <td className="p-4 text-sm text-gray-700">
                            {plan.jobPostLimit}
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
          maxWidth="5xl"
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
          maxWidth="5xl"
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
