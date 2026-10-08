import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  FileText, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Sparkles,
  Upload,
  Loader2
} from 'lucide-react';
import { profileService, uploadService } from '../../services/portfolioService';
import { usePortfolio } from '../../context/PortfolioContext';

export default function ManageProfile() {
  const { notifyUpdated } = usePortfolio();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    headline: '',
    summary: '',
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    twitter: '',
    leetcode: '',
    codeforces: '',
    resumeFileUrl: '',
    profileImageUrl: '',
    colorImageUrl: '',
    yearsExperience: '2+',
    projectsCompleted: '12+',
    contributions: '500+'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        if (data) {
          setFormData((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    try {
      const res = await uploadService.uploadFile(file);
      if (res && res.url) {
        setFormData((prev) => ({ ...prev, [fieldName]: res.url }));
        setFeedback({ type: 'success', text: `Uploaded to Cloudinary successfully!` });
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || err.message || 'File upload failed' });
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await profileService.updateProfile(formData);
      notifyUpdated();
      setFeedback({ type: 'success', text: 'Profile changes saved and updated in real-time!' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-950 rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono text-zinc-400">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header Banner with Yellow Accents */}
      <div className="relative overflow-hidden rounded-3xl bg-[#121215] border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(250,204,21,0.1)_0%,transparent_70%)] blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 text-xs font-mono font-medium mb-3">
              <Sparkles size={13} />
              <span>LIVE CONTENT MANAGER</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Profile & Personal Brand
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Updates made here instantly synchronize with your public Hero, About, and Contact sections in real time.
            </p>
          </div>

          {feedback && (
            <div className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm ${
              feedback.type === 'success' 
                ? 'bg-yellow-400 text-black' 
                : 'bg-red-500 text-white'
            }`}>
              {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Identity Grid */}
        <div className="bg-[#121215] border border-zinc-800 border-t-4 border-t-yellow-400 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 text-yellow-400 border border-zinc-700 flex items-center justify-center">
                <User size={16} />
              </div>
              <span>Core Identity & Headlines</span>
            </h3>
            <span className="text-[11px] font-mono font-semibold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-lg border border-yellow-400/30">
              Hero & Header Info
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1.5">
                Professional Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Software Engineer"
                className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1.5">
              Hero Section Tagline / Short Intro
            </label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              placeholder="e.g. I build modern web applications with a focus on clean code..."
              className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1.5">
              About Section Narrative / Full Biography
            </label>
            <textarea
              name="summary"
              rows={4}
              value={formData.summary}
              onChange={handleChange}
              placeholder="Tell your story, software philosophies, and engineering background..."
              className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 leading-relaxed"
            />
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Years of Experience
              </label>
              <input
                type="text"
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleChange}
                placeholder="e.g. 2+"
                className="w-full px-3.5 py-2 bg-[#09090b] border border-zinc-700 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Projects Completed
              </label>
              <input
                type="text"
                name="projectsCompleted"
                value={formData.projectsCompleted}
                onChange={handleChange}
                placeholder="e.g. 12+"
                className="w-full px-3.5 py-2 bg-[#09090b] border border-zinc-700 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Open Source Contributions
              </label>
              <input
                type="text"
                name="contributions"
                value={formData.contributions}
                onChange={handleChange}
                placeholder="e.g. 500+"
                className="w-full px-3.5 py-2 bg-[#09090b] border border-zinc-700 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-[#121215] border border-zinc-800 border-t-4 border-t-yellow-400 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 text-yellow-400 border border-zinc-700 flex items-center justify-center">
                <Mail size={16} />
              </div>
              <span>Contact Coordinates</span>
            </h3>
            <span className="text-[11px] font-mono font-semibold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-lg border border-yellow-400/30">
              Inquiry Channels
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1.5">
                Primary Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. New Delhi, India"
                className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              />
            </div>
          </div>
        </div>

        {/* Social Links & Coding Profiles */}
        <div className="bg-[#121215] border border-zinc-800 border-t-4 border-t-yellow-400 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 text-yellow-400 border border-zinc-700 flex items-center justify-center">
                <Globe size={16} />
              </div>
              <span>Social Profiles & Coding Handles</span>
            </h3>
            <span className="text-[11px] font-mono font-semibold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-lg border border-yellow-400/30">
              Community Links
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1.5">
                LeetCode Profile URL
              </label>
              <input
                type="url"
                name="leetcode"
                value={formData.leetcode}
                onChange={handleChange}
                placeholder="https://leetcode.com/username"
                className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1.5">
                Codeforces or Twitter / X URL
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="https://x.com/username"
                className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              />
            </div>
          </div>
        </div>

        {/* Media & Resume Files */}
        <div className="bg-[#121215] border border-zinc-800 border-t-4 border-t-yellow-400 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 text-yellow-400 border border-zinc-700 flex items-center justify-center">
                <FileText size={16} />
              </div>
              <span>Resume PDF & Profile Photos</span>
            </h3>
            <span className="text-[11px] font-mono font-semibold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-lg border border-yellow-400/30">
              Cloudinary Media
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Resume PDF */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1.5">
                Resume PDF File
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="resumeFileUrl"
                    value={formData.resumeFileUrl}
                    onChange={handleChange}
                    placeholder="/Anshika_Gupta_Resume.pdf"
                    className="flex-1 px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
                  />
                  {formData.resumeFileUrl && (
                    <a
                      href={formData.resumeFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-yellow-400 flex items-center justify-center shrink-0"
                      title="Test link"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-zinc-700 hover:border-yellow-400 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-yellow-400 text-xs font-mono cursor-pointer transition-colors w-full justify-center">
                  {uploadingField === 'resumeFileUrl' ? (
                    <Loader2 size={13} className="animate-spin text-yellow-400" />
                  ) : (
                    <Upload size={13} className="text-yellow-400" />
                  )}
                  <span className="font-semibold">{uploadingField === 'resumeFileUrl' ? 'Uploading PDF...' : 'Upload PDF'}</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'resumeFileUrl')}
                    disabled={uploadingField !== null}
                  />
                </label>
              </div>
            </div>

            {/* B&W Image */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1.5">
                B&W Hero Photo
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="profileImageUrl"
                    value={formData.profileImageUrl}
                    onChange={handleChange}
                    placeholder="/anshika_bnw.png"
                    className="flex-1 px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
                  />
                  {formData.profileImageUrl && (
                    <a
                      href={formData.profileImageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-yellow-400 flex items-center justify-center shrink-0"
                      title="Preview"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-zinc-700 hover:border-yellow-400 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-yellow-400 text-xs font-mono cursor-pointer transition-colors w-full justify-center">
                  {uploadingField === 'profileImageUrl' ? (
                    <Loader2 size={13} className="animate-spin text-yellow-400" />
                  ) : (
                    <Upload size={13} className="text-yellow-400" />
                  )}
                  <span className="font-semibold">{uploadingField === 'profileImageUrl' ? 'Uploading Photo...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'profileImageUrl')}
                    disabled={uploadingField !== null}
                  />
                </label>
              </div>
            </div>

            {/* Color Image */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1.5">
                Color Hero Photo
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="colorImageUrl"
                    value={formData.colorImageUrl}
                    onChange={handleChange}
                    placeholder="/anshika_col.png"
                    className="flex-1 px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
                  />
                  {formData.colorImageUrl && (
                    <a
                      href={formData.colorImageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-yellow-400 flex items-center justify-center shrink-0"
                      title="Preview"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-zinc-700 hover:border-yellow-400 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-yellow-400 text-xs font-mono cursor-pointer transition-colors w-full justify-center">
                  {uploadingField === 'colorImageUrl' ? (
                    <Loader2 size={13} className="animate-spin text-yellow-400" />
                  ) : (
                    <Upload size={13} className="text-yellow-400" />
                  )}
                  <span className="font-semibold">{uploadingField === 'colorImageUrl' ? 'Uploading Photo...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'colorImageUrl')}
                    disabled={uploadingField !== null}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Row - Vibrant Yellow Save Button */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-black rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/35 hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save All Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
