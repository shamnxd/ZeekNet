import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { companyApi, type CompanyProfileData } from '@/api/company.api'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAppDispatch } from '@/hooks/useRedux'
import { fetchCompanyProfileThunk } from '@/store/slices/auth.slice'
import { 
  Building2, 
  Mail, 
  Globe, 
  Users, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle, 
  FileText,
  Upload,
  Target,
  TrendingUp,
  Zap,
  Loader2,
  AlertCircle,
  Sparkles
} from 'lucide-react'

const companyProfileSchema = z.object({
  company_name: z.string().min(1, 'Company name is required').min(2, 'Company name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  website: z.string().min(1, 'Website is required').refine((val) => {
    try {
      new URL(val.startsWith('http') ? val : `https://${val}`)
      return true
    } catch {
      return false
    }
  }, 'Please enter a valid website URL'),
  industry: z.string().min(1, 'Industry is required'),
  organisation: z.string().min(1, 'Organisation type is required'),
  location: z.string().min(1, 'Location is required').min(2, 'Location must be at least 2 characters'),
  employees: z.string().min(1, 'Number of employees is required'),
  description: z.string().min(1, 'Company description is required').min(10, 'Description must be at least 10 characters'),
  logo: z.string().optional(),
  business_license: z.string().optional(),
  tax_id: z.string().min(1, 'Tax ID is required').min(3, 'Tax ID must be at least 3 characters')
})

type CompanyProfileFormData = z.infer<typeof companyProfileSchema>

