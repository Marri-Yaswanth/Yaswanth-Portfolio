import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Award, Calendar, Link as LinkIcon, FileText, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import SectionHeading from '../components/SectionHeading';
import AnimatedSection from '../components/AnimatedSection';
import SectionArrow from '../components/SectionArrow';
import type { Certification } from '../types';

/* ── Certificate Modal (matches resume viewer style) ── */
const CertificateModal: React.FC<{ cert: Certification; onClose: () => void; isPdf: (f: string) => boolean }> = ({
  cert,
  onClose,
  isPdf,
}) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const hasPdf = cert.image && isPdf(cert.image);

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar — same style as resume viewer */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{cert.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Issued by {cert.issuer}</p>
          </div>
          <div className="flex items-center gap-3">
            {cert.credentialLink && (
              <a
                href={cert.credentialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
              >
                <LinkIcon size={14} />
                View Credential
              </a>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 p-4 overflow-hidden">
          {hasPdf ? (
            <iframe
              src={cert.image}
              title={cert.name}
              className="w-full h-full border-0 rounded-lg"
            />
          ) : cert.image ? (
            <div className="w-full h-full overflow-auto flex items-start justify-center">
              <img
                src={cert.image}
                alt={cert.name}
                className="max-w-full rounded-lg"
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <FileText size={48} className="mb-3 text-amber-500" />
              <p>No preview available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Certifications: React.FC = () => {
  const { certifications } = usePortfolio();
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certifications.map((cert, index) => {
            const directions: Array<'up' | 'left' | 'right'> = ['left', 'up', 'right'];
            const dir = directions[index % 3];
            return (
            <AnimatedSection
              key={cert.id}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow card-glow cursor-pointer group"
              delayMultiplier={index}
              direction={dir}
              onClick={() => setSelectedCert(cert)}
            >
              {cert.image && (
                <div className="h-36 flex items-center justify-center bg-gray-100 dark:bg-gray-600 overflow-hidden">
                  {isPdf(cert.image) ? (
                    <div className="flex flex-col items-center justify-center p-3 text-center">
                      <FileText size={36} className="text-amber-500 mb-1" />
                      <span className="text-xs text-gray-600 dark:text-gray-300">PDF Certificate</span>
                    </div>
                  ) : (
                    <img
                      src={cert.image}
                      alt={cert.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
              )}
              
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-base font-bold text-gray-800 dark:text-white leading-snug">
                      {cert.name}
                    </h3>
                    <Award className="text-amber-500 flex-shrink-0 ml-2" size={16} />
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {cert.issuer}
                  </p>
                  
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                    <Calendar size={13} className="mr-1" />
                    <span>{formatDate(cert.date)}</span>
                  </div>
                </div>

                {cert.credentialLink && (
                  <a
                    href={cert.credentialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-medium mt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinkIcon size={12} />
                    View Credential
                  </a>
                )}
              </div>
            </AnimatedSection>
            );
          })}
        </div>

        {/* Certificate Modal (portalled to body to escape transform context) */}
        {selectedCert && ReactDOM.createPortal(
          <CertificateModal
            cert={selectedCert}
            onClose={() => setSelectedCert(null)}
            isPdf={isPdf}
          />,
          document.body
        )}
      </div>

      <SectionArrow to="/contact" prev="/projects" label="Go to Contact" prevLabel="Go to Projects" />
    </AnimatedSection>
  );
};

export default Certifications;