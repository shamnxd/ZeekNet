import { ChevronLeft, ChevronRight, Search, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { jobApplicationApi } from '@/api'
import { toast } from 'sonner'
import type { ApiError } from '@/types/api-error.type'
import { useNavigate } from 'react-router-dom'

import { ApplicationStage } from '@/constants/enums'
import type { Application } from '@/interfaces/application/application.interface';

const stageStyles: Record<string, string> = {
  [ApplicationStage.APPLIED]: 'border-[#d1d5db] text-[#374151] bg-[#f3f4f6]/70',
  [ApplicationStage.SHORTLISTED]: 'border-[#34d39933] text-[#047857] bg-[#dcfce7]/70',
  [ApplicationStage.INTERVIEW]: 'border-[#fb923c33] text-[#c2410c] bg-[#ffedd5]/70',
  [ApplicationStage.REJECTED]: 'border-[#f8717133] text-[#b91c1c] bg-[#fee2e2]/70',
  [ApplicationStage.HIRED]: 'border-[#4f46e533] text-[#4338ca] bg-[#e0e7ff]/70',
  APPLIED: 'border-[#d1d5db] text-[#374151] bg-[#f3f4f6]/70',
  IN_REVIEW: 'border-[#9ca3af] text-[#4b5563] bg-[#f3f4f6]/70',
  SHORTLISTED: 'border-[#34d39933] text-[#047857] bg-[#dcfce7]/70',
  INTERVIEW: 'border-[#fb923c33] text-[#c2410c] bg-[#ffedd5]/70',
  TECHNICAL_TASK: 'border-[#ec489933] text-[#be185d] bg-[#fce7f3]/70',
  COMPENSATION: 'border-[#f59e0b33] text-[#b45309] bg-[#fffbeb]/70',
  OFFER: 'border-[#10b98133] text-[#047857] bg-[#d1fae5]/70',
  HIRED: 'border-[#4f46e533] text-[#4338ca] bg-[#e0e7ff]/70',
  REJECTED: 'border-[#f8717133] text-[#b91c1c] bg-[#fee2e2]/70',
}

function SeekerApplications() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stage, setStage] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await jobApplicationApi.getSeekerApplications({ stage, search: searchQuery || undefined, page, limit })
        const data = res?.data?.data || res?.data
        setItems(data?.applications || [])
        setTotal(data?.pagination?.total || 0)
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const message = apiError?.response?.data?.message || 'Failed to load applications'
        setError(message)
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [stage, searchQuery, page, limit])

  const tabs = [
    { label: 'All', key: undefined },
    { label: 'In Review', key: 'in_review' },
    { label: 'Applied', key: ApplicationStage.APPLIED },
    { label: 'Shortlisted', key: ApplicationStage.SHORTLISTED },
    { label: 'Interview', key: ApplicationStage.INTERVIEW },
    { label: 'Rejected', key: ApplicationStage.REJECTED },
    { label: 'Hired', key: ApplicationStage.HIRED },
  ] as { label: string; key: string | undefined }[]

  return (
    <div className="px-8 xl:px-11 py-9 space-y-6 bg-[#f8f9ff] min-h-screen">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-[26px] font-bold text-[#1f2937]">My Applications</h1>
          <p className="text-[14px] text-[#6b7280]">Track your application progress</p>
        </div>

      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="space-y-6 border-b border-[#e5e7eb] px-6 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-[22px] font-bold text-[#1f2937]">Applications History</h2>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex w-full items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-[13px] shadow-sm transition-all focus-within:border-[#4640de] focus-within:ring-2 focus-within:ring-[#6366f1]/20">
                <Search className="h-4 w-4 text-[#6b7280]" />
                <input
                  className="w-full bg-transparent text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none"
                  type="search"
                  placeholder="Search applications"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[14px] font-semibold">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                className={cn(
                  'relative pb-2 transition-all duration-200',
                  tab.key === stage
                    ? 'text-[#1f2937] after:absolute after:-bottom-[1px] after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[#4640de]'
                    : 'text-[#9ca3af] hover:text-[#4640de]'
                )}
                onClick={() => setStage(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="text-left text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">
                <th className="px-6 py-4">#</th>
                <th className="py-4 pr-6">Company</th>
                <th className="py-4 pr-6">Job</th>
                <th className="py-4 pr-6">Date Applied</th>
                <th className="py-4 pr-6">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(loading ? (Array.from({ length: 5 }) as (Application | undefined)[]) : items).map((application, index) => {
                const appId = application?.id || application?._id
                return (
                <tr
                  key={appId || index}
                  className={cn(
                    'align-middle text-[14px] text-[#1f2937] transition-colors duration-200',
                    index % 2 === 1 ? 'bg-[#f9fafc]' : 'bg-white',
                    'hover:bg-[#f8f9ff]'
                  )}
                >
                  <td className="px-6 py-5 text-[13px] font-semibold text-[#6b7280]">
                    {String(index + 1 + (page - 1) * limit).padStart(2, '0')}
                  </td>
                  <td className="py-5 pr-6">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl font-semibold bg-[#eef2ff] text-[#4338ca]')}>
                        {application?.company_logo ? (
                          <img src={application.company_logo} alt={(application?.company_name || 'Company') + ' Logo'} className="h-8 w-8 object-contain" />
                        ) : (
                          <span className="text-[16px]">
                            {(application?.company_name || application?.companyName || 'C').charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#1f2937]">{application?.company_name || application?.companyName || 'Loading...'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 pr-6 text-[14px] font-medium text-[#1f2937]">
                    {application?.job_title || application?.jobTitle || '-'}
                  </td>
                  <td className="py-5 pr-6 text-[13px] font-medium text-[#6b7280]">
                    {application?.applied_date ? new Date(application.applied_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-5 pr-6">
                    {application?.stage ? (
                      <Badge
                        variant="outline"
                        className={cn('rounded-full border px-3 py-1 text-[12px] font-semibold', stageStyles[String(application.stage ?? '')] ?? 'border-[#d1d5db] text-[#374151] bg-[#f3f4f6]/70')}
                      >
                        {(String(application.stage || '') === 'IN_REVIEW' || String(application.stage || '') === 'in_review') ? 'IN_REVIEW' : (String(application.stage || '').charAt(0).toUpperCase() + String(application.stage || '').slice(1).toLowerCase().replace(/_/g, ' '))}
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    {appId && (
                      <button
                        onClick={() => navigate(`/seeker/applications/${appId}`)}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 text-[13px] font-medium text-[#4640de] transition-all hover:bg-[#eef2ff] hover:border-[#4640de]"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              )})}
              {!loading && items.length === 0 && (
                <tr>
                  <td className="px-6 py-10 text-center text-[#6b7280]" colSpan={6}>
                    {error ? error : 'No applications found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#e5e7eb] px-6 py-5 text-[12px] text-[#6b7280] md:flex-row md:items-center md:justify-between">
          <p>
            Showing {(page - 1) * limit + (items.length > 0 ? 1 : 0)} to {(page - 1) * limit + items.length} of {total}{' '}
            applications
          </p>

          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[#6b7280] transition-all hover:border-[#4640de] hover:text-[#4640de]"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pg = i + 1
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={cn(
                    'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border text-[13px] font-semibold transition-all',
                    pg === page
                      ? 'border-transparent bg-gradient-to-r from-[#4640de] to-[#6366f1] text-white shadow-[0_10px_30px_rgba(70,64,222,0.25)]'
                      : 'border-[#e5e7eb] bg-white text-[#6b7280] hover:border-[#4640de] hover:text-[#4640de]'
                  )}
                >
                  {pg}
                </button>
              )
            })}

            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[#6b7280] transition-all hover:border-[#4640de] hover:text-[#4640de]"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeekerApplications

