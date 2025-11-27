import { useState, useEffect } from 'react'
import CompanyLayout from '../../components/layouts/CompanyLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2 } from 'lucide-react'
import { companyApi, type SubscriptionPlan } from '@/api/company.api'
import { toast } from 'sonner'

const CompanyPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)

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
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading subscription plans...</p>
          </div>
        </div>
      </CompanyLayout>
    )
  }

  return (
    <CompanyLayout>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your hiring needs. Upgrade or downgrade anytime.
          </p>
        </div>

        {plans.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No subscription plans available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => {
              const isPopular = plan.price > 0 && plan.price < 100
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative border-2 shadow-lg hover:shadow-xl transition-all ${
                    isPopular 
                      ? 'border-cyan-500 scale-105' 
                      : 'border-gray-200 hover:border-cyan-300'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-cyan-600 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center space-y-4 pb-8 pt-8">
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-500">/ {plan.duration} days</span>
                      </div>
                      {plan.price === 0 && (
                        <p className="text-sm text-green-600 font-medium">Forever free</p>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm min-h-[3rem]">{plan.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-3 border-t border-b border-gray-200 py-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Job Postings</span>
                        <span className="font-semibold text-gray-900">{plan.jobPostLimit}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Featured Jobs</span>
                        <span className="font-semibold text-gray-900">{plan.featuredJobLimit}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Applicant Access</span>
                        <span className="font-semibold text-gray-900">{plan.applicantAccessLimit}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className={`w-full py-6 text-base font-semibold ${
                        isPopular
                          ? 'bg-cyan-600 hover:bg-cyan-700'
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      {plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <div className="text-center text-sm text-gray-500 max-w-3xl mx-auto pt-8 border-t border-gray-200">
          <p>All plans include basic features and email support. Cancel anytime with no penalties.</p>
          <p className="mt-2">Need a custom plan? <a href="#" className="text-cyan-600 hover:underline">Contact our sales team</a></p>
        </div>
      </div>
    </CompanyLayout>
  )
}

export default CompanyPlans

