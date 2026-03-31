import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { companyApi } from '@/api/company.api';
import type { WorkplacePicture } from '@/interfaces/company/company-data.interface';
import type { EditWorkplacePicturesDialogProps } from '@/interfaces/company/dialogs/edit-workplace-pictures-dialog-props.interface';

interface WorkplacePictureWithPreview extends WorkplacePicture {
  previewUrl?: string;
}

const EditWorkplacePicturesDialog: React.FC<EditWorkplacePicturesDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  pictures
}) => {
  const [picturesList, setPicturesList] = useState<WorkplacePictureWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPicturesList([...pictures]);
    }
  }, [isOpen, pictures]);

  const handleFileUpload = async (file: File, index: number) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const result = await companyApi.uploadWorkplacePicture(file);

      if (result.success && result.data) {
        const updatedPictures = [...picturesList];
        const previewUrl = URL.createObjectURL(file);

        updatedPictures[index] = {
          ...updatedPictures[index],
          pictureUrl: result.data.url,
          previewUrl: previewUrl
        };
        setPicturesList(updatedPictures);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };


  const addNewPicture = () => {
    setPicturesList([...picturesList, { pictureUrl: '' }]);
  };

  const removePicture = (index: number) => {
    const updatedPictures = picturesList.filter((_, i) => i !== index);
    setPicturesList(updatedPictures);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validPictures = picturesList.filter(picture => (picture.pictureUrl || picture.url || '').trim() !== '');

    if (validPictures.length === 0) {
      toast.error('Please add at least one picture');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const picturesToSave = validPictures.map(({ previewUrl, ...rest }) => rest);

    onSave(picturesToSave);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Workplace Pictures</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {picturesList.map((picture, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Picture {index + 1}</h4>
                  {picturesList.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePicture(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`image-${index}`}>Upload Image</Label>
                    <div className="mt-2">
                      {picture.pictureUrl || picture.previewUrl ? (
                        <div className="relative">
                          <img
                            src={picture.previewUrl || picture.pictureUrl}
                            alt={`Workplace ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <Input
                            id={`image-${index}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, index);
                            }}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById(`image-${index}`)?.click()}
                            disabled={uploading}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={addNewPicture}
              disabled={picturesList.length >= 10}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Add Picture ({picturesList.length}/10)
            </Button>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                Save Pictures
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkplacePicturesDialog;