import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar, 
  MapPin, 
  Award 
} from 'lucide-react';
import { educationService } from '../../services/portfolioService';
import { usePortfolio } from '../../context/PortfolioContext';
import Modal from '../../components/common/Modal';

export default function ManageEducation() {
  const { notifyUpdated } = usePortfolio();
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    cgpa: '',
    order: 1
  });

  const loadEducation = async () => {
    setLoading(true);
    try {
      const data = await educationService.getAll();
      setEducationList(data || []);
    } catch (err) {
      console.error('Error loading education:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEducation();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      cgpa: '',
      order: educationList.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      degree: item.degree || '',
      institution: item.institution || '',
      location: item.location || '',
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      cgpa: item.cgpa || '',
      order: item.order || 1
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.degree.trim() || !formData.institution.trim()) return;

    try {
      if (editingItem) {
        const id = editingItem.id || editingItem._id;
        await educationService.update(id, formData);
      } else {
        await educationService.create(formData);
      }
      setIsModalOpen(false);
      notifyUpdated();
      loadEducation();
    } catch (err) {
      alert('Failed to save education entry: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await educationService.delete(id);
      setDeleteConfirmId(null);
      notifyUpdated();
      loadEducation();
    } catch (err) {
      alert('Failed to delete education entry: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-100 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
              <GraduationCap size={20} />
            </span>
            Education & Academics
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage your degrees, academic institutions, timeline, and GPA standings.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold transition-all shadow-lg shadow-yellow-400/20 cursor-pointer self-start sm:self-auto hover:scale-105"
        >
          <Plus size={15} />
          <span>Add Education</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-yellow-400 rounded-full animate-spin mb-3" />
          <p className="text-xs font-mono text-zinc-400">Loading education...</p>
        </div>
      ) : educationList.length === 0 ? (
        <div className="bg-[#121215] rounded-2xl border border-zinc-800 p-12 text-center">
          <GraduationCap size={36} className="mx-auto text-yellow-400/50 mb-3" />
          <h3 className="font-display font-bold text-zinc-100 text-base">No Education Records</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 mb-5">
            Add your degrees, certifications, or high school qualifications.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-xs shadow-lg shadow-yellow-400/20"
          >
            Add Record
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {educationList.map((item) => {
            const id = item.id || item._id;
            return (
              <div
                key={id}
                className="bg-[#121215] rounded-2xl border border-zinc-800 border-l-4 border-l-yellow-400 p-6 shadow-xl shadow-black/40 hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-base font-bold text-zinc-100">
                      {item.degree}
                    </h3>
                  </div>

                  <p className="text-sm font-semibold text-yellow-400">
                    {item.institution}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono pt-1">
                    <span className="flex items-center gap-1 text-zinc-300 font-medium">
                      <Calendar size={13} className="text-yellow-400" />
                      {item.startDate} — {item.endDate}
                    </span>
                    {item.location && (
                      <span className="flex items-center gap-1 text-zinc-400">
                        <MapPin size={13} className="text-zinc-500" />
                        {item.location}
                      </span>
                    )}
                    {item.cgpa && (
                      <span className="flex items-center gap-1 text-yellow-400 font-bold bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-0.5 rounded-lg shadow-xs">
                        <Award size={12} className="text-yellow-400" />
                        {item.cgpa}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-zinc-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors cursor-pointer"
                    title="Edit Education"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Delete Education"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Education Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Education Record' : 'Add Education Record'}
        subtitle="Specify degree, institution, duration, and score."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              Degree / Certification *
            </label>
            <input
              type="text"
              required
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              placeholder="e.g. B.Tech in Computer Science & Engineering"
              className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
              Institution / University *
            </label>
            <input
              type="text"
              required
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="e.g. Graphic Era Hill University"
              className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Start Year
              </label>
              <input
                type="text"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                placeholder="2020"
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                End Year
              </label>
              <input
                type="text"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                placeholder="2024"
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                CGPA / Percentage
              </label>
              <input
                type="text"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                placeholder="e.g. 8.6 / 10.0 or 91.4%"
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Dehradun, India"
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
              />
            </div>
          </div>

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
              className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-xs shadow-lg shadow-yellow-400/20"
            >
              {editingItem ? 'Save Changes' : 'Add Record'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          title="Delete Education Entry?"
          subtitle="This action cannot be undone."
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs text-zinc-400">
              Are you sure you want to delete this education entry?
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
