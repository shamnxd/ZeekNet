import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, XCircle, Loader2, CreditCard, Calendar, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PurchaseConfirmationDialogProps {
  open: boolean
  onClose: () => void
  plan: {
    id: string
    name: string
    price: number
    yearlyDiscount: number
    duration: number
    features: string[]
  } | null
  billingCycle: 'monthly' | 'annual'
  onConfirm: () => Promise<void>
  loading: boolean
  isUpgrade?: boolean
}

export function PurchaseConfirmationDialog({
  open,
  onClose,
  plan,
  billingCycle,
  onConfirm,
  loading,
  isUpgrade = false,
}: PurchaseConfirmationDialogProps) {
  if (!plan) return null

  const isAnnual = billingCycle === 'annual'
  const monthlyPrice = plan.price
  const yearlyPrice = Math.round((monthlyPrice * 12) * (1 - plan.yearlyDiscount / 100))
  const totalPrice = isAnnual ? yearlyPrice : monthlyPrice
  const originalYearlyPrice = monthlyPrice * 12
  const duration = isAnnual ? 365 : plan.duration

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#4640DE]" />
            {isUpgrade ? 'Change Subscription Plan' : 'Confirm Subscription Purchase'}
          </DialogTitle>
          <DialogDescription>
            {isUpgrade 
              ? 'Your subscription will be updated immediately with prorated billing.'
              : 'Review your subscription details before confirming'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Plan Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <Badge variant={isAnnual ? "default" : "secondary"} className="mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {isAnnual ? 'Annual' : 'Monthly'} - {duration} Days
                </Badge>
              </div>
              <div className="text-right">
                {isAnnual && plan.yearlyDiscount > 0 && (
                  <div className="text-xs text-muted-foreground line-through mb-1">
                    ${originalYearlyPrice}
                  </div>
                )}
                <div className="text-2xl font-bold text-[#4640DE]">
                  ${totalPrice}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isAnnual ? (
                    <>
                      <span className="font-medium">${(totalPrice / 12).toFixed(2)}/month</span>
                      {plan.yearlyDiscount > 0 && (
                        <Badge variant="default" className="ml-2 bg-green-600">
                          Save {plan.yearlyDiscount}%
                        </Badge>
                      )}
                    </>
                  ) : (
                    'Monthly billing'
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-3 mt-3">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Zap className="h-4 w-4 text-yellow-500" />
                Features Included:
              </h4>
              <ul className="space-y-1">
                {plan.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="text-sm flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Demo Payment Mode
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  This is a dummy payment. Your subscription will be activated immediately without actual payment processing.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="bg-[#4640DE] hover:bg-[#3730b8]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {isUpgrade ? 'Change Plan' : 'Confirm Purchase'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface PurchaseResultDialogProps {
  open: boolean
  onClose: () => void
  success: boolean
  message: string
  invoiceId?: string
  transactionId?: string
}

export function PurchaseResultDialog({
  open,
  onClose,
  success,
  message,
  invoiceId,
  transactionId,
}: PurchaseResultDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex flex-col items-center text-center space-y-3">
            {success ? (
              <>
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <DialogTitle className="text-xl">
                  Payment Successful!
                </DialogTitle>
                <DialogDescription className="text-base">
                  {message}
                </DialogDescription>
              </>
            ) : (
              <>
                <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <DialogTitle className="text-xl">
                  Payment Failed
                </DialogTitle>
                <DialogDescription className="text-base">
                  {message}
                </DialogDescription>
              </>
            )}
          </div>
        </DialogHeader>

        {success && (invoiceId || transactionId) && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-2 space-y-2">
            {invoiceId && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Invoice ID:</span>
                <code className="font-mono text-sm bg-white dark:bg-gray-900 px-3 py-1.5 rounded font-semibold">
                  {invoiceId}
                </code>
              </div>
            )}
            {transactionId && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Transaction ID:</span>
                <code className="font-mono text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded">
                  {transactionId}
                </code>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={onClose}
            className={success ? "bg-[#4640DE] hover:bg-[#3730b8] w-full" : "w-full"}
          >
            {success ? 'Continue' : 'Try Again'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
