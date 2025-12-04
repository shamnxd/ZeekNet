import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { registerThunk, googleLoginThunk, clearError, fetchCompanyProfileThunk } from '@/store/slices/auth.slice'
import { UserRole } from '@/constants/enums'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { GoogleLogin } from '@react-oauth/google'
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Briefcase,
  Users,
  Sparkles,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react'

const Register = () => {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.auth)
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.SEEKER as UserRole
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    dispatch(clearError())
    setLocalError(null)
  }, [dispatch])

  const validatePassword = (password: string) => {
    if (password.length < 8) return 'Password must be at least 8 characters long'
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter'
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLocalError(null)
    setPasswordError('')

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      const errorMessage = 'Please fill in all fields'
      setLocalError(errorMessage)
      toast.error('Missing Information', {
        description: 'Please fill in all required fields to create your account.',
        duration: 4000,
      })
      return
    }
    
    const passwordValidation = validatePassword(formData.password)
    if (passwordValidation) {
      setPasswordError(passwordValidation)
      toast.error('Password Requirements', {
        description: passwordValidation,
        duration: 5000,
      })
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      const errorMessage = 'Passwords do not match'
      setPasswordError(errorMessage)
      toast.error('Password Mismatch', {
        description: 'The passwords you entered do not match. Please make sure both passwords are identical.',
        duration: 4000,
      })
      return
    }
    
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    }
    try {
      const res = await dispatch(registerThunk(payload)).unwrap()
      if (res?.success) {
        toast.success('Account Created Successfully!', {
          description: 'Please check your email for verification instructions.',
          duration: 4000,
        })
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`)
      } else {
        const msg = res?.message || 'Registration failed. Please try again.'
        setLocalError(msg)
        toast.error('Registration Failed', { description: msg })
      }
    } catch (err) {
      const msg = typeof err === 'string' ? err : 'Registration failed'
      setLocalError(msg)
      toast.error('Registration Failed', { description: msg })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

    if (localError || error) {
      setLocalError(null)
      clearError()
    }
    if (passwordError) {
      setPasswordError('')
    }
  }

  const handleRoleToggle = (isCompany: boolean) => {
    setFormData({
      ...formData,
      role: isCompany ? UserRole.COMPANY : UserRole.SEEKER
    })
  }

  const handleGoogleLogin = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      toast.error('Google Registration Failed', { description: 'No credential received from Google' });
      return;
    }

    try {
      const res = await dispatch(googleLoginThunk({ idToken: credentialResponse.credential })).unwrap()
      if (res?.success) {
        // Fetch company profile if company user
        if (res.data?.role === UserRole.COMPANY) {
          dispatch(fetchCompanyProfileThunk()).catch(() => {
            // Silently fail - will default to 'not_created'
          })
        }

        toast.success('Welcome!', { description: 'Account created successfully with Google.' })
        const r = res.data?.role
        if (r === UserRole.ADMIN) navigate('/admin/dashboard')
        else if (r === UserRole.COMPANY) navigate('/company/dashboard')
        else navigate('/seeker/dashboard')
      } else {
        const msg = res?.message || 'Google registration failed. Please try again.'
        toast.error('Google Registration Failed', { description: msg })
      }
    } catch (err) {
      const msg = typeof err === 'string' ? err : 'Google registration failed'
      toast.error('Google Registration Failed', { description: msg })
    }
  }

  const handleGoogleError = () => {
    toast.error('Google Registration Failed', { description: 'Failed to authenticate with Google. Please try again.' })
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen flex">
      <div className="fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')} 
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Button>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
        
        {}
        <div className="relative z-10 flex flex-col justify-center px-12 py-12">
          {}
          <div className="flex items-center space-x-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
              
              <img src="/white.png" alt="ZeekNet Logo" className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">ZeekNet</h1>
              <Badge variant="secondary" className="bg-primary/20 text-foreground">
                <Sparkles className="mr-1 h-3 w-3" />
                Job Portal
              </Badge>
            </div>
          </div>

          {}
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Start your career journey today
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of professionals and companies who trust ZeekNet for their job search and hiring needs.
            </p>

            {}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Smart Matching</p>
                  <p className="text-sm text-muted-foreground">AI-powered job recommendations</p>
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
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Quick Setup</p>
                  <p className="text-sm text-muted-foreground">Get started in minutes</p>
                </div>
              </div>
            </div>

            {}
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
                <Briefcase className="h-6 w-6 text-primary-foreground" />
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
              <h2 className="text-3xl font-bold text-foreground">Create your account</h2>
              <p className="text-muted-foreground mt-2">
                Join ZeekNet and start your career journey today
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={formData.role === UserRole.SEEKER ? "default" : "outline"}
                  onClick={() => handleRoleToggle(false)}
                  disabled={loading}
                  className="flex-1 flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Job Seeker</span>
                </Button>
                <Button
                  type="button"
                  variant={formData.role === UserRole.COMPANY ? "default" : "outline"}
                  onClick={() => handleRoleToggle(true)}
                  disabled={loading}
                  className="flex-1 flex items-center space-x-2"
                >
                  <Building2 className="h-4 w-4" />
                  <span>Company</span>
                </Button>
              </div>
            </div>

            {displayError && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{displayError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {formData.role === UserRole.COMPANY ? 'Company Name' : 'Full Name'}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="pl-10"
                    placeholder={formData.role === UserRole.COMPANY ? 'Enter company name' : 'Enter your full name'}
                  />
                </div>
              </div>

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
                    placeholder="Create a password"
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
                {passwordError && (
                  <p className="text-sm text-destructive flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="pl-10 pr-10"
                    placeholder="Confirm your password"
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
              
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
            
            <Separator className="my-6" />
            
            {}
            {formData.role === UserRole.SEEKER && (
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
            )}
            
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Already have an account? 
                <Button 
                  variant="link" 
                  onClick={() => navigate('/auth/login')} 
                  disabled={loading}
                  className="p-0 h-auto font-semibold"
                >
                  Sign in here
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register