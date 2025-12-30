import { IFileUrlService } from '../../domain/interfaces/services/IFileUrlService';
import { IS3Service } from '../../domain/interfaces/services/IS3Service';

export class FileUrlService implements IFileUrlService {
  constructor(private s3Service: IS3Service) {}

  async getSignedUrl(key: string): Promise<string> {
    return this.s3Service.getSignedUrl(key);
  }

  async getSignedUrls(keys: string[]): Promise<string[]> {
    return Promise.all(keys.map(key => this.s3Service.getSignedUrl(key)));
  }
}

