import React, { useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';

interface ContentLengthSliderProps {
  value: number;
  onChange: (value: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const lengthLabels = [
  { value: 1, label: 'Brief', words: '~100 words' },
  { value: 2, label: 'Short', words: '~250 words' },
  { value: 3, label: 'Medium', words: '~500 words' },
  { value: 4, label: 'Long', words: '~1000 words' },
  { value: 5, label: 'Detailed', words: '~2000 words' }
];

const writingStyles = [
  { id: 'academic', label: 'Academic' },
  { id: 'blog', label: 'Blog-style' },
  { id: 'educational', label: 'Educational' },
  { id: 'professional', label: 'Professional' },
  { id: 'seo', label: 'SEO-optimized' }
];

export function ContentLengthSlider({ value, onChange, onGenerate, isGenerating }: ContentLengthSliderProps) {
  const [showStyles, setShowStyles] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(writingStyles[0]);

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-white text-lg font-medium">Content Length</h3>
          <div className="relative">
            <button
              onClick={() => setShowStyles(!showStyles)}
              className="flex items-center px-3 py-1.5 bg-[#2a2f3e] text-gray-300 rounded-md hover:bg-[#3a3f4e] transition-colors"
            >
              {selectedStyle.label}
              <ChevronDown size={16} className="ml-2" />
            </button>
            
            {showStyles && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-[#2a2f3e] rounded-md shadow-lg py-1 z-50">
                {writingStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setSelectedStyle(style);
                      setShowStyles(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-[#3a3f4e] transition-colors"
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`flex items-center px-4 py-2 bg-[#2563eb] text-white rounded-md hover:bg-[#1d4ed8] transition-colors ${
            isGenerating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Sparkles size={16} className={`mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>
      
      <div className="relative mb-8">
        <div className="absolute -top-2 left-0 w-full">
          <div className="relative h-1 bg-[#2a2f3e] rounded-full">
            <div
              className="absolute h-full bg-[#2563eb] rounded-full transition-all duration-200"
              style={{ width: `${((value - 1) / 4) * 100}%` }}
            />
          </div>
          <div className="absolute top-0 left-0 w-full flex justify-between">
            {lengthLabels.map((item) => (
              <button
                key={item.value}
                onClick={() => onChange(item.value)}
                className={`w-4 h-4 rounded-full -mt-1.5 transition-all duration-200 ${
                  value >= item.value
                    ? 'bg-[#2563eb] border-2 border-[#2563eb] transform scale-100'
                    : 'bg-[#2a2f3e] border-2 border-[#2a2f3e] transform scale-75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        {lengthLabels.map((item) => (
          <div
            key={item.value}
            className={`text-center transition-colors cursor-pointer group ${
              value === item.value ? 'text-[#2563eb]' : 'text-gray-400'
            }`}
            onClick={() => onChange(item.value)}
            style={{ width: '20%' }}
          >
            <div className="text-sm font-medium group-hover:text-white transition-colors">
              {item.label}
            </div>
            <div className="text-xs mt-1 opacity-75 group-hover:opacity-100 transition-opacity">
              {item.words}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}