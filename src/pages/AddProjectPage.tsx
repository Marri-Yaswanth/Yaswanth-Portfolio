import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, CheckCircle, Upload, X } from 'lucide-react';
import { ProjectStatus } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import SectionHeading from '../components/SectionHeading';

const AddProjectPage: React.FC = () => {
  const { addProject } = usePortfolio();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Add Project | Yaswanth Portfolio';
  }, []);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    technologies: [''],
    github: '',
    link: '',
    status: 'in-progress' as ProjectStatus,
    credentials: [{ label: '', value: '' }],
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Technologies
  const handleTechChange = (index: number, value: string) => {
    const techs = [...form.technologies];
    techs[index] = value;
    setForm({ ...form, technologies: techs });
  };
  const addTech = () => setForm({ ...form, technologies: [...form.technologies, ''] });
  const removeTech = (index: number) => {
    const techs = form.technologies.filter((_, i) => i !== index);
    setForm({ ...form, technologies: techs.length ? techs : [''] });
  };

  // Credentials
  const handleCredChange = (index: number, field: 'label' | 'value', val: string) => {
    const creds = [...form.credentials];
    creds[index] = { ...creds[index], [field]: val };
    setForm({ ...form, credentials: creds });
  };
  const addCred = () => setForm({ ...form, credentials: [...form.credentials, { label: '', value: '' }] });
  const removeCred = (index: number) => {
    const creds = form.credentials.filter((_, i) => i !== index);
    setForm({ ...form, credentials: creds.length ? creds : [{ label: '', value: '' }] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProject = {
      id: `project-${Date.now()}`,
      title: form.title,
      description: form.description,
      technologies: form.technologies.filter((t) => t.trim() !== ''),
      image: imagePreview || '/projects/placeholder.png',
      github: form.github || undefined,
      link: form.link || undefined,
      status: form.status,
      credentials: form.credentials.filter((c) => c.label.trim() && c.value.trim()),
    };

    addProject(newProject);
    showToast('Project added successfully!');
    setSubmitted(true);
    setTimeout(() => navigate('/projects'), 1500);
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 dark:text-gray-200 text-sm';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <CheckCircle size={56} className="text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Project Added!</h2>
        <p className="text-gray-500 dark:text-gray-400">Redirecting to projects...</p>
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

        <SectionHeading title="Add New Project" subtitle="Fill in the details to add a project to your portfolio" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className={labelClass}>Project Title *</label>
            <input id="title" name="title" value={form.title} onChange={handleChange} required className={inputClass} placeholder="My Awesome Project" />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>Description *</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} required rows={4} className={`${inputClass} resize-none`} placeholder="Describe what the project does..." />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className={labelClass}>Status *</label>
            <select id="status" name="status" value={form.status} onChange={handleChange} className={inputClass}>
              <option value="live">Live</option>
              <option value="in-progress">In Progress</option>
              <option value="ideation">Ideation</option>
            </select>
          </div>

          {/* Technologies */}
          <div>
            <label className={labelClass}>Technologies *</label>
            <div className="space-y-2">
              {form.technologies.map((tech, i) => (
                <div key={i} className="flex gap-2">
                  <input value={tech} onChange={(e) => handleTechChange(i, e.target.value)} className={inputClass} placeholder="e.g. React" />
                  <button type="button" onClick={() => removeTech(i)} className="p-2 text-red-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addTech} className="mt-2 flex items-center gap-1 text-sm text-amber-500 hover:text-amber-600 transition-colors">
              <Plus size={14} /> Add Technology
            </button>
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelClass}>Project Image</label>
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

          {/* GitHub */}
          <div>
            <label htmlFor="github" className={labelClass}>GitHub URL</label>
            <input id="github" name="github" value={form.github} onChange={handleChange} className={inputClass} placeholder="https://github.com/username/repo" />
          </div>

          {/* Live Link */}
          <div>
            <label htmlFor="link" className={labelClass}>Live Demo URL</label>
            <input id="link" name="link" value={form.link} onChange={handleChange} className={inputClass} placeholder="https://my-project.vercel.app" />
          </div>

          {/* Credentials */}
          <div>
            <label className={labelClass}>Demo Credentials</label>
            <div className="space-y-3">
              {form.credentials.map((cred, i) => (
                <div key={i} className="flex gap-2">
                  <input value={cred.label} onChange={(e) => handleCredChange(i, 'label', e.target.value)} className={inputClass} placeholder="Label (e.g. Username)" />
                  <input value={cred.value} onChange={(e) => handleCredChange(i, 'value', e.target.value)} className={inputClass} placeholder="Value (e.g. demo@mail.com)" />
                  <button type="button" onClick={() => removeCred(i)} className="p-2 text-red-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addCred} className="mt-2 flex items-center gap-1 text-sm text-amber-500 hover:text-amber-600 transition-colors">
              <Plus size={14} /> Add Credential
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors"
          >
            Add Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProjectPage;
