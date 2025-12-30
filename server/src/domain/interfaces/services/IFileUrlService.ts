export interface IFileUrlService {
  getSignedUrl(key: string): Promise<string>;
  getSignedUrls(keys: string[]): Promise<string[]>;
}

