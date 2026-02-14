import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type { CompanyContact } from '@/interfaces/company/company-contact.interface';
import type { EditContactDialogProps } from '@/interfaces/company/dialogs/edit-contact-dialog-props.interface';

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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      setErrors({});
    }
  }, [isOpen, contact]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && formData.phone.trim()) {
      const phoneValue = formData.phone.trim();

      if (phoneValue.includes('-') && phoneValue.startsWith('-')) {
        newErrors.phone = 'Phone number cannot be negative';
      } else if (!/^[\d\s\-()+]+$/.test(phoneValue)) {
        newErrors.phone = 'Phone number can only contain digits, spaces, +, -, ( and )';
      } else {
        const digitsOnly = phoneValue.replace(/\D/g, '');
        if (digitsOnly.length < 10) {
          newErrors.phone = 'Phone number must have at least 10 digits';
        } else if (digitsOnly.length > 15) {
          newErrors.phone = 'Phone number cannot exceed 15 digits';
        }
      }
    }

    const urlFields = ['twitter_link', 'facebook_link', 'linkedin'] as const;
    urlFields.forEach(field => {
      if (formData[field] && formData[field].trim()) {
        const value = formData[field].trim();
        const urlToCheck = value.startsWith('http')
          ? value
          : `https://${value}`;
        try {
          new URL(urlToCheck);

          if (field === 'twitter_link' && !urlToCheck.includes('twitter.com') && !urlToCheck.includes('x.com')) {
            newErrors.twitter_link = 'Please enter a valid Twitter/X URL';
          }
          if (field === 'facebook_link' && !urlToCheck.includes('facebook.com')) {
            newErrors.facebook_link = 'Please enter a valid Facebook URL';
          }
          if (field === 'linkedin' && !urlToCheck.includes('linkedin.com')) {
            newErrors.linkedin = 'Please enter a valid LinkedIn URL';
          }
        } catch {
          newErrors[field] = 'Please enter a valid URL';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof CompanyContact, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
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
              placeholder="company@example.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="twitter_link">Twitter/X Link</Label>
            <Input
              id="twitter_link"
              type="text"
              value={formData.twitter_link}
              onChange={(e) => handleChange('twitter_link', e.target.value)}
              placeholder="https://twitter.com/yourcompany"
              className={errors.twitter_link ? 'border-red-500' : ''}
            />
            {errors.twitter_link && <p className="text-sm text-red-500 mt-1">{errors.twitter_link}</p>}
          </div>

          <div>
            <Label htmlFor="facebook_link">Facebook Link</Label>
            <Input
              id="facebook_link"
              type="text"
              value={formData.facebook_link}
              onChange={(e) => handleChange('facebook_link', e.target.value)}
              placeholder="https://facebook.com/yourcompany"
              className={errors.facebook_link ? 'border-red-500' : ''}
            />
            {errors.facebook_link && <p className="text-sm text-red-500 mt-1">{errors.facebook_link}</p>}
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn Link</Label>
            <Input
              id="linkedin"
              type="text"
              value={formData.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/company/yourcompany"
              className={errors.linkedin ? 'border-red-500' : ''}
            />
            {errors.linkedin && <p className="text-sm text-red-500 mt-1">{errors.linkedin}</p>}
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