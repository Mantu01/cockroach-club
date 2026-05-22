import { GoogleGenerativeAI } from '@google/generative-ai';

function cleanMarkdownBlocks(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '');
    cleaned = cleaned.replace(/\n?```$/, '');
  }
  return cleaned.trim();
}

export async function generateResumeLatex(
  profile: any,
  jobDetails?: any,
  template: string = 'modern'
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. AI-based generation is required.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are an expert LaTeX resume designer. Create a clean, professional, compile-ready LaTeX resume source code.
Do NOT wrap the output in markdown code blocks (like \`\`\`latex ... \`\`\`), output ONLY the raw LaTeX code starting with \\documentclass and ending with \\end{document}.
Here is the user's profile:
${JSON.stringify(profile, null, 2)}
${jobDetails ? `Tailor this resume specifically for this job description to pass ATS filters:\n${JSON.stringify(jobDetails, null, 2)}` : ''}
Use the template style: ${template}. Ensure it compiles out of the box and uses standard packages (geometry, enumitem, hyperref).

Make sure to include ALL of the following details from the profile in the resume:
- Contact information: Full Name, Headline, Phone, Location, email (if available).
- Personal links: LinkedIn, GitHub, Portfolio (include them in the header or contact section).
- Professional Summary.
- Skills (list them clearly).
- Professional Preferences (if desiredSalary, noticePeriod, or relocationReady are provided, create a small section or metadata block listing them clearly, e.g. desired salary, notice period, relocation readiness).
- Certifications (if certificates array has items, create a dedicated 'Certifications' section listing all of them).
- Work Experience (company, role, start/end dates, key achievements).
- Education (institution, degree, field of study, start/end dates).
Do not leave any user profile fields out.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return cleanMarkdownBlocks(text);
  } catch (error) {
    console.error('Gemini LaTeX generation failed:', error);
    throw error;
  }
}

export async function editResumeLatex(
  existingLatex: string,
  instruction: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. AI-based editing is required.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are an expert LaTeX resume editor. Here is the existing resume source code. Modify it according to the instruction below and return only the full LaTeX source code.

Existing LaTeX:
${existingLatex}

Instruction:
${instruction}

Requirements:
- Output ONLY valid LaTeX code.
- Do NOT wrap the output in markdown code fences or any extra text.
- Preserve the document structure and keep a compile-ready resume starting with \\documentclass and ending with \\end{document}.
- Make minimal necessary changes to satisfy the instruction while preserving the original content wherever possible.`;

    const result = await model.generateContent(prompt);
    const text = cleanMarkdownBlocks(result.response.text());
    return text;
  } catch (error) {
    console.error('Gemini LaTeX edit failed:', error);
    throw error;
  }
}

export async function generateInterviewQuestions(
  role: string,
  company?: string,
  skills?: string[],
  experience?: string
): Promise<any[]> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. AI-based generation is required.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are a technical interviewer. Generate exactly 5 interview questions tailored to the following details:
Role: ${role}
${company ? `Company: ${company}` : ''}
${skills && skills.length > 0 ? `Target Skills: ${skills.join(', ')}` : ''}
${experience ? `User Experience Summary: ${experience}` : ''}

Output the questions as a JSON array of objects. Each object MUST have:
1. "question": The question text.
2. "category": The category (e.g., Technical, Behavioral, System Design).
3. "difficulty": One of "easy", "medium", "hard".

Output ONLY valid JSON. Do NOT wrap it in markdown code blocks.`;

    const result = await model.generateContent(prompt);
    const text = cleanMarkdownBlocks(result.response.text());
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini questions generation failed:', error);
    throw error;
  }
}
