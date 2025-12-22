import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api';
import { PublicRoutes } from '@/constants/api-routes';
import { Building2, Briefcase, CheckCircle2, Search } from 'lucide-react';
import { toast } from 'sonner';
import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';

interface Company {
  id: string;
  companyName: string;
  logo: string;
  industry: string;
  aboutUs: string;
  activeJobCount: number;
  hasActiveSubscription: boolean;
}

interface CompaniesResponse {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Companies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (searchTerm) params.append('search', searchTerm);

        const response = await api.get<{ success: boolean; message: string; data: CompaniesResponse }>(
          `${PublicRoutes.COMPANIES}?${params.toString()}`
        );

        if (response.data.success) {
          setCompanies(response.data.data.companies);
          setTotalPages(response.data.data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error('Failed to load companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [page, searchTerm, limit]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

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

      <section className="flex flex-col items-center text-sm bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center bg-no-repeat">
        <PublicHeader />

        <main className="flex flex-col items-center max-md:px-2 pb-20 w-full">
          <div className="container max-w-[1440px] mx-auto px-4 lg:px-16 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Explore <span className="text-primary">Companies</span>
              </h1>
              <p className="text-lg text-slate-700 max-w-2xl mx-auto">
                Discover amazing companies hiring now and find your perfect workplace
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search companies by name, industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white shadow-sm"
                />
              </div>
            </form>

            {/* Companies Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : companies.length === 0 ? (
              <div className="text-center py-16">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {companies.map((company) => (
                    <div
                      key={company.id}
                      onClick={() => navigate(`/company/${company.id}`)}
                      className="bg-white rounded-2xl p-6 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer border border-gray-100 hover:border-primary/30 group"
                    >
                      {/* Company Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative">
                          <img
                            src={company.logo || '/default-company-logo.png'}
                            alt={company.companyName}
                            className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100 group-hover:border-primary/30 transition"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-company-logo.png';
                            }}
                          />
                          {company.hasActiveSubscription && (
                            <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition truncate">
                            {company.companyName}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {company.industry}
                          </p>
                        </div>
                      </div>

                      {/* About Section */}
                      <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                        {truncateText(company.aboutUs, 120)}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-gray-900">{company.activeJobCount}</span>
                          <span className="text-gray-600">active {company.activeJobCount === 1 ? 'job' : 'jobs'}</span>
                        </div>
                        {company.hasActiveSubscription && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </section>

      <PublicFooter />
    </div>
  );
}
