import type { WorkplacePicture } from '../workplace-picture.interface';

export interface EditWorkplacePicturesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pictures: WorkplacePicture[]) => void;
  pictures: WorkplacePicture[];
}
