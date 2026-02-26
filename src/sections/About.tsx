import React, { useState } from 'react';
import { FileText, Download, ExternalLink, X } from 'lucide-react';
import { aboutMe } from '../data';
import { usePortfolio } from '../context/PortfolioContext';
import SectionHeading from '../components/SectionHeading';
import SectionArrow from '../components/SectionArrow';
import AnimatedSection from '../components/AnimatedSection';

const About: React.FC = () => {
  const { resumeLinks } = usePortfolio();
  const [activePdf, setActivePdf] = useState<string | null>(null);

  const handleViewPdf = (pdfPath: string) => {
    setActivePdf(pdfPath);
  };

  const handleClosePdf = () => {
    setActivePdf(null);
  };

  return (
    <AnimatedSection id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="About Me"
          subtitle="Learn more about my background and interests"
        />

        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-5/12 relative">
            <div className="relative max-w-md mx-auto">
              <div className="w-full h-96 rounded-lg overflow-hidden shadow-xl transform transition-transform hover:scale-105">
                <img
                  src={aboutMe.photoUrl}
                  alt={aboutMe.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-gray-200 dark:bg-gray-800 rounded-lg -z-10"></div>
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-amber-100 dark:bg-amber-900 rounded-lg -z-10 opacity-50"></div>
            </div>
          </div>

          <div className="lg:w-7/12 mt-10 lg:mt-0">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Hello, I'm {aboutMe.name}
            </h3>
            
            <div className="text-gray-600 dark:text-gray-300 space-y-4 mb-8">
              <p className="leading-relaxed">{aboutMe.introduction}</p>
              <p className="leading-relaxed">{aboutMe.detailedBio}</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mt-8">
              <div className="flex-1 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 transition-transform hover:shadow-md hover:translate-y-[-4px]">
                <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                  <FileText className="mr-2 text-amber-500" size={20} />
                  General Resume
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  A comprehensive overview of my skills and experience suitable for most positions.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleViewPdf(resumeLinks.general)}
                    className="inline-flex items-center text-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    <span>View PDF</span>
                  </button>
                  <a
                    href={resumeLinks.general}
                    download="general-resume.pdf"
                    className="inline-flex items-center text-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
                  >
                    <Download size={16} className="mr-1" />
                    <span>Download</span>
                  </a>
                </div>
              </div>

              <div className="flex-1 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 transition-transform hover:shadow-md hover:translate-y-[-4px]">
                <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                  <FileText className="mr-2 text-amber-500" size={20} />
                  Specialized Resume
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Tailored for specialized roles with focus on relevant skills and projects.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleViewPdf(resumeLinks.specialized)}
                    className="inline-flex items-center text-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    <span>View PDF</span>
                  </button>
                  <a
                    href={resumeLinks.specialized}
                    download="specialized-resume.pdf"
                    className="inline-flex items-center text-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
                  >
                    <Download size={16} className="mr-1" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {activePdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Resume Preview</h3>
              <button 
                onClick={handleClosePdf}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
              <iframe 
                src={activePdf} 
                className="w-full h-full border-0"
                title="Resume PDF"
              />
            </div>
          </div>
        </div>
      )}

      <SectionArrow to="/education" prev="/" label="Go to Education" prevLabel="Go to Home" />
    </AnimatedSection>
  );
};

export default About;