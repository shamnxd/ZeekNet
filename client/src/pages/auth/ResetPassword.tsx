import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { authApi } from '@/api/auth.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Lock,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  Sparkles
} from 'lucide-react'

const ResetPassword = () => {
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' })
  const [isPasswordReset, setIsPasswordReset] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (passwordError) setPasswordError('')
  }

  const validatePassword = (password: string): string => {
    if (password.length < 6) return 'Password must be at least 6 characters long'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')

    const urlParams = new URLSearchParams(window.location.search)
    const tokenFromUrl = urlParams.get('token')

    if (!tokenFromUrl) {
      setPasswordError('Invalid or missing reset token')
      return
    }

    const passwordValidationError = validatePassword(formData.newPassword)
    if (passwordValidationError) {
      setPasswordError(passwordValidationError)
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    try {
      if (formData.newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters long')
        return
      }

      await authApi.resetPassword(tokenFromUrl, formData.newPassword)
      toast.success('Password Reset Successfully!', {
        description: 'Your password has been updated. You can now log in with your new password.'
      })
      setIsPasswordReset(true)
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } }, message?: string }
      const errorMessage = axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to reset password. Please try again.'
      setPasswordError(errorMessage)
      toast.error('Password Reset Failed', {
        description: errorMessage
      })
    }
  }

  if (isPasswordReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        { }
        <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">

                  <img src="/white.png" alt="ZeekNet Logo" className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-bold text-foreground">ZeekNet</h1>
                <Badge variant="secondary" className="ml-2">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Job Portal
                </Badge>
              </div>
              <Button
                variant="outline"
                onClick={() => (window.location.href = '/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-md">
            <Card className="shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Password Reset Successful</h2>
                    <p className="text-muted-foreground">
                      Your password has been successfully reset. You can now log in with your new password.
                    </p>
                  </div>

                  <Button asChild className="w-full">
                    <Link to="/auth/login">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Go to Login
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      { }
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">

                <img src="/white.png" alt="ZeekNet Logo" className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold text-foreground">ZeekNet</h1>
              <Badge variant="secondary" className="ml-2">
                <Sparkles className="mr-1 h-3 w-3" />
                Job Portal
              </Badge>
            </div>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md">
          {(passwordError) && (
            <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>{passwordError}</span>
            </div>
          )}

          <Card className="shadow-xl">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
              <CardDescription className="text-center">
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      required
                      className="pl-10 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters with uppercase, lowercase, number, and special character
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      required
                      className="pl-10 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Reset Password</span>
                  </div>
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <Button
                    variant="link"
                    asChild
                    className="p-0 h-auto font-semibold"
                  >
                    <Link to="/auth/login">Back to Login</Link>
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default ResetPassword