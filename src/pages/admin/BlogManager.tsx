import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Post } from '../../types';
import { PostForm } from '../../components/admin/PostForm';
import { useData } from '../../contexts/DataContext';

export function BlogManager() {
  const { posts, addPost, updatePost, deletePost } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  async function handleSubmit(data: Partial<Post>) {
    setIsLoading(true);
    try {
      if (editingPost) {
        updatePost(editingPost.id, data);
        toast.success('Post updated successfully');
      } else {
        addPost(data as Omit<Post, 'id' | 'created_at' | 'updated_at'>);
        toast.success('Post created successfully');
      }
      setShowForm(false);
      setEditingPost(null);
    } catch (error) {
      toast.error('Failed to save post');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      deletePost(id);
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
          <button
            onClick={() => {
              setEditingPost(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </button>
        </div>

        {showForm ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingPost ? 'Edit Post' : 'New Post'}
            </h2>
            <PostForm
              post={editingPost || undefined}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
            <button
              onClick={() => {
                setShowForm(false);
                setEditingPost(null);
              }}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post) => (
                <li key={post.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {post.published ? 'Published' : 'Draft'} · {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingPost(post);
                          setShowForm(true);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}