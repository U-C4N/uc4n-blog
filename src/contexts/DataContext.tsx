import React, { createContext, useContext, useEffect, useState } from 'react';
import { Post, Project } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface DataContextType {
  posts: Post[];
  projects: Project[];
  addPost: (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePost: (id: string, post: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchPosts();
    fetchProjects();

    // Set up realtime subscriptions
    const postsSubscription = supabase
      .channel('posts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    const projectsSubscription = supabase
      .channel('projects_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(postsSubscription);
      supabase.removeChannel(projectsSubscription);
    };
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
    }
  }

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    }
  }

  const addPost = async (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('posts')
        .insert([{ ...post }]);

      if (error) throw error;
      await fetchPosts();
    } catch (error: any) {
      console.error('Error adding post:', error);
      throw new Error(error.message || 'Failed to add post');
    }
  };

  const updatePost = async (id: string, post: Partial<Post>) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update(post)
        .eq('id', id);

      if (error) throw error;
      await fetchPosts();
    } catch (error: any) {
      console.error('Error updating post:', error);
      throw new Error(error.message || 'Failed to update post');
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPosts();
    } catch (error: any) {
      console.error('Error deleting post:', error);
      throw new Error(error.message || 'Failed to delete post');
    }
  };

  const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .insert([{ ...project }]);

      if (error) throw error;
      await fetchProjects();
    } catch (error: any) {
      console.error('Error adding project:', error);
      throw new Error(error.message || 'Failed to add project');
    }
  };

  const updateProject = async (id: string, project: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id);

      if (error) throw error;
      await fetchProjects();
    } catch (error: any) {
      console.error('Error updating project:', error);
      throw new Error(error.message || 'Failed to update project');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProjects();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      throw new Error(error.message || 'Failed to delete project');
    }
  };

  return (
    <DataContext.Provider value={{
      posts,
      projects,
      addPost,
      updatePost,
      deletePost,
      addProject,
      updateProject,
      deleteProject,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}