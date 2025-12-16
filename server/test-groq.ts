import { groqService } from './src/infrastructure/services/groq.service';

async function testGroqService() {
  console.log('🧪 Testing Groq ATS Score Service...\n');

  const testJobDetails = {
    title: 'Senior Full Stack Developer',
    description: 'We are looking for an experienced full stack developer to join our team.',
    qualifications: [
      'Bachelor\'s degree in Computer Science or related field',
      '5+ years of experience in web development',
      'Strong problem-solving skills',
    ],
    responsibilities: [
      'Design and develop scalable web applications',
      'Collaborate with cross-functional teams',
      'Write clean, maintainable code',
    ],
    skillsRequired: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'REST APIs'],
  };

  const testCandidateData = {
    coverLetter: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Full Stack Developer position. With over 6 years of experience in web development, I have developed a deep expertise in JavaScript, TypeScript, React, and Node.js.

Throughout my career, I have successfully designed and deployed multiple scalable web applications using modern technologies. I am proficient in MongoDB and have extensive experience building RESTful APIs. My strong problem-solving skills and ability to work collaboratively with cross-functional teams have consistently delivered high-quality results.

I hold a Bachelor's degree in Computer Science and am passionate about writing clean, maintainable code. I am excited about the opportunity to contribute to your team and help build innovative solutions.

Thank you for considering my application.

Best regards,
John Doe`,
  };

  try {
    console.log('📋 Job Details:');
    console.log(`   Title: ${testJobDetails.title}`);
    console.log(`   Required Skills: ${testJobDetails.skillsRequired.join(', ')}\n`);

    console.log('📝 Candidate Cover Letter:');
    console.log(`   ${testCandidateData.coverLetter.substring(0, 100)}...\n`);

    console.log('⏳ Calculating ATS Score with Groq AI...\n');

    const startTime = Date.now();
    const result = await groqService.calculateATSScore(testJobDetails, testCandidateData);
    const endTime = Date.now();

    console.log('✅ SUCCESS! Groq API is working correctly.\n');
    console.log('\n✅ ATS Score Calculation Successful!');
    console.log(`Score: ${result.score}/100`);
    console.log(`Reasoning: ${result.reasoning}`);
    console.log(`Response Time: ${endTime - startTime}ms\n`);

    // Interpret the score
    let interpretation = '';
    if (result.score >= 80) {
      interpretation = '🟢 Excellent Match';
    } else if (result.score >= 60) {
      interpretation = '🔵 Good Match';
    } else if (result.score >= 40) {
      interpretation = '🟡 Fair Match';
    } else {
      interpretation = '🟠 Poor Match';
    }

    console.log(`   Interpretation: ${interpretation}\n`);
    console.log('✨ Test completed successfully!');

  } catch (error: unknown) {
    console.error('❌ ERROR: Groq API test failed\n');
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    
    if (error instanceof Error && error.message.includes('GROQ_API_KEY')) {
      console.error('\n💡 Make sure GROQ_API_KEY is set in your .env file');
    } else {
      console.error('\nFull error:', error);
    }
    
    process.exit(1);
  }
}

// Run the test
testGroqService();
