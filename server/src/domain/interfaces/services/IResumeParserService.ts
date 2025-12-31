/**
 * Resume Parser Service Interface
 * Responsible for extracting text from resume files
 */
export interface IResumeParserService {
  parse(buffer: Buffer, mimeType: string): Promise<string>;
}
