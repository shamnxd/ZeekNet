import { useState } from 'react'
import { Upload, File as FileIcon, Trash2, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface TaskSubmissionModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { document?: File; submissionUrl?: string; submissionFilename?: string; submissionLink?: string; submissionNote?: string }) => Promise<void>
  taskTitle: string
}

type SubmissionType = 'file' | 'link' | 'both'

export const TaskSubmissionModal = ({ open, onClose, onSubmit, taskTitle }: TaskSubmissionModalProps) => {
  const [submissionType, setSubmissionType] = useState<SubmissionType>('file')
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string>('')
  const [submissionLink, setSubmissionLink] = useState<string>('')
  const [submissionNote, setSubmissionNote] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      
      const allowedTypes = ['application/pdf', 'application/zip', 'application/x-zip-compressed']
      const allowedExtensions = ['.pdf', '.zip', '.doc', '.docx']
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase()
      
      if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(fileExtension)) {
        alert('Please upload a PDF, ZIP, DOC, or DOCX file')
        return
      }

      
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }

      setFile(selectedFile)
      
      const url = URL.createObjectURL(selectedFile)
      setFileUrl(url)
    }
  }

  const removeFile = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl)
    }
    setFile(null)
    setFileUrl('')
  }

  const handleSubmit = async () => {
    try {
      setUploading(true)

      
      if (submissionType === 'file' && !file) {
        alert('Please upload a file')
        setUploading(false)
        return
      }
      if (submissionType === 'link' && !submissionLink.trim()) {
        alert('Please provide a submission link')
        setUploading(false)
        return
      }
      if (submissionType === 'both' && !file && !submissionLink.trim()) {
        alert('Please provide either a file or a link')
        setUploading(false)
        return
      }

      
      
      await onSubmit({
        document: file || undefined,
        submissionLink: submissionLink.trim() || undefined,
        submissionNote: submissionNote.trim() || undefined,
      })

      
      setFile(null)
      setFileUrl('')
      setSubmissionLink('')
      setSubmissionNote('')
      setSubmissionType('file')
      onClose()
    } catch (error) {
      console.error('Error submitting task:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl)
    }
    setFile(null)
    setFileUrl('')
    setSubmissionLink('')
    setSubmissionNote('')
    setSubmissionType('file')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Task: {taskTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {}
          <div className="space-y-2">
            <Label>Submission Type</Label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSubmissionType('file')}
                className={`flex-1 px-4 py-2.5 rounded-lg border-2 transition-colors text-sm font-medium ${
                  submissionType === 'file'
                    ? 'border-[#4640DE] bg-[#4640DE] text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <Upload className="h-4 w-4 inline mr-2" />
                File Only
              </button>
              <button
                type="button"
                onClick={() => setSubmissionType('link')}
                className={`flex-1 px-4 py-2.5 rounded-lg border-2 transition-colors text-sm font-medium ${
                  submissionType === 'link'
                    ? 'border-[#4640DE] bg-[#4640DE] text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <LinkIcon className="h-4 w-4 inline mr-2" />
                Link Only
              </button>
              <button
                type="button"
                onClick={() => setSubmissionType('both')}
                className={`flex-1 px-4 py-2.5 rounded-lg border-2 transition-colors text-sm font-medium ${
                  submissionType === 'both'
                    ? 'border-[#4640DE] bg-[#4640DE] text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Both
              </button>
            </div>
          </div>

          {}
          {(submissionType === 'file' || submissionType === 'both') && (
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload File (PDF, ZIP, DOC, DOCX - Max 10MB)</Label>
            {!file ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#4640DE] transition-colors">
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.zip,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                  <span className="text-xs text-gray-500">PDF, ZIP, DOC, DOCX (Max 10MB)</span>
                </label>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileIcon className="h-5 w-5 text-[#4640DE]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          )}

          {}
          {(submissionType === 'link' || submissionType === 'both') && (
            <div className="space-y-2">
              <Label htmlFor="submission-link">Submission Link (GitHub, CodeSandbox, Live Demo, etc.)</Label>
              <Input
                id="submission-link"
                type="url"
                placeholder="https://github.com/username/repository or https://example.com"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Provide a link to your code repository, live demo, or other submission</p>
            </div>
          )}

          {}
          <div className="space-y-2">
            <Label htmlFor="submission-note">Additional Notes (Optional)</Label>
            <Textarea
              id="submission-note"
              placeholder="Add any additional notes, instructions, or context about your submission..."
              value={submissionNote}
              onChange={(e) => setSubmissionNote(e.target.value)}
              rows={4}
              className="w-full resize-none"
            />
            <p className="text-xs text-gray-500">Optional: Add any notes, setup instructions, or context the reviewer should know</p>
          </div>

          {}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={uploading || (submissionType === 'file' && !file) || (submissionType === 'link' && !submissionLink.trim()) || (submissionType === 'both' && !file && !submissionLink.trim())}
              className="bg-[#4640DE] hover:bg-[#3730A3]"
            >
              {uploading ? 'Submitting...' : 'Submit Task'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
