import React, { useState } from 'react';
import { skills } from '../data';
import SectionHeading from '../components/SectionHeading';
import AnimatedSection from '../components/AnimatedSection';
import * as LucideIcons from 'lucide-react';

type SkillCategory = 'all' | 'frontend' | 'backend' | 'tools' | 'languages' | 'other';

const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('all');

  // Dynamically get Lucide icons
  const IconComponent = (iconName: string | undefined) => {
    if (!iconName) return null;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon size={20} className="mr-2" /> : null;
  };

  const categories: { id: SkillCategory; label: string }[] = [
    { id: 'all', label: 'All Skills' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'languages', label: 'Languages' },
    { id: 'tools', label: 'Tools' },
  ];

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  return (
    <AnimatedSection id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Skills & Technologies"
          subtitle="A comprehensive overview of my technical abilities"
        />

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2 rounded-full transition-colors ${
                activeCategory === category.id
                  ? 'bg-teal-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => (
            <AnimatedSection
              key={skill.name}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6"
              delayMultiplier={index}
            >
              <div className="flex items-center mb-4">
                <div className="text-teal-500 mr-2">
                  {IconComponent(skill.icon)}
                </div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                  {skill.name}
                </h3>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-teal-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${skill.proficiency}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Beginner</span>
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {skill.proficiency}%
                </span>
                <span>Expert</span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default Skills;