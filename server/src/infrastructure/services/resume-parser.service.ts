import { IResumeParserService } from 'src/domain/interfaces/services/IResumeParserService';
import { ResumeParser } from 'src/shared/utils/application/resume-parser.utils';


export class ResumeParserService implements IResumeParserService {
  async parse(buffer: Buffer, mimeType: string): Promise<string> {
    return ResumeParser.parse(buffer, mimeType);
  }
}

