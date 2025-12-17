import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CompanyContact } from '@/interfaces/company/company-contact.interface';

interface EditContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: CompanyContact) => void;
  contact?: CompanyContact;
}

const EditContactDialog: React.FC<EditContactDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  contact
}) => {
  const [formData, setFormData] = useState<CompanyContact>({
    id: contact?.id,
    email: contact?.email || '',
    phone: contact?.phone || '',
    twitter_link: contact?.twitter_link || '',
    facebook_link: contact?.facebook_link || '',
    linkedin: contact?.linkedin || ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: contact?.id,
        email: contact?.email || '',
        phone: contact?.phone || '',
        twitter_link: contact?.twitter_link || '',
        facebook_link: contact?.facebook_link || '',
        linkedin: contact?.linkedin || ''
      });
    }
  }, [isOpen, contact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof CompanyContact, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {contact ? 'Edit Contact Information' : 'Add Contact Information'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <Label htmlFor="twitter_link">Twitter Link</Label>
            <Input
              id="twitter_link"
              type="url"
              value={formData.twitter_link}
              onChange={(e) => handleChange('twitter_link', e.target.value)}
              placeholder="https://twitter.com/yourcompany"
            />
          </div>

          <div>
            <Label htmlFor="facebook_link">Facebook Link</Label>
            <Input
              id="facebook_link"
              type="url"
              value={formData.facebook_link}
              onChange={(e) => handleChange('facebook_link', e.target.value)}
              placeholder="https://facebook.com/yourcompany"
            />
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn Link</Label>
            <Input
              id="linkedin"
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/company/yourcompany"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {contact ? 'Update' : 'Add'} Contact
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactDialog;