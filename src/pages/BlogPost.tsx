import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { calculateReadingTime } from '../utils/readingTime';

export function BlogPost() {
  const { slug } = useParams();
  const { posts } = useData();
  const location = useLocation();
  const isAdminView = location.pathname.startsWith('/admin');
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-2xl">Post not found</h1>
        </div>
      </div>
    );
  }

  const renderedContent = DOMPurify.sanitize(marked(post.content));
  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white pt-32 pb-16">
      <article className="max-w-3xl mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} · {readingTime} min read
          </div>
        </header>

        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      </article>
    </div>
  );
}