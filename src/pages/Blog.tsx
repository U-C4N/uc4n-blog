import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { calculateReadingTime } from '../utils/readingTime';

export function Blog() {
  const { posts } = useData();
  const publishedPosts = posts.filter(post => post.published);

  const groupedPosts = publishedPosts.reduce((acc, post) => {
    const year = new Date(post.created_at).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<number, typeof posts>);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <main className="max-w-3xl mx-auto px-6 pt-32 pb-16">
      {Object.entries(groupedPosts)
        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
        .map(([year, yearPosts]) => (
          <section key={year} className="mb-16">
            <div className="text-8xl font-bold text-gray-900/10 dark:text-white/10 mb-8">{year}</div>
            <div className="space-y-6">
              {yearPosts.map((post) => (
                <article
                  key={post.id}
                  className="group flex justify-between items-center hover:bg-white/50 dark:hover:bg-gray-800/50 -mx-4 px-4 py-3 rounded-lg transition-colors"
                >
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="flex-grow text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white text-lg transition-colors"
                  >
                    {post.title}
                  </Link>
                  <div className="text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap ml-4">
                    {formatDate(post.created_at)} · {calculateReadingTime(post.content)} min read
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

      {publishedPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No posts published yet.</p>
        </div>
      )}
    </main>
  );
}