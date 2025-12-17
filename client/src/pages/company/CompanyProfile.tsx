import CompanyLayout from '../../components/layouts/CompanyLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { 
  Building2, 
  Mail, 
  MapPin, 
  Users, 
  Edit3,
  Plus,
  ArrowRight,
  Heart,
  Flame,
  ArrowLeft,
  Linkedin,
  Twitter,
  Facebook,
  Phone,
  Briefcase
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { companyApi, type CompanyProfileResponse } from '@/api/company.api'
import { toast } from 'sonner'

import EditContactDialog from '@/components/company/dialogs/EditContactDialog'
import EditTechStackDialog from '@/components/company/dialogs/EditTechStackDialog'
import EditBenefitsDialog from '@/components/company/dialogs/EditBenefitsDialog'
import EditOfficeLocationDialog from '@/components/company/dialogs/EditOfficeLocationDialog'
import EditAboutDialog from '@/components/company/dialogs/EditAboutDialog'
import EditWorkplacePicturesDialog from '@/components/company/dialogs/EditWorkplacePicturesDialog'
import type { CompanyContact } from '@/interfaces/company/company-contact.interface'
import type { TechStackItem } from '@/interfaces/company/tech-stack-item.interface'
import type { Benefit } from '@/interfaces/company/benefit.interface'
import type { OfficeLocation } from '@/interfaces/company/office-location.interface'
import type { WorkplacePicture } from '@/interfaces/company/workplace-picture.interface'
import type { JobPosting } from '@/interfaces/company/job-posting.interface'

