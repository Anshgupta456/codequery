import { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink,
  Star, 
  Check, 
  X, 
  AlertCircle,
  Image as ImageIcon,
  Upload,
  Loader2,
  Tag,
  Filter
} from 'lucide-react';
import { projectService, projectCategoryService, uploadService } from '../../services/portfolioService';
import { usePortfolio } from '../../context/PortfolioContext';
import Modal from '../../components/common/Modal';

const GithubIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ManageProjects() {
  const { notifyUpdated } = usePortfolio();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [isModalAddingCategory, setIsModalAddingCategory] = useState(false);
  const [modalCustomCategory, setModalCustomCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [bulletInput, setBulletInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Full Stack',
    description: '',
    bulletPoints: [],
    techStack: [],
    liveLink: '',
    githubLink: '',
    imageUrl: '',
    featured: false,
    order: 1
  });

  const loadCategories = async () => {
    try {
      const data = await projectCategoryService.getAll();
      setCategories(data || []);
      return data || [];
    } catch (err) {
      console.error('Error loading categories:', err);
      return [];
    }
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAll();
      setProjects(data || []);
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    loadCategories();
  }, []);

  const handleCreateCategory = async (catName) => {
    const name = (catName || newCatName).trim();
    if (!name) return;
    try {
      await projectCategoryService.create(name);
      setNewCatName('');
      setIsAddingCat(false);
      const updated = await loadCategories();
      notifyUpdated();
      return updated;
    } catch (err) {
      alert('Failed to add category: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (categories.length <= 1) {
      alert('You must keep at least one category.');
      return;
    }
    const catId = cat.id || cat._id || cat.name;
    const catName = cat.name;
    if (window.confirm(`Delete filter category "${catName}"?`)) {
      try {
        await projectCategoryService.delete(catId);
        const remaining = categories.filter((c) => (c.id || c._id || c.name) !== catId && c.name !== catName);
        const fallbackCat = remaining[0]?.name || 'Full Stack';

        // Reassign any projects that were using this category
        const affectedProjects = (projects || []).filter((p) => p.category === catName);
        for (const p of affectedProjects) {
          try {
            await projectService.update(p.id || p._id, { ...p, category: fallbackCat });
          } catch (e) {
            console.warn('Could not reassign category for project:', p.title, e);
          }
        }

        await loadCategories();
        await loadProjects();
        notifyUpdated();
      } catch (err) {
        alert('Failed to delete category: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadService.uploadFile(file);
      if (res && res.url) {
        setFormData((prev) => ({ ...prev, imageUrl: res.url }));
      }
    } catch (err) {
      alert('Image upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingImage(false);
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: categories[0]?.name || 'Full Stack',
      description: '',
      bulletPoints: [],
      techStack: [],
      liveLink: '',
      githubLink: '',
      imageUrl: '',
      featured: false,
      order: projects.length + 1
    });
    setIsModalAddingCategory(false);
    setModalCustomCategory('');
    setTagInput('');
    setBulletInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title || '',
      category: proj.category || categories[0]?.name || 'Full Stack',
      description: proj.description || '',
      bulletPoints: proj.bulletPoints ? [...proj.bulletPoints] : [],
      techStack: proj.techStack ? [...proj.techStack] : [],
      liveLink: proj.liveLink || '',
      githubLink: proj.githubLink || '',
      imageUrl: proj.imageUrl || '',
      featured: !!proj.featured,
      order: proj.order || 1
    });
    setIsModalAddingCategory(false);
    setModalCustomCategory('');
    setTagInput('');
    setBulletInput('');
    setIsModalOpen(true);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (tagInput.trim() && !formData.techStack.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          techStack: [...prev.techStack, tagInput.trim()]
        }));
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== tagToRemove)
    }));
  };

  const handleAddBullet = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (bulletInput.trim()) {
        setFormData((prev) => ({
          ...prev,
          bulletPoints: [...prev.bulletPoints, bulletInput.trim()]
        }));
        setBulletInput('');
      }
    }
  };

  const handleRemoveBullet = (index) => {
    setFormData((prev) => ({
      ...prev,
      bulletPoints: prev.bulletPoints.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      if (editingProject) {
        const id = editingProject.id || editingProject._id;
        await projectService.update(id, formData);
      } else {
        await projectService.create(formData);
      }
      setIsModalOpen(false);
      notifyUpdated();
      loadProjects();
    } catch (err) {
      alert('Failed to save project: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await projectService.delete(id);
      setDeleteConfirmId(null);
      notifyUpdated();
      loadProjects();
    } catch (err) {
      alert('Failed to delete project: ' + err.message);
    }
  };

  const handleToggleFeatured = async (proj) => {
    const id = proj.id || proj._id;
    await projectService.update(id, { featured: !proj.featured });
    notifyUpdated();
    loadProjects();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-100 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
              <FolderKanban size={20} />
            </span>
            Manage Projects
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Showcase your applications, engineering bullet points, tech stacks, and live deployments.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold transition-all shadow-lg shadow-yellow-400/20 cursor-pointer self-start sm:self-auto hover:scale-105"
        >
          <Plus size={15} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Category / Filter Manager Bar */}
      <div className="bg-[#121215] border border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-zinc-800/60">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1 rounded-md bg-yellow-400/10 text-yellow-400">
              <Filter size={15} />
            </span>
            <span className="font-display font-bold text-sm text-zinc-200">
              Dynamic Filter Categories
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-yellow-400 border border-zinc-700/50">
              {categories.length} active filters
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Categories added here automatically appear as filter tabs on the homepage & projects page.
          </p>
        </div>

        <div className="pt-3.5 flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const catId = cat.id || cat._id || cat.name;
            return (
              <span
                key={catId}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-mono group hover:border-yellow-400/60 transition-colors"
              >
                <span>{cat.name}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat)}
                  className="text-zinc-500 hover:text-rose-400 p-0.5 rounded transition-colors cursor-pointer"
                  title={`Delete category "${cat.name}"`}
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}

          {/* Inline Add Category Form */}
          {isAddingCat ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateCategory();
              }}
              className="inline-flex items-center gap-1.5"
            >
              <input
                type="text"
                autoFocus
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name (e.g. AI & ML, Mobile)..."
                className="px-3 py-1.5 bg-[#09090b] border border-yellow-400 text-zinc-100 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
              <button
                type="submit"
                disabled={!newCatName.trim()}
                className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Add Filter
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCat(false);
                  setNewCatName('');
                }}
                className="p-1 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X size={14} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingCat(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-zinc-700 hover:border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Category</span>
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid / Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-yellow-400 rounded-full animate-spin mb-3" />
          <p className="text-xs font-mono text-zinc-400">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#121215] rounded-2xl border border-zinc-800 p-12 text-center">
          <FolderKanban size={36} className="mx-auto text-yellow-400/50 mb-3" />
          <h3 className="font-display font-bold text-zinc-100 text-base">No Projects Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 mb-5">
            You have not added any projects yet. Click the button below to add your first one.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-xs shadow-lg shadow-yellow-400/20"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj) => {
            const id = proj.id || proj._id;
            return (
              <div
                key={id}
                className="bg-[#121215] rounded-2xl border border-zinc-800 overflow-hidden flex flex-col justify-between hover:border-yellow-400/50 hover:shadow-xl hover:shadow-black/50 transition-all group/card shadow-lg shadow-black/30"
              >
                {/* Image preview banner - full color! */}
                {proj.imageUrl ? (
                  <div className="h-44 w-full bg-zinc-900 overflow-hidden relative group">
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {proj.category && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/80 backdrop-blur-md text-yellow-400 border border-yellow-400/40 shadow-md">
                          {proj.category}
                        </span>
                      )}
                      {proj.featured && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-yellow-400 text-black shadow-md shadow-yellow-400/30 flex items-center gap-1">
                          <Star size={11} fill="currentColor" /> Featured
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-24 w-full bg-zinc-900/60 flex items-center justify-between px-4 text-zinc-600">
                    <ImageIcon size={24} />
                    <div className="flex items-center gap-1.5">
                      {proj.category && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-zinc-800 text-yellow-400 border border-yellow-400/30">
                          {proj.category}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base font-bold text-zinc-100 leading-snug group-hover/card:text-yellow-400 transition-colors">
                        {proj.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(proj)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          proj.featured
                            ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30 shadow-xs'
                            : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-yellow-400'
                        }`}
                        title={proj.featured ? 'Remove from Featured' : 'Mark as Featured'}
                      >
                        <Star size={14} fill={proj.featured ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Bullet Points Preview */}
                    {proj.bulletPoints && proj.bulletPoints.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-[11px] text-zinc-400 list-disc list-inside">
                        {proj.bulletPoints.slice(0, 2).map((bp, idx) => (
                          <li key={idx} className="line-clamp-1">{bp}</li>
                        ))}
                        {proj.bulletPoints.length > 2 && (
                          <li className="text-[10px] font-mono text-yellow-400 list-none font-medium">
                            +{proj.bulletPoints.length - 2} more impact points...
                          </li>
                        )}
                      </ul>
                    )}

                    {/* Tech Stack Pills - Colorful accents on dark */}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {proj.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-0.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-zinc-300 text-[10px] font-mono font-semibold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Links Bar */}
                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {proj.liveLink && (
                        <a
                          href={proj.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-yellow-400 hover:text-yellow-300 font-mono text-[11px] font-semibold hover:underline"
                        >
                          <ExternalLink size={12} />
                          <span>Demo ↗</span>
                        </a>
                      )}
                      {proj.githubLink && (
                        <a
                          href={proj.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-200 font-mono text-[11px] font-medium hover:underline"
                        >
                          <GithubIcon size={12} />
                          <span>Code</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(proj)}
                        className="p-1.5 text-zinc-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
        subtitle="Manage the project details, bullet points, and deployment URLs."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Paawani Healthcare Portal"
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none"
              />
            </div>
          </div>

          {/* Project Category Filter Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono uppercase text-zinc-400">
                Filter Category *
              </label>
              {!isModalAddingCategory && (
                <button
                  type="button"
                  onClick={() => setIsModalAddingCategory(true)}
                  className="text-[11px] text-yellow-400 hover:underline font-mono cursor-pointer"
                >
                  + Add new category
                </button>
              )}
            </div>

            {isModalAddingCategory ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  value={modalCustomCategory}
                  onChange={(e) => setModalCustomCategory(e.target.value)}
                  placeholder="Type new category (e.g. Mobile Apps)..."
                  className="flex-1 px-3 py-2 bg-[#09090b] border border-yellow-400 text-zinc-100 rounded-xl text-xs font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={async () => {
                    const trimmed = modalCustomCategory.trim();
                    if (trimmed) {
                      await handleCreateCategory(trimmed);
                      setFormData((prev) => ({ ...prev, category: trimmed }));
                      setIsModalAddingCategory(false);
                      setModalCustomCategory('');
                    }
                  }}
                  className="px-3.5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Add & Select
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalAddingCategory(false);
                    setModalCustomCategory('');
                  }}
                  className="px-2 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <select
                value={formData.category}
                onChange={(e) => {
                  if (e.target.value === '__add_new__') {
                    setIsModalAddingCategory(true);
                  } else {
                    setFormData({ ...formData, category: e.target.value });
                  }
                }}
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id || c._id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
                <option value="__add_new__">+ Create new category...</option>
              </select>
            )}
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">
              Controls which filter tab displays this project on the homepage & projects archive.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              Short Description / Summary
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the problem solved and architecture..."
              className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
            />
          </div>

          {/* Bullet Points Manager */}
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              Impact Bullet Points ({formData.bulletPoints.length})
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={bulletInput}
                onChange={(e) => setBulletInput(e.target.value)}
                onKeyDown={handleAddBullet}
                placeholder="Add resume-ready bullet point (e.g. Optimized database queries by 45%)..."
                className="flex-1 px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-xs focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500 font-mono"
              />
              <button
                type="button"
                onClick={handleAddBullet}
                className="px-3.5 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-xl text-xs font-bold transition-colors"
              >
                Add
              </button>
            </div>

            {formData.bulletPoints.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {formData.bulletPoints.map((bp, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 p-2 bg-[#09090b] rounded-lg text-xs border border-zinc-800">
                    <span className="flex-1 text-zinc-300">{bp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(i)}
                      className="text-zinc-500 hover:text-rose-400 p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tech Stack Tags Manager */}
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              Tech Stack Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tech name and press Enter (e.g. React, MongoDB)..."
                className="flex-1 px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-xs focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500 font-mono"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3.5 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-xl text-xs font-bold transition-colors"
              >
                Add
              </button>
            </div>

            {formData.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {formData.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-lg text-xs font-mono"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tech)}
                      className="text-zinc-500 hover:text-rose-400"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Links & Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Live Demo Link
              </label>
              <input
                type="url"
                value={formData.liveLink}
                onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-xs focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                GitHub Repository Link
              </label>
              <input
                type="url"
                value={formData.githubLink}
                onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-xs focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              Thumbnail / Screenshot Image
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or upload below"
                  className="flex-1 px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-xs focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
                />
                {formData.imageUrl && (
                  <a
                    href={formData.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-yellow-400 flex items-center justify-center shrink-0"
                    title="Preview Image"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-zinc-700 hover:border-yellow-400 bg-[#09090b] hover:bg-zinc-900 text-zinc-300 text-xs font-mono cursor-pointer transition-colors w-full justify-center">
                {uploadingImage ? (
                  <Loader2 size={13} className="animate-spin text-yellow-400" />
                ) : (
                  <Upload size={13} className="text-yellow-400" />
                )}
                <span>{uploadingImage ? 'Uploading Screenshot...' : 'Upload Image to Cloudinary'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadImage}
                  disabled={uploadingImage}
                />
              </label>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featuredCheckbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded border-zinc-700 text-yellow-400 focus:ring-yellow-400 accent-yellow-400 cursor-pointer"
            />
            <label htmlFor="featuredCheckbox" className="text-xs text-zinc-300 font-medium cursor-pointer">
              Mark as Featured Project (prominently displayed on homepage)
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-xs shadow-lg shadow-yellow-400/20 cursor-pointer"
            >
              {editingProject ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          title="Delete Project?"
          subtitle="This action cannot be undone."
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs text-zinc-400">
              Are you sure you want to permanently delete this project record?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
