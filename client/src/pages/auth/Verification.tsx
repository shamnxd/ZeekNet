import { useRef, useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { authApi } from '@/api/auth.api'
import { UserRole } from '@/constants/enums'
import { toast } from 'sonner'
import { useAppDispatch } from '@/hooks/useRedux'

import {
  ArrowLeft,
  Briefcase,
  Sparkles,
  Shield,
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { setUser, fetchCompanyProfileThunk } from '@/store/slices/auth.slice'

const useOtpInput = (length: number = 6) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1 || !/^\d*$/.test(value)) return

    const newValues = [...values]
    newValues[index] = value
    setValues(newValues)

    if (value && index < length - 1) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus()
      }, 0)
    }
  }

  const handleInput = (index: number, e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    const value = target.value

    if (value === '' && values[index] !== '') {
      setTimeout(() => {
        inputRefs.current[index]?.focus()
      }, 0)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)

    if (pastedData.length > 0) {
      const newValues = Array(length).fill('')
      for (let i = 0; i < pastedData.length && i < length; i++) {
        newValues[i] = pastedData[i]
      }
      setValues(newValues)

      const nextEmptyIndex = newValues.findIndex((val, idx) => idx >= 0 && val === '')
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1
      setTimeout(() => {
        inputRefs.current[focusIndex]?.focus()
      }, 0)
    }
  }

  const reset = () => setValues(Array(length).fill(''))
  const getOtp = () => values.join('')
  const isComplete = () => values.every(v => v !== '') && values.length === length

  return {
    values,
    inputRefs,
    handleChange,
    handleInput,
    handleKeyDown,
    handlePaste,
    reset,
    getOtp,
    isComplete
  }
}

const useCountdown = (initialSeconds: number = 0) => {
  const [countdown, setCountdown] = useState(initialSeconds)

  const start = (seconds: number) => setCountdown(seconds)
  const reset = () => setCountdown(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return { countdown, start, reset, formatTime }
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response: { status: number } }).response;
    if (response.status === 429) {
      return 'Please wait 30 seconds before requesting another OTP'
    }
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response: { data: { message: string } } }).response;
    if (response.data?.message) {
      return response.data.message
    }
  }
  return fallback
}

const navigateByRole = (role: UserRole, navigate: (path: string) => void) => {
  const routes: Record<UserRole, string> = {
    [UserRole.COMPANY]: '/company/dashboard',
    [UserRole.ADMIN]: '/admin/dashboard',
    [UserRole.SEEKER]: '/seeker/dashboard'
  }
  navigate(routes[role] || '/seeker/dashboard')
}

