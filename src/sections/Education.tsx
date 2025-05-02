import React from 'react';
import Section from '../ui/Section';
import { education } from '../data/education';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';

const Education: React.FC = () => {
  return (
    <Section
      id="education"
      title="Education"
      subtitle="My academic journey and qualifications"
      className="bg-gray-50 dark:bg-gray-800/50"
    >
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
          
          {education.map((edu, index) => (
            <div key={index} className="relative mb-12 pl-12">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              
              <div className="card p-6 hover:translate-y-(-2px)">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">
                    {edu.degree}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {edu.period}
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
                  {edu.institution}
                </h4>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  {edu.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Education;