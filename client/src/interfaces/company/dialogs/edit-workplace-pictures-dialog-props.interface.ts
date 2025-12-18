import type { WorkplacePicture } from '@/interfaces/company/company-data.interface';

export interface EditWorkplacePicturesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pictures: WorkplacePicture[]) => void;
  pictures: WorkplacePicture[];
}
