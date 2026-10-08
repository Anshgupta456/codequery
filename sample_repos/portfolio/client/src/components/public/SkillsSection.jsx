import { useState, useRef, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';
import { SkillIconRenderer } from '../admin/techIcons';

// Crisp, high-fidelity monochrome SVGs matching the reference card icons
const CardIcon = ({ type }) => {
  switch (type) {
    case 'react':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.6">
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.8" className="fill-current" />
        </svg>
      );
    case 'next':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.3 14.3l-5.7-7.4v7.4H8V7.7h1.6l5.7 7.4V7.7h1.6v8.6h-1.6z" />
        </svg>
      );
    case 'tailwind':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z" />
        </svg>
      );
    case 'html':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M4 3l1.8 16.2L12 21l6.2-1.8L20 3H4zm13.1 5.3H9.4l.2 2.2h7.3l-.6 6.3-4.3 1.2-4.3-1.2-.3-3.4h2.2l.2 1.8 2.2.6 2.2-.6.3-2.9H7l-.6-6.3h11l-.3 2.3z" />
        </svg>
      );
    case 'css':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M4 3l1.8 16.2L12 21l6.2-1.8L20 3H4zm13.3 4.5l-.2 2.2H9.2l.2 2.2h7.6l-.6 6.3-4.4 1.2-4.4-1.2-.3-3.4h2.2l.2 1.8 2.3.6 2.3-.6.3-2.9H7.1l-.6-6.3h10.8z" />
        </svg>
      );
    case 'js':
      return (
        <div className="w-5 h-5 rounded-xs bg-zinc-900 text-white font-mono font-black text-[11px] flex items-center justify-center leading-none">
          JS
        </div>
      );
    case 'node':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8">
          <path d="M12 2l8 4.6v9.2L12 20.4 4 15.8V6.6L12 2z" />
          <path d="M12 6.5v8" />
        </svg>
      );
    case 'express':
      return (
        <span className="font-mono font-black text-[11px] tracking-tighter">
          ex
        </span>
      );
    case 'api':
      return (
        <span className="font-mono font-bold text-sm tracking-tighter">
          &#123; &#125;
        </span>
      );
    case 'jwt':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'mongodb':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8">
          <path d="M12 2C12 2 6 8.5 6 14.5C6 18.5 9 22 12 22C15 22 18 18.5 18 14.5C18 8.5 12 2 12 2Z" />
          <path d="M12 2V22" />
        </svg>
      );
    case 'postgres':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8">
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
          <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
        </svg>
      );
    case 'redis':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      );
    case 'cloud':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        </svg>
      );
    case 'git':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8">
          <circle cx="18" cy="18" r="3" />
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M6 9v6" />
          <path d="M9 9a9 9 0 0 1 9 9" />
        </svg>
      );
    case 'docker':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M22.5 10.5c-.4-.3-1.4-.4-2.1-.2-.2-.6-.6-1.2-1.1-1.6l-.7.6c-.3-.2-.7-.3-1.1-.3-.2 0-.3 0-.5.1V7h-2.5v2.1h-1.5V7h-2.5v2.1h-1.5V7H6.1v2.1H3.6c-.5 0-.9.4-.9.9v2.5c0 3.3 2.7 6 6 6 4.7 0 8.5-3.3 9.3-7.7.8.2 1.6 0 2-.4.4-.4.6-.9.5-1.4zm-14-1.9h1.5v1.5H8.5V8.6zm3 0H13v1.5h-1.5V8.6z" />
        </svg>
      );
    case 'aws':
      return (
        <span className="font-mono font-black text-[10px] tracking-tight">
          aws
        </span>
      );
    case 'cicd':
      return (
        <span className="font-sans font-bold text-base leading-none">
          ∞
        </span>
      );
    case 'openai':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.6">
          <path d="M12 2a4 4 0 0 1 3.5 2.1l.5.9a4 4 0 0 1 4 4v1a4 4 0 0 1 .5 3.5l-.5.9a4 4 0 0 1-2.5 3.1l-1 .3a4 4 0 0 1-4 0l-1-.3a4 4 0 0 1-2.5-3.1l-.5-.9a4 4 0 0 1 .5-3.5v-1a4 4 0 0 1 4-4l.5-.9A4 4 0 0 1 12 2z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case 'langchain':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    case 'tensorflow':
      return (
        <span className="font-serif font-black text-sm">
          T
        </span>
      );
    case 'pinecone':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8">
          <path d="M12 2l7 12H5l7-12z" />
          <path d="M12 14v8" />
        </svg>
      );
    case 'linux':
      return (
        <span className="font-mono font-bold text-xs tracking-tight">
          &gt;_
        </span>
      );
    case 'figma':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M8 2h8a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8zm0 8h8a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8zm0 8h4a4 4 0 1 1-4 4v-4z" />
        </svg>
      );
    case 'vscode':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8">
          <path d="M16 3l5 3v12l-5 3-9-6.5L3 17V7l4-2.5L16 3z" />
          <path d="M7 14.5l9-8.5" />
          <path d="M7 9.5l9 8.5" />
        </svg>
      );
    case 'postman':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8l4 4-4 4M8 12h8" />
        </svg>
      );
    default:
      return (
        <span className="font-mono text-xs font-bold">●</span>
      );
  }
};

