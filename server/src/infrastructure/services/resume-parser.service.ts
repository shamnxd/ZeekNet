import { IResumeParserService } from '../../../domain/interfaces/services/IResumeParserService';
import { ResumeParser } from '../../../shared/utils/resume-parser.utils';

/**
 * Resume Parser Service Implementation
 * Wraps the ResumeParser utility to implement the domain interface
 */
export class ResumeParserService implements IResumeParserService {
  async parse(buffer: Buffer, mimeType: string): Promise<string> {
    return ResumeParser.parse(buffer, mimeType);
  }
}
