import React from 'react';
import { useData } from '../contexts/DataContext';

export function Projects() {
  const currentFocus = [
    {
      icon: "○",
      title: "Nuxt ESLint",
      description: "All-in-one ESLint module for Nuxt"
    },
    {
      icon: "△",
      title: "Nuxt Playground",
      description: "Interactive Playground for learning Nuxt"
    },
    {
      icon: "△",
      title: "Nuxt DevTools",
      description: "Unleash Nuxt Developer Experience"
    }
  ];

  const vueEcosystem = [
    {
      icon: "U",
      title: "VueUse",
      description: "Collection of Composition API utils for Vue 2 and 3"
    },
    {
      icon: "23",
      title: "Vue Demi",
      description: "Creates Universal Library for Vue 2 & 3"
    },
    {
      icon: "↗",
      title: "vue-template-promise",
      description: "Template as Promise in Vue"
    },
    {
      icon: "⛵",
      title: "Vue Starport",
      description: "Shared component across routes with animations."
    },
    {
      icon: "V",
      title: "@vue/composition-api",
      description: "Vue 2 Composition API plugin"
    },
    {
      icon: "D",
      title: "Vue Reactivity",
      description: "Reactivity utils set for @vue/reactivity"
    },
    {
      icon: "⚛",
      title: "ReactiVue",
      description: "Use Vue Composition API in React components"
    },
    {
      icon: "⚗",
      title: "Vue Chemistry",
      description: "Reactified JavaScript functions for Vue"
    },
    {
      icon: "$",
      title: "v-dollar",
      description: "jQuery-like Vue Reactivity API"
    }
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 pt-32 pb-16">
      <div className="relative">
        {/* Dot pattern overlay */}
        <div 
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}
        />

        {/* Current Focus Section */}
        <section className="mb-24">
          <h2 className="text-[180px] font-bold text-gray-200/10 dark:text-white/10 leading-none mb-16">
            Current Focus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentFocus.map((project, index) => (
              <div
                key={index}
                className="group"
              >
                <div className="text-4xl text-gray-600 dark:text-gray-400 mb-4">{project.icon}</div>
                <h3 className="text-xl font-medium text-gray-800 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vue Ecosystem Section */}
        <section>
          <h2 className="text-[180px] font-bold text-gray-200/10 dark:text-white/10 leading-none mb-16">
            Vue Ecosystem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vueEcosystem.map((project, index) => (
              <div
                key={index}
                className="group"
              >
                <div className="text-4xl text-gray-600 dark:text-gray-400 mb-4">{project.icon}</div>
                <h3 className="text-xl font-medium text-gray-800 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}