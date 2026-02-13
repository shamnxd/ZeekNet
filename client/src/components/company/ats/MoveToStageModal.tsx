import { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { ATSStage, ATSStageDisplayNames } from '@/constants/ats-stages'

interface MoveToStageModalProps {
  isOpen: boolean
  onClose: () => void
  candidateName: string
  currentStage: ATSStage
  availableStages: ATSStage[]
  onConfirm: (targetStage: ATSStage, reason: string) => Promise<void>
}

export const MoveToStageModal = ({
  isOpen,
  onClose,
  candidateName,
  currentStage,
  availableStages,
  onConfirm,
}: MoveToStageModalProps) => {
  const [targetStage, setTargetStage] = useState<ATSStage | ''>('')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')


  const normalizedStages = useMemo(() => {

    const displayNameToEnum = Object.entries(ATSStageDisplayNames).reduce((acc, [enumValue, displayName]) => {
      acc[displayName] = enumValue
      return acc
    }, {} as Record<string, string>)

    return availableStages.map((stage: string) => {

      if (Object.values(ATSStage).includes(stage as ATSStage)) {
        return stage
      }

      return displayNameToEnum[stage] || stage
    }) as ATSStage[]
  }, [availableStages])


  // When forcefully changing stage, show all enabled stages except the current one and previous stages
  const allAvailableStages = useMemo(() => {
    // Define the order of stages
    const stageOrder = [
      ATSStage.IN_REVIEW,
      ATSStage.SHORTLISTED,
      ATSStage.INTERVIEW,
      ATSStage.TECHNICAL_TASK,
      ATSStage.COMPENSATION,
      ATSStage.OFFER,
      ATSStage.HIRED,
      ATSStage.REJECTED
    ];

    const currentStageIndex = stageOrder.indexOf(currentStage);

    if (currentStageIndex === -1) {
      // If current stage is not in the predefined order, fallback to showing all other stages
      return normalizedStages.filter((stage) => stage && stage !== currentStage);
    }

    return normalizedStages.filter((stage) => {
      // Always exclude current stage
      if (!stage || stage === currentStage) return false;

      const stageIndex = stageOrder.indexOf(stage);

      // If target stage is REJECTED, always allow it (unless it's already rejected)
      if (stage === ATSStage.REJECTED) return true;

      // If target stage is HIRED, always allow it (usually only from Offer, but flexible)
      if (stage === ATSStage.HIRED) return true;

      // Only allow moving forward
      return stageIndex > currentStageIndex;
    });
  }, [normalizedStages, currentStage]);

  useEffect(() => {
    if (!isOpen) {

      setTargetStage('')
      setReason('')
      setError('')
    }
  }, [isOpen])

  const handleConfirm = async () => {
    setError('')


    if (!targetStage) {
      setError('Please select a target stage')
      return
    }

    if (!reason.trim()) {
      setError('Please provide a reason for moving the candidate')
      return
    }

    if (reason.trim().length < 10) {
      setError('Reason must be at least 10 characters long')
      return
    }

    try {
      setIsSubmitting(true)
      await onConfirm(targetStage as ATSStage, reason.trim())

      setTargetStage('')
      setReason('')
      onClose()
    } catch (err) {
      console.error('Error moving stage:', err)
      setError('Failed to move candidate. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Move to Another Stage</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Moving <span className="font-semibold text-gray-900">{candidateName}</span> from{' '}
              <span className="font-semibold text-gray-900">{ATSStageDisplayNames[currentStage]}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-stage">Select Target Stage *</Label>
            <Select
              value={targetStage}
              onValueChange={(value) => {
                setTargetStage(value as ATSStage)
                setError('')
              }}
            >
              <SelectTrigger id="target-stage" className="w-full">
                <SelectValue placeholder="Select a stage" />
              </SelectTrigger>
              <SelectContent>
                {allAvailableStages.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">
                    No other stages available
                  </div>
                ) : (
                  allAvailableStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {ATSStageDisplayNames[stage]}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {allAvailableStages.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                No other stages are enabled for this job posting.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Textarea
              id="reason"
              placeholder="Example: Candidate already completed technical round externally"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setError('')
              }}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              This reason will be saved as a comment on the candidate's profile.
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting || !targetStage || !reason.trim() || allAvailableStages.length === 0}
            className="bg-[#4640DE] hover:bg-[#3730A3]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Moving...
              </>
            ) : (
              'Confirm'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
