import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/api';
import { PublicRoutes } from '@/constants/api-routes';
import { 
  Building2, 
  MapPin, 
  Users, 
  Mail, 
  Phone, 
  Clock,
  MessageCircle,
  Flame,
  Linkedin,
  Twitter,
  Facebook,
  Heart
} from 'lucide-react';
import { useAppSelector } from '@/hooks/useRedux';

import { chatApi } from '@/api/chat.api';
import { UserRole } from '@/constants/enums';
import { toast } from 'sonner';
import PublicHeader from '@/components/layouts/PublicHeader';
import type { ApiError } from '@/types/api-error.type';
import PublicFooter from '@/components/layouts/PublicFooter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CompanyProfileData {
  profile: {
    id: string;
    userId: string;
    companyName: string;
    logo: string;
    banner: string;
    websiteLink: string;
    employeeCount: number;
    industry: string;
    organisation: string;
    aboutUs: string;
    phone?: string;
    foundedDate?: string;
    hasActiveSubscription: boolean;
  };
  contact: {
    email: string;
    phone: string;
    twitterLink?: string;
    facebookLink?: string;
    linkedin?: string;
  } | null;
  locations: Array<{
    id: string;
    city: string;
    state: string;
    country: string;
    address: string;
    isPrimary: boolean;
  }>;
  techStack: Array<{
    id: string;
    name: string;
    category: string;
  }>;
  benefits: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
  }>;
  workplacePictures: Array<{
    id: string;
    imageUrl: string;
    caption?: string;
  }>;
  activeJobCount: number;
}

interface JobPosting {
  id: string;
  title: string;
  location: string;
  salary: { min: number; max: number };
  employmentTypes: string[];
  createdAt: string;
}

