import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/api';
import { PublicRoutes } from '@/constants/api-routes';
import { 
  Building2, 
  MapPin, 
  Users, 
  Globe, 
  Calendar,
  Briefcase,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  Mail,
  Phone,
  Award,
  Code,
  DollarSign,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';

interface CompanyProfileData {
  profile: {
    id: string;
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
  const [companyData, setCompanyData] = useState<CompanyProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsPage, setJobsPage] = useState(1);
  const [hasMoreJobs, setHasMoreJobs] = useState(false);


  const fetchCompanyJobs = useCallback(async (page: number) => {
    try {
      setJobsLoading(true);
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
    } finally {
      setJobsLoading(false);
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
      fetchCompanyJobs(1); // Load first 5 jobs
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

      {/* Banner */}
      <div className="relative h-64 bg-gradient-to-r from-primary to-primary/80">
        {profile.banner && (
          <img
            src={profile.banner}
            alt="Company banner"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/companies')}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Companies
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Header Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-start gap-6">
                <div className="relative">
                  {profile.logo ? (
                    <img
                      src={profile.logo}
                      alt={profile.companyName}
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-24 h-24 rounded-2xl bg-gray-50 flex items-center justify-center border-4 border-white shadow-lg ${profile.logo ? 'hidden' : ''}`}>
                    <Building2 className="w-10 h-10 text-gray-300" />
                  </div>
                  {profile.hasActiveSubscription && (
                    <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1.5 shadow-lg">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.companyName}</h1>
                      <p className="text-lg text-gray-600">{profile.organisation}</p>
                    </div>
                    {profile.websiteLink && (
                      <a
                        href={profile.websiteLink.startsWith('http') ? profile.websiteLink : `https://${profile.websiteLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition shadow-lg shadow-primary/25"
                      >
                        <Globe className="w-4 h-4" />
                        Visit Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-gray-500">Industry</p>
                        <p className="font-semibold">{profile.industry}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-gray-500">Employees</p>
                        <p className="font-semibold">{profile.employeeCount}+</p>
                      </div>
                    </div>
                    {profile.foundedDate && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs text-gray-500">Founded</p>
                          <p className="font-semibold">{new Date(profile.foundedDate).getFullYear()}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-700">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-gray-500">Active Jobs</p>
                        <p className="font-semibold">{companyData.activeJobCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {profile.companyName}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{profile.aboutUs}</p>
            </div>

            {/* Tech Stack */}
            {techStack.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <Code className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-gray-900">Tech Stack</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech.id}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {benefits.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-gray-900">Benefits & Perks</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit) => (
                    <div key={benefit.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                        {benefit.description && (
                          <p className="text-sm text-gray-600 mt-1">{benefit.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workplace Pictures */}
            {workplacePictures.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Life at {profile.companyName}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {workplacePictures.map((picture) => (
                    <div key={picture.id} className="relative group overflow-hidden rounded-lg">
                      <img
                        src={picture.imageUrl}
                        alt={picture.caption || 'Workplace'}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {picture.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <p className="text-white text-sm">{picture.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Open Positions */}
            {(jobs.length > 0 || companyData?.activeJobCount > 0) && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Open Positions ({companyData?.activeJobCount || 0})</h2>
                </div>
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="p-6 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {formatSalary(job.salary.min, job.salary.max)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {getTimeAgo(job.createdAt)}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            {job.employmentTypes.map((type, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {jobsLoading && (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  )}
                  
                  {hasMoreJobs && !jobsLoading && (
                    <button
                      onClick={loadMoreJobs}
                      className="w-full py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-medium"
                    >
                      View More Jobs
                    </button>
                  )}
                  
                  {jobs.length === 0 && !jobsLoading && (
                    <div className="text-center py-8 text-gray-500">
                      No open positions at the moment
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Locations */}
          <div className="space-y-6">
            {/* Contact Info */}
            {contact && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {contact.email && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail className="w-5 h-5 text-primary" />
                      <a href={`mailto:${contact.email}`} className="hover:text-primary transition">
                        {contact.email}
                      </a>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone className="w-5 h-5 text-primary" />
                      <a href={`tel:${contact.phone}`} className="hover:text-primary transition">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Office Locations */}
            {locations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Office Locations</h3>
                <div className="space-y-4">
                  {locations.map((location) => (
                    <div key={location.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      {location.isPrimary && (
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded mb-2">
                          Headquarters
                        </span>
                      )}
                      <p className="font-semibold text-gray-900">{location.city}, {location.state}</p>
                      <p className="text-sm text-gray-600">{location.country}</p>
                      {location.address && (
                        <p className="text-sm text-gray-500 mt-1">{location.address}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
