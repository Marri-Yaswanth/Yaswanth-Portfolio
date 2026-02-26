import React from 'react';
import { Award, Calendar, Link as LinkIcon, FileText } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import SectionHeading from '../components/SectionHeading';
import AnimatedSection from '../components/AnimatedSection';
import SectionArrow from '../components/SectionArrow';

const Certifications: React.FC = () => {
  const { certifications } = usePortfolio();
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  // Helper function to check if the file is a PDF
  const isPdf = (filePath: string) => {
    return filePath.toLowerCase().endsWith('.pdf') || filePath.startsWith('data:application/pdf');
  };

  // Helper function to check if a string is an image
  const isImage = (filePath: string) => {
    return filePath.startsWith('data:image/') || /\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(filePath);
  };

  return (
    <AnimatedSection id="certifications" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Certifications"
          subtitle="Professional certifications that validate my expertise"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certifications.map((cert, index) => {
            const directions: Array<'up' | 'left' | 'right'> = ['left', 'right'];
            const dir = directions[index % 2];
            return (
            <AnimatedSection
              key={cert.id}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow card-glow"
              delayMultiplier={index}
              direction={dir}
            >
              {cert.image && (
                <div className="md:w-1/3 h-48 md:h-auto flex items-center justify-center bg-gray-100 dark:bg-gray-600">
                  {isPdf(cert.image) ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <FileText size={48} className="text-amber-500 mb-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">PDF Certificate</span>
                    </div>
                  ) : (
                    <img
                      src={cert.image}
                      alt={cert.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}
              
              <div className={`p-6 flex flex-col justify-between ${cert.image ? 'md:w-2/3' : 'w-full'}`}>
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {cert.name}
                    </h3>
                    <Award className="text-amber-500 flex-shrink-0 ml-2" size={20} />
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Issued by {cert.issuer}
                  </p>
                  
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                    <Calendar size={16} className="mr-1" />
                    <span>{formatDate(cert.date)}</span>
                  </div>
                </div>
                
                {cert.credentialLink && (
                  <a
                    href={cert.credentialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 text-sm font-medium"
                  >
                    <LinkIcon size={16} className="mr-1" />
                    <span>View Certificate</span>
                  </a>
                )}
              </div>
            </AnimatedSection>
            );
          })}
        </div>
      </div>

      <SectionArrow to="/contact" prev="/projects" label="Go to Contact" prevLabel="Go to Projects" />
    </AnimatedSection>
  );
};

export default Certifications;