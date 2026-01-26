import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import CompanyLayout from '@/components/layouts/CompanyLayout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Search, MapPin, Lock, Crown } from 'lucide-react'
import { companyApi } from '@/api/company.api'
import type { Candidate } from '@/api/company.api'
import { useDebounce } from '@/hooks/useDebounce'
import { Badge } from '@/components/ui/badge'

const FindCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limitReached, setLimitReached] = useState(false)
  const navigate = useNavigate()

  const debouncedSearch = useDebounce(search, 500)
  const debouncedLocation = useDebounce(location, 500)

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true)
      setLimitReached(false)
      const response = await companyApi.getCandidates({
        page,
        limit: 12,
        search: debouncedSearch,
        location: debouncedLocation
      })
      setCandidates(response.data?.candidates || [])
      setTotalPages(response.data?.totalPages || 1)
    } catch (error: unknown) {
      console.error(error)
      const err = error as { response?: { data?: { message?: string } } };
      if (err?.response?.data?.message?.includes('limit') || err?.response?.data?.message?.includes('subscription')) {
        setLimitReached(true)
        setCandidates([])
      }
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, debouncedLocation])

  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])

  return (
    <CompanyLayout>
      <div className="px-4 py-4 space-y-6">
        <div>
          <h1 className="text-xl mt-5 font-bold text-gray-900">Find Candidates</h1>
          <p className="text-gray-500">Discover and connect with talented professionals</p>
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, skills, or headline..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <div className="relative w-full md:w-64">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : limitReached ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 max-w-md w-full border-2 border-amber-200 shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="bg-amber-100 p-4 rounded-full">
                  <Lock className="h-8 w-8 text-amber-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Candidate View Limit Reached
              </h2>
              <p className="text-gray-600 text-center mb-6">
                You've reached your monthly candidate view limit. Upgrade your subscription to continue discovering talented professionals.
              </p>
              <Button
                onClick={() => navigate('/company/subscription')}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-lg shadow-md"
              >
                <Crown className="h-5 w-5 mr-2" />
                Upgrade Subscription
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {candidates.map((candidate) => (
              <div key={candidate.id} onClick={() => navigate(`/company/candidates/${candidate.id}`)} className="bg-white rounded-lg border p-3.5 hover:shadow-sm transition cursor-pointer flex flex-col h-full hover:border-primary group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 group-hover:ring-2 ring-primary ring-offset-2 transition-all">
                    {candidate.avatar ? (
                      <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[13px] font-bold text-gray-400">
                        {candidate.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">{candidate.name}</h3>
                    <p className="text-primary font-medium text-[12px] line-clamp-1">{candidate.headline || 'Open to work'}</p>
                    {candidate.location && (
                      <div className="flex items-center gap-0.5 text-gray-500 text-[11px] mt-0.5">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-2">{candidate.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2.5 flex-1">
                  <p className="text-[11px] text-gray-500 line-clamp-3 leading-snug">
                    {candidate.summary || 'No summary available.'}
                  </p>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {candidate.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="!bg-gray-50 !text-gray-600 !border-gray-100 !text-[10px] px-2 py-0.5">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 3 && (
                    <Badge variant="secondary" className="!bg-gray-50 !text-gray-600 !border-gray-100 !text-[10px] px-2 py-0.5">
                      +{candidate.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            ))}

            {candidates.length === 0 && !limitReached && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No candidates found matching your criteria.
              </div>
            )}

            {candidates.length > 0 && (
              <div className="col-span-full flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </CompanyLayout>
  )
}

export default FindCandidates
