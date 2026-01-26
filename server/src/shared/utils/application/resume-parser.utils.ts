
import mammoth from 'mammoth';
import pdf = require('pdf-parse');
import { ValidationError } from 'src/domain/errors/errors';
import { logger } from 'src/infrastructure/config/logger';

export class ResumeParser {
  static async parse(buffer: Buffer, mimeType: string): Promise<string> {
    try {
      if (mimeType === 'application/pdf') {
        const data = await pdf(buffer);
        return data.text;
      } else if (
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimeType === 'application/msword'
      ) {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
      } else {
        throw new ValidationError('Unsupported file type. Please upload PDF or DOCX.');
      }
    } catch (error) {
      logger.error('Error parsing resume file:', error);
      throw new ValidationError('Failed to parse resume file. Please ensure it is a valid document.');
    }
  }
}

