import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { loginThunk, googleLoginThunk, clearError } from '@/store/slices/auth.slice'
import { UserRole } from '@/constants/enums'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { GoogleLogin } from '@react-oauth/google'
import { 
  Mail, 
  Lock, 
  Building2, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Users,
  CheckCircle,
  TrendingUp,
  Target,
  AlertCircle,
  Sparkles
} from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { loading, error, role } = useAppSelector((s) => s.auth)

  const from = (location.state as { from?: string })?.from || null

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await dispatch(loginThunk({ email: formData.email, password: formData.password })).unwrap()
      if (res?.success) {
        if (res.data && res.data.isBlocked) {
          toast.error('Account Blocked', { 
            description: 'Your account has been blocked. Please contact support for assistance.',
            duration: 5000,
          })
          return
        }
        if (res.data && !res.data.isVerified) {
          toast.info('Verification Required', { 
            description: 'Please verify your email to continue. A verification code has been sent to your email.',
            duration: 5000,
          })
          navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`)
        } else {
          toast.success('Welcome back!', { description: 'Logged in successfully.' })
          const userRole = res.data?.role || role

          if (from && userRole === UserRole.SEEKER) {
            navigate(from, { replace: true })
          } else if (userRole === UserRole.ADMIN) {
            navigate('/admin/dashboard')
          } else if (userRole === UserRole.COMPANY) {
            navigate('/company/dashboard')
          } else {
            navigate('/seeker/dashboard')
          }
        }
      } else {
        const msg = res?.message || 'Login failed. Please try again.'
        toast.error('Login Failed', { description: msg })
      }
    } catch (err) {
      const msg = typeof err === 'string' ? err : 'Login failed'
      toast.error('Login Failed', { description: msg })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleGoogleLogin = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      toast.error('Google Login Failed', { description: 'No credential received from Google' });
      return;
    }

    try {
      const res = await dispatch(googleLoginThunk({ idToken: credentialResponse.credential })).unwrap()
      if (res?.success) {
        if (res.data && res.data.isBlocked) {
          toast.error('Account Blocked', { 
            description: 'Your account has been blocked. Please contact support for assistance.',
            duration: 5000,
          })
          return
        }
        if (res.data && !res.data.isVerified) {
          toast.info('Verification Required', { 
            description: 'Please verify your email to continue. A verification code has been sent to your email.',
            duration: 5000,
          })
          navigate(`/verify-email?email=${encodeURIComponent(res.data.email || '')}`)
          return
        }
        toast.success('Welcome back!', { description: 'Logged in successfully with Google.' })
        const userRole = res.data?.role || role
        if (from && userRole === UserRole.SEEKER) {
          navigate(from, { replace: true })
        } else if (userRole === UserRole.ADMIN) {
          navigate('/admin/dashboard')
        } else if (userRole === UserRole.COMPANY) {
          navigate('/company/dashboard')
        } else {
          navigate('/seeker/dashboard')
        }
      } else {
        const msg = res?.message || 'Google login failed. Please try again.'
        toast.error('Google Login Failed', { description: msg })
      }
    } catch (err) {
      const msg = typeof err === 'string' ? err : 'Google login failed'
      toast.error('Google Login Failed', { description: msg })
    }
  }

  const handleGoogleError = () => {
    toast.error('Google Login Failed', { description: 'Failed to authenticate with Google. Please try again.' })
  }

  const displayError: string | null = error

  return (
    <div className="min-h-screen flex">
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

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 py-12">
          <div className="flex items-center space-x-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
              
              <img src="/white.png" alt="ZeekNet Logo" className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">ZeekNet</h1>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                <Sparkles className="mr-1 h-3 w-3" />
                Job Portal
              </Badge>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Welcome back to your career journey
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Sign in to access your personalized job search experience, track applications, and connect with opportunities that match your skills.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Smart Job Matching</p>
                  <p className="text-sm text-muted-foreground">AI-powered recommendations</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Track Progress</p>
                  <p className="text-sm text-muted-foreground">Monitor applications & interviews</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Connect</p>
                  <p className="text-sm text-muted-foreground">Network with companies & peers</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border/50">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>10K+ Users</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Building2 className="h-4 w-4" />
                  <span>500+ Companies</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>95% Success Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                
                <img src="/white.png" alt="ZeekNet Logo" className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ZeekNet</h1>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Job Portal
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
              <p className="text-muted-foreground mt-2">
                Sign in to your account to continue your job search journey
              </p>
            </div>

            {displayError && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{displayError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
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
                <div className="text-right">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
            
            <Separator className="my-6" />
            
            <div className="text-center space-y-4">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={handleGoogleError}
                useOneTap={false}
                width="100%"
                text="continue_with"
                shape="rectangular"
                theme="outline"
                size="large"
              />
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Don't have an account? 
                <Link to="/auth/register" className="text-primary font-semibold hover:underline">Create one here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login