// Big Category Hero Icons for the top circular badge of each card
const CategoryHeroIcon = ({ id }) => {
  switch (id) {
    case 'frontend':
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current" strokeWidth="1.7">
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="2" className="fill-current" />
        </svg>
      );
    case 'backend':
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current" strokeWidth="1.7">
          <rect x="2" y="3" width="20" height="7" rx="2" />
          <rect x="2" y="14" width="20" height="7" rx="2" />
          <line x1="6" y1="6.5" x2="6.01" y2="6.5" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="6" y1="17.5" x2="6.01" y2="17.5" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="10" y1="6.5" x2="14" y2="6.5" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="17.5" x2="14" y2="17.5" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'database':
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current" strokeWidth="1.7">
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
          <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
        </svg>
      );
    case 'devops':
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current" strokeWidth="1.7">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 'ai':
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
          <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
        </svg>
      );
    case 'other':
      return (
        <span className="font-mono text-2xl font-black tracking-tight">
          &lt;/&gt;
        </span>
      );
    default:
      return null;
  }
};

export default function SkillsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);
  const isDragging = useRef(false);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { skills: dbSkillCategories } = usePortfolio();

  const getSkillIcon = (name) => {
    const n = (name || '').toLowerCase();
    if (n.includes('react')) return 'react';
    if (n.includes('next')) return 'next';
    if (n.includes('tailwind')) return 'tailwind';
    if (n.includes('html')) return 'html';
    if (n.includes('css')) return 'css';
    if (n.includes('js') || n.includes('javascript')) return 'js';
    if (n.includes('node')) return 'node';
    if (n.includes('express')) return 'express';
    if (n.includes('api')) return 'api';
    if (n.includes('jwt')) return 'jwt';
    if (n.includes('mongo')) return 'mongodb';
    if (n.includes('postman')) return 'postman';
    if (n.includes('postgres') || n.includes('sql')) return 'postgres';
    if (n.includes('redis')) return 'redis';
    if (n.includes('aws') || n.includes('cloud')) return 'aws';
    if (n.includes('git')) return 'git';
    if (n.includes('docker')) return 'docker';
    if (n.includes('ci')) return 'cicd';
    if (n.includes('linux')) return 'linux';
    if (n.includes('vscode')) return 'vscode';
    if (n.includes('openai') || n.includes('gpt')) return 'openai';
    if (n.includes('langchain')) return 'langchain';
    if (n.includes('pinecone') || n.includes('vector')) return 'pinecone';
    if (n.includes('figma')) return 'figma';
    return 'other';
  };

  const getCategoryIconId = (catName) => {
    const c = (catName || '').toLowerCase();
    if (c.includes('front')) return 'frontend';
    if (c.includes('back')) return 'backend';
    if (c.includes('data')) return 'database';
    if (c.includes('devops') || c.includes('tool') || c.includes('cloud')) return 'devops';
    if (c.includes('ai') || c.includes('ml')) return 'ai';
    return 'other';
  };

  const categories = useMemo(() => {
    if (!Array.isArray(dbSkillCategories) || dbSkillCategories.length === 0) {
      return [
        {
          id: 'frontend',
          number: '01 / 01',
          title: 'Full Stack Skills',
          description: 'Modern development technologies and engineering competencies.',
          skills: [{ name: 'JavaScript', icon: 'js' }]
        }
      ];
    }
    return dbSkillCategories.map((cat, idx) => ({
      id: getCategoryIconId(cat.category),
      number: `${String(idx + 1).padStart(2, '0')} / ${String(dbSkillCategories.length).padStart(2, '0')}`,
      title: cat.category,
      description: `Specialized skills in ${cat.category} powering robust and scalable web applications.`,
      skills: (cat.items || []).map((item) => {
        const name = typeof item === 'string' ? item : (item?.name || '');
        return {
          name,
          raw: item,
          icon: typeof item === 'object' && item?.icon ? item.icon : getSkillIcon(name)
        };
      })
    }));
  }, [dbSkillCategories]);

  // Dynamically calculate horizontal spread based on screen width and number of cards
  // so background cards have ample space and visibility without overflowing
  const isMobile = windowWidth < 640;

  const stackOffset = useMemo(() => {
    const stepCount = Math.max(1, categories.length - 1);
    if (windowWidth < 640) {
      return 10; // strictly bounded for mobile viewports
    }
    if (windowWidth < 1024) {
      return Math.min(84, Math.max(62, Math.floor(310 / stepCount)));
    }
    if (windowWidth < 1280) {
      return Math.min(102, Math.max(78, Math.floor(390 / stepCount)));
    }
    // Wide desktop (>= 1280px)
    return Math.min(125, Math.max(92, Math.floor(480 / stepCount)));
  }, [windowWidth, categories.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % categories.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const handlePointerDown = (e) => {
    isDragging.current = true;
    touchStartX.current = e.clientX;
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    const diff = e.clientX - touchStartX.current;
    if (diff < -40) {
      handleNext();
    } else if (diff > 40) {
      handlePrev();
    }
    isDragging.current = false;
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff < -40) {
      handleNext();
    } else if (diff > 40) {
      handlePrev();
    }
  };

  const currentCategory = categories[activeIndex];

  return (
    <section id="skills" className="relative py-16 sm:py-28 bg-[#FAFAFA] overflow-hidden select-none scroll-mt-16 sm:scroll-mt-20">
      
      {/* Background shirt-matching teal ambient glow (colored by default) */}
      <div
        className="absolute top-[10%] right-[10%] w-[650px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(178,216,226,0.3)_0%,rgba(232,244,247,0.15)_50%,transparent_85%)] blur-[80px] pointer-events-none opacity-80 z-0"
        aria-hidden="true"
      />

      {/* Subtle bottom-left concentric arc motif */}
      <div className="absolute bottom-[-100px] left-[-60px] w-96 h-96 pointer-events-none opacity-40 z-0">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <circle cx="0" cy="300" r="260" fill="none" stroke="#E5E5E5" strokeWidth="1.2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Top-Right Navigation Header: < 1 / 6 > */}
        <div className="flex justify-between sm:justify-end items-center gap-4 mb-4 sm:mb-8">
          <span className="sm:hidden text-xs font-mono text-[#367C8E] font-bold">
            SKILLS & EXPERTISE
          </span>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous skill"
              className="text-[#367C8E] hover:text-[#235B6A] active:scale-90 transition-all cursor-pointer p-1.5 rounded-lg border border-zinc-200/80 bg-white shadow-2xs sm:border-0 sm:shadow-none"
            >
              <ChevronLeft size={18} strokeWidth={2.4} />
            </button>

            <span className="font-mono text-xs font-semibold text-zinc-600 tracking-wider">
              {activeIndex + 1} / {categories.length}
            </span>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next skill"
              className="text-[#367C8E] hover:text-[#235B6A] active:scale-90 transition-all cursor-pointer p-1.5 rounded-lg border border-zinc-200/80 bg-white shadow-2xs sm:border-0 sm:shadow-none"
            >
              <ChevronRight size={18} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        {/* Main Grid: Left Side Content + Right Side 3D Cascading Stacked Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Paragraph, Progress Line, and "Swipe to see next skill" */}
          <div className="lg:col-span-5 flex flex-col items-start justify-center pr-0 lg:pr-2">
            
            {/* Section Heading Component (Left Aligned) */}
            <SectionHeading
              watermark="SKILLS"
              title={currentCategory.title}
              variant="color"
              align="left"
              className="!mb-3 sm:!mb-4 !py-0"
            />

            {/* Paragraph Bio */}
            <p className="text-zinc-600 text-xs sm:text-base leading-relaxed max-w-[360px] mb-5 sm:mb-8 transition-all duration-300 min-h-[44px]">
              {currentCategory.description}
            </p>

            {/* Segmented Progress Rule: Solid active portion + remaining grey line + "01 / 06" */}
            <div className="flex items-center gap-4 w-full max-w-[280px] mb-6 sm:mb-8">
              <div className="relative flex-1 h-[2px] bg-zinc-200 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-[#367C8E] transition-all duration-500 ease-out"
                  style={{ width: `${((activeIndex + 1) / categories.length) * 100}%` }}
                />
              </div>
              <span className="font-mono text-xs font-bold text-[#367C8E] tracking-wider">
                {currentCategory.number}
              </span>
            </div>

            {/* Bottom Button: [ → ] Swipe to see next skill */}
            <button
              type="button"
              onClick={handleNext}
              className="group/btn inline-flex items-center gap-3 rounded-full border border-[#367C8E] bg-[#E8F4F7]/40 pl-2 pr-5 py-2 text-xs sm:text-sm font-semibold text-[#367C8E] shadow-xs transition-all duration-300 hover:bg-[#367C8E] hover:text-white hover:shadow-md hover:shadow-[#367C8E]/20 cursor-pointer active:scale-95"
            >
              <div className="w-6 h-6 rounded-full bg-[#367C8E] text-white flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-0.5">
                <ArrowRight size={13} strokeWidth={2.4} />
              </div>
              <span>Tap or swipe for next skill</span>
            </button>

          </div>

          {/* Right Column: 3D Cascading Stacked Deck (Adaptive for Mobile) */}
          <div 
            className="lg:col-span-7 relative w-full h-[450px] sm:h-[500px] overflow-hidden sm:overflow-visible flex items-center justify-center lg:justify-start cursor-grab active:cursor-grabbing max-w-full"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            
            {/* The Stacked Cards Container */}
            <div className="relative w-[275px] xs:w-[290px] lg:w-full h-full">
              {categories.map((category, index) => {
                // Calculate distance in circular queue from activeIndex
                const diff = (index - activeIndex + categories.length) % categories.length;

                // Cascade metrics: mobile bounds cards tightly within viewport, desktop cascades smoothly
                const xOffset = isMobile ? Math.min(diff * 10, 22) : diff * stackOffset; 
                const scale = isMobile ? Math.max(0.86, 1 - diff * 0.045) : (1 - diff * 0.045); 
                const zIndex = 50 - diff; 
                const opacity = diff === 0 ? 1 : (isMobile ? (diff <= 2 ? Math.max(0.35, 0.85 - diff * 0.25) : 0) : Math.max(0.5, 1 - diff * 0.09));

                return (
                  <div
                    key={category.id}
                    onClick={() => setActiveIndex(index)}
                    style={{
                      transform: `translateX(${xOffset}px) scale(${scale})`,
                      zIndex: zIndex,
                      opacity: opacity,
                      transformOrigin: isMobile ? 'center center' : 'left center',
                      transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                      pointerEvents: diff === 0 || !isMobile ? 'auto' : 'none'
                    }}
                    className={`absolute top-0 left-0 w-[270px] xs:w-[285px] sm:w-[290px] lg:w-[305px] h-[430px] sm:h-[470px] bg-white rounded-3xl border p-4 sm:p-6 flex flex-col justify-between shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] transition-shadow duration-300 ${
                      diff === 0 
                        ? 'border-[#367C8E]/50 shadow-[0_25px_60px_-10px_rgba(54,124,142,0.18)] cursor-default' 
                        : 'border-[#B2D8E2]/60 hover:border-[#367C8E]/40 hover:shadow-lg cursor-pointer'
                    }`}
                  >
                    
                    {/* Top Row: Index number (e.g. 01 / 06) */}
                    <div className="flex justify-end items-center">
                      <span className="font-mono text-[11px] font-bold text-[#367C8E]">
                        {category.number}
                      </span>
                    </div>

                    {/* Card Header: Big Circular Dark Badge + Title + Divider */}
                    <div className="flex flex-col items-center text-center mt-1">
                      
                      {/* Big Circle Icon Badge */}
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#367C8E] text-white flex items-center justify-center shadow-lg shadow-[#367C8E]/25 mb-3.5">
                        <CategoryHeroIcon id={category.id} />
                      </div>

                      {/* Card Category Title */}
                      <h3 className="font-display font-bold text-base sm:text-lg text-zinc-950 tracking-tight mb-2">
                        {category.title}
                      </h3>

                      {/* Subtle Short Divider Line */}
                      <div className="w-8 h-[1.5px] bg-[#367C8E]/40 rounded-full" />
                    </div>

                    {/* Skill Icons Grid: 3 columns x 2 rows matching reference mockup */}
                    <div className="grid grid-cols-3 gap-y-4 gap-x-2 my-auto pt-3">
                      {category.skills.map((skill, sIndex) => (
                        <div key={skill.name || sIndex} className="flex flex-col items-center text-center group/item">
                          
                          {/* Circular Skill Disc - Clean backdrop to showcase colorful icons */}
                          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-white border border-zinc-200/80 flex items-center justify-center shadow-xs mb-1.5 transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-md group-hover/item:border-zinc-400">
                            <SkillIconRenderer 
                              skill={skill.raw} 
                              className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full" 
                              fallbackText={skill.name} 
                            />
                          </div>

                          {/* Skill Label */}
                          <span className="text-[10px] sm:text-[11px] font-medium text-zinc-700 tracking-tight leading-tight px-0.5">
                            {skill.name}
                          </span>

                        </div>
                      ))}
                    </div>

                    {/* Subtle bottom edge indicator */}
                    <div className="h-1 w-8 mx-auto bg-zinc-100 rounded-full" />

                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
