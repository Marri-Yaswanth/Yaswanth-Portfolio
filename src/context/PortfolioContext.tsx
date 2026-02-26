import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  updateResumeLinks: (links: ResumeLinks) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [resumeLinks, setResumeLinks] = useState<ResumeLinks>(aboutMe.resumeLinks);

  const addProject = (project: Project) => {
    setProjects((prev) => [...prev, project]);
  };

  const addCertification = (certification: Certification) => {
    setCertifications((prev) => [...prev, certification]);
  };

  const addSkill = (skill: Skill) => {
    setSkills((prev) => [...prev, skill]);
  };

  const updateResumeLinks = (links: ResumeLinks) => {
    setResumeLinks(links);
  };

  return (
    <PortfolioContext.Provider value={{ projects, certifications, skills, resumeLinks, addProject, addCertification, addSkill, updateResumeLinks }}>
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
