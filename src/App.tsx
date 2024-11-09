import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { BlogEditor } from './pages/admin/BlogEditor';
import { ProjectEditor } from './pages/admin/ProjectEditor';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { initializeStorage } from './lib/supabase';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
}

function AppRoutes() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Initialize storage silently
    initializeStorage();

    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/blog/new"
          element={
            <PrivateRoute>
              <BlogEditor />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/blog/edit/:id"
          element={
            <PrivateRoute>
              <BlogEditor />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/projects/new"
          element={
            <PrivateRoute>
              <ProjectEditor />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/projects/edit/:id"
          element={
            <PrivateRoute>
              <ProjectEditor />
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}