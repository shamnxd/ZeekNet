import type { Area } from 'react-easy-crop';

export interface ImageCropperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: string;
  aspect?: number; 
  cropShape?: 'rect' | 'round';
  onCropComplete: (croppedAreaPixels: Area, croppedImage: string) => void;
  title?: string;
}
