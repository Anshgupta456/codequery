import { useState } from 'react';
import { Mail, ArrowUpRight, Copy, Check, MapPin, Globe, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';
import { messageService } from '../../services/portfolioService';

const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function ContactSection() {
  const { profile, notifyUpdated } = usePortfolio();
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const emailAddress = profile?.email || 'anshikagupta.work@gmail.com';
  const linkedinUrl = profile?.linkedin || 'https://linkedin.com/in/anshikagupta';
  const githubUrl = profile?.github || 'https://github.com/anshikagupta';
  const locationText = profile?.location || 'Dehradun / Remote, India';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitting(true);
    setStatus(null);

    try {
      await messageService.submit({
        name: name.trim(),
        email: email.trim(),
        message: message.trim()
      });
      setName('');
      setEmail('');
      setMessage('');
      setStatus({ type: 'success', text: 'Message sent successfully! I will get back to you shortly.' });
      notifyUpdated();
      setTimeout(() => setStatus(null), 5000);
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Failed to send message. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const contactChannels = [
    {
      id: 'email',
      icon: <Mail size={22} className="text-[#367C8E]" />,
      label: 'EMAIL ADDRESS',
      value: emailAddress,
      href: `mailto:${emailAddress}`,
      actionText: 'Send Email',
      isPrimary: true
    },
    {
      id: 'linkedin',
      icon: <LinkedinIcon size={22} />,
      label: 'LINKEDIN',
      value: linkedinUrl.replace('https://', ''),
      href: linkedinUrl,
      actionText: 'Connect'
    },
    {
      id: 'github',
      icon: <GithubIcon size={22} />,
      label: 'GITHUB',
      value: githubUrl.replace('https://', ''),
      href: githubUrl,
      actionText: 'Explore Code'
    },
    {
      id: 'location',
      icon: <MapPin size={22} className="text-[#367C8E]" />,
      label: 'LOCATION & TIMEZONE',
      value: locationText,
      subValue: 'IST (UTC +5:30) • Open to Remote & Relocation',
      actionText: 'Open to Work',
      isLocation: true
    }
  ];

  return (
    <section id="contact" className="relative py-20 sm:py-28 bg-white overflow-hidden select-none scroll-mt-16 sm:scroll-mt-20">

      {/* Background shirt-matching teal ambient glow (colored by default) */}
      <div 
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(178,216,226,0.35)_0%,rgba(232,244,247,0.18)_50%,transparent_85%)] blur-[90px] pointer-events-none opacity-80 z-0" 
        aria-hidden="true" 
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Heading */}
        <SectionHeading
          watermark="CONTACT"
          title="GET IN TOUCH"
          variant="color"
          align="center"
          className="mb-6 sm:mb-8"
        />

        {/* Narrative Headline */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-16">
          <p className="font-display text-base sm:text-xl font-normal text-zinc-700 leading-relaxed tracking-tight px-1">
            Have a project in mind, an engineering role to discuss, or want to collaborate? I am always open to exploring high-impact opportunities.
          </p>

          {/* Availability Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full border border-[#B2D8E2] bg-[#E8F4F7]/50 mt-4 sm:mt-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
            <span className="font-mono text-[11px] sm:text-xs font-semibold text-[#367C8E]">
              Available for full-time engineering roles
            </span>
          </div>
        </div>

        {/* 4 Contact Cards Grid (Purely tactile direct channels) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {contactChannels.map((channel) => (
            <div
              key={channel.id}
              className={`group/card relative rounded-2xl sm:rounded-3xl border p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 ${
                channel.isPrimary
                  ? 'bg-white border-[#367C8E] shadow-md shadow-[#367C8E]/10 hover:border-[#235B6A] hover:shadow-lg hover:-translate-y-1'
                  : 'bg-[#FAFAFA] border-[#B2D8E2]/80 shadow-2xs hover:bg-white hover:border-[#367C8E] hover:shadow-md hover:-translate-y-1'
              }`}
            >
              <div>
                {/* Top Row: Icon badge & Label */}
                <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#E8F4F7] border border-[#B2D8E2] flex items-center justify-center text-[#367C8E] shadow-2xs">
                    {channel.icon}
                  </div>
                  <span className="font-mono text-[10px] font-bold tracking-wider text-[#367C8E] uppercase">
                    {channel.label}
                  </span>
                </div>

                {/* Main Value */}
                <h4 className="font-display font-bold text-sm sm:text-base text-zinc-950 tracking-tight break-all mb-1">
                  {channel.value}
                </h4>

                {channel.subValue && (
                  <p className="text-xs text-zinc-500 leading-snug mb-2">
                    {channel.subValue}
                  </p>
                )}
              </div>

              {/* Bottom Action */}
              <div className="pt-3.5 sm:pt-4 mt-4 sm:mt-6 border-t border-zinc-200/60 flex items-center justify-between">
                {channel.href ? (
                  <a
                    href={channel.href}
                    target={channel.href.startsWith('mailto') ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#367C8E] hover:text-[#235B6A] hover:underline transition-colors"
                  >
                    <span>{channel.actionText}</span>
                    <ArrowUpRight size={13} strokeWidth={2.4} />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#367C8E]">
                    <Globe size={13} className="text-[#367C8E]" />
                    <span>Active IST</span>
                  </span>
                )}

                {channel.id === 'email' && (
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy email address"
                    className="inline-flex items-center gap-1 text-xs font-mono text-zinc-600 hover:text-[#367C8E] cursor-pointer transition-colors p-1"
                  >
                    {copiedEmail ? (
                      <>
                        <Check size={13} className="text-emerald-500" />
                        <span className="text-[11px] text-emerald-600 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Direct Message Form (Saved to MongoDB and viewable in Admin inbox) */}
        <div className="mt-10 sm:mt-14 max-w-2xl mx-auto bg-[#FAFAFA] border border-zinc-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-9 shadow-xs">
          <div className="text-center mb-5 sm:mb-6">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
              Send a Direct Message
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Drop a note below and it will land directly in my priority inbox.
            </p>
          </div>

          {status && (
            <div className={`mb-5 sm:mb-6 p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 ${
              status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {status.type === 'success' ? (
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{status.text}</span>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-600 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-base sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#367C8E] focus:border-[#367C8E] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-600 mb-1.5">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-base sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#367C8E] focus:border-[#367C8E] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-600 mb-1.5">
                Message
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What would you like to build together?"
                className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-base sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#367C8E] focus:border-[#367C8E] transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#367C8E] hover:bg-[#235B6A] text-white py-3 px-5 text-sm font-semibold shadow-md shadow-[#367C8E]/20 transition-all duration-300 disabled:opacity-50 cursor-pointer group"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send size={15} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
