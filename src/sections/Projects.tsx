import React, { useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { projects } from '../data';
import SectionHeading from '../components/SectionHeading';
import AnimatedSection from '../components/AnimatedSection';

type ProjectFilter = 'all' | string;

const Projects: React.FC = () => {
  const [filter, setFilter] = useState<ProjectFilter>('all');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

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

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              filter === 'all'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-700'
            }`}
          >
            All Projects
          </button>
          
          {allTechnologies.slice(0, 6).map((tech) => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === tech
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-700'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <AnimatedSection 
              key={project.id}
              className="group rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all"
              delayMultiplier={index}
            >
              <div 
                className="relative h-64 overflow-hidden"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end transform transition-opacity duration-300 ${
                  hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="flex space-x-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-colors"
                      >
                        <Github size={18} />
                      </a>
                    )}
                    
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-colors"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.technologies.map((tech) => (
                    <span
                      key={`${project.id}-${tech}`}
                      className={`px-3 py-1 text-xs rounded-full ${
                        filter === tech
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default Projects;