import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import SectionHeading from '../components/SectionHeading';
import AnimatedSection from '../components/AnimatedSection';
import SectionArrow from '../components/SectionArrow';
import * as LucideIcons from 'lucide-react';

// Built-in categories in display order; custom ones are appended dynamically
const BASE_CATEGORIES = ['frontend', 'backend', 'languages', 'tools'];

// Radial progress ring component
const RadialProgress: React.FC<{ percent: number; size?: number; strokeWidth?: number }> = ({
  percent,
  size = 56,
  strokeWidth = 5,
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
            <stop offset="0%" stopColor="#415a77" />
            <stop offset="100%" stopColor="#778da9" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{percent}%</span>
      </div>
    </div>
  );
};

const Skills: React.FC = () => {
  const { skills } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Dynamically get Lucide icons
  const IconComponent = (iconName: string | undefined) => {
    if (!iconName) return null;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon size={20} className="mr-2" /> : null;
  };

  // Build category tabs dynamically: base ones first, then any custom ones from skills data
  const customCats = Array.from(new Set(
    skills
      .map((s) => s.category)
      .filter((c) => !BASE_CATEGORIES.includes(c) && c !== 'other')
  ));
  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Skills' },
    ...BASE_CATEGORIES.map((c) => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1) })),
    ...customCats.map((c) => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1) })),
  ];

  const filteredSkills = activeCategory === 'all'
    ? skills
    : skills.filter((skill) => skill.category === activeCategory);

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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredSkills.map((skill, index) => {
            const directions: Array<'up' | 'left' | 'right'> = ['left', 'up', 'right'];
            const dir = directions[index % 3];
            return (
              <AnimatedSection
                key={skill.name}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow p-3 card-glow"
                delayMultiplier={index}
                direction={dir}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <RadialProgress percent={skill.proficiency} />
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <div className="text-amber-500">
                        {IconComponent(skill.icon)}
                      </div>
                      <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
                        {skill.name}
                      </h3>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 capitalize mt-0.5">{skill.category}</p>
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