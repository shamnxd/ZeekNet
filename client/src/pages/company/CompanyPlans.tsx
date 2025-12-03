import { useState, useEffect } from 'react'
import CompanyLayout from '../../components/layouts/CompanyLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Check, 
  Loader2, 
  CreditCard, 
  Download,
  FileText,
  ArrowRight,
  ArrowLeft,
  XCircle,
  Edit,
  AlertCircle,
  Briefcase,
  Eye,
  Users,
  Zap
} from 'lucide-react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { companyApi, type SubscriptionPlan } from '@/api/company.api'
import { toast } from 'sonner'
import { PurchaseConfirmationDialog, PurchaseResultDialog } from '@/components/company/dialogs/PurchaseSubscriptionDialog'

const CompanyPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'dashboard' | 'plans'>('dashboard')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  
  // Purchase flow states
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [purchaseResult, setPurchaseResult] = useState<{
    success: boolean
    message: string
    transactionId?: string
  } | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await companyApi.getSubscriptionPlans()
      
      if (response.success && response.data?.plans) {
        const activePlans = response.data.plans.filter(plan => plan.isActive)
        setPlans(activePlans)
      } else {
        toast.error(response.message || 'Failed to load subscription plans')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load subscription plans'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setShowConfirmDialog(true)
  }

  const handleConfirmPurchase = async () => {
    if (!selectedPlan) return

    try {
      setPurchaseLoading(true)
      const response = await companyApi.purchaseSubscription(selectedPlan.id)

      if (response.success && response.data) {
        setPurchaseResult({
          success: true,
          message: 'Your subscription has been activated successfully!',
          transactionId: response.data.paymentOrder.transactionId,
        })
        setShowConfirmDialog(false)
        setShowResultDialog(true)
        
        // Refresh plans or redirect
        setTimeout(() => {
          setView('dashboard')
          fetchPlans()
        }, 2000)
      } else {
        throw new Error(response.message || 'Purchase failed')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to purchase subscription'
      setPurchaseResult({
        success: false,
        message,
      })
      setShowConfirmDialog(false)
      setShowResultDialog(true)
    } finally {
      setPurchaseLoading(false)
    }
  }

  const handleCloseResultDialog = () => {
    setShowResultDialog(false)
    setPurchaseResult(null)
    setSelectedPlan(null)
  }

  if (loading) {
    return (
      <CompanyLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-[#4640DE] mx-auto" />
            <p className="text-muted-foreground font-medium">Loading subscription plans...</p>
          </div>
        </div>
      </CompanyLayout>
    )
  }

  // Static Data for Free Plan Dashboard
  const currentPlan = {
    name: 'Free Plan',
    description: 'Perfect for getting started with your first hire.',
    price: 0,
    startDate: 'Nov 28, 2025',
    status: 'Active',
    benefits: [
      '1 Active Job Posting',
      'Basic Job Visibility',
      '5 Days Resume Visibility',
      'Standard Email Support'
    ],
    usage: {
      activeJobs: { used: 1, total: 1, label: 'Active Jobs' },
      resumeViews: { used: 2, total: 5, label: 'Resume Views' },
    }
  }

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in-50 duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plans & Billing</h1>
          <p className="text-gray-500 mt-1">Manage your subscription and billing details.</p>
        </div>
        <Button 
          onClick={() => setView('plans')}
          className="bg-[#4640DE] hover:bg-[#3b35b9] text-white shadow-md transition-all hover:scale-105"
        >
          Upgrade Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Current Plan Card - Spans 2 columns on large screens */}
        <Card className="lg:col-span-2 border border-gray-200 shadow-sm flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Current Subscription</p>
                <CardTitle className="text-3xl font-bold text-gray-900">{currentPlan.name}</CardTitle>
              </div>
              <Badge variant="secondary" className="!bg-green-100 !text-green-700 !hover:bg-green-100 px-3 py-1">
                {currentPlan.status}
              </Badge>
            </div>
            <CardDescription className="text-base mt-2">
              {currentPlan.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[#4640DE]" />
                  Plan Usage
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{currentPlan.usage.activeJobs.label}</span>
                      <span className="font-medium text-gray-900">{currentPlan.usage.activeJobs.used} / {currentPlan.usage.activeJobs.total}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#4640DE] rounded-full transition-all duration-500" 
                        style={{ width: `${(currentPlan.usage.activeJobs.used / currentPlan.usage.activeJobs.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{currentPlan.usage.resumeViews.label}</span>
                      <span className="font-medium text-gray-900">{currentPlan.usage.resumeViews.used} / {currentPlan.usage.resumeViews.total}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#4640DE] rounded-full transition-all duration-500" 
                        style={{ width: `${(currentPlan.usage.resumeViews.used / currentPlan.usage.resumeViews.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#4640DE]" />
                  Included Benefits
                </h4>
                <ul className="space-y-3">
                  {currentPlan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="mt-1 min-w-[6px] min-h-[6px] rounded-full bg-[#4640DE]" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Summary / Upgrade Card */}
        <Card className="border border-gray-200 shadow-sm flex flex-col h-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900">Billing Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-1">
                <p className="text-sm text-gray-500">Next Invoice</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">$0.00</span>
                </div>
                <p className="text-xs text-gray-400">Free Forever Plan</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span>No payment method added</span>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs h-8">
                  Add Payment Method
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-3">Want more features?</p>
              <Button 
                onClick={() => setView('plans')}
                className="w-full bg-gradient-to-r from-[#4640DE] to-[#7069fa] hover:from-[#3b35b9] hover:to-[#5e56e8] text-white border-0"
              >
                Upgrade to Premium
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice History */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 border-none">
                <TableHead className="font-semibold text-xs text-gray-600 uppercase">Invoice ID</TableHead>
                <TableHead className="font-semibold text-xs text-gray-600 uppercase">Date</TableHead>
                <TableHead className="font-semibold text-xs text-gray-600 uppercase">Amount</TableHead>
                <TableHead className="font-semibold text-xs text-gray-600 uppercase">Status</TableHead>
                <TableHead className="text-right font-semibold text-xs text-gray-600 uppercase">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b border-gray-50 hover:bg-transparent">
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="h-8 w-8 text-gray-300" />
                    <p className="text-sm text-gray-500 font-medium">No invoices found</p>
                    <p className="text-xs text-gray-400">You are currently on a free plan.</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderPlans = () => (
    <div className="space-y-12 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => setView('dashboard')}
          className="absolute left-4 top-4 md:left-8 md:top-8 text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-4xl font-bold text-gray-900">Plans & Pricing</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Choose the plan that fits your needs. All plans include essential features to get you started, with options to scale as you grow. No hidden fees and the flexibility to change anytime.
        </p>

        {/* Monthly/Annual Toggle */}
        <div className="flex justify-center pt-4">
          <div className="bg-gray-100 p-1 rounded-full flex items-center">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                billingCycle === 'monthly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                billingCycle === 'annual' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Annual
            </button>
          </div>
        </div>
        {billingCycle === 'annual' && (
          <p className="text-sm text-[#4640DE] font-medium">-15% off on annual payments</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {plans.map((plan) => {
          const isPopular = plan.name.toLowerCase().includes('standard') || plan.name.toLowerCase().includes('popular')
          
          return (
            <Card 
              key={plan.id} 
              className={`relative flex flex-col transition-all duration-300 h-full border-2 ${
                isPopular 
                  ? 'border-[#4640DE] shadow-xl scale-105 z-10' 
                  : 'border-gray-100 hover:border-[#CCCCF5] hover:shadow-lg'
              }`}
            >
              {isPopular && (
                <div className="bg-[#4640DE] !mt-4 text-white text-center py-1.5 text-xs font-bold uppercase tracking-wider rounded-t-lg absolute w-full -top-8 left-0 h-8 flex items-center justify-center">
                  Most Popular Plan
                </div>
              )}
              
              <CardHeader className="pb-4  !mt-4">
                <CardTitle className="text-xl font-bold text-gray-900">{plan.name}</CardTitle>
                <CardDescription className="text-gray-500">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col gap-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}rs
                  </span>
                  <span className="text-gray-500 font-medium">
                    / {plan.duration} Days
                  </span>
                </div>

                <div className="space-y-4 flex-1">
                  {/* Plan Limits Section */}
                  <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Briefcase className="h-4 w-4 text-[#4640DE]" />
                      <span className="font-medium">{plan.jobPostLimit} Active Job Posts</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Zap className="h-4 w-4 text-[#4640DE]" />
                      <span className="font-medium">{plan.featuredJobLimit} Featured Jobs</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Users className="h-4 w-4 text-[#4640DE]" />
                      <span className="font-medium">{plan.applicantAccessLimit} Applicant Access</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-1 bg-[#4640DE] rounded-full p-0.5">
                           <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-600 leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-base font-bold shadow-sm mt-4"
                  variant={isPopular ? 'company' : 'companyOutline'}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {plan.price === 0 ? 'Try for free' : 'Select plan'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  return (
    <CompanyLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {view === 'dashboard' ? renderDashboard() : renderPlans()}
      </div>

      {/* Purchase Confirmation Dialog */}
      <PurchaseConfirmationDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        plan={selectedPlan}
        onConfirm={handleConfirmPurchase}
        loading={purchaseLoading}
      />

      {/* Purchase Result Dialog */}
      <PurchaseResultDialog
        open={showResultDialog}
        onClose={handleCloseResultDialog}
        success={purchaseResult?.success ?? false}
        message={purchaseResult?.message ?? ''}
        transactionId={purchaseResult?.transactionId}
      />
    </CompanyLayout>
  )
}

export default CompanyPlans
