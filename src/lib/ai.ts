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
  return callAI(stylePrompt, text);
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

  const prompt = `Generate SEO-friendly markdown content about "${title}" in approximately ${wordCounts[length as keyof typeof wordCounts]} words. 
    Include:
    - Engaging introduction
    - Relevant headings and subheadings
    - Key points and details
    - Natural keyword usage
    - Clear structure
    - Conclusion
    Format using markdown with proper headings (#, ##), lists, and emphasis (* for italic, ** for bold) where appropriate.`;

  return callAI(prompt, title);
}