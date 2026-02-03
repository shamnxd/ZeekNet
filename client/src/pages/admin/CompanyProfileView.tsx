import AdminLayout from '../../components/layouts/AdminLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import {
  Building2,
  MapPin,
  Users,
  ArrowRight,
  Linkedin,
  Twitter,
  Facebook,
  Phone,
  Mail,
  Briefcase,
  Flame,
  Loader2
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { adminApi } from '@/api/admin.api'
import { toast } from 'sonner'
import type { Company } from '@/interfaces/admin/admin-company.interface'
import FormDialog from '../../components/common/FormDialog'

const CompanyProfileView = () => {
  const { id } = useParams<{ id: string }>()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [blockOpen, setBlockOpen] = useState(false)
  const [reasonType, setReasonType] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [blocked, setBlocked] = useState(false)

  const blockReasons = [
    { value: 'fraudulent', label: 'Posting fraudulent jobs or misleading company information' },
    { value: 'violation', label: 'Repeated violation of platform rules, guidelines or TOS' },
    { value: 'offensive', label: 'Inappropriate or offensive behavior' },
    { value: 'duplicate', label: 'Duplicate posting or spam' },
    { value: 'abuse', label: 'Suspected scam, abuse, or exploitation' },
    { value: 'other', label: 'Other (please specify)' }
  ];

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!id) return
      try {
        setLoading(true)
        const response = await adminApi.getCompanyById(id)
        if (response.success && response.data) {
          setCompany(response.data)
          setBlocked(response.data.isBlocked)
        } else {
          toast.error(response.message || 'Failed to fetch company data')
        }
      } catch (error) {
        console.error('Error fetching company:', error)
        toast.error('An error occurred while fetching company data')
      } finally {
        setLoading(false)
      }
    }

    fetchCompanyData()
  }, [id])

  const blockReason = reasonType === 'other'
    ? customReason
    : (blockReasons.find(r => r.value === reasonType)?.label || '');

  const canBlock = reasonType && (reasonType !== 'other' || customReason.trim());

  const handleBlock = async () => {
    if (!canBlock || !company) return;
    try {
      const response = await adminApi.blockUser(company.userId, !blocked)
      if (response.success) {
        setBlocked(!blocked)
        toast.success(`Company ${!blocked ? 'blocked' : 'unblocked'} successfully`)
        setBlockOpen(false)
      } else {
        toast.error(response.message || 'Failed to update block status')
      }
    } catch {
      toast.error('An error occurred while updating block status')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    )
  }

  if (!company) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
          <Building2 className="h-12 w-12 text-gray-400" />
          <p className="text-gray-500">Company not found</p>
        </div>
      </AdminLayout>
    )
  }

  // Mapping actual data from the company object
  const displayData = {
    profile: {
      company_name: company.companyName,
      website_link: company.websiteLink || 'Not specified',
      industry: company.industry || 'Not specified',
      created_at: company.createdAt,
      about_us: company.aboutUs || 'No about information provided.',
      logo: company.logo,
      banner: company.banner
    },
    contact: {
      email: company.contact?.email || company.email || 'Not specified',
      phone: company.contact?.phone || 'Not specified',
      twitter_link: company.contact?.twitterLink || 'Not specified',
      facebook_link: company.contact?.facebookLink || 'Not specified',
      linkedin: company.contact?.linkedin || 'Not specified'
    },
    locations: company.locations?.map(loc => ({
      id: loc.id,
      location: loc.city || 'Unknown',
      officeName: 'Office',
      address: loc.address || '',
      isHeadquarters: loc.isPrimary
    })) || [],
    techStack: company.techStack || [],
    pictures: company.workplacePictures || [],
    jobs: [] as { id: string, title: string, description: string, location: string, employmentType: string }[]
  }

  const { profile, contact, locations, techStack, pictures, jobs } = displayData

  return (
    <AdminLayout>
      <div className="bg-white border-b border-gray-200 px-7 py-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-5">
            <div className="relative">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
                {profile.logo ? (
                  <img src={profile.logo} alt="Company Logo" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white">{profile.company_name.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{profile.company_name}</div>
                <div className="text-base font-semibold text-purple-500">{profile.website_link}</div>
              </div>

              <div className="flex items-center gap-7">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center">
                    <Flame className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Founded</div>
                    <div className="font-semibold text-gray-900 text-sm">{new Date(profile.created_at).getFullYear()}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Employees</div>
                    <div className="font-semibold text-gray-900 text-sm">{company.employeeCount || 'Not specified'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Location</div>
                    <div className="font-semibold text-gray-900 text-sm">{locations[0]?.location || 'Not specified'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Industry</div>
                    <div className="font-semibold text-gray-900 text-sm">{profile.industry}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            {!blocked && (
              <Button className="bg-red-100 text-red-700 border-red-300 hover:bg-red-200 mr-2" onClick={() => setBlockOpen(true)}>
                Block
              </Button>
            )}
          </div>
        </div>
        {blocked && <div className="text-red-600 font-semibold p-1">Blocked: {blockReason}</div>}
      </div>

      <FormDialog
        isOpen={blockOpen}
        onClose={() => setBlockOpen(false)}
        onConfirm={handleBlock}
        title="Block Company"
        description="Select a reason for blocking this company account."
        confirmText="Block"
        cancelText="Cancel"
        confirmVariant="destructive"
        isLoading={false}
      >
        <div>
          <label className="text-sm font-medium mb-1 block">Reason</label>
          <Select value={reasonType} onValueChange={setReasonType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select reason..." />
            </SelectTrigger>
            <SelectContent>
              {blockReasons.map(reason => (
                <SelectItem value={reason.value} key={reason.value}>{reason.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {reasonType === 'other' && (
            <textarea
              className="mt-2 w-full border rounded p-2 text-sm min-h-[90px]"
              value={customReason}
              onChange={e => setCustomReason(e.target.value)}
              required
              placeholder="Describe the reason for blocking..."
            />
          )}
        </div>
      </FormDialog>

      <div className="flex gap-5 px-5 py-7">
        <div className="flex-1 space-y-5">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-lg font-semibold">About us</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm">
              {profile.about_us}
            </p>
          </div>

          <div className="border-t border-gray-200"></div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-lg font-semibold">Contact</h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex gap-2.5">
                <div className="flex items-center gap-3 px-2.5 py-1.5 border border-primary rounded-lg text-primary">
                  <Twitter className="h-4 w-4" />
                  <span className="font-medium text-sm">{contact.twitter_link}</span>
                </div>
                <div className="flex items-center gap-3 px-2.5 py-1.5 border border-primary rounded-lg text-primary">
                  <Facebook className="h-4 w-4" />
                  <span className="font-medium text-sm">{contact.facebook_link}</span>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="flex items-center gap-3 px-2.5 py-1.5 border border-primary rounded-lg text-primary">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium text-sm">{contact.phone}</span>
                </div>
                <div className="flex items-center gap-3 px-2.5 py-1.5 border border-primary rounded-lg text-primary">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium text-sm">{contact.email}</span>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="flex items-center gap-3 px-2.5 py-1.5 border border-primary rounded-lg text-primary">
                  <Linkedin className="h-4 w-4" />
                  <span className="font-medium text-sm">{contact.linkedin}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-lg font-semibold">Workplace Pictures</h3>
            </div>
            <div className="flex gap-2.5">
              {pictures.slice(0, 1).map((picture) => (
                <div key={picture.id} className="w-64 h-72 bg-gray-200 rounded-lg overflow-hidden">
                  <img src={picture.imageUrl} alt={picture.caption || 'Workplace'} className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="flex flex-col gap-2.5">
                {pictures.slice(1, 4).map((picture) => (
                  <div key={picture.id} className="w-48 h-44 bg-gray-200 rounded-lg overflow-hidden">
                    <img src={picture.imageUrl} alt={picture.caption || 'Workplace'} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-lg font-semibold">Open Positions</h3>
              <Button variant="ghost" className="text-primary text-sm" disabled>
                Show all jobs
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </div>
            {jobs.length > 0 ? (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-3">
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
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm text-center py-4">No active job postings available.</div>
            )}
          </div>
        </div>

        <div className="w-80 space-y-7">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-lg font-semibold">Tech Stack</h3>
            </div>
            {techStack.length > 0 ? (
              <div>
                {Array.from({ length: Math.ceil(techStack.length / 3) }).map((_, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2.5 mb-2.5">
                    {techStack.slice(rowIndex * 3, (rowIndex + 1) * 3).map((tech) => (
                      <div key={tech.id} className="flex flex-col items-center gap-1.5 p-2.5">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-semibold">{tech.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-xs">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3.5">
                  <Button variant="ghost" className="text-primary text-sm" disabled>
                    View tech stack
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">No tech stack added yet.</div>
            )}
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-lg font-semibold">Office Locations</h3>
            </div>
            {locations.length > 0 ? (
              <div className="space-y-2.5 mb-3.5">
                {locations.map((location) => (
                  <div key={location.id} className="flex items-center gap-2.5">
                    <div className="text-xl">🏢</div>
                    <div className="flex-1">
                      <div className="font-semibold text-xs">{location.location}</div>
                      {location.isHeadquarters && (
                        <Badge className="bg-blue-100 text-blue-700 text-xs mt-1 px-2 py-0.5">Headquarters</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm mb-3.5">No office locations added yet.</div>
            )}
            <Button variant="ghost" className="text-primary text-sm" disabled>
              View countries
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default CompanyProfileView