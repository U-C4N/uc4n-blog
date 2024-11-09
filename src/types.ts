export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  icon: string;
  is_current_focus: boolean;
  category: string;
  created_at: string;
  updated_at: string;
}