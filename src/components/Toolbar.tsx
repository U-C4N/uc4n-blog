import React from 'react';
import { Bold, Italic, Heading1, Heading2, List, Link as LinkIcon, Quote, Code, X } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { TextEnhancer } from './TextEnhancer';

interface ToolbarProps {
  onFormatClick: (format: string) => void;
  onImageUpload: (imageUrl: string) => void;
  onTextUpdate: (text: string) => void;
  currentText: string;
  onClose: () => void;
}

export function Toolbar({ onFormatClick, onImageUpload, onTextUpdate, currentText, onClose }: ToolbarProps) {
  return (
    <div className="absolute -top-12 left-0 right-0 flex items-center justify-between bg-gray-800 rounded-md p-1.5 shadow-lg animate-fade-in">
      <div className="flex items-center space-x-1">
        <button onClick={() => onFormatClick('bold')} className="p-2 hover:bg-gray-700 rounded transition-colors" title="Bold">
          <Bold size={18} className="text-gray-300" />
        </button>
        <button onClick={() => onFormatClick('italic')} className="p-2 hover:bg-gray-700 rounded transition-colors" title="Italic">
          <Italic size={18} className="text-gray-300" />
        </button>
        <button onClick={() => onFormatClick('h1')} className="p-2 hover:bg-gray-700 rounded transition-colors" title="Heading 1">
          <Heading1 size={18} className="text-gray-300" />
        </button>
        <button onClick={() => onFormatClick('h2')} className="p-2 hover:bg-gray-700 rounded transition-colors" title="Heading 2">
          <Heading2 size={18} className="text-gray-300" />
        </button>
        <button onClick={() => onFormatClick('list')} className="p-2 hover:bg-gray-700 rounded transition-colors" title="List">
          <List size={18} className="text-gray-300" />
        </button>
        <button onClick={() => onFormatClick('link')} className="p-2 hover:bg-gray-700 rounded transition-colors" title="Link">
          <LinkIcon size={18} className="text-gray-300" />
        </button>
        <button onClick={() => onFormatClick('quote')} className="p-2 hover:bg-gray-700 rounded transition-colors" title="Quote">
          <Quote size={18} className="text-gray-300" />
        </button>
        <button onClick={() => onFormatClick('code')} className="p-2 hover:bg-gray-700 rounded transition-colors" title="Code">
          <Code size={18} className="text-gray-300" />
        </button>
        <ImageUploader onUploadComplete={onImageUpload} />
        <div className="h-6 w-px bg-gray-600 mx-1" />
        <TextEnhancer text={currentText} onUpdate={onTextUpdate} />
      </div>
      <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded transition-colors">
        <X size={18} className="text-gray-300" />
      </button>
    </div>
  );
}