const CompanyProfileSetup = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const [formData, setFormData] = useState<CompanyProfileFormData>({
    company_name: '',
    email: '',
    website: '',
    industry: '',
    organisation: '',
    location: '',
    employees: '',
    description: '',
    logo: '',
    business_license: '',
    tax_id: ''
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState<{ logo: boolean; business_license: boolean }>({
    logo: false,
    business_license: false
  })
  const [isReapplication, setIsReapplication] = useState(false)

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const response = await companyApi.getProfile()
        if (response.success && response.data) {
          const status = response.data.is_verified || 'not_created'
          setIsReapplication(status === 'rejected')
        }
      } catch (err: unknown) {
        setIsReapplication(false)
      }
    }
    
    checkVerificationStatus()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleFileUpload = async (file: File, type: 'logo' | 'business_license') => {
    try {
      setUploading(prev => ({ ...prev, [type]: true }))
      
      let uploadResult
      if (type === 'logo') {
        uploadResult = await companyApi.uploadLogo(file)
      } else {
        uploadResult = await companyApi.uploadBusinessLicense(file)
      }

      if (uploadResult.success && uploadResult.data) {
        setFormData(prev => ({
          ...prev,
          [type]: uploadResult.data!.url
        }))
        
        toast.success(`${type === 'logo' ? 'Logo' : 'Business License'} uploaded successfully!`)
      } else {
        throw new Error(uploadResult.message || 'Upload failed')
      }
    } catch (error) {
      const errorMsg = typeof error === 'string' ? error : 'Failed to upload file'
      toast.error('Upload Failed', { description: errorMsg })
      setValidationErrors(prev => ({
        ...prev,
        [type]: errorMsg
      }))
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setValidationErrors({})

    try {
      const validatedData = companyProfileSchema.parse(formData)
      const profileData: CompanyProfileData = {
        company_name: validatedData.company_name,
        email: validatedData.email,
        website: validatedData.website,
        industry: validatedData.industry,
        organisation: validatedData.organisation,
        location: validatedData.location,
        employees: validatedData.employees,
        description: validatedData.description,
        logo: validatedData.logo || undefined,
        business_license: validatedData.business_license || undefined,
        tax_id: validatedData.tax_id,
      }

      const res = isReapplication 
        ? await companyApi.reapplyVerification(profileData)
        : await companyApi.createProfile(profileData)
      
      if (res.success) {
        // Refresh verification status in Redux
        dispatch(fetchCompanyProfileThunk()).catch(() => {})

        const successMessage = isReapplication 
          ? 'Reapplication Submitted Successfully!'
          : 'Profile Created Successfully!'
        const description = isReapplication
          ? 'Your reapplication has been submitted for review. Redirecting to status page...'
          : 'Your company profile has been created. Redirecting to dashboard...'
        
        toast.success(successMessage, {
          description,
          duration: 3000,
        })
        
        setTimeout(() => {
          navigate(isReapplication ? '/company/dashboard' : '/company/dashboard')
        }, 2000)
      } else {
        throw new Error(res.message || `Failed to ${isReapplication ? 'submit reapplication' : 'create company profile'}`)
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        err.issues.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message
          }
        })
        setValidationErrors(fieldErrors)
        toast.error('Validation Failed', { description: 'Please fix the errors below' })
      } else {
        const errorMsg = typeof err === 'string' ? err : `Failed to ${isReapplication ? 'submit reapplication' : 'create company profile'}`
        setError(errorMsg)
        toast.error(isReapplication ? 'Reapplication Failed' : 'Profile Creation Failed', { description: errorMsg })
      }
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 3) {
      let stepData: any = {}
      let stepSchema: any = null

      if (currentStep === 1) {
        stepData = {
          company_name: formData.company_name,
          email: formData.email,
          website: formData.website,
          industry: formData.industry,
          organisation: formData.organisation,
        }
        stepSchema = companyProfileSchema.pick({
          company_name: true,
          email: true,
          website: true,
          industry: true,
          organisation: true,
        })
      }
      
      else if (currentStep === 2) {
        stepData = {
          location: formData.location,
          employees: formData.employees,
          description: formData.description,
          logo: formData.logo || undefined,
        }
        stepSchema = companyProfileSchema.pick({
          location: true,
          employees: true,
          description: true,
          logo: true,
        })
      }

      try {
        stepSchema.parse(stepData)
        setCurrentStep(currentStep + 1)
        setValidationErrors({})
      } catch (err) {
        if (err instanceof z.ZodError) {
          const fieldErrors: Record<string, string> = {}
          err.issues.forEach((error) => {
            if (error.path[0]) {
              fieldErrors[error.path[0] as string] = error.message
            }
          })
          setValidationErrors(fieldErrors)
          toast.error('Please complete all required fields before proceeding')
        }
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

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
              <Building2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">ZeekNet</h1>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                <Sparkles className="mr-1 h-3 w-3" />
                Company Portal
              </Badge>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {isReapplication ? 'Resubmit your company profile' : 'Complete your company profile'}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {isReapplication 
                ? 'Update your company information and resubmit for verification.'
                : 'Set up your company profile to start attracting top talent and posting jobs on our platform.'
              }
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Attract Top Talent</p>
                  <p className="text-sm text-muted-foreground">Reach qualified candidates</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Post Jobs Easily</p>
                  <p className="text-sm text-muted-foreground">Create and manage job listings</p>
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

            <div className="mt-12 pt-8 border-t border-border/50">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>10K+ Candidates</span>
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
        <div className="w-full max-w-2xl space-y-8">
          <div className="lg:hidden text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ZeekNet</h1>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Company Portal
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              
              <p className="text-muted-foreground mt-2">
                Set up your company profile to start attracting top talent
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4 mt-4">
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <span className="text-sm font-semibold">1</span>
                </div>
                <span className={`text-sm font-medium ${
                  currentStep >= 1 ? 'text-foreground' : 'text-muted-foreground'
                }`}>Basic Info</span>
              </div>
              
              <div className={`w-12 h-0.5 ${
                currentStep >= 2 ? 'bg-primary' : 'bg-muted'
              }`}></div>

              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <span className="text-sm font-semibold">2</span>
                </div>
                <span className={`text-sm font-medium ${
                  currentStep >= 2 ? 'text-foreground' : 'text-muted-foreground'
                }`}>Details</span>
              </div>
              
              <div className={`w-12 h-0.5 ${
                currentStep >= 3 ? 'bg-primary' : 'bg-muted'
              }`}></div>

              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 3 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <span className="text-sm font-semibold">3</span>
                </div>
                <span className={`text-sm font-medium ${
                  currentStep >= 3 ? 'text-foreground' : 'text-muted-foreground'
                }`}>Documents</span>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {currentStep === 1 && (
                <Card className="shadow-lg border-0 bg-card">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                    <CardTitle className="flex items-center space-x-3 text-xl py-2">
                      <div className="p-2 bg-background rounded-lg shadow-sm">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <span>Basic Information</span>
                        <p className="text-sm font-normal text-muted-foreground mt-1">
                          Enter your company's basic details
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company_name" className="text-sm font-semibold">
                          Company Name *
                        </Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            id="company_name"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleInputChange}
                            placeholder="e.g., TechCorp Solutions"
                            className={`pl-10 ${validationErrors.company_name ? 'border-destructive' : ''}`}
                            required
                          />
                        </div>
                        {validationErrors.company_name && (
                          <p className="text-sm text-destructive">{validationErrors.company_name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold">
                          Email Address *
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="admin@techcorp.com"
                            className={`pl-10 ${validationErrors.email ? 'border-destructive' : ''}`}
                            required
                          />
                        </div>
                        {validationErrors.email && (
                          <p className="text-sm text-destructive">{validationErrors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm font-semibold">
                        Website *
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="url"
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="www.techcorp.com or https://www.techcorp.com"
                          className={`pl-10 ${validationErrors.website ? 'border-destructive' : ''}`}
                          required
                        />
                      </div>
                      {validationErrors.website && (
                        <p className="text-sm text-destructive">{validationErrors.website}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="industry" className="text-sm font-semibold">
                          Industry *
                        </Label>
                        <select
                          id="industry"
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md ${validationErrors.industry ? 'border-destructive' : 'border-input'}`}
                          required
                        >
                          <option value="">Select industry</option>
                          <option value="Technology">Technology</option>
                          <option value="Finance">Finance</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Education">Education</option>
                          <option value="Retail">Retail</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Other">Other</option>
                        </select>
                        {validationErrors.industry && (
                          <p className="text-sm text-destructive">{validationErrors.industry}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="organisation" className="text-sm font-semibold">
                          Organisation Type *
                        </Label>
                        <select
                          id="organisation"
                          name="organisation"
                          value={formData.organisation}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md ${validationErrors.organisation ? 'border-destructive' : 'border-input'}`}
                          required
                        >
                          <option value="">Select type</option>
                          <option value="Private">Private</option>
                          <option value="Public">Public</option>
                          <option value="Non-Profit">Non-Profit</option>
                          <option value="Government">Government</option>
                        </select>
                        {validationErrors.organisation && (
                          <p className="text-sm text-destructive">{validationErrors.organisation}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 2 && (
                <Card className="shadow-lg border-0 bg-card">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                    <CardTitle className="py-3 flex items-center space-x-3 text-l">
                      <div className="p-2 bg-background rounded-lg shadow-sm">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <span>Company Details</span>
                        <p className="text-sm font-normal text-muted-foreground mt-1">
                          Tell us more about your company
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-1 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-semibold">
                          Location *
                        </Label>
                        <Input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="e.g., San Francisco, CA"
                          className={validationErrors.location ? 'border-destructive' : ''}
                          required
                        />
                        {validationErrors.location && (
                          <p className="text-sm text-destructive">{validationErrors.location}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employees" className="text-sm font-semibold">
                          Number of Employees *
                        </Label>
                        <select
                          id="employees"
                          name="employees"
                          value={formData.employees}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md ${validationErrors.employees ? 'border-destructive' : 'border-input'}`}
                          required
                        >
                          <option value="">Select range</option>
                          <option value="1-10">1-10</option>
                          <option value="11-50">11-50</option>
                          <option value="51-200">51-200</option>
                          <option value="201-500">201-500</option>
                          <option value="501-1000">501-1000</option>
                          <option value="1000+">1000+</option>
                        </select>
                        {validationErrors.employees && (
                          <p className="text-sm text-destructive">{validationErrors.employees}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-semibold">
                        Company Description *
                      </Label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Tell us about your company..."
                        rows={4}
                        className={`w-full px-3 py-2 h-20 border text-sm rounded-md ${validationErrors.description ? 'border-destructive' : 'border-input'}`}
                        required
                      />
                      {validationErrors.description && (
                        <p className="text-sm text-destructive">{validationErrors.description}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logo" className="text-sm font-semibold">
                        Company Logo (Optional)
                      </Label>
                      <div 
                        onClick={() => document.getElementById('logo')?.click()}
                        className={`border-2 border-dashed rounded-lg p-2 text-center hover:border-primary transition-colors cursor-pointer ${
                          validationErrors.logo ? 'border-destructive' : 'border-border'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-3">
                          {uploading.logo ? (
                            <>
                              <Loader2 className="h-6 w-6 text-primary animate-spin" />
                              <p className="text-sm font-medium text-foreground">Uploading...</p>
                            </>
                          ) : formData.logo ? (
                            <>
                              <div className="relative">
                                <img 
                                  src={formData.logo} 
                                  alt="Company logo preview" 
                                  className="h-20 w-20 object-contain rounded"
                                />
                              </div>
                              <p className="text-sm font-medium text-green-600">✓ Logo uploaded</p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  document.getElementById('logo')?.click();
                                }}
                              >
                                Change Logo
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className="p-2 bg-primary/10 rounded-full">
                                <Upload className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">Upload Company Logo</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                              </div>
                            </>
                          )}
                          <Input
                            type="file"
                            id="logo"
                            name="logo"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleFileUpload(file, 'logo')
                                if (validationErrors.logo) {
                                  setValidationErrors(prev => {
                                    const newErrors = { ...prev }
                                    delete newErrors.logo
                                    return newErrors
                                  })
                                }
                              }
                            }}
                            className="hidden"
                          />
                        </div>
                      </div>
                      {validationErrors.logo && (
                        <p className="text-sm text-destructive">{validationErrors.logo}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 3 && (
                <Card className="shadow-lg border-0 bg-card">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="p-2 bg-background rounded-lg shadow-sm">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <span>Verification Documents</span>
                        <p className="text-sm font-normal text-muted-foreground mt-1">
                          Submit required documents for verification
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tax_id" className="text-sm font-semibold">
                        Tax ID / Registration Number *
                      </Label>
                      <Input
                        type="text"
                        id="tax_id"
                        name="tax_id"
                        value={formData.tax_id}
                        onChange={handleInputChange}
                        placeholder="e.g., 12-3456789"
                        className={validationErrors.tax_id ? 'border-destructive' : ''}
                        required
                      />
                      {validationErrors.tax_id && (
                        <p className="text-sm text-destructive">{validationErrors.tax_id}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business_license" className="text-sm font-semibold">
                        Business License (Optional)
                      </Label>
                      <div 
                        onClick={() => document.getElementById('business_license')?.click()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer ${
                          validationErrors.business_license ? 'border-destructive' : 'border-border'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-3">
                          {uploading.business_license ? (
                            <>
                              <Loader2 className="h-6 w-6 text-primary animate-spin" />
                              <p className="text-sm font-medium text-foreground">Uploading...</p>
                            </>
                          ) : formData.business_license ? (
                            <>
                              <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                              </div>
                              <p className="text-sm font-medium text-green-600">✓ Business license uploaded</p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  document.getElementById('business_license')?.click();
                                }}
                              >
                                Change Document
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className="p-3 bg-primary/10 rounded-full">
                                <Upload className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">Upload Business License</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB</p>
                              </div>
                            </>
                          )}
                          <Input
                            type="file"
                            id="business_license"
                            name="business_license"
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleFileUpload(file, 'business_license')
                                if (validationErrors.business_license) {
                                  setValidationErrors(prev => {
                                    const newErrors = { ...prev }
                                    delete newErrors.business_license
                                    return newErrors
                                  })
                                }
                              }
                            }}
                            className="hidden"
                          />
                        </div>
                      </div>
                      {validationErrors.business_license && (
                        <p className="text-sm text-destructive">{validationErrors.business_license}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex items-center justify-between pt-4">
                <div>
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center space-x-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={loading}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <span>Next</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          <span>{isReapplication ? 'Submitting Reapplication...' : 'Creating Profile...'}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span>{isReapplication ? 'Submit Reapplication' : 'Complete Setup'}</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>

            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Need help?</span>
                <a href="mailto:support@zeeknet.com" className="text-primary hover:text-primary/80 font-medium">
                  Contact our support team
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyProfileSetup