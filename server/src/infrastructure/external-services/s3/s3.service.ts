import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../../config/env';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';

export class S3Service implements IS3Service {
  private _s3Client: S3Client;
  private _bucketName: string;

  constructor() {
    this._s3Client = new S3Client({
      region: env.AWS_REGION!,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true,
    });
    this._bucketName = env.AWS_S3_BUCKET_NAME!;
  }

  async uploadImage(file: Buffer, fileName: string, contentType: string): Promise<string> {
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `company-images/${Date.now()}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: this._bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await this._s3Client.send(command);
    return key;
  }

  async uploadImageToFolder(file: Buffer, fileName: string, contentType: string, folder: string): Promise<string> {
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `${folder}/${Date.now()}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: this._bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await this._s3Client.send(command);
    return key;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    let key: string;

    if (imageUrl.includes(`/${this._bucketName}/`)) {
      const urlParts = imageUrl.split(`/${this._bucketName}/`);
      key = urlParts[1];
    } else if (imageUrl.includes(`${this._bucketName}.s3`)) {
      const urlParts = imageUrl.split('/');
      key = urlParts.slice(3).join('/');
    } else {
      throw new Error('Invalid S3 URL format');
    }

    await this.deleteImageByKey(key);
  }

  async deleteImageByKey(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this._bucketName,
      Key: key,
    });

    await this._s3Client.send(command);
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this._bucketName,
      Key: key,
    });

    return await getSignedUrl(this._s3Client, command, { expiresIn });
  }

  extractKeyFromUrl(imageUrl: string): string {
    if (imageUrl.includes(`/${this._bucketName}/`)) {
      const urlParts = imageUrl.split(`/${this._bucketName}/`);
      return urlParts[1];
    } else if (imageUrl.includes(`${this._bucketName}.s3`)) {
      const urlParts = imageUrl.split('/');
      return urlParts.slice(3).join('/');
    } else {

      const urlMatch = imageUrl.match(/\/[^\/]+\/(.+)$/);
      if (urlMatch && urlMatch[1]) {
        return urlMatch[1];
      }
      throw new Error('Invalid S3 URL format');
    }
  }

  async uploadResume(file: Buffer, fileName: string, contentType: string): Promise<string> {
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `resumes/${Date.now()}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: this._bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await this._s3Client.send(command);
    return key;
  }
}