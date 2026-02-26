import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import SectionHeading from '../components/SectionHeading';
import AnimatedSection from '../components/AnimatedSection';
import SectionArrow from '../components/SectionArrow';
import * as LucideIcons from 'lucide-react';

type SkillCategory = 'all' | 'frontend' | 'backend' | 'tools' | 'languages' | 'other';

// Radial progress ring component
const RadialProgress: React.FC<{ percent: number; size?: number; strokeWidth?: number }> = ({
  percent,
  size = 80,
  strokeWidth = 6,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const ringRef = useRef<SVGCircleElement>(null);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-600"
        />
        <circle
          ref={ringRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#amberGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={visible ? offset : circumference}
          className="transition-[stroke-dashoffset] duration-[1.2s] ease-out"
        />
        <defs>
          <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{percent}%</span>
      </div>
    </div>
  );
};

const Skills: React.FC = () => {
  const { skills } = usePortfolio();
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
                  ? 'bg-amber-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-gray-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => {
            const directions: Array<'up' | 'left' | 'right'> = ['left', 'up', 'right'];
            const dir = directions[index % 3];
            return (
              <AnimatedSection
                key={skill.name}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6 card-glow"
                delayMultiplier={index}
                direction={dir}
              >
                <div className="flex items-center gap-4">
                  <RadialProgress percent={skill.proficiency} />
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <div className="text-amber-500 mr-2">
                        {IconComponent(skill.icon)}
                      </div>
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                        {skill.name}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{skill.category}</p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
      <SectionArrow to="/projects" prev="/education" label="Go to Projects" prevLabel="Go to Education" />
    </AnimatedSection>
  );
};

export default Skills;