import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, CheckCircle, Upload, X, Zap } from 'lucide-react';
import { ProjectStatus, Skill } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import SectionHeading from '../components/SectionHeading';

const SKILL_CATEGORIES: { id: string; label: string }[] = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'languages', label: 'Languages' },
  { id: 'tools', label: 'Tools' },
  { id: 'other', label: 'Other (custom)' },
];

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AddProjectPage: React.FC = () => {
  const { addProject, addSkills, skills } = usePortfolio();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  // New-skill detection state
  const [pendingProject, setPendingProject] = useState<any>(null);
  const [newSkillEntries, setNewSkillEntries] = useState<
    { name: string; proficiency: number; category: string; skip: boolean; customCategory: string }[]
  >([]);
  const [showSkillModal, setShowSkillModal] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert image to base64 for persistence
    let imageData = '/projects/placeholder.png';
    if (imageFile) {
      try {
        imageData = await fileToBase64(imageFile);
      } catch {
        imageData = imagePreview || '/projects/placeholder.png';
      }
    }

    const newProject = {
      id: `project-${Date.now()}`,
      title: form.title,
      description: form.description,
      technologies: form.technologies.filter((t) => t.trim() !== ''),
      image: imageData,
      github: form.github || undefined,
      link: form.link || undefined,
      status: form.status,
      credentials: form.credentials.filter((c) => c.label.trim() && c.value.trim()),
    };

    // Detect technologies not already in skills
    const existingNames = skills.map((s) => s.name.toLowerCase());
    const newTechs = newProject.technologies.filter(
      (t) => !existingNames.includes(t.toLowerCase())
    );

    if (newTechs.length > 0) {
      // Show modal to ask proficiency for each new skill
      setPendingProject(newProject);
      setNewSkillEntries(
        newTechs.map((name) => ({ name, proficiency: 50, category: 'other' as string, skip: false, customCategory: '' }))
      );
      setShowSkillModal(true);
    } else {
      // No new skills — just add the project
      addProject(newProject);
      showToast('Project added successfully!');
      setSubmitted(true);
      setTimeout(() => navigate('/projects'), 1500);
    }
  };

  const handleSkillModalSubmit = () => {
    if (!pendingProject) return;
    addProject(pendingProject);
    const skillsToAdd: Skill[] = newSkillEntries
      .filter((e) => !e.skip)
      .map((entry) => ({
        name: entry.name,
        proficiency: entry.proficiency,
        category: entry.category === 'other' && entry.customCategory.trim()
          ? entry.customCategory.trim().toLowerCase()
          : entry.category,
      }));
    if (skillsToAdd.length > 0) {
      addSkills(skillsToAdd);
      showToast(`Project added with ${skillsToAdd.length} new skill(s)!`);
    } else {
      showToast('Project added (all new skills skipped).');
    }
    setShowSkillModal(false);
    setPendingProject(null);
    setSubmitted(true);
    setTimeout(() => navigate('/projects'), 1500);
  };

  const handleSkillModalCancel = () => {
    // Add project without adding new skills
    if (pendingProject) {
      addProject(pendingProject);
      showToast('Project added (new skills skipped).');
    }
    setShowSkillModal(false);
    setPendingProject(null);
    setSubmitted(true);
    setTimeout(() => navigate('/projects'), 1500);
  };

  const updateNewSkillEntry = (
    index: number,
    field: 'proficiency' | 'category' | 'skip' | 'customCategory',
    value: number | string | boolean
  ) => {
    setNewSkillEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry))
    );
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

      {/* New Skills Proficiency Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-500/20">
                <Zap size={22} className="text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">New Skills Detected</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Set proficiency &amp; category for each new technology</p>
              </div>
            </div>

            <div className="space-y-5">
              {newSkillEntries.map((entry, i) => (
                <div
                  key={entry.name}
                  className={`p-4 rounded-xl border ${
                    entry.skip
                      ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-gray-800 dark:text-white">{entry.name}</p>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Skip</span>
                      <input
                        type="checkbox"
                        checked={entry.skip}
                        onChange={(e) => updateNewSkillEntry(i, 'skip', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                    </label>
                  </div>

                  {!entry.skip && (
                    <>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Proficiency (0–100)
                      </label>
                      <div className="flex items-center gap-3 mb-3">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={entry.proficiency}
                          onChange={(e) => updateNewSkillEntry(i, 'proficiency', Number(e.target.value))}
                          className="flex-1 accent-amber-500"
                        />
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={entry.proficiency}
                          onChange={(e) =>
                            updateNewSkillEntry(
                              i,
                              'proficiency',
                              Math.max(0, Math.min(100, Number(e.target.value)))
                            )
                          }
                          className="w-16 px-2 py-1 text-center text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <select
                        value={entry.category}
                        onChange={(e) => updateNewSkillEntry(i, 'category', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {SKILL_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>

                      {entry.category === 'other' && (
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                            Custom category name (e.g. SQL, Database, Cloud)
                          </label>
                          <input
                            value={entry.customCategory}
                            onChange={(e) => updateNewSkillEntry(i, 'customCategory', e.target.value)}
                            placeholder="e.g. SQL"
                            className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <p className="text-[10px] text-gray-400 mt-1">Appears as a new tab on the Skills page</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSkillModalCancel}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Skip All
              </button>
              <button
                onClick={handleSkillModalSubmit}
                className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors text-sm font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProjectPage;
