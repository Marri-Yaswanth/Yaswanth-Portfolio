import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Upload, FileText, Eye, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import SectionHeading from '../components/SectionHeading';

const UpdateResumePage: React.FC = () => {
  const { resumeLinks, updateResumeLinks } = usePortfolio();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const [generalFile, setGeneralFile] = useState<File | null>(null);
  const [specializedFile, setSpecializedFile] = useState<File | null>(null);
  const [generalPreview, setGeneralPreview] = useState<string>(resumeLinks.general);
  const [specializedPreview, setSpecializedPreview] = useState<string>(resumeLinks.specialized);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Update Resume | Yaswanth Portfolio';
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'general' | 'specialized'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    if (type === 'general') {
      setGeneralFile(file);
      setGeneralPreview(objectUrl);
    } else {
      setSpecializedFile(file);
      setSpecializedPreview(objectUrl);
    }
  };

  const clearFile = (type: 'general' | 'specialized') => {
    if (type === 'general') {
      setGeneralFile(null);
      setGeneralPreview(resumeLinks.general);
    } else {
      setSpecializedFile(null);
      setSpecializedPreview(resumeLinks.specialized);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app you'd upload files to a server here.
    // For the static portfolio, we update the context with the object URLs
    // so the About section picks up the new files for the current session.
    updateResumeLinks({
      general: generalPreview,
      specialized: specializedPreview,
    });

    setSubmitted(true);
    setTimeout(() => navigate('/about'), 1500);
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 dark:text-gray-200 text-sm';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <CheckCircle size={56} className="text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Resume Updated!</h2>
        <p className="text-gray-500 dark:text-gray-400">Redirecting to about...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <SectionHeading title="Update Resume" subtitle="Upload new PDF files to replace your current resumes" />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Resume */}
          <div>
            <label className={labelClass}>General Resume (PDF)</label>
            <div className="mt-2">
              <label className={`${inputClass} cursor-pointer flex items-center gap-3 hover:border-amber-500 transition-colors`}>
                <Upload size={18} className="text-amber-500 flex-shrink-0" />
                <span className="truncate text-gray-500 dark:text-gray-400">
                  {generalFile ? generalFile.name : 'Choose PDF file...'}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'general')}
                  className="hidden"
                />
              </label>
              {generalPreview && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
                    <FileText size={16} className="text-amber-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {generalFile ? generalFile.name : 'general-resume.pdf (current)'}
                    </span>
                  </div>
                  <a
                    href={generalPreview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-amber-500 hover:text-amber-600 transition-colors"
                    title="Preview"
                  >
                    <Eye size={18} />
                  </a>
                  {generalFile && (
                    <button
                      type="button"
                      onClick={() => clearFile('general')}
                      className="p-2 text-red-400 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Specialized Resume */}
          <div>
            <label className={labelClass}>Specialized Resume (PDF)</label>
            <div className="mt-2">
              <label className={`${inputClass} cursor-pointer flex items-center gap-3 hover:border-amber-500 transition-colors`}>
                <Upload size={18} className="text-amber-500 flex-shrink-0" />
                <span className="truncate text-gray-500 dark:text-gray-400">
                  {specializedFile ? specializedFile.name : 'Choose PDF file...'}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'specialized')}
                  className="hidden"
                />
              </label>
              {specializedPreview && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
                    <FileText size={16} className="text-amber-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {specializedFile ? specializedFile.name : 'specialized-resume.pdf (current)'}
                    </span>
                  </div>
                  <a
                    href={specializedPreview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-amber-500 hover:text-amber-600 transition-colors"
                    title="Preview"
                  >
                    <Eye size={18} />
                  </a>
                  {specializedFile && (
                    <button
                      type="button"
                      onClick={() => clearFile('specialized')}
                      className="p-2 text-red-400 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors"
          >
            Update Resume
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateResumePage;
