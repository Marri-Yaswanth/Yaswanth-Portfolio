import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Certification, Skill } from '../types';
import { projects as initialProjects, certifications as initialCertifications, skills as initialSkills, aboutMe } from '../data';

interface ResumeLinks {
  general: string;
  specialized: string;
}

interface PortfolioContextType {
  projects: Project[];
  certifications: Certification[];
  skills: Skill[];
  resumeLinks: ResumeLinks;
  addProject: (project: Project) => void;
  addCertification: (certification: Certification) => void;
  addSkill: (skill: Skill) => void;
  addSkills: (skills: Skill[]) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  updateCertification: (id: string, updates: Partial<Certification>) => void;
  updateSkill: (name: string, updates: Partial<Skill>) => void;
  deleteProject: (id: string) => void;
  deleteCertification: (id: string) => void;
  deleteSkill: (name: string) => void;
  updateResumeLinks: (links: ResumeLinks) => void;
}

const STORAGE_KEYS = {
  projects: 'portfolio_projects',
  certifications: 'portfolio_certifications',
  skills: 'portfolio_skills',
  resumeLinks: 'portfolio_resumeLinks',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  return fallback;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() =>
    loadFromStorage(STORAGE_KEYS.projects, initialProjects)
  );
  const [certifications, setCertifications] = useState<Certification[]>(() =>
    loadFromStorage(STORAGE_KEYS.certifications, initialCertifications)
  );
  const [skills, setSkills] = useState<Skill[]>(() =>
    loadFromStorage(STORAGE_KEYS.skills, initialSkills)
  );
  const [resumeLinks, setResumeLinks] = useState<ResumeLinks>(() =>
    loadFromStorage(STORAGE_KEYS.resumeLinks, aboutMe.resumeLinks)
  );

  // Persist to localStorage whenever data changes
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.certifications, JSON.stringify(certifications)); }, [certifications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify(skills)); }, [skills]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.resumeLinks, JSON.stringify(resumeLinks)); }, [resumeLinks]);

  const addProject = (project: Project) => {
    setProjects((prev) => [...prev, project]);
  };

  const addCertification = (certification: Certification) => {
    setCertifications((prev) => [...prev, certification]);
  };

  const addSkill = (skill: Skill) => {
    setSkills((prev) => [...prev, skill]);
  };

  const addSkills = (newSkills: Skill[]) => {
    setSkills((prev) => [...prev, ...newSkills]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    setCertifications((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const updateSkill = (name: string, updates: Partial<Skill>) => {
    setSkills((prev) => prev.map((s) => (s.name === name ? { ...s, ...updates } : s)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const deleteCertification = (id: string) => {
    setCertifications((prev) => prev.filter((c) => c.id !== id));
  };

  const deleteSkill = (name: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== name));
  };

  const updateResumeLinks = (links: ResumeLinks) => {
    setResumeLinks(links);
  };

  return (
    <PortfolioContext.Provider value={{ projects, certifications, skills, resumeLinks, addProject, addCertification, addSkill, addSkills, updateProject, updateCertification, updateSkill, deleteProject, deleteCertification, deleteSkill, updateResumeLinks }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
