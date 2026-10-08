import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar, 
  MapPin, 
  X, 
  CheckCircle2,
  Building2
} from 'lucide-react';
import { experienceService } from '../../services/portfolioService';
import { usePortfolio } from '../../context/PortfolioContext';
import Modal from '../../components/common/Modal';

export default function ManageExperience() {
  const { notifyUpdated } = usePortfolio();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [bulletInput, setBulletInput] = useState('');

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    bulletPoints: [],
    order: 1
  });

  const loadExperience = async () => {
    setLoading(true);
    try {
      const data = await experienceService.getAll();
      setExperiences(data || []);
    } catch (err) {
      console.error('Error loading experience:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperience();
  }, []);

  const openCreateModal = () => {
    setEditingExp(null);
    setFormData({
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      bulletPoints: [],
      order: experiences.length + 1
    });
    setBulletInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExp(exp);
    setFormData({
      company: exp.company || '',
      role: exp.role || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      isCurrent: !!exp.isCurrent,
      bulletPoints: exp.bulletPoints ? [...exp.bulletPoints] : [],
      order: exp.order || 1
    });
    setBulletInput('');
    setIsModalOpen(true);
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
    if (!formData.company.trim() || !formData.role.trim()) return;

    try {
      if (editingExp) {
        const id = editingExp.id || editingExp._id;
        await experienceService.update(id, formData);
      } else {
        await experienceService.create(formData);
      }
      setIsModalOpen(false);
      notifyUpdated();
      loadExperience();
    } catch (err) {
      alert('Failed to save experience: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await experienceService.delete(id);
      setDeleteConfirmId(null);
      notifyUpdated();
      loadExperience();
    } catch (err) {
      alert('Failed to delete experience: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-100 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
              <Briefcase size={20} />
            </span>
            Work Experience
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage your professional roles, organizational affiliations, and key engineering impact statements.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold transition-all shadow-lg shadow-yellow-400/20 cursor-pointer self-start sm:self-auto hover:scale-105"
        >
          <Plus size={15} />
          <span>Add Position</span>
        </button>
      </div>

      {/* Experience Timeline Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-yellow-400 rounded-full animate-spin mb-3" />
          <p className="text-xs font-mono text-zinc-400">Loading experience...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="bg-[#121215] rounded-2xl border border-zinc-800 p-12 text-center">
          <Briefcase size={36} className="mx-auto text-yellow-400/50 mb-3" />
          <h3 className="font-display font-bold text-zinc-100 text-base">No Experience Entries</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 mb-5">
            Add your employment history, internships, or consultancy work.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-xs shadow-lg shadow-yellow-400/20"
          >
            Add Experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => {
            const id = exp.id || exp._id;
            return (
              <div
                key={id}
                className="bg-[#121215] rounded-2xl border border-zinc-800 border-l-4 border-l-yellow-400 p-6 shadow-xl shadow-black/40 hover:border-zinc-700 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-display text-base font-bold text-zinc-100">
                        {exp.role}
                      </h3>
                      <span className="text-zinc-600">·</span>
                      <span className="font-semibold text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-lg border border-yellow-400/20 text-xs flex items-center gap-1.5">
                        <Building2 size={13} className="text-yellow-400" />
                        {exp.company}
                      </span>
                      {exp.isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-yellow-400 text-black shadow-xs">
                          Current Role
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono mt-1">
                      <span className="flex items-center gap-1 text-zinc-300 font-medium">
                        <Calendar size={13} className="text-yellow-400" />
                        {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate || 'N/A'}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1 text-zinc-400">
                          <MapPin size={13} className="text-zinc-500" />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(exp)}
                      className="p-1.5 text-zinc-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors cursor-pointer"
                      title="Edit Experience"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Experience"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Bullet Points */}
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <div className="pt-2 border-t border-zinc-800/80">
                    <ul className="space-y-2 text-xs text-zinc-400 list-disc list-outside pl-4 leading-relaxed">
                      {exp.bulletPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Experience Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExp ? 'Edit Experience' : 'Add Experience Entry'}
        subtitle="Manage your position, company, timeline, and resume achievements."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Company / Organization *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Paawani Group"
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Job Title / Role *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Full Stack Software Engineer"
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Noida / Hybrid"
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Start Date
              </label>
              <input
                type="text"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                placeholder="e.g. Jan 2024"
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                End Date
              </label>
              <input
                type="text"
                disabled={formData.isCurrent}
                value={formData.isCurrent ? 'Present' : formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                placeholder="e.g. Dec 2024"
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none disabled:bg-zinc-900 disabled:text-zinc-600"
              />
            </div>
          </div>

          {/* Current Role Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isCurrentCheckbox"
              checked={formData.isCurrent}
              onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked, endDate: e.target.checked ? '' : formData.endDate })}
              className="w-4 h-4 rounded border-zinc-700 text-yellow-400 focus:ring-yellow-400 accent-yellow-400 cursor-pointer"
            />
            <label htmlFor="isCurrentCheckbox" className="text-xs text-zinc-300 font-medium cursor-pointer">
              I am currently working in this role
            </label>
          </div>

          {/* Bullet Points */}
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              Key Responsibilities & Impact Points ({formData.bulletPoints.length})
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={bulletInput}
                onChange={(e) => setBulletInput(e.target.value)}
                onKeyDown={handleAddBullet}
                placeholder="Add bullet point describing impact (e.g. Reduced latency by 35%)..."
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
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
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
              {editingExp ? 'Save Changes' : 'Add Experience'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          title="Delete Experience Entry?"
          subtitle="This action cannot be undone."
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs text-zinc-400">
              Are you sure you want to remove this experience record from your portfolio?
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
