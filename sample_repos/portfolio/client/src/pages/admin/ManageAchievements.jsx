import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar, 
  ExternalLink,
  Award,
  Sparkles
} from 'lucide-react';
import { achievementService } from '../../services/portfolioService';
import { usePortfolio } from '../../context/PortfolioContext';
import Modal from '../../components/common/Modal';

export default function ManageAchievements() {
  const { notifyUpdated } = usePortfolio();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    link: '',
    order: 1
  });

  const loadAchievements = async () => {
    setLoading(true);
    try {
      const data = await achievementService.getAll();
      setAchievements(data || []);
    } catch (err) {
      console.error('Error loading achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      link: '',
      order: achievements.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      date: item.date || '',
      link: item.link || '',
      order: item.order || 1
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      if (editingItem) {
        const id = editingItem.id || editingItem._id;
        await achievementService.update(id, formData);
      } else {
        await achievementService.create(formData);
      }
      setIsModalOpen(false);
      notifyUpdated();
      loadAchievements();
    } catch (err) {
      alert('Failed to save achievement: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await achievementService.delete(id);
      setDeleteConfirmId(null);
      notifyUpdated();
      loadAchievements();
    } catch (err) {
      alert('Failed to delete achievement: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-100 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
              <Trophy size={20} />
            </span>
            Achievements & Honors
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Highlight hackathon wins, competitive programming milestones, and university merit recognitions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold transition-all shadow-lg shadow-yellow-400/20 cursor-pointer self-start sm:self-auto hover:scale-105"
        >
          <Plus size={15} />
          <span>Add Achievement</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-yellow-400 rounded-full animate-spin mb-3" />
          <p className="text-xs font-mono text-zinc-400">Loading achievements...</p>
        </div>
      ) : achievements.length === 0 ? (
        <div className="bg-[#121215] rounded-2xl border border-zinc-800 p-12 text-center">
          <Trophy size={36} className="mx-auto text-yellow-400/50 mb-3" />
          <h3 className="font-display font-bold text-zinc-100 text-base">No Achievements Added</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 mb-5">
            Add awards, competitive honors, and certifications to validate your experience.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-xs shadow-lg shadow-yellow-400/20"
          >
            Add Achievement
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {achievements.map((item) => {
            const id = item.id || item._id;
            return (
              <div
                key={id}
                className="bg-[#121215] rounded-2xl border border-zinc-800 border-l-4 border-l-yellow-400 p-6 shadow-xl shadow-black/40 hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="p-1 rounded-md bg-yellow-400/10 text-yellow-400">
                      <Award size={16} className="shrink-0" />
                    </span>
                    <h3 className="font-display text-base font-bold text-zinc-100">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono pt-1">
                    {item.date && (
                      <span className="flex items-center gap-1 text-zinc-300 font-medium">
                        <Calendar size={13} className="text-yellow-400" />
                        {new Date(item.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-yellow-400 hover:text-yellow-300 font-semibold hover:underline"
                      >
                        <ExternalLink size={12} />
                        <span>View Credential ↗</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-zinc-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors cursor-pointer"
                    title="Edit Achievement"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Delete Achievement"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Achievement' : 'Add New Achievement'}
        subtitle="Record awards, certifications, competitive honors, and hackathons."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Award / Honor Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Smart India Hackathon Finalist"
              className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Description & Context
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain the achievement, scale, competing teams, or key project..."
              className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-xs focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Date Received
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-xs focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Verification / Proof Link
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-xs focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-xs shadow-lg shadow-yellow-400/20 cursor-pointer"
            >
              {editingItem ? 'Save Changes' : 'Add Achievement'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          title="Delete Achievement Entry?"
          subtitle="This action cannot be undone."
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs text-zinc-400">
              Are you sure you want to delete this achievement record?
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
