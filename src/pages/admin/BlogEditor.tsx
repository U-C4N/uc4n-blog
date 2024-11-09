import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Undo } from 'lucide-react';
import toast from 'react-hot-toast';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Toolbar } from '../../components/Toolbar';
import { ContentLengthSlider } from '../../components/ContentLengthSlider';
import { generateSEOContent } from '../../lib/ai';

interface EditableBlockProps {
  content: string;
  onChange: (content: string) => void;
}

function EditableBlock({ content, onChange }: EditableBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const html = DOMPurify.sanitize(marked(content));
    setPreview(html);
  }, [content]);

  const handleFormatClick = (format: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = textareaRef.current.value;
    const selectedText = text.substring(start, end);

    let newText = text;
    let newCursorPos = start;

    switch (format) {
      case 'bold':
        newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
        newCursorPos = end + 2;
        break;
      case 'h1':
        newText = text.substring(0, start) + `# ${selectedText}` + text.substring(end);
        newCursorPos = end + 2;
        break;
      case 'h2':
        newText = text.substring(0, start) + `## ${selectedText}` + text.substring(end);
        newCursorPos = end + 3;
        break;
      case 'list':
        newText = text.substring(0, start) + `- ${selectedText}` + text.substring(end);
        newCursorPos = end + 2;
        break;
      case 'link':
        newText = text.substring(0, start) + `[${selectedText}](url)` + text.substring(end);
        newCursorPos = end + 7;
        break;
      case 'quote':
        newText = text.substring(0, start) + `> ${selectedText}` + text.substring(end);
        newCursorPos = end + 2;
        break;
      case 'code':
        newText = text.substring(0, start) + `\`${selectedText}\`` + text.substring(end);
        newCursorPos = end + 2;
        break;
    }

    onChange(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleImageUpload = (imageUrl: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const text = textareaRef.current.value;
      const imageMarkdown = `![Image](${imageUrl})`;
      const newText = text.substring(0, start) + imageMarkdown + text.substring(start);
      onChange(newText);
    }
  };

  return (
    <div className="relative group">
      {isEditing && (
        <Toolbar 
          onFormatClick={handleFormatClick}
          onImageUpload={handleImageUpload}
          onTextUpdate={onChange}
          currentText={content}
          onClose={() => setIsEditing(false)}
        />
      )}
      <div className="grid grid-cols-2 gap-4">
        <div 
          className="relative"
          onClick={() => setIsEditing(true)}
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[500px] bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-none"
            style={{
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word'
            }}
          />
          <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-l" />
        </div>
        <div 
          className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700 overflow-auto"
          style={{ minHeight: '500px' }}
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      </div>
    </div>
  );
}

export function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, addPost, updatePost } = useData();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [published, setPublished] = useState(false);
  const [contentLength, setContentLength] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      const post = posts.find(p => p.id === id);
      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setSlug(post.slug);
        setPublished(post.published);
      }
    }
  }, [id, posts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await updatePost(id, { title, content, slug, published });
        toast.success('Post updated successfully');
      } else {
        await addPost({ title, content, slug, published });
        toast.success('Post created successfully');
      }
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('An error occurred while saving the post');
    }
  };

  const handleGenerate = async () => {
    if (!title) {
      toast.error('Please enter a title first');
      return;
    }

    setIsGenerating(true);
    try {
      const { text, error } = await generateSEOContent(title, contentLength);
      
      if (error) {
        throw new Error(error);
      }

      setContent(text);
      toast.success('Content generated successfully');
    } catch (error) {
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Undo size={20} className="mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Published</span>
            </label>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {id ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-600"
          />
          
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="post-url-slug"
            className="w-full bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <ContentLengthSlider
            value={contentLength}
            onChange={setContentLength}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          <EditableBlock 
            content={content}
            onChange={setContent}
          />
        </div>
      </div>
    </div>
  );
}