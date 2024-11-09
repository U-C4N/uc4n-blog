import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown, Languages, ChevronRight, FileText } from 'lucide-react';
import { fixGrammar, expandText, translateToEnglish } from '../lib/ai';
import toast from 'react-hot-toast';

interface TextEnhancerProps {
  text: string;
  onUpdate: (text: string) => void;
}

const writingStyles = [
  { id: 'academic', label: 'Academic', description: 'Formal, research-oriented tone' },
  { id: 'blog', label: 'Blog-style', description: 'Conversational and engaging' },
  { id: 'educational', label: 'Educational', description: 'Clear and instructional' },
  { id: 'professional', label: 'Professional', description: 'Business-appropriate tone' },
  { 
    id: 'seo', 
    label: 'SEO-optimized', 
    description: 'Keyword-rich and web-friendly',
    template: (text: string) => `# ${text}

## Key Takeaways
- Important point 1
- Important point 2
- Important point 3

## Introduction
*An engaging introduction to capture reader attention...*

## Main Content
**Key Concept 1**
Detailed explanation with relevant keywords...

**Key Concept 2**
Further exploration with SEO-friendly terms...

## Best Practices
1. First best practice
2. Second best practice
3. Third best practice

## Conclusion
*Summarizing the main points and providing value...*

## FAQs
**Q: Common question 1?**
A: Detailed answer...

**Q: Common question 2?**
A: Detailed answer...

###### Keywords: relevant, comma-separated, keywords`
  }
];

export function TextEnhancer({ text, onUpdate }: TextEnhancerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(writingStyles[0]);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const words = text.trim().split(/\s+/).length;
    setWordCount(words);
  }, [text]);

  const handleAction = async (action: 'grammar' | 'expand' | 'translate') => {
    if (!text.trim()) {
      toast.error('Please enter some text first');
      return;
    }

    setIsProcessing(true);
    setShowStyleMenu(false);
    
    try {
      let result;
      if (action === 'expand') {
        let prompt = `Enhance this text using a ${selectedStyle.label.toLowerCase()} writing style.`;
        
        if (selectedStyle.id === 'seo') {
          const template = selectedStyle.template(text);
          prompt = `Transform this text into an SEO-optimized article following this structure:
          ${template}
          
          Ensure to:
          - Include relevant keywords naturally
          - Use proper heading hierarchy
          - Add meta description
          - Include internal/external linking suggestions
          - Optimize for featured snippets
          - Maintain readability and engagement`;
        }
        
        result = await expandText(text, prompt);
      } else {
        const actionMap = {
          grammar: fixGrammar,
          translate: translateToEnglish
        };
        result = await actionMap[action](text);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      // Animate the text update with scroll sync
      const words = result.text.split(' ');
      let currentIndex = 0;
      const textArea = document.querySelector('textarea');
      const scrollPos = textArea?.scrollTop || 0;

      const interval = setInterval(() => {
        if (currentIndex >= words.length) {
          clearInterval(interval);
          onUpdate(result.text);
          setIsProcessing(false);
          // Restore scroll position
          if (textArea) {
            textArea.scrollTop = scrollPos;
          }
          return;
        }

        const partialText = words.slice(0, currentIndex + 1).join(' ');
        onUpdate(partialText);
        currentIndex++;
      }, 50);

      toast.success(`Text ${action === 'grammar' ? 'corrected' : action === 'expand' ? 'enhanced' : 'translated'} successfully`);
    } catch (error) {
      toast.error('Failed to process text. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleAction('grammar')}
        disabled={isProcessing}
        className={`p-2 hover:bg-gray-700 rounded transition-colors ${
          isProcessing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title="Fix Grammar"
      >
        <Globe size={18} className={`text-gray-300 ${isProcessing ? 'animate-spin' : ''}`} />
      </button>
      
      <div className="relative">
        <button
          onClick={() => !isProcessing && setShowStyleMenu(!showStyleMenu)}
          disabled={isProcessing}
          className={`p-2 hover:bg-gray-700 rounded transition-colors flex items-center ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Enhance Text"
        >
          <span className="text-gray-300 text-sm mr-1">{selectedStyle.label}</span>
          <ChevronDown size={14} className={`text-gray-300 transition-transform ${showStyleMenu ? 'rotate-180' : ''}`} />
        </button>

        {showStyleMenu && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 rounded-md shadow-lg py-1 z-50">
            {writingStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => {
                  setSelectedStyle(style);
                  setShowStyleMenu(false);
                  handleAction('expand');
                }}
                className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{style.label}</span>
                  <span className="text-xs text-gray-400">{style.description}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => handleAction('translate')}
        disabled={isProcessing}
        className={`p-2 hover:bg-gray-700 rounded transition-colors ${
          isProcessing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title="Translate to English"
      >
        <Languages size={18} className={`text-gray-300 ${isProcessing ? 'animate-pulse' : ''}`} />
      </button>

      <div className="flex items-center space-x-2 ml-4 text-gray-400 text-sm">
        <FileText size={14} />
        <span>{wordCount} words</span>
      </div>
    </div>
  );
}