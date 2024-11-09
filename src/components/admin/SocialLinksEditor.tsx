import React, { useState } from 'react';
import { Github, Twitter, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function SocialLinksEditor() {
  const { socialLinks, updateSocialLinks } = useAuth();
  const [github, setGithub] = useState(socialLinks.github);
  const [twitter, setTwitter] = useState(socialLinks.twitter);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocialLinks({ github, twitter });
    setIsEditing(false);
  };

  return (
    <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Social Links</h2>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Github size={16} className="mr-2" />
              GitHub URL
            </label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://github.com/username"
              required
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Twitter size={16} className="mr-2" />
              X (Twitter) URL
            </label>
            <input
              type="url"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://x.com/username"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Github size={16} className="mr-2" />
              <a href={github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                {github}
              </a>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Twitter size={16} className="mr-2" />
              <a href={twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                {twitter}
              </a>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Edit Links
          </button>
        </div>
      )}
    </div>
  );
}