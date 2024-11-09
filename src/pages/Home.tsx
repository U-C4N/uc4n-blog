import React from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 pt-32 pb-16">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Umutcan Edizaslan
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        🔧 Mechanical Engineer | 🐍 Python Developer
      </p>

      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <p className="flex items-center">
          Working at{' '}
          <span className="inline-flex items-center px-2 py-1 ml-2 bg-gray-800 text-gray-300 rounded text-sm">
            Deuz AI
          </span>
        </p>

        <p className="flex items-center flex-wrap gap-2">
          Founder of
          <span className="inline-flex items-center px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm">
            Deuz AI
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm">
            Adne
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm">
            Fizyo AI
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm">
            Zooth AI
          </span>
        </p>
      </div>

      <p className="mt-8 text-gray-600 dark:text-gray-300 italic">
        "Be not what you are, but what you ought to be." - High Evolutionary
      </p>
    </main>
  );
}
