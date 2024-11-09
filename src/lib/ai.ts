const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface AIResponse {
  text: string;
  error?: string;
}

async function callAI(prompt: string, text: string): Promise<AIResponse> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: prompt
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return { text: data.choices[0].message.content };
  } catch (error) {
    console.error('AI API error:', error);
    return { text: '', error: 'Failed to process text' };
  }
}

export async function fixGrammar(text: string): Promise<AIResponse> {
  return callAI('Fix any grammar errors in the following text while preserving its meaning and any markdown formatting:', text);
}

export async function expandText(text: string, stylePrompt: string): Promise<AIResponse> {
  const prompt = `
    ${stylePrompt}
    
    Original text:
    ${text}
    
    Additional instructions:
    - Maintain proper markdown formatting
    - Use appropriate heading levels (h1, h2, h3)
    - Include bold and italic text for emphasis
    - Add bullet points and numbered lists where appropriate
    - Optimize for readability and engagement
    - Keep the tone consistent with the selected style
  `;
  
  return callAI(prompt, text);
}

export async function translateToEnglish(text: string): Promise<AIResponse> {
  return callAI('Translate the following text to English if it\'s not already in English, preserving any markdown formatting:', text);
}

export async function generateSEOContent(title: string, length: number): Promise<AIResponse> {
  const wordCounts = {
    1: 100,
    2: 250,
    3: 500,
    4: 1000,
    5: 2000
  };

  const targetWords = wordCounts[length as keyof typeof wordCounts];

  const prompt = `Generate SEO-friendly markdown content about "${title}" that is EXACTLY ${targetWords} words long (±10 words). 
    
    Required Structure:
    1. Title (H1)
    2. Brief meta description (100-155 characters)
    3. Table of Contents
    4. Introduction (10% of content)
    5. Main sections with H2 and H3 headings (75% of content)
    6. Conclusion (15% of content)
    
    Requirements:
    - MUST be exactly ${targetWords} words (±10 words)
    - Use proper markdown formatting
    - Include relevant keywords naturally
    - Use bullet points and numbered lists
    - Add bold and italic emphasis
    - Maintain consistent heading hierarchy
    - Optimize for featured snippets
    - Include relevant statistics or data points
    
    Note: The word count is critical - ensure the output is ${targetWords} words (±10 words).`;

  return callAI(prompt, title);
}