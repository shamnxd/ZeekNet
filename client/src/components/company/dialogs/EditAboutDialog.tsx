import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { EditAboutDialogProps } from '@/interfaces/company/dialogs/edit-about-dialog-props.interface';

const EditAboutDialog: React.FC<EditAboutDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  aboutUs
}) => {
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDescription(aboutUs || '');
      setError(null);
    }
  }, [isOpen, aboutUs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (description.trim().length < 50) {
      setError('Description should be at least 50 characters long to provide enough detail');
      return;
    }
    setError(null);
    onSave(description);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit About Us</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="aboutUs">Company Description *</Label>
            <Textarea
              id="aboutUs"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Tell us about your company, its mission, values, and what makes it unique..."
              rows={8}
              className={`resize-none overflow-wrap-anywhere break-words whitespace-pre-wrap ${error ? 'border-red-500' : ''}`}
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Description
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};


export default EditAboutDialog;