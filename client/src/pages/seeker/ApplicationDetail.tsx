import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { jobApplicationApi } from '@/api'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Stage = 'applied' | 'shortlisted' | 'interview' | 'rejected' | 'hired'

const stageStyles: Record<Stage, string> = {
  applied: 'border-[#d1d5db] text-[#374151] bg-[#f3f4f6]/70',
  shortlisted: 'border-[#34d39933] text-[#047857] bg-[#dcfce7]/70',
  interview: 'border-[#fb923c33] text-[#c2410c] bg-[#ffedd5]/70',
  rejected: 'border-[#f8717133] text-[#b91c1c] bg-[#fee2e2]/70',
  hired: 'border-[#4f46e533] text-[#4338ca] bg-[#e0e7ff]/70',
}

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!id) return
      try {
        setLoading(true)
        setError(null)
        const res = await jobApplicationApi.getSeekerApplicationById(id)
        const detail = res?.data?.data || res?.data
        setData(detail)
      } catch (e: any) {
        const message = e?.response?.data?.message || 'Failed to load application'
        setError(message)
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="px-8 xl:px-11 py-9">
        <div className="flex items-center justify-center py-20 text-[#6b7280]">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading application...
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="px-8 xl:px-11 py-9">
        <div className="text-center py-20">
          <p className="text-[#6b7280] mb-4">{error || 'Application not found'}</p>
          <button
            onClick={() => navigate('/seeker/applications')}
            className="inline-flex items-center rounded-lg bg-[#4640de] px-4 py-2 text-white hover:bg-[#3338c0]"
          >
            Back to Applications
          </button>
        </div>
      </div>
    )
  }

  const application = data
  const interviews = application?.interviews || []

  return (
    <div className="px-8 xl:px-11 py-9 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn('flex h-14 w-14 items-center justify-center rounded-xl font-semibold bg-[#eef2ff] text-[#4338ca]')}>
            {application?.company_logo ? (
              <img src={application.company_logo} alt={(application?.job_company || application?.company_name || 'Company') + ' Logo'} className="h-10 w-10 object-contain" />
            ) : (
              <span className="text-[18px]">
                {(application?.job_company || application?.company_name || 'C').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-[#1f2937]">{application?.job_title || '-'}</h1>
            <p className="text-[14px] text-[#6b7280]">{application?.job_company || application?.company_name || 'Unknown Company'}</p>
          </div>
        </div>
        {application?.stage && (
          <Badge variant="outline" className={cn('rounded-full border px-3 py-1 text-[12px] font-semibold', stageStyles[application.stage as Stage])}>
            {(application.stage as string).charAt(0).toUpperCase() + (application.stage as string).slice(1)}
          </Badge>
        )}
      </div>

      <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="px-6 py-5 border-b border-[#e5e7eb]">
          <h2 className="text-[18px] font-semibold text-[#1f2937]">Application Details</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-[#6b7280] mb-1">Applied on</p>
              <p className="text-[14px] text-[#1f2937]">
                {application?.applied_date ? new Date(application.applied_date).toLocaleString() : '-'}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-[#6b7280] mb-1">Score</p>
              <p className="text-[14px] text-[#1f2937]">{application?.score ?? '-'}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-[12px] text-[#6b7280] mb-1">Resume</p>
            {application?.resume_url ? (
              <a
                href={application.resume_url}
                target="_blank"
                rel="noreferrer"
                className="text-[#4640de] hover:underline text-[14px]"
              >
                {application?.resume_filename || 'View resume'}
              </a>
            ) : (
              <p className="text-[14px] text-[#1f2937]">-</p>
            )}
          </div>

          <div>
            <p className="text-[12px] text-[#6b7280] mb-1">Cover Letter</p>
            <p className="text-[14px] text-[#1f2937] whitespace-pre-line">
              {application?.cover_letter || '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="px-6 py-5 border-b border-[#e5e7eb]">
          <h2 className="text-[18px] font-semibold text-[#1f2937]">Interviews</h2>
        </div>
        <div className="px-6 py-5">
          {interviews.length === 0 ? (
            <p className="text-[14px] text-[#6b7280]">No interviews scheduled yet.</p>
          ) : (
            <div className="space-y-4">
              {interviews.map((iv: any, idx: number) => (
                <div key={iv?.id || idx} className="rounded-xl border border-[#e5e7eb] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[14px] text-[#1f2937] font-semibold">
                      {iv?.interview_type || 'Interview'} • {iv?.location || '-'}
                    </div>
                    {iv?.status && (
                      <Badge variant="outline" className="rounded-full border px-3 py-1 text-[12px] font-semibold">
                        {(iv.status as string).charAt(0).toUpperCase() + (iv.status as string).slice(1)}
                      </Badge>
                    )}
                  </div>
                  <div className="text-[13px] text-[#6b7280]">
                    {iv?.date ? new Date(iv.date).toLocaleString() : '-'} {iv?.time ? `• ${iv.time}` : ''}
                  </div>
                  {iv?.interviewer_name && (
                    <div className="text-[13px] text-[#6b7280] mt-1">Interviewer: {iv.interviewer_name}</div>
                  )}
                  {iv?.feedback && (
                    <div className="mt-3 rounded-lg bg-[#f8f9ff] border border-[#e5e7eb] p-3">
                      <div className="text-[13px] text-[#1f2937] font-semibold mb-1">Feedback</div>
                      <div className="text-[13px] text-[#6b7280]">
                        <div>Reviewer: {iv.feedback.reviewer_name}</div>
                        {'rating' in iv.feedback && iv.feedback.rating !== undefined && (
                          <div>Rating: {iv.feedback.rating}</div>
                        )}
                        <div>Comment: {iv.feedback.comment}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


