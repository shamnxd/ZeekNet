import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// be - in
interface EditAboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (aboutUs: string) => void;
  aboutUs: string;
}

const EditAboutDialog: React.FC<EditAboutDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  aboutUs
}) => {
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDescription(aboutUs || '');
    }
  }, [isOpen, aboutUs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            <Label htmlFor="aboutUs">Company Description</Label>
            <Textarea
              id="aboutUs"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your company, its mission, values, and what makes it unique..."
              rows={8}
              className="resize-none overflow-wrap-anywhere break-words whitespace-pre-wrap"
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            />
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