const CompanyProfile = () => {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfileResponse | null>(null)
  const [contact, setContact] = useState<CompanyContact | null>(null)
  const [techStack, setTechStack] = useState<TechStackItem[]>([])
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([])
  const [workplacePictures, setWorkplacePictures] = useState<WorkplacePicture[]>([])
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [editContactDialog, setEditContactDialog] = useState(false)
  const [editTechStackDialog, setEditTechStackDialog] = useState(false)
  const [editBenefitsDialog, setEditBenefitsDialog] = useState(false)
  const [editOfficeLocationDialog, setEditOfficeLocationDialog] = useState(false)
  const [editAboutDialog, setEditAboutDialog] = useState(false)
  const [editWorkplacePicturesDialog, setEditWorkplacePicturesDialog] = useState(false)
  const fetchedRef = useRef(false)

  const fetchCompanyData = async () => {
    try {
      setLoading(true)
      
      const response = await companyApi.getCompleteProfile()

      if (response.success && response.data) {
        const { profile, contact, locations, techStack, benefits, workplacePictures, jobPostings } = response.data
        
        setCompanyProfile(profile)
        setContact(contact)
        const mappedLocations = locations.map((location: any) => ({
          id: location.id,
          location: location.location,
          officeName: location.office_name,
          address: location.address,
          isHeadquarters: location.is_headquarters
        }))
        setOfficeLocations(mappedLocations)
        setTechStack(techStack)
        setBenefits(benefits)
        setWorkplacePictures(workplacePictures)
        setJobPostings(jobPostings || [])
      }
      
    } catch {
      toast.error('Failed to load company data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    fetchCompanyData()
  }, [])

  const handleSaveContact = async (contactData: CompanyContact) => {
    try {
      setSaving(true)
      const apiData = {
        id: contactData.id,
        email: contactData.email,
        phone: contactData.phone,
        twitter_link: contactData.twitter_link,
        facebook_link: contactData.facebook_link,
        linkedin: contactData.linkedin
      }
      const response = await companyApi.updateContact(apiData)
      if (response.success) {
        setContact(contactData)
        toast.success('Contact information updated successfully')
        } else {
        toast.error('Failed to update contact information')
        }
      } catch {
      toast.error('Failed to update contact information')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveTechStack = async (techStackData: TechStackItem[]) => {
    try {
      setSaving(true)
      
      const itemsToDelete = techStack.filter(existingItem => 
        existingItem.id && !techStackData.some(newItem => newItem.id === existingItem.id)
      )
      
      for (const item of itemsToDelete) {
        if (item.id) {
          await companyApi.deleteTechStack(item.id)
        }
      }
      
      const itemsToCreate = techStackData.filter(item => !item.id)
      
      for (const item of itemsToCreate) {
        await companyApi.createTechStack(item)
      }
      
      const itemsToUpdate = techStackData.filter(item => 
        item.id && techStack.some(existingItem => 
          existingItem.id === item.id && existingItem.techStack !== item.techStack
        )
      )
      
      for (const item of itemsToUpdate) {
        if (item.id) {
          await companyApi.updateTechStack(item.id, item)
        }
      }
      
      setTechStack(techStackData)
      toast.success('Tech stack updated successfully')
    } catch {
      toast.error('Failed to update tech stack')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveBenefits = async (benefitsData: Benefit[]) => {
    try {
      setSaving(true)
      
      const benefitsToDelete = benefits.filter(existingBenefit => 
        existingBenefit.id && !benefitsData.some(newBenefit => newBenefit.id === existingBenefit.id)
      )
      
      for (const benefit of benefitsToDelete) {
        if (benefit.id) {
          await companyApi.deleteBenefit(benefit.id)
        }
      }
      
      const benefitsToCreate = benefitsData.filter(benefit => !benefit.id)
      
      for (const benefit of benefitsToCreate) {
        await companyApi.createBenefit({
          perk: benefit.perk,
          description: benefit.description
        })
      }
      
      const benefitsToUpdate = benefitsData.filter(benefit => 
        benefit.id && benefits.some(existingBenefit => 
          existingBenefit.id === benefit.id && 
          (existingBenefit.perk !== benefit.perk || existingBenefit.description !== benefit.description)
        )
      )
      
      for (const benefit of benefitsToUpdate) {
        if (benefit.id) {
          await companyApi.updateBenefit(benefit.id, {
            perk: benefit.perk,
            description: benefit.description
          })
        }
      }
      
      setBenefits(benefitsData)
      toast.success('Benefits updated successfully')
    } catch {
      toast.error('Failed to update benefits')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveOfficeLocations = async (locationsData: OfficeLocation[]) => {
    try {
      setSaving(true)
      
      const locationsToDelete = officeLocations.filter(existingLocation => 
        existingLocation.id && !locationsData.some(newLocation => newLocation.id === existingLocation.id)
      )
      
      for (const location of locationsToDelete) {
        if (location.id) {
          await companyApi.deleteOfficeLocation(location.id)
        }
      }
      
      const locationsToCreate = locationsData.filter(location => !location.id)
      
      for (const location of locationsToCreate) {
        await companyApi.createOfficeLocation({
          location: location.location,
          officeName: location.officeName,
          address: location.address,
          isHeadquarters: location.isHeadquarters
        })
      }
      
      const locationsToUpdate = locationsData.filter(location => 
        location.id && officeLocations.some(existingLocation => 
          existingLocation.id === location.id && 
          (existingLocation.location !== location.location || 
           existingLocation.officeName !== location.officeName ||
           existingLocation.address !== location.address ||
           existingLocation.isHeadquarters !== location.isHeadquarters)
        )
      )
      
      for (const location of locationsToUpdate) {
        if (location.id) {
          await companyApi.updateOfficeLocation(location.id, {
            location: location.location,
            officeName: location.officeName,
            address: location.address,
            isHeadquarters: location.isHeadquarters
          })
        }
      }
      
      setOfficeLocations(locationsData)
      toast.success('Office locations updated successfully')
    } catch {
      toast.error('Failed to update office locations')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAbout = async (aboutUs: string) => {
    try {
      setSaving(true)
      const response = await companyApi.updateProfile({ about_us: aboutUs })
      if (response.success) {
        setCompanyProfile(prev => prev ? { ...prev, about_us: aboutUs } : null)
        toast.success('About section updated successfully')
      } else {
        toast.error('Failed to update about section')
      }
    } catch {
      toast.error('Failed to update about section')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveWorkplacePictures = async (pictures: WorkplacePicture[]) => {
    try {
      setSaving(true)
      
      const picturesToDelete = workplacePictures.filter(existingPicture => 
        existingPicture.id && !pictures.some(newPicture => newPicture.id === existingPicture.id)
      )
      
      for (const picture of picturesToDelete) {
        if (picture.id) {
          await companyApi.deleteWorkplacePicture(picture.id)
        }
      }
      
      const picturesToCreate = pictures.filter(picture => !picture.id)
      
      for (const picture of picturesToCreate) {
        await companyApi.createWorkplacePicture({
          pictureUrl: picture.pictureUrl,
          caption: picture.caption
        })
      }
      
      const picturesToUpdate = pictures.filter(picture => 
        picture.id && workplacePictures.some(existingPicture => 
          existingPicture.id === picture.id && 
          (existingPicture.pictureUrl !== picture.pictureUrl || existingPicture.caption !== picture.caption)
        )
      )
      
      for (const picture of picturesToUpdate) {
        if (picture.id) {
          await companyApi.updateWorkplacePicture(picture.id, {
            pictureUrl: picture.pictureUrl,
            caption: picture.caption
          })
        }
      }
      
      setWorkplacePictures(pictures)
      toast.success('Workplace pictures updated successfully')
    } catch {
      toast.error('Failed to update workplace pictures')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <CompanyLayout>
        <div className="flex items-center justify-center h-64">
          <Loading />
        </div>
      </CompanyLayout>
    )
  }

  if (!companyProfile) {
    return (
      <CompanyLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Failed to load company profile</p>
            <Button onClick={fetchCompanyData}>Retry</Button>
          </div>
        </div>
      </CompanyLayout>
    )
  }

  return (
    <CompanyLayout>
      <div className="bg-white border-b border-gray-200 px-7 py-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-5">
            <div className="relative">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
                {companyProfile.logo ? (
                  <img src={companyProfile.logo} alt="Company Logo" className="w-24 h-24 rounded-full object-cover" />  
                ) : (
                  <span className="text-3xl font-bold text-white">{companyProfile.company_name.charAt(0).toUpperCase()}</span>
                )}  
              </div>
              <Button variant="outline" size="sm" className="absolute -top-1.5 -left-1.5 w-7 h-7 p-0 bg-white border-purple-200">
                <ArrowLeft className="h-3.5 w-3.5 text-purple-500" />
              </Button>
            </div>
            
            <div className="space-y-3.5">
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{companyProfile.company_name}</div>
                <div className="text-base font-semibold text-purple-500">{companyProfile.website_link || 'No website'}</div>
              </div>
              
              <div className="flex items-center gap-7">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center">
                    <Flame className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Founded</div>
                    <div className="font-semibold text-gray-900 text-sm">{companyProfile.created_at ? new Date(companyProfile.created_at).getFullYear() : 'Not specified'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Employees</div>
                    <div className="font-semibold text-gray-900 text-sm">{companyProfile.employee_count || 'Not specified'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Location</div>
                    <div className="font-semibold text-gray-900 text-sm">{officeLocations.length > 0 ? officeLocations[0].location : 'Not specified'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Industry</div>
                    <div className="font-semibold text-gray-900 text-sm">{companyProfile.industry}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100 px-3.5 py-1.5 text-sm"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Profile Settings
          </Button>
        </div>
      </div>

      <div className="flex gap-5 px-5 py-7">
        <div className="flex-1 space-y-5">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-lg font-semibold">About us</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="p-1.5"
                onClick={() => setEditAboutDialog(true)}
                disabled={saving}
              >
                <Edit3 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm">
              {companyProfile.about_us || 'No description available. Click edit to add one.'}
            </p>
                    </div>
                    
          <div className="border-t border-gray-200"></div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-lg font-semibold">Contact</h3>
              <div className="flex gap-1.5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="p-1.5"
                  onClick={() => setEditContactDialog(true)}
                  disabled={saving}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </Button>
                  </div>
                </div>
                
            {contact ? (
            <div className="space-y-2.5">
              <div className="flex gap-2.5">
                  {contact.twitter_link && (
                <div className="flex items-center gap-3 px-2.5 py-1.5 border border-primary rounded-lg text-primary">
                  <Twitter className="h-4 w-4" />
                      <span className="font-medium text-sm">{contact.twitter_link}</span>
                </div>
                  )}
                  {contact.facebook_link && (
                <div className="flex items-center gap-3 px-2.5 py-1.5 border border-primary rounded-lg text-primary">
                  <Facebook className="h-4 w-4" />
                      <span className="font-medium text-sm">{contact.facebook_link}</span>
                </div>
                  )}
                  </div>
              <div className="flex gap-2.5">
                  {contact.phone && (
                <div className="flex items-center gap-3 px-2.5 py-1.5 border border-primary rounded-lg text-primary">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium text-sm">{contact.phone}</span>
                </div>
                  )}
                  {contact.email && (
                <div className="flex items-center gap-3 px-2.5 py-1.5 border border-primary rounded-lg text-primary">
                  <Mail className="h-4 w-4" />
                      <span className="font-medium text-sm">{contact.email}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2.5">
                  {contact.linkedin && (
                    <div className="flex items-center gap-3 px-2.5 py-1.5 border border-primary rounded-lg text-primary">
                      <Linkedin className="h-4 w-4" />
                      <span className="font-medium text-sm">{contact.linkedin}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                No contact information available. Click edit to add contact details.
            </div>
            )}
          </div>

          <div className="border-t border-gray-200"></div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-lg font-semibold">Workplace Pictures</h3>
              <div className="flex gap-1.5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="p-1.5"
                  onClick={() => setEditWorkplacePicturesDialog(true)}
                  disabled={saving}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </Button>
              </div>
                </div>
                
            {workplacePictures.length > 0 ? (
            <div className="flex gap-2.5">
                {workplacePictures.slice(0, 1).map((picture, index) => (
                  <div key={picture.id || index} className="w-64 h-72 bg-gray-200 rounded-lg overflow-hidden">
                    <img src={picture.pictureUrl} alt={picture.caption || "Workplace"} className="w-full h-full object-cover" />
              </div>
                ))}
              <div className="flex flex-col gap-2.5">
                  {workplacePictures.slice(1, 4).map((picture, index) => (
                    <div key={picture.id || index} className="w-48 h-44 bg-gray-200 rounded-lg overflow-hidden">
                      <img src={picture.pictureUrl} alt={picture.caption || "Workplace"} className="w-full h-full object-cover" />
                </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500 text-sm mb-2">No workplace pictures added yet</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditWorkplacePicturesDialog(true)}
                  disabled={saving}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Pictures
                </Button>
            </div>
            )}
          </div>

          <div className="border-t border-gray-200"></div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-lg font-semibold">Benefits</h3>
              <div className="flex gap-1.5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="p-1.5"
                  onClick={() => setEditBenefitsDialog(true)}
                  disabled={saving}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </Button>
                    </div>
                  </div>
                  
            {benefits.length > 0 ? (
            <div className="grid grid-cols-2 gap-3.5">
                {benefits.map((benefit, index) => (
                  <div key={benefit.id || index} className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                    <div>
                        <h4 className="font-semibold text-sm">{benefit.perk}</h4>
                        <p className="text-xs text-gray-600">{benefit.description}</p>
                  </div>
                </div>
                    </div>
                ))}
                  </div>
            ) : (
              <div className="text-gray-500 text-sm">
                No benefits added yet. Click edit to add benefits and perks.
                  </div>
            )}
          </div>

          <div className="border-t border-gray-200"></div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-lg font-semibold">Open Positions</h3>
              <Button variant="ghost" className="text-primary text-sm">
                Show all jobs
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </div>
            
            {jobPostings.length > 0 ? (
              <div className="space-y-3">
                {jobPostings.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-3 hover:border-primary/20 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{job.title}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{job.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {job.employmentType}
                          </span>
                          {job.salaryMin && job.salaryMax && (
                            <span className="flex items-center gap-1">
                              <span className="font-medium">₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm text-center py-4">
                No active job postings available.
              </div>
            )}
          </div>
        </div>

        <div className="w-80 space-y-7">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-lg font-semibold">Tech Stack</h3>
              <div className="flex gap-1.5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="p-1.5"
                  onClick={() => setEditTechStackDialog(true)}
                  disabled={saving}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            
            {techStack.length > 0 ? (
                      <div>
                {Array.from({ length: Math.ceil(techStack.length / 3) }).map((_, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2.5 mb-2.5">
                    {techStack.slice(rowIndex * 3, (rowIndex + 1) * 3).map((tech, index) => (
                      <div key={tech.id || index} className="flex flex-col items-center gap-1.5 p-2.5">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-semibold">{tech.techStack.charAt(0).toUpperCase()}</span>
                  </div>
                        <span className="text-xs">{tech.techStack}</span>
                </div>
                    ))}
                  </div>
                ))}
              
              <div className="border-t border-gray-200 pt-3.5">
                <Button variant="ghost" className="text-primary text-sm">
                  View tech stack
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
            ) : (
              <div className="text-gray-500 text-sm">
                No tech stack added yet. Click edit to add technologies.
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-lg font-semibold">Office Locations</h3>
              <div className="flex gap-1.5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="p-1.5"
                  onClick={() => setEditOfficeLocationDialog(true)}
                  disabled={saving}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </Button>
                      </div>
                    </div>
            
            {officeLocations.length > 0 ? (
            <div className="space-y-2.5 mb-3.5">
                {officeLocations.map((location, index) => (
                  <div key={location.id || index} className="flex items-center gap-2.5">
                    <div className="text-xl">🏢</div>
                  <div className="flex-1">
                      <div className="font-semibold text-xs">{location.location}</div>
                      {location.isHeadquarters && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs mt-1 px-2 py-0.5">
                          Headquarters
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            ) : (
              <div className="text-gray-500 text-sm mb-3.5">
                No office locations added yet. Click edit to add locations.
              </div>
            )}
            
            <Button variant="ghost" className="text-primary text-sm">
              View countries
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>

      <EditContactDialog
        isOpen={editContactDialog}
        onClose={() => setEditContactDialog(false)}
        onSave={handleSaveContact}
        contact={contact || undefined}
      />

      <EditTechStackDialog
        isOpen={editTechStackDialog}
        onClose={() => setEditTechStackDialog(false)}
        onSave={handleSaveTechStack}
        techStack={techStack}
      />

      <EditBenefitsDialog
        isOpen={editBenefitsDialog}
        onClose={() => setEditBenefitsDialog(false)}
        onSave={handleSaveBenefits}
        benefits={benefits}
      />

      <EditOfficeLocationDialog
        isOpen={editOfficeLocationDialog}
        onClose={() => setEditOfficeLocationDialog(false)}
        onSave={handleSaveOfficeLocations}
        locations={officeLocations}
      />

      <EditAboutDialog
        isOpen={editAboutDialog}
        onClose={() => setEditAboutDialog(false)}
        onSave={handleSaveAbout}
        aboutUs={companyProfile.about_us || ''}
      />

      <EditWorkplacePicturesDialog
        isOpen={editWorkplacePicturesDialog}
        onClose={() => setEditWorkplacePicturesDialog(false)}
        onSave={handleSaveWorkplacePictures}
        pictures={workplacePictures}
      />
    </CompanyLayout>
  )
}

export default CompanyProfile