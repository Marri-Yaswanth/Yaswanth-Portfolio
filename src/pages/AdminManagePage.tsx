import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Pencil, FolderOpen, Award, Wrench, AlertTriangle, X, Check, Plus, Zap } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import SectionHeading from '../components/SectionHeading';
import { Project, Certification, Skill, ProjectStatus } from '../types';

type Tab = 'projects' | 'certifications' | 'skills';

const SKILL_CATEGORIES: { id: string; label: string }[] = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'languages', label: 'Languages' },
  { id: 'tools', label: 'Tools' },
  { id: 'other', label: 'Other (custom)' },
];

const AdminManagePage: React.FC = () => {
  const {
    projects, certifications, skills,
    deleteProject, deleteCertification, deleteSkill,
    updateProject, updateCertification, updateSkill,
    addSkills,
  } = usePortfolio();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [confirmDelete, setConfirmDelete] = useState<{ type: Tab; id: string; name: string } | null>(null);

  // Edit states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // New skill detection state (when editing project adds new techs)
  const [pendingProjectUpdate, setPendingProjectUpdate] = useState<Project | null>(null);
  const [newSkillEntries, setNewSkillEntries] = useState<
    { name: string; proficiency: number; category: string; skip: boolean; customCategory: string }[]
  >([]);
  const [showSkillModal, setShowSkillModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Admin | Yaswanth Portfolio';
  }, []);

  const handleDelete = () => {
    if (!confirmDelete) return;
    const { type, id, name } = confirmDelete;

    switch (type) {
      case 'projects':
        deleteProject(id);
        showToast(`Project "${name}" deleted`, 'success');
        break;
      case 'certifications':
        deleteCertification(id);
        showToast(`Certification "${name}" deleted`, 'success');
        break;
      case 'skills':
        deleteSkill(id);
        showToast(`Skill "${name}" deleted`, 'success');
        break;
    }
    setConfirmDelete(null);
  };

  // --- Edit handlers ---
  const handleSaveProject = () => {
    if (!editingProject) return;

    const cleanTechs = editingProject.technologies.filter((t: string) => t.trim() !== '');
    const updatedProject = { ...editingProject, technologies: cleanTechs };

    // Detect new technologies not in skills
    const existingNames = skills.map((s) => s.name.toLowerCase());
    const newTechs = cleanTechs.filter(
      (t: string) => !existingNames.includes(t.toLowerCase())
    );

    if (newTechs.length > 0) {
      // Show skill proficiency modal
      setPendingProjectUpdate(updatedProject);
      setNewSkillEntries(
        newTechs.map((name: string) => ({
          name,
          proficiency: 50,
          category: 'other' as string,
          skip: false,
          customCategory: '',
        }))
      );
      setEditingProject(null);
      setShowSkillModal(true);
    } else {
      updateProject(updatedProject.id, {
        title: updatedProject.title,
        description: updatedProject.description,
        technologies: updatedProject.technologies,
        github: updatedProject.github,
        link: updatedProject.link,
        status: updatedProject.status,
        credentials: updatedProject.credentials,
      });
      showToast(`Project "${updatedProject.title}" updated`, 'success');
      setEditingProject(null);
    }
  };

  const handleSkillModalSubmit = () => {
    if (!pendingProjectUpdate) return;
    // Save the project update
    updateProject(pendingProjectUpdate.id, {
      title: pendingProjectUpdate.title,
      description: pendingProjectUpdate.description,
      technologies: pendingProjectUpdate.technologies,
      github: pendingProjectUpdate.github,
      link: pendingProjectUpdate.link,
      status: pendingProjectUpdate.status,
      credentials: pendingProjectUpdate.credentials,
    });
    // Batch-add non-skipped skills
    const skillsToAdd: Skill[] = newSkillEntries
      .filter((entry) => !entry.skip)
      .map((entry) => ({
        name: entry.name,
        proficiency: entry.proficiency,
        category: entry.category === 'other' && entry.customCategory.trim()
          ? entry.customCategory.trim().toLowerCase()
          : entry.category,
      }));
    if (skillsToAdd.length > 0) {
      addSkills(skillsToAdd);
    }
    const skipped = newSkillEntries.filter((e) => e.skip).length;
    const added = skillsToAdd.length;
    const msgs: string[] = [`Project updated`];
    if (added > 0) msgs.push(`${added} skill(s) added`);
    if (skipped > 0) msgs.push(`${skipped} skipped`);
    showToast(msgs.join(', '), 'success');
    setShowSkillModal(false);
    setPendingProjectUpdate(null);
  };

  const handleSkillModalSkipAll = () => {
    if (pendingProjectUpdate) {
      updateProject(pendingProjectUpdate.id, {
        title: pendingProjectUpdate.title,
        description: pendingProjectUpdate.description,
        technologies: pendingProjectUpdate.technologies,
        github: pendingProjectUpdate.github,
        link: pendingProjectUpdate.link,
        status: pendingProjectUpdate.status,
        credentials: pendingProjectUpdate.credentials,
      });
      showToast(`Project updated (new skills skipped)`, 'success');
    }
    setShowSkillModal(false);
    setPendingProjectUpdate(null);
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

  const handleSaveCert = () => {
    if (!editingCert) return;
    updateCertification(editingCert.id, {
      name: editingCert.name,
      issuer: editingCert.issuer,
      date: editingCert.date,
      credentialLink: editingCert.credentialLink,
    });
    showToast(`Certification "${editingCert.name}" updated`, 'success');
    setEditingCert(null);
  };

  const handleSaveSkill = () => {
    if (!editingSkill) return;
    updateSkill(editingSkill.name, {
      proficiency: editingSkill.proficiency,
      category: editingSkill.category,
    });
    showToast(`Skill "${editingSkill.name}" updated`, 'success');
    setEditingSkill(null);
  };

  // Project edit helpers
  const updateEditProjectTech = (index: number, value: string) => {
    if (!editingProject) return;
    const techs = [...editingProject.technologies];
    techs[index] = value;
    setEditingProject({ ...editingProject, technologies: techs });
  };
  const addEditProjectTech = () => {
    if (!editingProject) return;
    setEditingProject({ ...editingProject, technologies: [...editingProject.technologies, ''] });
  };
  const removeEditProjectTech = (index: number) => {
    if (!editingProject) return;
    const techs = editingProject.technologies.filter((_: string, i: number) => i !== index);
    setEditingProject({ ...editingProject, technologies: techs.length ? techs : [''] });
  };

  const inputClass =
    'w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 dark:text-gray-200 text-sm';
  const labelClass = 'block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1';

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'projects', label: 'Projects', icon: <FolderOpen size={16} />, count: projects.length },
    { id: 'certifications', label: 'Certifications', icon: <Award size={16} />, count: certifications.length },
    { id: 'skills', label: 'Skills', icon: <Wrench size={16} />, count: skills.length },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <SectionHeading title="Admin Panel" subtitle="Manage your portfolio content" />

        {/* Quick-add links */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            to="/projects/add"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
          >
            <Plus size={15} /> Project
          </Link>
          <Link
            to="/certifications/add"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
          >
            <Plus size={15} /> Certification
          </Link>
          <Link
            to="/skills/add"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
          >
            <Plus size={15} /> Skill
          </Link>
          <Link
            to="/resume/update"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
          >
            <Plus size={15} /> Resume
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Projects List */}
        {activeTab === 'projects' && (
          <div className="space-y-3">
            {projects.length === 0 && (
              <p className="text-center text-gray-400 dark:text-gray-500 py-8">No projects yet</p>
            )}
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {project.image && (
                    <img src={project.image} alt={project.title} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">{project.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{project.technologies.slice(0, 3).join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setEditingProject({ ...project })}
                    className="p-2 text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                    title="Edit project"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ type: 'projects', id: project.id, name: project.title })}
                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications List */}
        {activeTab === 'certifications' && (
          <div className="space-y-3">
            {certifications.length === 0 && (
              <p className="text-center text-gray-400 dark:text-gray-500 py-8">No certifications yet</p>
            )}
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Award size={18} className="text-amber-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">{cert.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{cert.issuer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setEditingCert({ ...cert })}
                    className="p-2 text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                    title="Edit certification"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ type: 'certifications', id: cert.id, name: cert.name })}
                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Delete certification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills List */}
        {activeTab === 'skills' && (
          <div className="space-y-3">
            {skills.length === 0 && (
              <p className="text-center text-gray-400 dark:text-gray-500 py-8">No skills yet</p>
            )}
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-amber-500">{skill.proficiency}%</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">{skill.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{skill.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setEditingSkill({ ...skill })}
                    className="p-2 text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                    title="Edit skill"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ type: 'skills', id: skill.name, name: skill.name })}
                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Delete skill"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========== EDIT PROJECT MODAL ========== */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Edit Project</h3>
              <button onClick={() => setEditingProject(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Title</label>
                <input
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={editingProject.status}
                  onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as ProjectStatus })}
                  className={inputClass}
                >
                  <option value="live">Live</option>
                  <option value="in-progress">In Progress</option>
                  <option value="ideation">Ideation</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Technologies</label>
                <div className="space-y-2">
                  {editingProject.technologies.map((tech: string, i: number) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={tech}
                        onChange={(e) => updateEditProjectTech(i, e.target.value)}
                        className={inputClass}
                      />
                      <button type="button" onClick={() => removeEditProjectTech(i)} className="p-2 text-red-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addEditProjectTech} className="mt-2 flex items-center gap-1 text-xs text-amber-500 hover:text-amber-600">
                  <Plus size={12} /> Add Tech
                </button>
              </div>
              <div>
                <label className={labelClass}>GitHub URL</label>
                <input
                  value={editingProject.github || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, github: e.target.value || undefined })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Live URL</label>
                <input
                  value={editingProject.link || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value || undefined })}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingProject(null)} className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                Cancel
              </button>
              <button onClick={handleSaveProject} className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <Check size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== EDIT CERTIFICATION MODAL ========== */}
      {editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Edit Certification</h3>
              <button onClick={() => setEditingCert(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  value={editingCert.name}
                  onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Issuer</label>
                <input
                  value={editingCert.issuer}
                  onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <input
                  type="date"
                  value={editingCert.date}
                  onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Credential Link</label>
                <input
                  value={editingCert.credentialLink || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, credentialLink: e.target.value || undefined })}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingCert(null)} className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                Cancel
              </button>
              <button onClick={handleSaveCert} className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <Check size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== EDIT SKILL MODAL ========== */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Edit Skill</h3>
              <button onClick={() => setEditingSkill(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Skill Name</label>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{editingSkill.name}</p>
              </div>
              <div>
                <label className={labelClass}>Proficiency (0-100)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={editingSkill.proficiency}
                    onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: Number(e.target.value) })}
                    className="flex-1 accent-amber-500"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editingSkill.proficiency}
                    onChange={(e) =>
                      setEditingSkill({
                        ...editingSkill,
                        proficiency: Math.max(0, Math.min(100, Number(e.target.value))),
                      })
                    }
                    className="w-16 px-2 py-1 text-center text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={['frontend','backend','languages','tools'].includes(editingSkill.category) ? editingSkill.category : 'other'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'other') {
                      setEditingSkill({ ...editingSkill, category: 'other' });
                    } else {
                      setEditingSkill({ ...editingSkill, category: val });
                    }
                  }}
                  className={inputClass}
                >
                  {SKILL_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
                {!['frontend','backend','languages','tools'].includes(editingSkill.category) && (
                  <div className="mt-3">
                    <label className={labelClass}>Custom Category Name</label>
                    <input
                      value={editingSkill.category === 'other' ? '' : editingSkill.category}
                      onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value.trim() ? e.target.value.toLowerCase() : 'other' })}
                      placeholder="e.g. SQL, Database, Cloud"
                      className={inputClass}
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Appears as a new tab on the Skills page</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingSkill(null)} className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                Cancel
              </button>
              <button onClick={handleSaveSkill} className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <Check size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== NEW SKILLS PROFICIENCY MODAL ========== */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-500/20">
                <Zap size={22} className="text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">New Skills Detected</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Set proficiency &amp; category for each, or skip individually</p>
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
                            updateNewSkillEntry(i, 'proficiency', Math.max(0, Math.min(100, Number(e.target.value))))
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
                onClick={handleSkillModalSkipAll}
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

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle size={20} />
                <h3 className="text-lg font-semibold">Confirm Delete</h3>
              </div>
              <button onClick={() => setConfirmDelete(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete <strong className="text-gray-800 dark:text-white">"{confirmDelete.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagePage;
