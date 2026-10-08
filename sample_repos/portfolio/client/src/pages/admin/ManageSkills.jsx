import { useState, useEffect } from 'react';
import { 
  Cpu, 
  Plus, 
  Trash2, 
  Pencil, 
  X, 
  Check, 
  FolderPlus,
  Sparkles,
  Palette
} from 'lucide-react';
import { skillService } from '../../services/portfolioService';
import { usePortfolio } from '../../context/PortfolioContext';
import Modal from '../../components/common/Modal';
import SkillIconPickerModal from '../../components/admin/SkillIconPickerModal';
import { SkillIconRenderer, findPresetByKeyword } from '../../components/admin/techIcons';

const getSkillName = (s) => (typeof s === 'string' ? s : s?.name || '');

const getCategoryTheme = (name, index) => {
  return {
    border: 'border-t-2 border-yellow-400',
    dot: 'bg-yellow-400 shadow-xs shadow-yellow-400/50',
    pill: 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border-zinc-700/80 hover:border-yellow-400/50',
    badge: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20',
    iconText: 'text-yellow-400',
    btn: 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-xs shadow-yellow-400/30'
  };
};

export default function ManageSkills() {
  const { notifyUpdated } = usePortfolio();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Icon Picker Modal State
  const [iconPickerState, setIconPickerState] = useState({
    isOpen: false,
    category: null,
    skillItem: null,
    itemIndex: -1
  });

  // Per-category tag input state: { [catId]: string }
  const [newSkillInputs, setNewSkillInputs] = useState({});

  const loadSkills = async () => {
    setLoading(true);
    try {
      const data = await skillService.getAll();
      setCategories(data || []);
    } catch (err) {
      console.error('Error loading skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryName('');
    setIsCategoryModalOpen(true);
  };

  const openEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.category || '');
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (editingCategory) {
        const id = editingCategory.id || editingCategory._id;
        await skillService.updateCategory(id, { category: categoryName.trim() });
      } else {
        await skillService.createCategory({
          category: categoryName.trim(),
          items: []
        });
      }
      setIsCategoryModalOpen(false);
      notifyUpdated();
      loadSkills();
    } catch (err) {
      alert('Failed to save category: ' + err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await skillService.deleteCategory(id);
      setDeleteConfirmId(null);
      notifyUpdated();
      loadSkills();
    } catch (err) {
      alert('Failed to delete category: ' + err.message);
    }
  };

  const handleAddSkillTag = async (cat, e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const id = cat.id || cat._id;
      const skillText = (newSkillInputs[id] || '').trim();
      if (!skillText) return;

      const currentItems = cat.items || [];
      const alreadyExists = currentItems.some(
        (s) => getSkillName(s).toLowerCase() === skillText.toLowerCase()
      );
      if (alreadyExists) {
        setNewSkillInputs((prev) => ({ ...prev, [id]: '' }));
        return;
      }

      // Auto-associate preset icon if available
      const matched = findPresetByKeyword(skillText);
      const newEntry = matched
        ? { name: skillText, icon: matched.id, svg: matched.svg }
        : skillText;

      const updatedItems = [...currentItems, newEntry];
      try {
        await skillService.updateCategory(id, { items: updatedItems });
        setCategories((prev) =>
          prev.map((c) => (c.id === id || c._id === id ? { ...c, items: updatedItems } : c))
        );
        setNewSkillInputs((prev) => ({ ...prev, [id]: '' }));
        notifyUpdated();
      } catch (err) {
        alert('Failed to add skill: ' + err.message);
      }
    }
  };

  const handleRemoveSkillTag = async (cat, skillToRemove) => {
    const id = cat.id || cat._id;
    const targetName = getSkillName(skillToRemove);
    const updatedItems = (cat.items || []).filter((s) => getSkillName(s) !== targetName);

    try {
      await skillService.updateCategory(id, { items: updatedItems });
      setCategories((prev) =>
        prev.map((c) => (c.id === id || c._id === id ? { ...c, items: updatedItems } : c))
      );
      notifyUpdated();
    } catch (err) {
      alert('Failed to remove skill: ' + err.message);
    }
  };

  const handleOpenIconPicker = (cat, item, index) => {
    setIconPickerState({
      isOpen: true,
      category: cat,
      skillItem: item,
      itemIndex: index
    });
  };

  const handleSaveSkillFromPicker = async (savedObj) => {
    const { category: cat, itemIndex } = iconPickerState;
    if (!cat) return;
    const catId = cat.id || cat._id;
    const currentItems = [...(cat.items || [])];

    if (itemIndex >= 0 && itemIndex < currentItems.length) {
      currentItems[itemIndex] = savedObj;
    } else {
      const existingIdx = currentItems.findIndex(
        (s) => getSkillName(s).toLowerCase() === savedObj.name.toLowerCase()
      );
      if (existingIdx >= 0) {
        currentItems[existingIdx] = savedObj;
      } else {
        currentItems.push(savedObj);
      }
    }

    try {
      await skillService.updateCategory(catId, { items: currentItems });
      setCategories((prev) =>
        prev.map((c) => (c.id === catId || c._id === catId ? { ...c, items: currentItems } : c))
      );
      notifyUpdated();
    } catch (err) {
      alert('Failed to save skill SVG icon: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-100 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
              <Cpu size={20} />
            </span>
            Skills & Technical Stack
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Organize programming languages, libraries, frameworks, cloud tooling, and AI technologies by domain.
          </p>
        </div>

        <button
          onClick={openAddCategory}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold transition-all shadow-lg shadow-yellow-400/20 cursor-pointer self-start sm:self-auto hover:scale-105"
        >
          <FolderPlus size={15} />
          <span>New Skill Category</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-yellow-400 rounded-full animate-spin mb-3" />
          <p className="text-xs font-mono text-zinc-400">Loading skill domains...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-[#121215] rounded-2xl border border-zinc-800 p-12 text-center">
          <Cpu size={36} className="mx-auto text-yellow-400/50 mb-3" />
          <h3 className="font-display font-bold text-zinc-100 text-base">No Skill Categories</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 mb-5">
            Add categories like Languages, Frontend, Backend, or DevOps to get started.
          </p>
          <button
            onClick={openAddCategory}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-xs shadow-lg shadow-yellow-400/20"
          >
            Create Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categories.map((cat, catIdx) => {
            const id = cat.id || cat._id;
            const items = cat.items || [];
            const theme = getCategoryTheme(cat.category, catIdx);
            return (
              <div
                key={id}
                className={`bg-[#121215] rounded-2xl border border-zinc-800 ${theme.border} p-5 shadow-xl shadow-black/40 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4`}
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${theme.dot}`} />
                      <h3 className="font-display text-sm font-bold text-zinc-100">
                        {cat.category}
                      </h3>
                      <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full ${theme.badge}`}>
                        {items.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditCategory(cat)}
                        className="p-1.5 text-zinc-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors cursor-pointer"
                        title="Rename Category"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Skills Pills List */}
                  <div className="pt-3 min-h-[80px]">
                    {items.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic">No skills in this category yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {items.map((skill, sIdx) => {
                          const name = getSkillName(skill);
                          const hasCustomIcon = typeof skill === 'object' && (skill.svg || skill.icon);
                          return (
                            <div
                              key={name || sIdx}
                              className={`inline-flex items-center gap-1.5 pl-2.5 pr-2 py-1.5 rounded-xl text-xs font-mono transition-all group border shadow-sm ${theme.pill}`}
                            >
                              {/* SVG / Image Icon Thumbnail - Fully Colorful */}
                              <button
                                type="button"
                                onClick={() => handleOpenIconPicker(cat, skill, sIdx)}
                                className="cursor-pointer hover:scale-125 transition-transform flex items-center justify-center w-4 h-4 shrink-0"
                                title="Click to customize icon"
                              >
                                <SkillIconRenderer skill={skill} className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full object-contain" />
                              </button>

                              {/* Skill Name */}
                              <span 
                                onClick={() => handleOpenIconPicker(cat, skill, sIdx)}
                                className="cursor-pointer hover:text-yellow-400 hover:underline font-semibold"
                                title="Click to edit icon"
                              >
                                {name}
                              </span>

                              {/* Customize Icon Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenIconPicker(cat, skill, sIdx)}
                                className={`p-0.5 rounded transition-colors ${
                                  hasCustomIcon 
                                    ? 'text-yellow-400 hover:scale-115' 
                                    : 'text-zinc-500 hover:text-yellow-400 opacity-60 group-hover:opacity-100'
                                }`}
                                title="Choose / Edit Icon"
                              >
                                <Sparkles size={11} />
                              </button>

                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveSkillTag(cat, skill)}
                                className="text-zinc-500 hover:text-rose-400 transition-colors p-0.5 ml-0.5 cursor-pointer"
                                title={`Remove ${name}`}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline Quick Add Input */}
                <div className="pt-3 border-t border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSkillInputs[id] || ''}
                      onChange={(e) =>
                        setNewSkillInputs((prev) => ({ ...prev, [id]: e.target.value }))
                      }
                      onKeyDown={(e) => handleAddSkillTag(cat, e)}
                      placeholder="Add skill (e.g. Docker, GraphQL)..."
                      className="flex-1 px-3 py-1.5 bg-[#09090b] border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-xl text-xs focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = (newSkillInputs[id] || '').trim();
                        handleOpenIconPicker(cat, val ? { name: val } : null, -1);
                      }}
                      className="p-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
                      title="Add with Custom Colorful Icon / SVG"
                    >
                      <Palette size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleAddSkillTag(cat, e)}
                      className={`px-3.5 py-1.5 ${theme.btn} rounded-xl text-xs font-bold shrink-0 cursor-pointer transition-all hover:scale-105`}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? 'Rename Category' : 'Create New Category'}
        subtitle="Categorize your technical proficiencies (e.g. Languages, Frontend, Cloud)."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. AI-Augmented Development"
              className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 focus:outline-none placeholder-zinc-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-xs shadow-lg shadow-yellow-400/20"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          title="Delete Category?"
          subtitle="All skill tags in this category will also be deleted."
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs text-zinc-400">
              Are you sure you want to permanently delete this category and all its skills?
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
                onClick={() => handleDeleteCategory(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Skill SVG Icon Picker Modal */}
      {iconPickerState.isOpen && (
        <SkillIconPickerModal
          isOpen={iconPickerState.isOpen}
          onClose={() => setIconPickerState({ isOpen: false, category: null, skillItem: null, itemIndex: -1 })}
          skillItem={iconPickerState.skillItem}
          onSave={handleSaveSkillFromPicker}
        />
      )}
    </div>
  );
}
