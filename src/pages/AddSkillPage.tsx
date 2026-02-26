import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import SectionHeading from '../components/SectionHeading';
import { Skill } from '../types';

const categoryOptions: { value: Skill['category']; label: string }[] = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'languages', label: 'Languages' },
  { value: 'tools', label: 'Tools' },
  { value: 'other', label: 'Other' },
];

const AddSkillPage: React.FC = () => {
  const { addSkill } = usePortfolio();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Add Skill | Yaswanth Portfolio';
  }, []);

  const [form, setForm] = useState({
    name: '',
    proficiency: 50,
    category: 'frontend' as Skill['category'],
    icon: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'proficiency' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      showToast('Please enter a skill name', 'error');
      return;
    }

    const newSkill: Skill = {
      name: form.name.trim(),
      proficiency: form.proficiency,
      category: form.category,
      ...(form.icon.trim() ? { icon: form.icon.trim() } : {}),
    };

    addSkill(newSkill);
    showToast('Skill added successfully!', 'success');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <CheckCircle size={64} className="mx-auto text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Skill Added!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Your new skill has been added to the portfolio.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', proficiency: 50, category: 'frontend', icon: '' }); }}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Add Another
            </button>
            <button
              onClick={() => navigate('/skills')}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              View Skills
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-amber-500 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>

        <SectionHeading title="Add Skill" subtitle="Add a new skill to your portfolio" />

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {/* Skill Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Skill Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. React, Python, Docker"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Proficiency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Proficiency: <span className="text-amber-500 font-bold">{form.proficiency}%</span>
            </label>
            <input
              type="range"
              name="proficiency"
              min={0}
              max={100}
              step={5}
              value={form.proficiency}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Icon (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Lucide Icon Name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              name="icon"
              value={form.icon}
              onChange={handleChange}
              placeholder="e.g. Code, Database, Globe"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
            />
            <p className="text-xs text-gray-400 mt-1">
              Browse icons at{' '}
              <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="text-amber-500 underline">
                lucide.dev/icons
              </a>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors shadow-lg hover:shadow-xl"
          >
            Add Skill
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSkillPage;
