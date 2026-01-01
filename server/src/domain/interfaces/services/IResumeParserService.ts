
export interface IResumeParserService {
  parse(buffer: Buffer, mimeType: string): Promise<string>;
}
