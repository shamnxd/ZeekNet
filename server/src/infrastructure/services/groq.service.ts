import Groq from 'groq-sdk';

export interface ATSScoreResult {
  score: number;
  reasoning?: string;
}

export class GroqService {
  private client: Groq;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY || '';
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not configured in environment variables');
    }
    this.client = new Groq({ apiKey });
  }

  async calculateATSScore(
    jobDetails: {
      title: string;
      description: string;
      qualifications?: string[];
      responsibilities?: string[];
      skillsRequired: string[];
      experienceLevel?: string;
    },
    candidateData: {
      coverLetter: string;
      resumeText?: string;
    },
  ): Promise<ATSScoreResult> {
    try {
      const prompt = this.buildATSPrompt(jobDetails, candidateData);

      const completion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an expert ATS (Applicant Tracking System) that evaluates job applications. 
Your task is to analyze how well a candidate matches a job posting based on their resume and cover letter.
You must return ONLY a valid JSON object with this exact structure:
{
  "score": <number between 0-100>,
  "reasoning": "<brief explanation of the score>"
}

Scoring criteria:
- 80-100: Excellent match - candidate meets or exceeds all key requirements
- 60-79: Good match - candidate meets most requirements with minor gaps
- 40-59: Fair match - candidate has some relevant experience but significant gaps
- 0-39: Poor match - candidate lacks most required qualifications

Consider: skills match, experience relevance, qualifications, and overall fit.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No response from Groq API');
      }

      const result = JSON.parse(responseContent);
      
      // Validate and normalize score
      let score = Number(result.score);
      if (isNaN(score) || score < 0) score = 0;
      if (score > 100) score = 100;

      return {
        score: Math.round(score),
        reasoning: result.reasoning || 'Score calculated based on job requirements match',
      };
    } catch (error) {
      console.error('Error calculating ATS score with Groq:', error);
      // Return a default neutral score on error
      return {
        score: 50,
        reasoning: 'Unable to calculate precise score - manual review recommended',
      };
    }
  }

  private buildATSPrompt(
    jobDetails: {
      title: string;
      description: string;
      qualifications?: string[];
      responsibilities?: string[];
      skillsRequired: string[];
      experienceLevel?: string;
    },
    candidateData: {
      coverLetter: string;
      resumeText?: string;
    },
  ): string {
    return `
JOB POSTING:
Title: ${jobDetails.title}
Description: ${jobDetails.description}
${jobDetails.experienceLevel ? `Experience Level: ${jobDetails.experienceLevel}` : ''}

Required Skills: ${jobDetails.skillsRequired.join(', ')}

${jobDetails.qualifications && jobDetails.qualifications.length > 0 ? `Qualifications:\n${jobDetails.qualifications.map(q => `- ${q}`).join('\n')}` : ''}

${jobDetails.responsibilities && jobDetails.responsibilities.length > 0 ? `Responsibilities:\n${jobDetails.responsibilities.map(r => `- ${r}`).join('\n')}` : ''}

---

CANDIDATE APPLICATION:

Cover Letter:
${candidateData.coverLetter}

${candidateData.resumeText ? `Resume:\n${candidateData.resumeText}` : ''}

---

Analyze this application and provide an ATS score (0-100) with reasoning.
`.trim();
  }
}

export const groqService = new GroqService();
