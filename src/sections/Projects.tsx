import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ExternalLink, Github, Circle, Loader, Lightbulb, X, Globe, KeyRound, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import { Project, ProjectStatus } from '../types';
import SectionHeading from '../components/SectionHeading';
import AnimatedSection from '../components/AnimatedSection';
import SectionArrow from '../components/SectionArrow';

type ProjectFilter = 'all' | string;

const statusConfig: Record<ProjectStatus, { label: string; color: string; badgeColor: string; icon: React.ReactNode }> = {
  live: {
    label: 'Live',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    badgeColor: 'bg-green-500',
    icon: <Circle size={8} className="fill-green-500 text-green-500" />,
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    badgeColor: 'bg-amber-500',
    icon: <Loader size={12} className="text-amber-500 animate-spin" />,
  },
  ideation: {
    label: 'Ideation',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    badgeColor: 'bg-blue-500',
    icon: <Lightbulb size={12} className="text-blue-500" />,
  },
};

// ── Project Detail Modal ──
const ProjectModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  const status = statusConfig[project.status];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [visibleCreds, setVisibleCreds] = useState<Set<number>>(new Set());
  const { showToast } = useToast();

  const toggleCredVisibility = (index: number) => {
    setVisibleCreds((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleCopy = (value: string, index: number) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Image banner */}
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <h2 className="text-xl font-bold text-white mb-1">{project.title}</h2>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
              {status.icon}
              {status.label}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {project.description}
          </p>

          {/* Tech stack */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
              >
                <Github size={16} />
                Open in GitHub
              </a>
            )}
            {project.status === 'live' && project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
              >
                <Globe size={16} />
                Open in Browser
              </a>
            )}
            {project.status !== 'live' && (
              <span className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm font-medium cursor-not-allowed">
                <Globe size={16} />
                {project.status === 'in-progress' ? 'Coming Soon' : 'Not Available'}
              </span>
            )}
          </div>

          {/* Credentials */}
          {project.credentials && project.credentials.length > 0 && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white mb-3">
                <KeyRound size={16} className="text-amber-500" />
                Demo Credentials
              </h4>
              <div className="space-y-2">
                {project.credentials.map((cred, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-md px-3 py-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{cred.label}</span>
                      <p className="text-sm font-mono text-gray-800 dark:text-gray-200">
                        {visibleCreds.has(i) ? cred.value : '••••••••'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      <button
                        onClick={() => toggleCredVisibility(i)}
                        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors"
                        title={visibleCreds.has(i) ? 'Hide' : 'Show'}
                      >
                        {visibleCreds.has(i) ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => handleCopy(cred.value, i)}
                        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors"
                        title="Copy"
                      >
                        {copiedIndex === i ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Projects Section ──
const Projects: React.FC = () => {
  const { projects } = usePortfolio();
  const [filter, setFilter] = useState<ProjectFilter>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Extract unique technologies from all projects
  const allTechnologies = Array.from(
    new Set(projects.flatMap(project => project.technologies))
  );

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(project => project.technologies.includes(filter));

  return (
    <AnimatedSection id="projects" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="My Projects"
          subtitle="A showcase of my recent work and contributions"
        />

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              filter === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-500/10 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          
          {allTechnologies.slice(0, 6).map((tech) => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                filter === tech
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-500/10 dark:hover:bg-gray-700'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => {
            const status = statusConfig[project.status];
            const directions: Array<'up' | 'left' | 'right'> = ['left', 'up', 'right'];
            const dir = directions[index % 3];

            return (
              <AnimatedSection 
                key={project.id}
                className="group rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all flex flex-col cursor-pointer card-glow"
                delayMultiplier={index}
                direction={dir}
              >
                <div onClick={() => setSelectedProject(project)}>
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Status badge */}
                    <span className={`absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                  
                  {/* Card body */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {project.technologies.map((tech) => (
                        <span
                          key={`${project.id}-${tech}`}
                          className={`px-2.5 py-0.5 text-xs rounded-full ${
                            filter === tech
                              ? 'bg-amber-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>

      {/* Project Detail Modal (portalled to body to escape transform context) */}
      {selectedProject && ReactDOM.createPortal(
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />,
        document.body
      )}

      <SectionArrow to="/certifications" prev="/skills" label="Go to Certifications" prevLabel="Go to Skills" />
    </AnimatedSection>
  );
};

export default Projects;