const Verification = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const email = searchParams.get('email') || ''

  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [otpSent, setOtpSent] = useState(false)
  const [verificationSuccess, setVerificationSuccess] = useState(false)

  const otp = useOtpInput(6)
  const countdown = useCountdown()

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.isComplete()) return

    setIsVerifying(true)
    setError(null)

    try {
      const res = await authApi.verifyOtp(email, otp.getOtp())
      if (res.success && res.data && res.token) {
        // Ensure isVerified is true locally since the backend might return the pre-verification state
        // or the state might not be fully consistent yet.
        const updatedUser = { ...res.data, isVerified: true }

        dispatch(setUser({
          data: updatedUser,
          token: res.token
        }))

        // Fetch company profile if company user
        if (res.data.role === UserRole.COMPANY) {
          dispatch(fetchCompanyProfileThunk()).catch(() => { })
        }

        setVerificationSuccess(true)
        toast.success('Email verified successfully!', {
          description: 'Your account has been verified. Redirecting...',
          duration: 3000,
        })

        // Navigate immediately - token is in Redux state
        navigateByRole(res.data.role, navigate)
      } else {
        const errorMsg = res.message || 'Invalid or expired OTP code'
        setError(errorMsg)
        toast.error('Verification Failed', { description: errorMsg })
      }
    } catch (err) {
      const errorMsg = extractErrorMessage(err, 'Verification failed')
      setError(errorMsg)
      toast.error('Verification Failed', { description: errorMsg })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOTP = async () => {
    if (countdown.countdown > 0) return

    setIsResending(true)
    setError(null)

    try {
      const res = await authApi.requestOtp(email)
      if (res.success) {
        setOtpSent(true)
        toast.success('OTP sent successfully!', {
          description: 'A new verification code has been sent to your email.',
          duration: 3000,
        })
        countdown.start(60)
      } else {
        const errorMsg = res.message || 'Failed to send OTP'
        setError(errorMsg)
        toast.error('Failed to Send OTP', { description: errorMsg })
      }
    } catch (err) {
      const errorMsg = extractErrorMessage(err, 'Failed to send OTP')
      setError(errorMsg)
      toast.error('Failed to Send OTP', { description: errorMsg })

      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response: { status: number } }).response;
        if (response.status === 429) {
          countdown.start(30)
        }
      }
    } finally {
      setIsResending(false)
    }
  }

  const LogoSection = () => (
    <div className="flex items-center space-x-3 mb-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
        <Briefcase className="h-7 w-7 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">ZeekNet</h1>
        <Badge variant="secondary" className="bg-primary/20 text-primary">
          <Sparkles className="mr-1 h-3 w-3" />
          Job Portal
        </Badge>
      </div>
    </div>
  )

  const OtpInputs = () => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Enter verification code</Label>
      <div className="flex space-x-2">
        {otp.values.map((value, index) => (
          <Input
            key={index}
            ref={(el) => { otp.inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value}
            onChange={(e) => otp.handleChange(index, e.target.value)}
            onInput={(e) => otp.handleInput(index, e)}
            onKeyDown={(e) => otp.handleKeyDown(index, e)}
            onPaste={otp.handlePaste}
            className="h-12 w-12 text-center text-lg font-semibold"
            disabled={isVerifying || isResending}
            autoComplete="one-time-code"
          />
        ))}
      </div>
    </div>
  )

  const StatusMessage = ({ type, message }: { type: 'success' | 'error' | 'info', message: string }) => {
    const styles = {
      success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
      error: 'border-destructive/50 bg-destructive/10 text-destructive',
      info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200'
    }

    const icons = {
      success: <CheckCircle className="h-4 w-4" />,
      error: <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />,
      info: <CheckCircle className="h-4 w-4" />
    }

    return (
      <div className={`rounded-lg border p-4 text-sm flex items-start space-x-2 ${styles[type]}`}>
        {icons[type]}
        <span>{message}</span>
      </div>
    )
  }

  const ResendButton = () => (
    <Button
      variant="link"
      onClick={handleResendOTP}
      disabled={countdown.countdown > 0 || isVerifying || isResending}
      className="text-sm"
    >
      {isResending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : countdown.countdown > 0 ? (
        <>
          <Clock className="mr-2 h-4 w-4" />
          Resend in {countdown.formatTime(countdown.countdown)}
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Resend Code
        </>
      )}
    </Button>
  )

  return (
    <div className="min-h-screen flex">
      { }
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Button>
      </div>

      { }
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-12">
          <LogoSection />

          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Verify your email
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We've sent a verification code to your email address. Please check your inbox and enter the code below.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Secure Verification</p>
                  <p className="text-sm text-muted-foreground">Your account security is our priority</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Quick Process</p>
                  <p className="text-sm text-muted-foreground">Get verified in just a few steps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      { }
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          { }
          <div className="lg:hidden text-center">
            <LogoSection />
          </div>

          { }
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
              <CardDescription>
                Please verify your email to continue. A 6-digit verification code has been sent to{' '}
                <span className="font-medium text-foreground">{email}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              { }
              {otpSent && !error && (
                <StatusMessage type="success" message="OTP sent" />
              )}

              {error && (
                <StatusMessage type="error" message={error} />
              )}

              { }
              {verificationSuccess && (
                <StatusMessage type="success" message="Email verified successfully! Redirecting..." />
              )}

              { }
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <OtpInputs />

                <Button
                  type="submit"
                  disabled={isVerifying || isResending || !otp.isComplete()}
                  className="w-full"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Email'
                  )}
                </Button>
              </form>

              { }
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
                <ResendButton />
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Verification