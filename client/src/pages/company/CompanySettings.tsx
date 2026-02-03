import { useState, useEffect } from 'react'
import CompanyLayout from '../../components/layouts/CompanyLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Loading } from '@/components/ui/loading'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Image,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'
import { companyApi } from '@/api/company.api'
import { authApi } from '@/api/auth.api'
import type { CompanyProfileResponse } from '@/interfaces/company/company-api.interface'
import { toast } from 'sonner'
import { useAppDispatch } from '@/hooks/useRedux'
import { fetchCompanyProfileThunk } from '@/store/slices/auth.slice'

const CompanySettings = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'general'>('overview')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const dispatch = useAppDispatch()

  const [, setCompanyProfile] = useState<CompanyProfileResponse | null>(null)
  const [companyName, setCompanyName] = useState('')
  const [website, setWebsite] = useState('')
  const [employee, setEmployee] = useState('')
  const [industry, setIndustry] = useState('')
  const [organization, setOrganization] = useState('')
  const [dateFounded, setDateFounded] = useState('')
  const [logo, setLogo] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [settings, setSettings] = useState({
    emailNotifications: true,
    jobAlerts: true,
    profileVisibility: true,
    twoFactorAuth: false
  })

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true)
      const response = await companyApi.getCompleteProfile()

      if (response.success && response.data) {
        const data = response.data
        const profile = data.profile

        setCompanyProfile(profile)
        setCompanyName(profile.company_name || '')
        setWebsite(profile.website_link || '')
        setEmployee(profile.employee_count?.toString() || '')
        setIndustry(profile.industry || '')
        setOrganization(profile.organisation || '')
        setDateFounded(profile.created_at ? new Date(profile.created_at).getFullYear().toString() : '')
        setLogo(profile.logo || '')
      }
    } catch {
      toast.error('Failed to load company profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = async (file: File) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setUploadingLogo(true)
    try {
      const response = await companyApi.uploadLogo(file)

      if (response.success && response.data) {
        setLogo(response.data.url)
        dispatch(fetchCompanyProfileThunk()).catch(() => { })
        toast.success('Logo uploaded and saved successfully')
      } else {
        throw new Error(response.message || 'Upload failed')
      }
    } catch {
      toast.error('Failed to upload logo')
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSaveChanges = async () => {
    try {
      setSaving(true)

      console.log('📝 Form values:', { companyName, website, employee, industry, organization, logo })

      const updateData: Record<string, string | number> = {}

      if (companyName?.trim()) updateData.company_name = companyName.trim()
      if (website?.trim()) updateData.website_link = website.trim()
      if (employee?.trim()) updateData.employee_count = parseInt(employee)
      if (industry?.trim()) updateData.industry = industry.trim()
      if (organization?.trim()) updateData.organisation = organization.trim()
      if (logo?.trim()) updateData.logo = logo.trim()

      console.log('📤 Sending update data:', updateData)

      const response = await companyApi.updateProfile(updateData)

      if (response.success && response.data) {
        const profile = response.data
        setCompanyProfile(profile)
        setCompanyName(profile.company_name || '')
        setWebsite(profile.website_link || '')
        setEmployee(profile.employee_count?.toString() || '')
        setIndustry(profile.industry || '')
        setOrganization(profile.organisation || '')
        setLogo(profile.logo || '')
        toast.success('Company settings updated successfully')
      } else {
        toast.error(response.message || 'Failed to update company settings')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update company settings'
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!currentPassword.trim()) {
      toast.error('Please enter your current password')
      return
    }

    if (!newPassword.trim()) {
      toast.error('Please enter a new password')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    try {
      setSaving(true)
      await authApi.changePassword(currentPassword, newPassword)
      toast.success('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswords({ current: false, new: false, confirm: false })
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update password'
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchCompanyProfile()
  }, [])

  const renderOverviewTab = () => (
    <div className="space-y-7">
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">Basic Information</h2>
        <p className="text-sm text-gray-600">This is company information that you can update anytime.</p>
      </div>

      <div className="border-t border-gray-200"></div>

      <div className="flex gap-7">
        <div className="flex-1 max-w-[650px]">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Company Logo</h3>
          <p className="text-sm text-gray-600">This image will be shown publicly as company logo.</p>
        </div>
        <div className="flex gap-7">
          <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {logo ? (
              <img src={logo} alt="Company Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 text-3xl font-bold">♫</div>
            )}
          </div>

          <div className="border-2 border-dashed border-purple-500 rounded-lg p-5 flex flex-col items-center gap-2 min-w-[280px]">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleLogoUpload(file)
              }}
              className="hidden"
              id="logo-upload"
            />
            <label htmlFor="logo-upload" className="cursor-pointer">
              <Image className="h-8 w-8 text-purple-500" />
              <div className="text-center">
                <p className="text-gray-900 font-medium">Click to replace or drag and drop</p>
                <p className="text-gray-600 text-sm">SVG, PNG, JPG or GIF (max. 5MB)</p>
                {uploadingLogo && <p className="text-purple-600 text-sm">Uploading...</p>}
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200"></div>

      <div className="flex gap-7">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Company Details</h3>
          <p className="text-sm text-gray-600">Introduce your company core info quickly to users by fill up company details</p>
        </div>

        <div className="w-[510px] space-y-5">
          <div className="space-y-1">
            <Label htmlFor="company-name" className="text-gray-800 font-semibold">Company Name</Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="This is placeholder"
              className="border-gray-200 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="website" className="text-gray-800 font-semibold">Website</Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="This is placeholder"
              className="border-gray-200 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="organization" className="text-gray-800 font-semibold">Organization</Label>
            <Select value={organization} onValueChange={setOrganization}>
              <SelectTrigger className="w-full h-9 border-gray-200 rounded-lg">
                <SelectValue placeholder="Select organization type" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                <SelectItem value="Government">Government</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                <SelectItem value="Startup">Startup</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
                <SelectItem value="SME">SME (Small & Medium Enterprise)</SelectItem>
                <SelectItem value="Multinational">Multinational</SelectItem>
                <SelectItem value="Educational">Educational</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1">
              <Label htmlFor="employee" className="text-gray-800 font-semibold">Employee</Label>
              <Input
                id="employee"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                placeholder="This is placeholder"
                className="border-gray-200 rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="industry" className="text-gray-800 font-semibold">Industry</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="This is placeholder"
                className="border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="date-founded" className="text-gray-800 font-semibold">Date Founded</Label>
            <Input
              id="date-founded"
              value={dateFounded}
              onChange={(e) => setDateFounded(e.target.value)}
              placeholder="Enter founding date"
              className="border-gray-200 rounded-lg"
            />
          </div>

        </div>
      </div>

    </div>
  )

  const renderGeneralTab = () => (
    <div className="space-y-7">
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">Security</h2>
        <p className="text-sm text-gray-600">Update your password and manage security settings.</p>
      </div>

      <div className="border-t border-gray-200"></div>

      <div className="flex gap-7">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Change Password</h3>
          <p className="text-sm text-gray-600">Update your account password for better security.</p>
        </div>

        <div className="w-[510px] space-y-5">
          <div className="space-y-1">
            <Label htmlFor="current-password" className="text-gray-800 font-semibold">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords.current ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="border-gray-200 rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="new-password" className="text-gray-800 font-semibold">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPasswords.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="border-gray-200 rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirm-password" className="text-gray-800 font-semibold">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPasswords.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="border-gray-200 rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            className="text-white"
            variant='company'
            onClick={handlePasswordUpdate}
            disabled={saving}
          >
            <Lock className="h-4 w-4 mr-2" />
            {saving ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-200"></div>

      <div className="flex gap-7">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Notifications</h3>
          <p className="text-sm text-gray-600">Manage your notification preferences.</p>
        </div>

        <div className="w-[510px] space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-800 font-semibold">Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive email updates about your account</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              disabled={true}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-800 font-semibold">Job Alerts</Label>
              <p className="text-sm text-gray-600">Get notified about new job applications</p>
            </div>
            <Switch
              checked={settings.jobAlerts}
              onCheckedChange={(checked) => handleSettingChange('jobAlerts', checked)}
              disabled={true}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200"></div>

      <div className="flex gap-7">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Privacy</h3>
          <p className="text-sm text-gray-600">Control your profile visibility and privacy settings.</p>
        </div>

        <div className="w-[510px] space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-800 font-semibold">Public Profile</Label>
              <p className="text-sm text-gray-600">Make your company profile visible to job seekers</p>
            </div>
            <Switch
              checked={settings.profileVisibility}
              onCheckedChange={(checked) => handleSettingChange('profileVisibility', checked)}
              disabled={true}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-800 font-semibold">Two-Factor Authentication</Label>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
              disabled={true}
            />
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <CompanyLayout>
        <div className="flex items-center justify-center h-64">
          <Loading />
        </div>
      </CompanyLayout>
    )
  }

  return (
    <CompanyLayout>
      <div className="flex-1 overflow-auto bg-white">
        <div className="px-5 py-5">
          <h1 className="text-2xl font-semibold text-gray-900 mb-5">Settings</h1>

          <div className="flex gap-9 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-1 border-b-2 font-semibold ${activeTab === 'overview'
                ? 'border-purple-500 text-gray-900'
                : 'border-transparent text-gray-600'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`pb-4 px-1 border-b-2 font-semibold ${activeTab === 'general'
                ? 'border-purple-500 text-gray-900'
                : 'border-transparent text-gray-600'
                }`}
            >
              General
            </button>
          </div>
        </div>

        <div className="px-7 pb-7">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'general' && renderGeneralTab()}
        </div>

        {activeTab === 'overview' && (
          <div className="px-7 pb-7">
            <div className="border-t border-gray-200 pt-5">
              <Button
                className="text-white px-7 py-2 text-base font-semibold"
                variant='company'
                onClick={handleSaveChanges}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </CompanyLayout>
  )
}

export default CompanySettings