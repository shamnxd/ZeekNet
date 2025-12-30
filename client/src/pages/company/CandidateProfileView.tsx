import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CompanyLayout from '@/components/layouts/CompanyLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, ArrowLeft, MapPin, Mail, Phone, Download, Building2, GraduationCap, Globe, MessageSquare } from 'lucide-react'
import { companyApi } from '@/api/company.api'
import { chatApi } from '@/api/chat.api'
import { toast } from 'sonner'
import type { CandidateDetailsResponse } from '@/api/company.api'
import type { ApiError } from '@/types/api-error.type'

const CandidateProfileView = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [data, setData] = useState<CandidateDetailsResponse | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (id) {
            fetchCandidateDetails(id)
        }
    }, [id])

    const fetchCandidateDetails = async (candidateId: string) => {
        try {
            setLoading(true)
            const response = await companyApi.getCandidateDetails(candidateId)
            if (response.data) {
                setData(response.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleChat = async () => {
        if (!data?.user?._id) return
        try {
            const conversation = await chatApi.createConversation({ participantId: data.user._id })
            navigate(`/company/messages?chat=${conversation.id}`)
        } catch (error: unknown) {
            const apiError = error as ApiError;
            toast.error(apiError?.response?.data?.message || 'Unable to start chat')
        }
    }

    if (loading) {
        return (
            <CompanyLayout>
                <div className="flex justify-center items-center h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </CompanyLayout>
        )
    }

    if (!data) {
        return (
            <CompanyLayout>
                <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                    <h2 className="text-xl font-semibold">Candidate not found</h2>
                    <Button onClick={() => navigate('/company/candidates')}>Back to Search</Button>
                </div>
            </CompanyLayout>
        )
    }

    const { profile, user, experiences, educations } = data
    const avatarUrl = profile.avatarFileName || profile.avatarUrl
    const bannerUrl = profile.bannerFileName || profile.bannerUrl

    const formatDate = (dateString: string) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }

    return (
        <CompanyLayout>
            <div className="px-6 py-6 space-y-6">
                <div>
                    <Button 
                        variant="ghost" 
                        className="gap-2 text-gray-600 hover:text-gray-900 pl-0 hover:pl-2 transition-all h-8 text-sm" 
                        onClick={() => navigate('/company/candidates')}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Candidates
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Fixed Profile Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-xl border overflow-hidden shadow-sm sticky top-6">
                            {/* Banner Image */}
                            <div className="h-32 bg-gray-100 relative">
                                {bannerUrl && (
                                    <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                                )}
                            </div>

                            <div className="px-6 pb-6 text-center -mt-12 relative">
                                <div className="inline-block relative">
                                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-sm">
                                        <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden border border-gray-100">
                                            {avatarUrl ? (
                                                <img src={avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400 bg-gray-50">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 space-y-1">
                                    <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                                    <p className="text-sm text-primary font-medium">{profile.headline || 'No headline'}</p>
                                    {profile.location && (
                                        <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs mt-2">
                                            <MapPin className="h-3.5 w-3.5" />
                                            <span>{profile.location}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex flex-col gap-3">
                                    {profile.resume?.url && (
                                        <Button 
                                            className="w-full gap-2 h-9 text-xs" 
                                            variant="outline"
                                            onClick={() => window.open(profile.resume!.url, '_blank')}
                                        >
                                            <Download className="h-3.5 w-3.5" />
                                            Download Resume
                                        </Button>
                                    )}
                                    <Button 
                                        className="w-full gap-2 h-9 text-xs"
                                        onClick={handleChat}
                                    >
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        Chat
                                    </Button>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-left">
                                     <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Contact</h3>
                                     <div className="space-y-2">
                                        <a href={`mailto:${user.email}`} className="flex items-center gap-3 text-xs text-gray-600 hover:text-primary transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                                                <Mail className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="truncate">{user.email}</span>
                                        </a>
                                        {profile.phone && (
                                            <div className="flex items-center gap-3 text-xs text-gray-600">
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                                                    <Phone className="h-3.5 w-3.5" />
                                                </div>
                                                <span>{profile.phone}</span>
                                            </div>
                                        )}
                                        {profile.socialLinks && profile.socialLinks.map((link, i) => (
                                            <a key={i} href={link.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs text-gray-600 hover:text-primary transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                                                    <Globe className="h-3.5 w-3.5" />
                                                </div>
                                                <span className="truncate">{link.name}</span>
                                            </a>
                                        ))}
                                     </div>
                                </div>

                                {profile.skills && profile.skills.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-gray-100 text-left">
                                        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Skills</h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {profile.skills.map((skill: string, index: number) => (
                                                <Badge key={index} className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/10 px-2.5 py-0.5 text-[11px] font-normal shadow-none">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Info */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Summary */}
                        {profile.summary && (
                            <div className="bg-white rounded-xl border p-6 shadow-sm">
                                <h2 className="text-base font-semibold mb-4 text-gray-900">About</h2>
                                <p className="text-gray-600 text-[13px] leading-relaxed whitespace-pre-line">{profile.summary}</p>
                            </div>
                        )}

                        {/* Experience */}
                        {experiences.length > 0 && (
                            <div className="bg-white rounded-xl border p-6 shadow-sm">
                                <h2 className="text-base font-semibold mb-6 text-gray-900 flex items-center gap-2">
                                    <Building2 className="h-4.5 w-4.5 text-gray-400" />
                                    Experience
                                </h2>
                                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                                    {experiences.map((exp, index) => (
                                        <div key={exp.id || index} className="relative pl-11">
                                            <div className="absolute left-[15px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-white"></div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                                                <h3 className="font-semibold text-gray-900 text-[15px]">{exp.title}</h3>
                                                {exp.startDate && (
                                                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                                        {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-primary font-medium text-[13px] mb-2">{exp.company}</div>
                                            {exp.description && (
                                                <p className="text-gray-600 text-xs leading-relaxed mb-3 whitespace-pre-line">{exp.description}</p>
                                            )}
                                            {exp.technologies && exp.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {exp.technologies.map((tech, i) => (
                                                        <Badge key={i} variant="secondary" className="bg-gray-50 text-gray-600 border border-gray-100 font-normal text-[10px] px-2 py-0.5">
                                                            {tech}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {educations.length > 0 && (
                            <div className="bg-white rounded-xl border p-6 shadow-sm">
                                <h2 className="text-base font-semibold mb-6 text-gray-900 flex items-center gap-2">
                                    <GraduationCap className="h-4.5 w-4.5 text-gray-400" />
                                    Education
                                </h2>
                                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                                    {educations.map((edu, index) => (
                                        <div key={edu.id || index} className="relative pl-11">
                                            <div className="absolute left-[15px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-white"></div>
                                            <h3 className="font-semibold text-gray-900 text-[15px]">{edu.school}</h3>
                                            <div className="text-gray-600 text-[13px] mb-1">
                                                {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                                            </div>
                                            {edu.startDate && (
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CompanyLayout>
    )
}

export default CandidateProfileView
