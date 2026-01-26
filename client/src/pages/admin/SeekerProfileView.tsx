import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { MapPin, Flag, Plus, Globe, Mail, Phone, Loader2, Linkedin, Twitter, Instagram, Link as LinkIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { adminApi } from '@/api/admin.api'
import { toast } from 'sonner'
import type { User } from '@/interfaces/admin/admin-user.interface'
import FormDialog from '../../components/common/FormDialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const SeekerProfileView = () => {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [blockOpen, setBlockOpen] = useState(false)
  const [reasonType, setReasonType] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [blocked, setBlocked] = useState(false)

  const blockReasons = [
    { value: 'fraudulent', label: 'Submitting fake or misleading profile information' },
    { value: 'violation', label: 'Repeated violation of platform rules or guidelines' },
    { value: 'offensive', label: 'Inappropriate or offensive behavior' },
    { value: 'spam', label: 'Engaging in spam or unsolicited contact' },
    { value: 'abuse', label: 'Suspected scam, abuse, or exploitation' },
    { value: 'other', label: 'Other (please specify)' }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return
      try {
        setLoading(true)
        const response = await adminApi.getUserById(id)
        if (response.success && response.data) {
          setUser(response.data)
          setBlocked(response.data.isBlocked)
        } else {
          toast.error(response.message || 'Failed to fetch user data')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        toast.error('An error occurred while fetching user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [id])

  const blockReason = reasonType === 'other'
    ? customReason
    : (blockReasons.find(r => r.value === reasonType)?.label || '');

  const canBlock = reasonType && (reasonType !== 'other' || customReason.trim());

  const handleBlock = async () => {
    if (!canBlock || !user) return;
    try {
      const response = await adminApi.blockUser(user.id, !blocked)
      if (response.success) {
        setBlocked(!blocked)
        toast.success(`User ${!blocked ? 'blocked' : 'unblocked'} successfully`)
        setBlockOpen(false)
      } else {
        toast.error(response.message || 'Failed to update block status')
      }
    } catch (error) {
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

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
          <MapPin className="h-12 w-12 text-gray-400" />
          <p className="text-gray-500">User not found</p>
        </div>
      </AdminLayout>
    )
  }

  const profile = {
    name: user.name || 'No Name',
    position: user.seekerProfile?.headline || 'Seeker',
    company: user.seekerProfile?.experiences?.[0]?.company || 'Looking for opportunities',
    location: user.seekerProfile?.location || 'Not specified',
    openForOpportunities: true,
    bannerImage: user.seekerProfile?.bannerUrl || 'https://rerouting.ca/wp-content/uploads/2020/12/2.png',
    profilePhoto: user.avatar || user.seekerProfile?.avatarUrl || 'https://img.freepik.com/premium-photo/3d-avatar-cartoon-character_113255-103130.jpg',
  }

  const aboutText = user.seekerProfile?.summary || 'No summary provided.'

  const experiences = user.seekerProfile?.experiences.map(exp => ({
    id: exp.id,
    title: exp.title,
    company: exp.company,
    type: exp.employmentType,
    period: `${new Date(exp.startDate).toLocaleDateString()} - ${exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}`,
    location: exp.location || '',
    description: exp.description || ''
  })) || []

  const education = user.seekerProfile?.education.map(edu => ({
    id: edu.id,
    school: edu.school,
    degree: edu.degree || '',
    period: `${new Date(edu.startDate).getFullYear()} - ${edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}`,
    description: ''
  })) || []

  const skills = user.seekerProfile?.skills || []

  const additionalDetails = {
    email: user.email,
    phone: user.seekerProfile?.phone || 'Not specified',
    languages: user.seekerProfile?.languages?.join(', ') || 'Not specified',
  }

  const socialLinks = user.seekerProfile?.socialLinks || []

  const getSocialIcon = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('linkedin')) return <Linkedin className="w-5 h-5 text-[#7c8493] flex-shrink-0" />
    if (n.includes('twitter') || n.includes('x')) return <Twitter className="w-5 h-5 text-[#7c8493] flex-shrink-0" />
    if (n.includes('instagram')) return <Instagram className="w-5 h-5 text-[#7c8493] flex-shrink-0" />
    if (n.includes('website')) return <Globe className="w-5 h-5 text-[#7c8493] flex-shrink-0" />
    return <LinkIcon className="w-5 h-5 text-[#7c8493] flex-shrink-0" />
  }

  return (
    <AdminLayout>
      <div className="p-10 max-w-7xl mx-auto">
        <div className="flex justify-end">
          {!blocked && (
            <Button className="bg-red-100 text-red-700 border-red-300 hover:bg-red-200 mr-2 mb-2" onClick={() => setBlockOpen(true)}>
              Block
            </Button>
          )}
        </div>
        {blocked && <div className="text-red-600 font-semibold p-1">Blocked: {blockReason}</div>}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <div className="lg:col-span-2 space-y-5">

            <Card className="!py-0 border border-[#d6ddeb] overflow-hidden">
              <div className="h-[140px] relative overflow-hidden">
                <img
                  src={profile.bannerImage}
                  alt="Profile Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="px-5 pb-5 relative">
                <div className="flex items-end gap-5 -mt-25 mb-3">
                  <div className="w-[112px] h-[112px] rounded-full border-[3px] border-white bg-gradient-to-br from-[#26a4ff] to-[#4640de] overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                      <img src={profile.profilePhoto} alt="Profile Photo" className="w-full h-full object-cover rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h2 className="text-[19px] text-[#25324b] font-extrabold leading-[1.2]">
                      {profile.name}
                    </h2>
                    <p className="text-[14px] text-[#7c8493]">
                      {profile.position} at <span className="font-medium text-[#25324b]">{profile.company}</span>
                    </p>
                    <div className="flex items-center gap-2 font-medium text-[#7c8493]">
                      <MapPin className="w-4 h-4" />
                      <span className="text-[14px]">{profile.location}</span>
                    </div>
                    {profile.openForOpportunities && (
                      <div className="inline-flex items-center gap-2 bg-[rgba(86,205,173,0.1)] px-5 py-2 rounded-lg mt-2">
                        <Flag className="w-5 h-5 text-[#56cdad]" />
                        <span className="font-semibold text-[13px] text-[#56cdad]">
                          OPEN FOR OPPORTUNITIES
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5 !gap-0 border border-[#d6ddeb]">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-[16px] text-[#25324b]">About Me</p>
              </div>
              <div className="space-y-3 text-[#515b6f] text-[13px] leading-[1.6]">
                {aboutText.split('\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Card>

            <Card className="!gap-0 !p-0 border border-[#d6ddeb]">
              <div className="p-5 flex items-center justify-between border-b border-[#d6ddeb]">
                <p className="font-bold text-[16px] text-[#25324b]">Experiences</p>
              </div>
              <div className="divide-y divide-[#d6ddeb]">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-6 flex gap-5">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {exp.company[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-[14px] text-[#25324b] mb-1">{exp.title}</p>
                          <div className="flex items-center gap-2 text-[13px] text-[#7c8493] mb-1">
                            <span className="font-medium text-[#25324b]">{exp.company}</span>
                            <span>•</span>
                            <span>{exp.type}</span>
                            <span>•</span>
                            <span>{exp.period}</span>
                          </div>
                          <p className="text-[13px] text-[#7c8493]">{exp.location}</p>
                        </div>
                      </div>
                      <p className="text-[13px] text-[#25324b] mt-2">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5 flex justify-center">
                <Button variant="seekerOutline" size="sm" className="text-[13px] font-bold" disabled>
                  Show 3 more experiences
                </Button>
              </div>
            </Card>

            <Card className="!gap-0 !p-0 border border-[#d6ddeb]">
              <div className="p-5 flex items-center justify-between border-b border-[#d6ddeb]">
                <p className="font-bold text-[16px] text-[#25324b]">Educations</p>
              </div>
              <div className="divide-y divide-[#d6ddeb]">
                {education.map((edu) => (
                  <div key={edu.id} className="p-6 flex gap-5">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {edu.school[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-[14px] text-[#25324b] mb-1">{edu.school}</p>
                          <p className="text-[13px] font-medium text-[#7c8493] mb-1">{edu.degree}</p>
                          <p className="text-[13px] text-[#7c8493]">{edu.period}</p>
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-[13px] text-[#25324b] mt-2">{edu.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5 flex justify-center">
                <Button variant="seekerOutline" size="sm" className="text-[13px] font-bold" disabled>
                  Show 2 more educations
                </Button>
              </div>
            </Card>

            <Card className="p-5 !gap-0 border border-[#d6ddeb]">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-[16px] text-[#25324b]">Skills</p>
                <div className="flex gap-2">
                  <Button variant="seekerOutline" size="sm" className="h-8 w-8 !rounded-full" disabled>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="skill">{skill}</Badge>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-5">

            <Card className="p-5 !gap-0 border border-[#d6ddeb]">
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-[16px] text-[#25324b]">Additional Details</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#7c8493] flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium text-[#7c8493] mb-1">Email</p>
                    <p className="text-[13px] font-medium text-[#25324b]">{additionalDetails.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#7c8493] flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium text-[#7c8493] mb-1">Phone</p>
                    <p className="text-[13px] font-medium text-[#25324b]">{additionalDetails.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-[#7c8493] flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium text-[#7c8493] mb-1">Languages</p>
                    <p className="text-[13px] font-medium text-[#25324b]">{additionalDetails.languages}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5 !gap-0 border border-[#d6ddeb]">
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-[16px] text-[#25324b]">Social Links</p>
              </div>
              <div className="space-y-3">
                {socialLinks.length > 0 ? (
                  socialLinks.map((link, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {getSocialIcon(link.name)}
                      <div>
                        <p className="text-[13px] font-medium text-[#7c8493] mb-1 capitalize">{link.name}</p>
                        <a
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[13px] text-[#4640de] font-medium hover:underline cursor-pointer block break-all"
                        >
                          {link.link}
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[13px] text-[#7c8493]">No social links provided.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <FormDialog
        isOpen={blockOpen}
        onClose={() => setBlockOpen(false)}
        onConfirm={handleBlock}
        title="Block Seeker"
        description="Select a reason for blocking this account."
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
    </AdminLayout>
  )
}

export default SeekerProfileView