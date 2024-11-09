import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText, Boxes, Users, TrendingUp, Settings, LogOut } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { AnalyticsDashboard } from '../../components/admin/AnalyticsDashboard';
import { SearchBar } from '../../components/admin/SearchBar';
import { AuditLog } from '../../components/admin/AuditLog';
import { SocialLinksEditor } from '../../components/admin/SocialLinksEditor';

// Mock audit events - In a real app, these would come from a backend
const mockAuditEvents = [
  {
    id: '1',
    type: 'create',
    entityType: 'post',
    entityId: '1',
    entityTitle: 'New Blog Post',
    timestamp: new Date().toISOString(),
    user: 'admin'
  },
  {
    id: '2',
    type: 'update',
    entityType: 'project',
    entityId: '2',
    entityTitle: 'Project Update',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: 'admin'
  }
] as const;

export function Dashboard() {
  const { posts, projects } = useData();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <SearchBar 
              onSearch={setSearchQuery}
              placeholder="Search posts and projects..."
            />
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="mb-8">
          <AnalyticsDashboard />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/admin/blog/new"
            className="group relative backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden hover:border-blue-500 dark:hover:border-blue-500 transition-colors duration-300"
          >
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg">
                <PlusCircle size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">New Blog Post</h3>
                <p className="text-gray-600 dark:text-gray-400">Create a new blog post</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/projects/new"
            className="group relative backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden hover:border-purple-500 dark:hover:border-purple-500 transition-colors duration-300"
          >
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg">
                <PlusCircle size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">New Project</h3>
                <p className="text-gray-600 dark:text-gray-400">Add a new project</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Posts */}
          <div className="lg:col-span-2 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Posts</h2>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPosts.slice(0, 5).map((post) => (
                <Link
                  key={post.id}
                  to={`/admin/blog/edit/${post.id}`}
                  className="block py-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 -mx-6 px-6 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">{post.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.published
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Social Links Editor */}
          <div>
            <SocialLinksEditor />
          </div>
        </div>

        {/* Activity Log */}
        <div className="mt-6">
          <AuditLog events={mockAuditEvents} />
        </div>
      </div>
    </div>
  );
}