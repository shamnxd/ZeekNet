import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { companyApi, type CompanyProfileData } from '@/api/company.api'
import { toast } from 'sonner'
import { z } from 'zod'
import { 
  Building2, 
  Mail, 
  Globe, 
  Users, 
  MapPin, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle, 
  FileText,
  Upload,
  Sparkles,
  Target,
  Loader2,
  AlertCircle,
  RotateCcw
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

const CompanyReapplication = () => {
  const navigate = useNavigate()
  
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
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true)
        const response = await companyApi.getProfile()
        
        if (response.success && response.data) {
          const profile = response.data
          setFormData({
            company_name: profile.company_name || '',
            email: profile.email || '',
            website: profile.website || '',
            industry: profile.industry || '',
            organisation: profile.organisation || '',
            location: profile.location || '',
            employees: profile.employees || '',
            description: profile.description || '',
            logo: profile.logo || '',
            business_license: profile.business_license || '',
            tax_id: profile.tax_id || ''
          })
        }
      } catch {
        toast.error('Failed to load profile data')
      } finally {
        setLoadingProfile(false)
      }
    }

    loadProfile()
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

  const handleFileUpload = async (
    file: File,
    type: 'logo' | 'business_license'
  ) => {
    try {
      setUploading(prev => ({ ...prev, [type]: true }))
      
      const uploadFunction = type === 'logo' 
        ? companyApi.uploadLogo 
        : companyApi.uploadBusinessLicense
      
      const response = await uploadFunction(file)
      
      if (response.success && response.data) {
        setFormData(prev => ({
          ...prev,
          [type === 'logo' ? 'logo' : 'business_license']: response.data!.url
        }))
        
        toast.success(`${type === 'logo' ? 'Logo' : 'Business license'} uploaded successfully`)
      }
    } catch {
      toast.error(`Failed to upload ${type === 'logo' ? 'logo' : 'business license'}`)
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

      const res = await companyApi.reapplyVerification(profileData)
      
      if (res.success) {
        toast.success('Reapplication Submitted Successfully!', {
          description: 'Your verification reapplication has been submitted and is now under review.',
          duration: 5000,
        })
        
        setTimeout(() => {
          navigate('/company/dashboard')
        }, 2000)
      } else {
        throw new Error(res.message || 'Failed to submit reapplication')
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
        const errorMsg = typeof err === 'string' ? err : 'Failed to submit reapplication'
        setError(errorMsg)
        toast.error('Reapplication Failed', { description: errorMsg })
      }
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <RotateCcw className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reapply for Verification</h1>
              <p className="text-gray-600 mt-2">Update your company information and resubmit for verification</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-orange-600" />
              <span>Review your information</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-orange-600" />
              <span>Make necessary updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-orange-600" />
              <span>Resubmit for approval</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              <span className="text-sm font-semibold">1</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              <span className="text-sm font-semibold">2</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive flex items-start space-x-2 mb-6">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <Card className="shadow-lg border-0 bg-card">
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        className={`pl-10 ${validationErrors.company_name ? 'border-destructive focus:border-destructive' : ''}`}
                        required
                      />
                    </div>
                    {validationErrors.company_name && (
                      <p className="text-sm text-destructive">{validationErrors.company_name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold">
                      Company Email *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="contact@company.com"
                        className={`pl-10 ${validationErrors.email ? 'border-destructive focus:border-destructive' : ''}`}
                        required
                      />
                    </div>
                    {validationErrors.email && (
                      <p className="text-sm text-destructive">{validationErrors.email}</p>
                    )}
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
                        placeholder="https://www.company.com"
                        className={`pl-10 ${validationErrors.website ? 'border-destructive focus:border-destructive' : ''}`}
                        required
                      />
                    </div>
                    {validationErrors.website && (
                      <p className="text-sm text-destructive">{validationErrors.website}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-sm font-semibold">
                      Industry *
                    </Label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${validationErrors.industry ? 'border-destructive focus:border-destructive' : ''}`}
                      required
                    >
                      <option value="">Select Industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
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
                      className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${validationErrors.organisation ? 'border-destructive focus:border-destructive' : ''}`}
                      required
                    >
                      <option value="">Select Organisation Type</option>
                      <option value="Government">Government</option>
                      <option value="Semi Government">Semi Government</option>
                      <option value="Private">Private</option>
                      <option value="Public">Public</option>
                      <option value="International Agencies">International Agencies</option>
                    </select>
                    {validationErrors.organisation && (
                      <p className="text-sm text-destructive">{validationErrors.organisation}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-semibold">
                      Location *
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., New York, NY"
                        className={`pl-10 ${validationErrors.location ? 'border-destructive focus:border-destructive' : ''}`}
                        required
                      />
                    </div>
                    {validationErrors.location && (
                      <p className="text-sm text-destructive">{validationErrors.location}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employees" className="text-sm font-semibold">
                      Number of Employees *
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <select
                        id="employees"
                        name="employees"
                        value={formData.employees}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${validationErrors.employees ? 'border-destructive focus:border-destructive' : ''}`}
                        required
                      >
                        <option value="">Select Employee Count</option>
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-200">51-200</option>
                        <option value="201-500">201-500</option>
                        <option value="500+">500+</option>
                      </select>
                    </div>
                    {validationErrors.employees && (
                      <p className="text-sm text-destructive">{validationErrors.employees}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">
                    Company Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your company, its mission, values, and what makes it unique..."
                    className={`min-h-[120px] ${validationErrors.description ? 'border-destructive focus:border-destructive' : ''}`}
                    required
                  />
                  {validationErrors.description && (
                    <p className="text-sm text-destructive">{validationErrors.description}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={nextStep} className="bg-orange-600 hover:bg-orange-700">
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="shadow-lg border-0 bg-card">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tax_id" className="text-sm font-semibold">
                    Tax ID *
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      id="tax_id"
                      name="tax_id"
                      value={formData.tax_id}
                      onChange={handleInputChange}
                      placeholder="Enter your tax identification number"
                      className={`pl-10 ${validationErrors.tax_id ? 'border-destructive focus:border-destructive' : ''}`}
                      required
                    />
                  </div>
                  {validationErrors.tax_id && (
                    <p className="text-sm text-destructive">{validationErrors.tax_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Company Logo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {formData.logo ? (
                      <div className="space-y-4">
                        <img 
                          src={formData.logo} 
                          alt="Company Logo" 
                          className="h-20 w-20 mx-auto rounded-lg object-cover"
                        />
                        <p className="text-sm text-gray-600">Logo uploaded successfully</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, 'logo')
                          }}
                          className="hidden"
                          id="logo-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                          disabled={uploading.logo}
                        >
                          {uploading.logo ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Change Logo
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-12 w-12 mx-auto text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Upload your company logo</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload(file, 'logo')
                            }}
                            className="hidden"
                            id="logo-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                            disabled={uploading.logo}
                          >
                            {uploading.logo ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Choose File
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Business License</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {formData.business_license ? (
                      <div className="space-y-4">
                        <FileText className="h-12 w-12 mx-auto text-green-600" />
                        <p className="text-sm text-gray-600">Business license uploaded successfully</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, 'business_license')
                          }}
                          className="hidden"
                          id="business-license-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('business-license-upload')?.click()}
                          disabled={uploading.business_license}
                        >
                          {uploading.business_license ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Change Document
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-12 w-12 mx-auto text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Upload your business license</p>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload(file, 'business_license')
                            }}
                            className="hidden"
                            id="business-license-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('business-license-upload')?.click()}
                            disabled={uploading.business_license}
                          >
                            {uploading.business_license ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Document
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting Reapplication...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Submit Reapplication
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  )
}

export default CompanyReapplication