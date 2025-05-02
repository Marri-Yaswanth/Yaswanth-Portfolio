// Define TypeScript types for the portfolio data

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link?: string;
  github?: string;
}

export interface Skill {
  name: string;
  proficiency: number; // 0-100
  category: 'frontend' | 'backend' | 'tools' | 'languages' | 'other';
  icon?: string; // Optional icon name from Lucide
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string; // ISO date string
  credentialLink?: string;
  image?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface NavLink {
  name: string;
  href: string;
}

export interface Education {
  institution: string;
  degree: string;
  location: string;
  period: string;
}