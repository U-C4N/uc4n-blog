import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Project } from '../../types';
import { ProjectForm } from '../../components/admin/ProjectForm';
import { useData } from '../../contexts/DataContext';

export function ProjectManager() {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  async function handleSubmit(data: Partial<Project>) {
    setIsLoading(true);
    try {
      if (editingProject) {
        updateProject(editingProject.id, data);
        toast.success('Project updated successfully');
      } else {
        addProject(data as Omit<Project, 'id' | 'created_at' | 'updated_at'>);
        toast.success('Project created successfully');
      }
      setShowForm(false);
      setEditingProject(null);
    } catch (error) {
      toast.error('Failed to save project');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      deleteProject(id);
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <button
            onClick={() => {
              setEditingProject(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </button>
        </div>

        {showForm ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingProject ? 'Edit Project' : 'New Project'}
            </h2>
            <ProjectForm
              project={editingProject || undefined}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProject(null);
              }}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {projects.map((project) => (
                <li key={project.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{project.icon}</span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {project.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {project.category} · {project.is_current_focus ? 'Current Focus' : 'Other Project'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingProject(project);
                          setShowForm(true);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
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