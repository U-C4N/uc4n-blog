import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface SocialLinks {
  github: string;
  twitter: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  socialLinks: SocialLinks;
  login: (username: string, password: string) => void;
  logout: () => void;
  updateSocialLinks: (links: SocialLinks) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'umutadmin'
};

const DEFAULT_SOCIAL_LINKS = {
  github: 'https://github.com/test',
  twitter: 'https://x.com/test'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(DEFAULT_SOCIAL_LINKS);
  const navigate = useNavigate();

  const login = (username: string, password: string) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const updateSocialLinks = (links: SocialLinks) => {
    setSocialLinks(links);
    toast.success('Social links updated successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      socialLinks,
      login, 
      logout,
      updateSocialLinks 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}