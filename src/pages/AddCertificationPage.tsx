import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Upload, X, FileText, Eye } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import SectionHeading from '../components/SectionHeading';

const AddCertificationPage: React.FC = () => {
  const { addCertification } = usePortfolio();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Add Certification | Yaswanth Portfolio';
  }, []);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [credFile, setCredFile] = useState<File | null>(null);
  const [credPreview, setCredPreview] = useState<string>('');

  const [form, setForm] = useState({
    name: '',
    issuer: '',
    date: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleCredUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCredFile(file);
    setCredPreview(URL.createObjectURL(file));
  };

  const clearCred = () => {
    setCredFile(null);
    setCredPreview('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCert = {
      id: `cert-${Date.now()}`,
      name: form.name,
      issuer: form.issuer,
      date: form.date,
      credentialLink: credPreview || undefined,
      image: imagePreview || undefined,
    };

    addCertification(newCert);
    showToast('Certification added successfully!');
    setSubmitted(true);
    setTimeout(() => navigate('/certifications'), 1500);
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 dark:text-gray-200 text-sm';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <CheckCircle size={56} className="text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Certification Added!</h2>
        <p className="text-gray-500 dark:text-gray-400">Redirecting to certifications...</p>
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

        <SectionHeading title="Add New Certification" subtitle="Fill in the details to add a certification to your portfolio" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className={labelClass}>Certificate Name *</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="AWS Solutions Architect" />
          </div>

          {/* Issuer */}
          <div>
            <label htmlFor="issuer" className={labelClass}>Issuing Organization *</label>
            <input id="issuer" name="issuer" value={form.issuer} onChange={handleChange} required className={inputClass} placeholder="Amazon Web Services" />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className={labelClass}>Date Issued *</label>
            <input id="date" name="date" type="date" value={form.date} onChange={handleChange} required className={inputClass} />
          </div>

          {/* Credential PDF Upload */}
          <div>
            <label className={labelClass}>Credential PDF</label>
            <label className={`${inputClass} cursor-pointer flex items-center gap-3 hover:border-amber-500 transition-colors`}>
              <Upload size={18} className="text-amber-500 flex-shrink-0" />
              <span className="truncate text-gray-500 dark:text-gray-400">
                {credFile ? credFile.name : 'Choose PDF file...'}
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleCredUpload}
                className="hidden"
              />
            </label>
            {credPreview && (
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
                  <FileText size={16} className="text-amber-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300 truncate">{credFile?.name}</span>
                </div>
                <a
                  href={credPreview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-amber-500 hover:text-amber-600 transition-colors"
                  title="Preview"
                >
                  <Eye size={18} />
                </a>
                <button
                  type="button"
                  onClick={clearCred}
                  className="p-2 text-red-400 hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Certificate Image Upload */}
          <div>
            <label className={labelClass}>Certificate Image</label>
            <label className={`${inputClass} cursor-pointer flex items-center gap-3 hover:border-amber-500 transition-colors`}>
              <Upload size={18} className="text-amber-500 flex-shrink-0" />
              <span className="truncate text-gray-500 dark:text-gray-400">
                {imageFile ? imageFile.name : 'Choose image file...'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <div className="mt-3 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-auto rounded-lg border border-gray-200 dark:border-gray-700 object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors"
          >
            Add Certification
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCertificationPage;
