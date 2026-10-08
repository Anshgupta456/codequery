import { useState, useEffect } from 'react';
import { 
  Mail, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Reply, 
  MailCheck, 
  MailWarning, 
  Filter,
  Search,
  X
} from 'lucide-react';
import { messageService } from '../../services/portfolioService';
import { usePortfolio } from '../../context/PortfolioContext';
import Modal from '../../components/common/Modal';

export default function Messages() {
  const { notifyUpdated } = usePortfolio();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await messageService.getAll();
      setMessages(data || []);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleRead = async (msg) => {
    const id = msg.id || msg._id;
    const newStatus = !msg.isRead;
    try {
      await messageService.markRead(id, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === id || m._id === id ? { ...m, isRead: newStatus } : m))
      );
      notifyUpdated();
    } catch (err) {
      alert('Failed to update message status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await messageService.delete(id);
      setDeleteConfirmId(null);
      setMessages((prev) => prev.filter((m) => m.id !== id && m._id !== id));
      notifyUpdated();
    } catch (err) {
      alert('Failed to delete message: ' + err.message);
    }
  };

  // Filter & Search logic
  const filteredMessages = messages.filter((msg) => {
    if (filter === 'unread' && msg.isRead) return false;
    if (filter === 'read' && !msg.isRead) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (msg.name && msg.name.toLowerCase().includes(q)) ||
        (msg.email && msg.email.toLowerCase().includes(q)) ||
        (msg.message && msg.message.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const unreadTotal = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
              <Mail size={20} />
            </span>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-100">
              Messages & Inquiries
            </h2>
            {unreadTotal > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-yellow-400 text-black shadow-xs shadow-yellow-400/30 animate-pulse">
                {unreadTotal} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Visitor submissions, recruiter messages, and freelance queries submitted through your contact form.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-yellow-400 text-black font-bold shadow-xs'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'unread'
                ? 'bg-yellow-400 text-black font-bold shadow-xs'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Unread ({unreadTotal})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'read'
                ? 'bg-yellow-400 text-black font-bold shadow-xs'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Read ({messages.length - unreadTotal})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by sender name, email address, or keyword..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#09090b] border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-xl text-xs focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 font-mono"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-yellow-400 rounded-full animate-spin mb-3" />
          <p className="text-xs font-mono text-zinc-400">Loading inbox messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-[#121215] rounded-2xl border border-zinc-800 p-12 text-center">
          <Mail size={36} className="mx-auto text-yellow-400/50 mb-3" />
          <h3 className="font-display font-bold text-zinc-100 text-base">No Messages Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
            {searchQuery ? 'No inquiries matched your search criteria.' : 'No messages in this folder.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const id = msg.id || msg._id;
            return (
              <div
                key={id}
                className={`bg-[#121215] rounded-2xl border transition-all p-5 space-y-3 ${
                  !msg.isRead
                    ? 'border-zinc-800 border-l-4 border-l-yellow-400 shadow-xl shadow-black/40'
                    : 'border-zinc-800/90 hover:border-zinc-700 shadow-md shadow-black/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {!msg.isRead ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0 shadow-xs shadow-yellow-400/50" title="Unread" />
                    ) : (
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    )}
                    <span className="font-display font-bold text-sm text-zinc-100">
                      {msg.name}
                    </span>
                    <span className="text-xs font-mono text-yellow-400 font-semibold">
                      &lt;{msg.email}&gt;
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Clock size={12} className="text-zinc-500" />
                      {new Date(msg.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="bg-[#09090b] rounded-xl p-3.5 border border-zinc-800 text-xs text-zinc-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {msg.message}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${msg.email}?subject=Re: Portfolio Inquiry&body=Hi ${msg.name},\n\nThank you for reaching out through my portfolio website.`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold transition-all shadow-lg shadow-yellow-400/20"
                    >
                      <Reply size={13} />
                      <span>Reply via Email</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleToggleRead(msg)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {msg.isRead ? (
                        <>
                          <span>Mark as Unread</span>
                        </>
                      ) : (
                        <>
                          <MailCheck size={13} className="text-yellow-400" />
                          <span>Mark as Read</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => setDeleteConfirmId(id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          title="Delete Message?"
          subtitle="This message will be permanently removed."
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs text-zinc-400">
              Are you sure you want to permanently delete this contact inquiry?
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
