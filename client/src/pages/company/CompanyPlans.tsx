import { useState, useEffect } from 'react'
import CompanyLayout from '../../components/layouts/CompanyLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  Check, 
  Loader2, 
  CreditCard, 
  Receipt, 
  ShieldCheck, 
  Download,
  FileText,
  Sparkles
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

const CompanyPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('plans')

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

  const handleSelectPlan = (planId: string) => {
    toast.info('Payment integration coming soon!')
    console.log('Selected plan:', planId)
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

  return (
    <CompanyLayout>
      <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center space-y-3 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Plans & Billing
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Transparent pricing for companies of all sizes.
          </p>
        </div>

        <Tabs value={activeTab} className="space-y-8" onValueChange={setActiveTab}>
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-gray-100/80 rounded-xl">
              <TabsTrigger 
                value="plans" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#4640DE] data-[state=active]:shadow-sm font-medium transition-all"
              >
                Available Plans
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#4640DE] data-[state=active]:shadow-sm font-medium transition-all"
              >
                Billing History
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="plans" className="space-y-12 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            {plans.length === 0 ? (
              <Card className="border-dashed border-2 bg-gray-50/50">
                <CardContent className="p-16 text-center space-y-6">
                  <div className="w-16 h-16 bg-[#CCCCF5]/30 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="h-8 w-8 text-[#4640DE]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-xl text-gray-900">No Plans Available</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      We're currently updating our subscription plans. Please check back later.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                {plans.map((plan) => {
                  const isPopular = plan.price > 0 && plan.price < 100
                  
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
                        <div className="absolute -top-4 left-0 right-0 flex justify-center">
                          <Badge className="bg-[#4640DE] hover:bg-[#4640DE]/90 text-white px-4 py-1 text-sm font-semibold shadow-md border-0">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      
                      <CardHeader className={`text-center pb-8 pt-10 ${isPopular ? 'pt-12' : ''}`}>
                        <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                        <CardDescription className="min-h-[3rem] flex items-center justify-center text-base mt-2 text-gray-500">
                          {plan.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex-1 space-y-8">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-5xl font-bold tracking-tight text-gray-900">
                            ${plan.price}
                          </span>
                          <span className="text-gray-500 font-medium text-lg">
                            / {plan.duration} days
                          </span>
                        </div>

                        <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 font-medium">Job Postings</span>
                            <span className="font-bold text-gray-900">{plan.jobPostLimit}</span>
                          </div>
                          <Separator className="bg-gray-200" />
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 font-medium">Featured Jobs</span>
                            <span className="font-bold text-gray-900">{plan.featuredJobLimit}</span>
                          </div>
                          <Separator className="bg-gray-200" />
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 font-medium">Applicant Access</span>
                            <span className="font-bold text-gray-900">{plan.applicantAccessLimit}</span>
                          </div>
                        </div>

                        <div className="space-y-4 px-2">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                            Features
                          </p>
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="mt-0.5 bg-[#CCCCF5]/30 p-1 rounded-full">
                                <Check className="h-3.5 w-3.5 text-[#4640DE]" />
                              </div>
                              <span className="text-sm text-gray-600 leading-tight">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>

                      <CardFooter className="pt-4 pb-8 px-6">
                        <Button
                          className="w-full h-12 text-base font-bold shadow-sm"
                          variant={isPopular ? 'company' : 'companyOutline'}
                          onClick={() => handleSelectPlan(plan.id)}
                        >
                          {plan.price === 0 ? 'Get Started Free' : 'Subscribe Now'}
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Trust Badges */}
            <div className="mt-16 pt-12 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                  <p className="text-sm text-gray-500">
                    Encrypted and secure transactions
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">No Hidden Fees</h3>
                  <p className="text-sm text-gray-500">
                    What you see is what you pay
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <Receipt className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Cancel Anytime</h3>
                  <p className="text-sm text-gray-500">
                    Flexible plans for your needs
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <Card className="border border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">Billing History</CardTitle>
                    <CardDescription className="text-gray-500">View and download your past invoices.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 border-gray-200 text-gray-600 hover:text-[#4640DE] hover:border-[#4640DE] hover:bg-[#CCCCF5]/10">
                    <Download className="h-4 w-4" />
                    Export All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-gray-100">
                      <TableHead className="w-[120px] font-semibold text-gray-600">Invoice</TableHead>
                      <TableHead className="font-semibold text-gray-600">Status</TableHead>
                      <TableHead className="font-semibold text-gray-600">Amount</TableHead>
                      <TableHead className="font-semibold text-gray-600">Plan</TableHead>
                      <TableHead className="font-semibold text-gray-600">Date</TableHead>
                      <TableHead className="text-right font-semibold text-gray-600">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Empty State Row */}
                    <TableRow className="hover:bg-transparent border-0">
                      <TableCell colSpan={6} className="h-[300px] text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-semibold text-lg text-gray-900">No Invoices Found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                              You haven't made any payments yet.
                            </p>
                          </div>
                          <Button 
                            variant="company" 
                            onClick={() => setActiveTab('plans')}
                            className="mt-4"
                          >
                            View Plans
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CompanyLayout>
  )
}

export default CompanyPlans

