import React from 'react';
import { BarChart, Calendar, TrendingUp, Clock } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { calculateReadingTime } from '../../utils/readingTime';

export function AnalyticsDashboard() {
  const { posts, projects } = useData();

  const analytics = {
    totalWords: posts.reduce((acc, post) => acc + post.content.split(/\s+/).length, 0),
    avgReadTime: Math.ceil(posts.reduce((acc, post) => acc + calculateReadingTime(post.content), 0) / posts.length) || 0,
    postsThisMonth: posts.filter(post => {
      const postDate = new Date(post.created_at);
      const now = new Date();
      return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
    }).length,
    publishedRatio: Math.round((posts.filter(post => post.published).length / posts.length) * 100) || 0
  };

  const stats = [
    {
      label: 'Total Words',
      value: analytics.totalWords.toLocaleString(),
      icon: BarChart,
      color: 'from-pink-500 to-rose-500'
    },
    {
      label: 'Avg. Read Time',
      value: `${analytics.avgReadTime} min`,
      icon: Clock,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      label: 'Posts This Month',
      value: analytics.postsThisMonth,
      icon: Calendar,
      color: 'from-violet-500 to-purple-500'
    },
    {
      label: 'Published Ratio',
      value: `${analytics.publishedRatio}%`,
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 ease-out" />
          <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.color} mb-4`}>
            <stat.icon size={24} className="text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stat.value}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}