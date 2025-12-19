import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import CompanyLayout from '../../components/layouts/CompanyLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Check, 
  Loader2, 
  CreditCard, 
  Download,
  FileText,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Users,
  Zap,
  ExternalLink,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { companyApi } from '@/api/company.api'
import type { SubscriptionPlan } from '@/interfaces/company/subscription/subscription-plan.interface'
import type { ActiveSubscriptionResponse } from '@/interfaces/company/subscription/active-subscription-response.interface'
import { toast } from 'sonner'
import { PurchaseConfirmationDialog, PurchaseResultDialog } from '@/components/company/dialogs/PurchaseSubscriptionDialog'

const CompanyPlans = () => {
  const [searchParams] = useSearchParams()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'dashboard' | 'plans'>('dashboard')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscriptionResponse | null>(null)
  
  interface BillingHistoryView {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: string;
    invoiceUrl: string;
    invoiceId?: string;
    transactionId?: string;
    hasStripeInvoice: boolean;
  }

  const [billingHistory, setBillingHistory] = useState<BillingHistoryView[]>([])
  
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [purchaseResult, setPurchaseResult] = useState<{
      success: boolean
      message: string
      invoiceId?: string
      transactionId?: string
    } | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [resumeLoading, setResumeLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [changingPlan, setChangingPlan] = useState(false)
  const [isPollingSubscription, setIsPollingSubscription] = useState(false)

  const fetchBillingHistory = useCallback(async () => {
    try {
      const response = await companyApi.getPaymentHistory()
      
      if (response.success && response.data) {
        const formattedHistory: BillingHistoryView[] = response.data.map((payment) => ({
          id: payment.invoiceId || payment.id,
          date: new Date(payment.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          description: `Subscription Plan${payment.billingCycle ? ` (${payment.billingCycle})` : ''}`,
          amount: payment.amount,
          status: payment.status === 'completed' ? 'Completed' : payment.status,
          invoiceUrl: payment.stripeInvoiceUrl || payment.stripeInvoicePdf || '#',
          invoiceId: payment.invoiceId,
          transactionId: payment.transactionId,
          hasStripeInvoice: !!(payment.stripeInvoiceUrl || payment.stripeInvoicePdf)
        }))
        setBillingHistory(formattedHistory)
      }
    } catch {
      console.log('Failed to fetch billing history')
    }
  }, [])

  const fetchPlans = useCallback(async () => {
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
  }, [])

  const fetchActiveSubscription = useCallback(async () => {
    try {
      const response = await companyApi.getActiveSubscription()
      
      if (response.success && response.data) {
        setActiveSubscription(response.data)
        await fetchBillingHistory()
      }
    } catch {
      console.log('No active subscription found')
    }
  }, [fetchBillingHistory])

  useEffect(() => {
    fetchPlans()
    fetchActiveSubscription()
  }, [fetchPlans, fetchActiveSubscription])

  const sessionId = searchParams.get('session_id')
  
  
  useEffect(() => {
    if (sessionId && !isPollingSubscription) {
      
      toast.success('Payment successful! Your subscription is being activated.')
      
      window.history.replaceState({}, '', window.location.pathname)
      
      
      setIsPollingSubscription(true)
      let retries = 0
      const maxRetries = 3 
      let timeoutId: NodeJS.Timeout | null = null
      
      const checkSubscription = async () => {
        try {
          const response = await companyApi.getActiveSubscription()
          
          if (response.success && response.data) {
            
            setActiveSubscription(response.data)
            await fetchBillingHistory()
            setIsPollingSubscription(false)
            toast.success('Subscription activated successfully!')
            if (timeoutId) clearTimeout(timeoutId)
            return
          }
          
          retries++
          if (retries < maxRetries) {
            
            timeoutId = setTimeout(checkSubscription, 2000)
          } else {
            
            setIsPollingSubscription(false)
            toast.info('Subscription is being processed. Please refresh the page in a moment if it doesn\'t appear.')
          }
        } catch {
          retries++
          if (retries < maxRetries) {
            timeoutId = setTimeout(checkSubscription, 2000)
          } else {
            setIsPollingSubscription(false)
            toast.error('Failed to fetch subscription. Please refresh the page.')
          }
        }
      }
      
      
      timeoutId = setTimeout(checkSubscription, 2000)
      
      
      return () => {
        if (timeoutId) clearTimeout(timeoutId)
        setIsPollingSubscription(false)
      }
    }
  }, [sessionId, isPollingSubscription, fetchBillingHistory]) 



  const handleSelectPlan = (plan: SubscriptionPlan) => {
    
    if (plan.isDefault || plan.price === 0) {
      toast.info('Default plan is automatically assigned to your account')
      return
    }
    
    
    setSelectedPlan(plan)
    setShowConfirmDialog(true)
  }

  const handleConfirmPurchase = async () => {
    if (!selectedPlan) return

    
    if (activeSubscription && activeSubscription.stripeSubscriptionId) {
      try {
        setChangingPlan(true)
        const response = await companyApi.changeSubscriptionPlan(
          selectedPlan.id,
          billingCycle === 'annual' ? 'yearly' : billingCycle
        )

        if (response.success && response.data) {
          toast.success('Plan changed successfully! Your subscription has been updated.')
          setShowConfirmDialog(false)
          setSelectedPlan(null)
          await fetchActiveSubscription()
        } else {
          throw new Error(response.message || 'Failed to change plan')
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to change plan'
        toast.error(message)
      } finally {
        setChangingPlan(false)
      }
      return
    }

    
    try {
      setPurchaseLoading(true)
      
      
      const successUrl = `${window.location.origin}/company/billing`
      const cancelUrl = `${window.location.origin}/company/billing`
      
      const response = await companyApi.createCheckoutSession(
        selectedPlan.id,
        billingCycle === 'annual' ? 'yearly' : billingCycle,
        successUrl,
        cancelUrl
      )

      if (response.success && response.data?.sessionUrl) {
        
        window.location.href = response.data.sessionUrl
      } else {
        throw new Error(response.message || 'Failed to create checkout session')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to start checkout'
      setPurchaseResult({
        success: false,
        message,
      })
      setShowConfirmDialog(false)
      setShowResultDialog(true)
      setPurchaseLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    try {
      setCancelLoading(true)
      const response = await companyApi.cancelSubscription()
      
      if (response.success) {
        toast.success('Your subscription will be canceled at the end of the billing period')
        fetchActiveSubscription()
      } else {
        throw new Error(response.message || 'Failed to cancel subscription')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to cancel subscription'
      toast.error(message)
    } finally {
      setCancelLoading(false)
    }
  }

  const handleResumeSubscription = async () => {
    try {
      setResumeLoading(true)
      const response = await companyApi.resumeSubscription()
      
      if (response.success) {
        toast.success('Your subscription has been resumed')
        fetchActiveSubscription()
      } else {
        throw new Error(response.message || 'Failed to resume subscription')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to resume subscription'
      toast.error(message)
    } finally {
      setResumeLoading(false)
    }
  }

  const handleOpenBillingPortal = async () => {
    try {
      setPortalLoading(true)
      const returnUrl = `${window.location.origin}/company/billing`
      const response = await companyApi.getBillingPortalUrl(returnUrl)
      
      if (response.success && response.data?.url) {
        window.location.href = response.data.url
      } else {
        throw new Error(response.message || 'Failed to open billing portal')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to open billing portal'
      toast.error(message)
      setPortalLoading(false)
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

  const currentPlan = activeSubscription ? {
    name: activeSubscription.plan?.name || 'Subscription Plan',
    description: 'Your current active subscription plan.',
    price: 0, 
    startDate: activeSubscription.startDate 
      ? new Date(activeSubscription.startDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      : null,
    expiryDate: activeSubscription.expiryDate 
      ? new Date(activeSubscription.expiryDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      : null,
    isDefault: activeSubscription.plan?.isDefault || false,
    status: activeSubscription.isActive ? 'Active' : 'Expired',
    benefits: [
      `${activeSubscription.plan?.jobPostLimit || 0} Active Jobs`,
      `${activeSubscription.plan?.featuredJobLimit || 0} Featured Jobs`,
      'Priority Support',
      'Advanced Analytics'
    ],
    usage: {
      activeJobs: { 
        used: activeSubscription.activeJobCount || activeSubscription.jobPostsUsed || 0, 
        total: activeSubscription.plan?.jobPostLimit || 0, 
        label: 'Active Jobs' 
      },
      featuredJobs: { 
        used: activeSubscription.featuredJobsUsed || 0, 
        total: activeSubscription.plan?.featuredJobLimit || 0, 
        label: 'Featured Jobs' 
      },
    }
  } : {
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
      activeJobs: { used: 0, total: 1, label: 'Active Jobs' },
      featuredJobs: { used: 0, total: 0, label: 'Featured Jobs' },
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
        {}
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
                      <span className="text-gray-600">{currentPlan.usage.featuredJobs.label}</span>
                      <span className="font-medium text-gray-900">{currentPlan.usage.featuredJobs.used} / {currentPlan.usage.featuredJobs.total}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#4640DE] rounded-full transition-all duration-500" 
                        style={{ width: `${currentPlan.usage.featuredJobs.total > 0 ? (currentPlan.usage.featuredJobs.used / currentPlan.usage.featuredJobs.total) * 100 : 0}%` }}
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

        {}
        <Card className="border border-gray-200 shadow-sm flex flex-col h-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900">Billing Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-base font-semibold text-gray-900">
                    {currentPlan.startDate || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expiry Date</p>
                  <p className="text-base font-semibold text-gray-900">
                    {currentPlan.isDefault || !currentPlan.expiryDate ? 'Lifetime' : currentPlan.expiryDate}
                  </p>
                </div>
                {!activeSubscription && (
                  <p className="text-xs text-gray-400">Free Forever Plan</p>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span>{activeSubscription?.stripeStatus ? 'Stripe Subscription' : 'No payment method'}</span>
                </div>
                {activeSubscription?.stripeStatus === 'past_due' && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-2 rounded">
                    <AlertCircle className="h-4 w-4" />
                    <span>Payment failed - please update your payment method</span>
                  </div>
                )}
                {activeSubscription?.cancelAtPeriodEnd && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
                    <XCircle className="h-4 w-4" />
                    <span>
                      {currentPlan.isDefault || !currentPlan.expiryDate 
                        ? 'Cancels at period end' 
                        : `Cancels on ${currentPlan.expiryDate}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-3">
              {activeSubscription?.stripeStatus && (
                <>
                  <Button 
                    onClick={handleOpenBillingPortal}
                    variant="outline"
                    className="w-full"
                    disabled={portalLoading}
                  >
                    {portalLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ExternalLink className="h-4 w-4 mr-2" />
                    )}
                    Manage Payment Method
                  </Button>
                  
                  {activeSubscription?.cancelAtPeriodEnd ? (
                    <Button 
                      onClick={handleResumeSubscription}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      disabled={resumeLoading}
                    >
                      {resumeLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Resume Subscription
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleCancelSubscription}
                      variant="destructive"
                      className="w-full"
                      disabled={cancelLoading}
                    >
                      {cancelLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Cancel Subscription
                    </Button>
                  )}
                </>
              )}
              
              {!activeSubscription && (
                <>
                  <p className="text-sm text-gray-500">Want more features?</p>
                  <Button 
                    onClick={() => setView('plans')}
                    className="w-full bg-gradient-to-r from-[#4640DE] to-[#7069fa] hover:from-[#3b35b9] hover:to-[#5e56e8] text-white border-0"
                  >
                    Upgrade to Premium
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {}
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
              {billingHistory.length > 0 ? (
                billingHistory.map((invoice) => (
                  <TableRow key={invoice.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <TableCell className="font-medium text-gray-900">#{invoice.id}</TableCell>
                    <TableCell className="text-gray-600">{invoice.date}</TableCell>
                    <TableCell className="text-gray-900 font-semibold">
                      ${invoice.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={invoice.status === 'Completed' ? 'default' : 'secondary'}
                        className={invoice.status === 'Completed' ? '!bg-green-100 !text-green-700' : ''}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.hasStripeInvoice ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-[#4640DE] hover:text-[#3730b8] hover:bg-[#4640DE]/10"
                          onClick={() => window.open(invoice.invoiceUrl, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Invoice
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-b border-gray-50 hover:bg-transparent">
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="h-8 w-8 text-gray-300" />
                      <p className="text-sm text-gray-500 font-medium">No billing history</p>
                      <p className="text-xs text-gray-400">Purchase a plan to see your billing history here.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
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

        {}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {plans.map((plan) => {
          const isPopular = plan.isPopular
          const isCurrentPlan = activeSubscription?.planId === plan.id
          
          return (
            <Card 
              key={plan.id} 
              className={`relative flex flex-col transition-all duration-300 h-full border-2 ${
                isCurrentPlan
                  ? 'border-green-500 shadow-lg ring-2 ring-green-200'
                  : isPopular 
                  ? 'border-[#4640DE] shadow-xl scale-105 z-10' 
                  : 'border-gray-100 hover:border-[#CCCCF5] hover:shadow-lg'
              }`}
            >
              {isCurrentPlan && (
                <div className="bg-green-500 text-white text-center py-1.5 text-xs font-bold uppercase tracking-wider rounded-t-lg absolute w-full -top-8 left-0 h-8 flex items-center justify-center">
                  Current Plan
                </div>
              )}
              {!isCurrentPlan && isPopular && (
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
                  {plan.isDefault ? (
                    <>
                      <span className="text-4xl font-bold text-gray-900">Free</span>
                      <span className="text-gray-500 font-medium">Lifetime</span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900">
                        {billingCycle === 'annual' 
                          ? (plan.yearlyDiscount > 0 
                              ? `${Math.round(plan.price * (1 - plan.yearlyDiscount / 100))}rs`
                              : `${plan.price}rs`)
                          : `${plan.price}rs`
                        }
                      </span>
                      <span className="text-gray-500 font-medium">
                        / month
                      </span>
                    </>
                  )}
                </div>

                {billingCycle === 'annual' && plan.yearlyDiscount > 0 && (
                  <div className="flex items-center gap-2 -mt-3">
                    <span className="text-sm text-gray-400 line-through">
                      {plan.price}rs/month
                    </span>
                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      Save {plan.yearlyDiscount}%
                    </span>
                  </div>
                )}

                <div className="space-y-4 flex-1">
                  {}
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

                  {}
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
                  disabled={changingPlan || plan.isDefault || plan.price === 0}
                >
                  {(() => {
                    if (changingPlan) return 'Changing...'
                    if (activeSubscription?.planId === plan.id) {
                      const currentBillingCycle = activeSubscription.billingCycle === 'yearly' ? 'annual' : 'monthly'
                      return currentBillingCycle === billingCycle
                        ? 'Current Plan'
                        : 'Change Billing'
                    }
                    if (activeSubscription && activeSubscription.stripeSubscriptionId) {
                      return plan.price > (activeSubscription.plan?.price || 0) ? 'Upgrade' : 'Downgrade'
                    }
                    if (plan.isDefault || plan.price === 0) {
                      return 'Default Plan'
                    }
                    return 'Select plan'
                  })()}
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

      {}
      <PurchaseConfirmationDialog
        open={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false)
          setSelectedPlan(null)
        }}
        plan={selectedPlan}
        billingCycle={billingCycle}
        onConfirm={handleConfirmPurchase}
        loading={purchaseLoading || changingPlan}
        isUpgrade={!!(activeSubscription && activeSubscription.stripeSubscriptionId)}
      />

      {}
      <PurchaseResultDialog
        open={showResultDialog}
        onClose={handleCloseResultDialog}
        success={purchaseResult?.success ?? false}
        message={purchaseResult?.message ?? ''}
        invoiceId={purchaseResult?.invoiceId}
        transactionId={purchaseResult?.transactionId}
      />
    </CompanyLayout>
  )
}

export default CompanyPlans
