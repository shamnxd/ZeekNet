export interface IS3Service {
  uploadImage(file: Buffer, fileName: string, contentType: string): Promise<string>;
  uploadImageToFolder(file: Buffer, fileName: string, contentType: string, folder: string): Promise<string>; 
  deleteImage(imageUrl: string): Promise<void>;
  deleteImageByKey(key: string): Promise<void>; 
  getSignedUrl(key: string, expiresIn?: number): Promise<string>; 
  extractKeyFromUrl(imageUrl: string): string; 
  uploadResume?(file: Buffer, fileName: string, contentType: string): Promise<string>;
}