export default function CompanyProfilePublic() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role, isAuthenticated } = useAppSelector((state) => state.auth);
  const [companyData, setCompanyData] = useState<CompanyProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [jobsPage, setJobsPage] = useState(1);
  const [hasMoreJobs, setHasMoreJobs] = useState(false);


  const fetchCompanyJobs = useCallback(async (page: number) => {
    try {
      const response = await api.get<{ 
        success: boolean; 
        message: string; 
        data: { 
          jobs: JobPosting[]; 
          hasMore: boolean;
          total: number;
        } 
      }>(
        `${PublicRoutes.COMPANIES}/${id}/jobs?page=${page}&limit=5`
      );

      if (response.data.success) {
        if (page === 1) {
          setJobs(response.data.data.jobs);
        } else {
          setJobs(prev => [...prev, ...response.data.data.jobs]);
        }
        setHasMoreJobs(response.data.data.hasMore);
        setJobsPage(page);
      }
    } catch (error) {
      console.error('Error fetching company jobs:', error);
      toast.error('Failed to load jobs');
    }
  }, [id]);


  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get<{ success: boolean; message: string; data: CompanyProfileData }>(
          `${PublicRoutes.COMPANIES}/${id}`
        );

        if (response.data.success) {
          setCompanyData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching company profile:', error);
        toast.error('Failed to load company profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompanyProfile();
      fetchCompanyJobs(1);
    }
  }, [id, fetchCompanyJobs]);

  const loadMoreJobs = () => {
    fetchCompanyJobs(jobsPage + 1);
  };

  const formatSalary = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const days = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const handleChat = async () => {
    if (!isAuthenticated || role !== UserRole.SEEKER || !companyData?.profile.userId) return;
    try {
      const conversation = await chatApi.createConversation({ participantId: companyData.profile.userId });
      navigate(`/seeker/messages?chat=${conversation.id}`);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast.error(apiError?.response?.data?.message || "Failed to start chat");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-poppins">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            .font-poppins {
              font-family: 'Poppins', sans-serif;
            }
          `}
        </style>
        <section className="bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center bg-no-repeat">
          <PublicHeader />
        </section>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="min-h-screen bg-background font-poppins">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            .font-poppins {
              font-family: 'Poppins', sans-serif;
            }
          `}
        </style>
        <section className="bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center bg-no-repeat">
          <PublicHeader />
        </section>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Company not found</h3>
            <button
              onClick={() => navigate('/companies')}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Back to Companies
            </button>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const { profile, contact, locations, techStack, benefits, workplacePictures } = companyData;

  return (
    <div className="min-h-screen bg-gray-50/50 font-poppins">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
          .font-poppins {
            font-family: 'Poppins', sans-serif;
          }
        `}
      </style>

      <section className="bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center bg-no-repeat">
        <PublicHeader />
      </section>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
                  {profile.logo ? (
                    <img src={profile.logo} alt="Company Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-gray-400">{profile.companyName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    {profile.companyName}
                    {profile.hasActiveSubscription && (
                       <i className="fi fi-ss-shield-trust text-primary text-xl flex-shrink-0" />
                    )}
                  </h1>
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    {profile.websiteLink ? (
                      <a 
                        href={profile.websiteLink.startsWith('http') ? profile.websiteLink : `https://${profile.websiteLink}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        {profile.websiteLink}
                      </a>
                    ) : (
                      <span className="text-gray-500">No website provided</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 group">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Flame className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Founded</div>
                      <div className="font-semibold text-gray-900">{profile.foundedDate ? new Date(profile.foundedDate).getFullYear() : 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 group">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Employees</div>
                      <div className="font-semibold text-gray-900">{profile.employeeCount || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 group">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100 transition-colors">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Location</div>
                      <div className="font-semibold text-gray-900">{locations.length > 0 ? locations[0].city : 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 group">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Industry</div>
                      <div className="font-semibold text-gray-900">{profile.industry}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated && role === UserRole.SEEKER && (
                <Button
                  onClick={handleChat}
                  className="bg-primary text-white hover:bg-primary/90 px-6 py-2.5 h-auto shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                About us
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                {profile.aboutUs || 'No description available for this company.'}
              </p>
            </section>

            {/* Contact Section */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact</h3>
              {contact ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {contact.twitterLink && (
                      <a href={contact.twitterLink} target="_blank" rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-primary hover:text-primary hover:bg-primary/5 transition-all text-sm font-medium text-gray-700">
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </a>
                    )}
                    {contact.facebookLink && (
                      <a href={contact.facebookLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-primary hover:text-primary hover:bg-primary/5 transition-all text-sm font-medium text-gray-700">
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </a>
                    )}
                    {contact.linkedin && (
                      <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-primary hover:text-primary hover:bg-primary/5 transition-all text-sm font-medium text-gray-700">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} 
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all text-sm font-medium text-gray-700">
                        <Phone className="h-4 w-4" />
                        {contact.phone}
                      </a>
                    )}
                    {contact.email && (
                      <a href={`mailto:${contact.email}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all text-sm font-medium text-gray-700">
                        <Mail className="h-4 w-4" />
                        {contact.email}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm italic">
                  No contact information available.
                </div>
              )}
            </section>

            {/* Workplace Pictures */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Workplace</h3>
              {workplacePictures.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="md:row-span-2 relative h-64 md:h-full rounded-xl overflow-hidden group">
                      <img 
                        src={workplacePictures[0].imageUrl} 
                        alt={workplacePictures[0].caption || "Workplace"} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      {workplacePictures[0].caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <p className="text-white text-sm font-medium truncate">{workplacePictures[0].caption}</p>
                        </div>
                      )}
                   </div>
                   <div className="grid grid-cols-2 gap-4 h-64">
                      {workplacePictures.slice(1, 5).map((picture) => (
                        <div key={picture.id} className="relative rounded-xl overflow-hidden group">
                           <img 
                            src={picture.imageUrl} 
                            alt={picture.caption || "Workplace"} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                        </div>
                      ))}
                   </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                   <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <div className="text-gray-500 text-sm">No workplace pictures added yet</div>
                </div>
              )}
            </section>

            {/* Benefits */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits</h3>
              {benefits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit) => (
                    <div key={benefit.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-primary/20 hover:shadow-md transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                          <Heart className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                          <p className="text-sm text-gray-600 leading-snug">{benefit.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm italic">
                  No benefits listed.
                </div>
              )}
            </section>

            {/* Open Positions */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Open Positions</h3>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  {jobs.length} Active
                </Badge>
              </div>
              
              {jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div 
                      key={job.id} 
                      onClick={() => navigate(`/jobs/${job.id}`)} 
                      className="group border border-gray-100 bg-white rounded-xl p-5 hover:border-primary/20 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                            {job.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                              <MapPin className="h-3.5 w-3.5" />
                              {job.location}
                            </span>
                            {job.salary && (
                              <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md text-green-700 font-medium">
                                {formatSalary(job.salary.min, job.salary.max)}
                              </span>
                            )}
                             <span className="flex items-center gap-1.5 text-xs">
                                <Clock className="w-3.5 h-3.5" />
                                {getTimeAgo(job.createdAt)}
                              </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                           <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                             Apply Now
                           </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {hasMoreJobs && (
                      <Button variant="outline" onClick={loadMoreJobs} className="w-full mt-4 border-primary/20 text-primary hover:bg-primary/5">
                        View More Jobs
                      </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
                  <p className="text-gray-500">No active job postings available at the moment.</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Tech Stack */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tech Stack</h3>
              {techStack.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <div key={tech.id} className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all w-[calc(33.33%-0.5rem)] border border-transparent hover:border-gray-100">
                       <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-2 text-lg font-bold text-gray-700 border border-gray-100">
                          {tech.name.charAt(0).toUpperCase()}
                       </div>
                       <span className="text-xs font-medium text-center text-gray-600 line-clamp-1 w-full">{tech.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm italic">
                  No tech stack listed.
                </div>
              )}
            </div>

            {/* Office Locations */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Office Locations</h3>
              {locations.length > 0 ? (
                <div className="space-y-4">
                  {locations.map((location) => (
                    <div key={location.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="text-2xl pt-1">🏢</div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{location.city}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{location.address}</div>
                        {location.isPrimary && (
                          <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none text-[10px] px-2">
                            Headquarters
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm italic">
                  No locations listed.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
