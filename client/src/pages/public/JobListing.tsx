import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Briefcase,
  Search,
  MapPin,
  Crosshair
} from "lucide-react";
import JobCard from "@/components/jobs/JobCard";
import SidebarFilters from "@/components/jobs/SidebarFilters";
import { jobApi } from "@/api/job.api";
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";
import type { JobPostingQuery } from "@/interfaces/job/job-posting-query.interface";
import PublicHeader from "@/components/layouts/PublicHeader";
import PublicFooter from "@/components/layouts/PublicFooter";

const JobListing = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPostingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [currentQuery, setCurrentQuery] = useState<JobPostingQuery>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const fetchJobs = useCallback(async (query: JobPostingQuery = {}, page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await jobApi.getAllJobs({
        ...query,
        page,
        limit: pagination.limit,
      });
      
      if (response.success && response.data) {
        const responseData = response.data;
        setJobs(responseData.jobs || []);
        setPagination((prev) => ({
          ...prev,
          page: responseData.pagination?.page || page,
          limit: responseData.pagination?.limit || prev.limit,
          total: responseData.pagination?.total || 0,
          totalPages: responseData.pagination?.totalPages || 0,
        }));
        setCurrentQuery(query);
      } else {
        setError(response.message || 'Failed to fetch jobs');
        setJobs([]);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = async (filterQuery: JobPostingQuery) => {
    await fetchJobs({
      ...filterQuery,
      search: searchQuery.trim() || undefined,
      location: location.trim() || undefined,
    }, 1);
  };

  const handleTextSearch = async () => {
    await fetchJobs({
      ...currentQuery,
      search: searchQuery.trim() || undefined,
      location: location.trim() || undefined,
    }, 1);
  };

  const handlePageChange = (page: number) => {
    fetchJobs(currentQuery, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (!pagination.totalPages || pagination.totalPages <= 1 || jobs.length === 0) {
      return null;
    }

    const currentPage = pagination.page || 1;
    const totalPages = pagination.totalPages || 1;
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col items-center gap-4 mt-8">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-[#3570E2] text-white'
                  : 'text-[#394047] hover:bg-gray-50'
              }`}
            >
              {page.toString().padStart(2, '0')}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="text-sm text-[#394047]">
          Page {currentPage} of {totalPages} ({pagination.total || 0} jobs)
        </div>
      </div>
    );
  };

  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#3570E2]" />
        <p className="text-[#394047]">Loading jobs...</p>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h3 className="text-lg font-semibold text-[#141414]">Oops! Something went wrong</h3>
        <p className="text-[#394047] max-w-md">{error}</p>
        <Button onClick={() => fetchJobs()} className="mt-4 bg-[#3570E2] hover:bg-[#3570E2]/90">
          Try Again
        </Button>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center space-y-4 text-center">
        <Briefcase className="w-12 h-12 text-gray-400" />
        <h3 className="text-lg font-semibold text-[#141414]">No jobs found</h3>
        <p className="text-[#394047] max-w-md">
          We couldn't find any jobs matching your criteria. Try adjusting your filters.
        </p>
        <Button 
          variant="outline" 
          onClick={() => fetchJobs({})}
          className="mt-4"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-poppins">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
          .font-poppins {
            font-family: 'Poppins', sans-serif;
          }
        `}
      </style>
      
      <div className="flex flex-col items-center text-sm bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center bg-no-repeat">
        <PublicHeader />
      </div>

      <div className="container max-w-[1440px] mx-auto px-4 lg:px-16 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          <aside className="w-full lg:w-[280px] flex-shrink-0">
            <div className="bg-white border border-gray-100 rounded-lg p-6 lg:sticky lg:top-8">

              <h2 className="text-[20px] font-bold text-[#141414] mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Filters
              </h2>

              <SidebarFilters onSearch={handleSearch} loading={loading} />
            </div>
          </aside>


          <main className="flex-1 min-w-0">

            <div className="mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex flex-col md:flex-row items-center gap-3">

                  <div className="flex-1 w-full">
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center px-3 py-3 border-r border-gray-200">
                        <Search className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search by: Job title, Position, Keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
                        className="flex-1 px-3 py-3 text-sm placeholder-gray-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  

                  <div className="w-px h-12 bg-gray-200 hidden md:block"></div>
                  

                  <div className="flex-1 w-full">
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center px-3 py-3 border-r border-gray-200">
                        <Crosshair className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="City, state or zip code"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
                        className="flex-1 px-3 py-3 text-sm placeholder-gray-400 focus:outline-none"
                      />
                      <div className="px-3 py-3">
                        <MapPin className="w-5 h-5 text-[#3570E2]" />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleTextSearch}
                    disabled={loading}
                    className="w-full md:w-auto bg-[#3570E2] hover:bg-[#3570E2]/90 text-white px-6"
                  >
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-[32px] font-bold text-[#141414]" style={{ fontFamily: 'DM Sans, sans-serif', lineHeight: '48px' }}>
                {pagination.total || 0} Job{(pagination.total || 0) !== 1 ? 's' : ''}
              </h1>
            </div>

            {loading && renderLoadingState()}
            {error && !loading && renderErrorState()}
            {!loading && !error && jobs.length === 0 && renderEmptyState()}
            
            {!loading && !error && jobs.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id || job._id}
                      job={job}
                      onViewDetails={(jobId) => navigate(`/jobs/${jobId}`)}
                    />
                  ))}
                </div>
                {renderPagination()}
              </>
            )}
          </main>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
};

export default JobListing;
