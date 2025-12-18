import { useState, useCallback, useEffect } from 'react';
import Cropper, { type Area, type Point } from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import type { ImageCropperProps } from '@/interfaces/ui/image-cropper-props.interface';

export function ImageCropper({
  open,
  onOpenChange,
  image,
  aspect,
  cropShape = 'rect',
  onCropComplete,
  title = 'Crop Image',
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    if (open && image) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    }
  }, [open, image]);

  const onCropChange = useCallback((crop: Point) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<string> => {
    const image = await createImage(imageSrc);

    if (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) {
      await new Promise<void>((resolve) => {
        if (image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) {
          resolve();
          return;
        }
        image.onload = () => resolve();
        image.onerror = () => resolve();
      });
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    canvas.width = Math.round(pixelCrop.width);
    canvas.height = Math.round(pixelCrop.height);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      Math.round(pixelCrop.x),
      Math.round(pixelCrop.y),
      Math.round(pixelCrop.width),
      Math.round(pixelCrop.height),
      0,
      0,
      Math.round(pixelCrop.width),
      Math.round(pixelCrop.height)
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.onerror = reject; 
            reader.readAsDataURL(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/jpeg',
        0.95
      );
    });
  };

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedAreaPixels, croppedImage);
      onOpenChange(false);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-[400px] bg-[#f8f9ff] rounded-lg overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
          />
        </div>
        <div className="space-y-3 pt-4">
          <div>
            <label className="text-[14px] font-medium text-[#25324b] mb-2 block">
              Zoom
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="hover:!bg-[#4640de]" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="seekerOutline" onClick={handleCrop}>
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}