import React from 'react';

// Comprehensive, authentic full-color SVG presets for popular tech stacks
export const TECH_ICON_PRESETS = [
  {
    id: 'react',
    name: 'React.js',
    keywords: ['react', 'reactjs', 'react.js', 'jsx'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" stroke-width="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" stroke="#61DAFB" stroke-width="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" stroke="#61DAFB" stroke-width="1.6"/><circle cx="12" cy="12" r="1.8" fill="#61DAFB"/></svg>`
  },
  {
    id: 'next',
    name: 'Next.js',
    keywords: ['next', 'nextjs', 'next.js'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" fill="#000000" stroke="#333" stroke-width="1"/><path d="M7 7.5v9h2.2v-4.8l5.8 4.8h2V7.5h-2.2v4.8L9 7.5H7z" fill="#FFFFFF"/></svg>`
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    keywords: ['js', 'javascript', 'es6', 'ecmascript'],
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#F7DF1E"/><path d="M7 11v6c0 1.2.7 2 1.9 2 .8 0 1.4-.3 1.8-.7l-.8-1.2c-.3.3-.6.4-1 .4-.5 0-.7-.3-.7-.9V11H7zm6 3.8c0-1.8 1.4-2.8 3.3-2.8 1.1 0 1.9.3 2.5.7l-.8 1.3c-.5-.3-1-.5-1.7-.5-.9 0-1.4.4-1.4 1.1 0 .6.4 1 1.6 1.4 1.8.6 2.6 1.4 2.6 2.8 0 1.9-1.5 2.9-3.6 2.9-1.3 0-2.3-.4-3-1l.9-1.3c.6.4 1.3.7 2.1.7 1 0 1.6-.4 1.6-1.1 0-.7-.4-1.1-1.6-1.5-1.6-.6-2.5-1.4-2.5-2.6z" fill="#000000"/></svg>`
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    keywords: ['ts', 'typescript'],
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#3178C6"/><path d="M5.5 10h6v1.5H9.3v6.5H7.7v-6.5H5.5V10zm8 3.8c0-1.8 1.4-2.8 3.3-2.8 1.1 0 1.9.3 2.5.7l-.8 1.3c-.5-.3-1-.5-1.7-.5-.9 0-1.4.4-1.4 1.1 0 .6.4 1 1.6 1.4 1.8.6 2.6 1.4 2.6 2.8 0 1.9-1.5 2.9-3.6 2.9-1.3 0-2.3-.4-3-1l.9-1.3c.6.4 1.3.7 2.1.7 1 0 1.6-.4 1.6-1.1 0-.7-.4-1.1-1.6-1.5-1.6-.6-2.5-1.4-2.5-2.6z" fill="#FFFFFF"/></svg>`
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    keywords: ['tailwind', 'tailwindcss'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C10.335 13.382 8.974 12 6.001 12z" fill="#06B6D4"/></svg>`
  },
  {
    id: 'html5',
    name: 'HTML5',
    keywords: ['html', 'html5'],
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 2l1.9 17.5L12 22l7.1-2.5L21 2H3z" fill="#E34F26"/><path d="M12 3.8v16.3l5.5-1.9L19 3.8H12z" fill="#EF652A"/><path d="M6.5 6.8h11l-.3 2.6H9.4l.2 2.6h7.3l-.6 6.3-4.3 1.2-4.3-1.2-.3-3.4h2.2l.2 1.8 2.2.6 2.2-.6.3-2.9H7.1l-.6-7z" fill="#FFFFFF"/></svg>`
  },
  {
    id: 'css3',
    name: 'CSS3',
    keywords: ['css', 'css3'],
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 2l1.9 17.5L12 22l7.1-2.5L21 2H3z" fill="#1572B6"/><path d="M12 3.8v16.3l5.5-1.9L19 3.8H12z" fill="#33A9DC"/><path d="M17.4 6.8H6.6l.3 2.6h8.2l-.3 2.6H7.1l.3 2.6h7.3l-.6 6.3-4.1 1.2-4.1-1.2-.2-2.3H3.6l.4 4.5L12 21l8-2.6 1-11.6h-3.6z" fill="#FFFFFF"/></svg>`
  },
  {
    id: 'node',
    name: 'Node.js',
    keywords: ['node', 'nodejs', 'node.js'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l8 4.6v9.2L12 20.4 4 15.8V6.6L12 2z" fill="#5FA04E" stroke="#339933" stroke-width="1"/><path d="M12 6.5v8" stroke="#FFFFFF" stroke-width="1.8"/><path d="M12 14.5l6-3.5" stroke="#FFFFFF" stroke-width="1.8"/><path d="M12 14.5l-6-3.5" stroke="#FFFFFF" stroke-width="1.8"/></svg>`
  },
  {
    id: 'express',
    name: 'Express.js',
    keywords: ['express', 'expressjs', 'express.js'],
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#18181B"/><text x="4" y="16" font-family="monospace" font-size="12" font-weight="900" fill="#FACC15">ex</text><circle cx="18" cy="12" r="3" fill="none" stroke="#FACC15" stroke-width="1.8"/></svg>`
  },
  {
    id: 'python',
    name: 'Python',
    keywords: ['python', 'py'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9 2c-3.6 0-3.4 1.6-3.4 1.6v1.7h3.5v.5H5.2S2 5.5 2 9.1c0 3.6 2.8 3.5 2.8 3.5h1.7v-2.4s-.1-2.9 2.8-2.9h4.8s2.7.1 2.7-2.6V4.1s.4-2.1-4.9-2.1z" fill="#3776AB"/><circle cx="7.5" cy="4.5" r=".7" fill="#FFFFFF"/><path d="M12.1 22c3.6 0 3.4-1.6 3.4-1.6v-1.7h-3.5v-.5h6.8s3.2.3 3.2-3.3c0-3.6-2.8-3.5-2.8-3.5h-1.7v2.4s.1 2.9-2.8 2.9H9.9s-2.7-.1-2.7 2.6v2.6s-.4 2.1 4.9 2.1z" fill="#FFD438"/><circle cx="16.5" cy="19.5" r=".7" fill="#000000"/></svg>`
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    keywords: ['fastapi', 'fast-api'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#009688"/><path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" fill="#FFFFFF"/></svg>`
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    keywords: ['mongo', 'mongodb', 'mongoose'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C12 2 6 8.5 6 13.5C6 17.5 8.7 21 12 22C15.3 21 18 17.5 18 13.5C18 8.5 12 2 12 2Z" fill="#13AA52"/><path d="M12 2v20c.5 0 6-3.5 6-8.5C18 8.5 12 2 12 2z" fill="#47A248"/><path d="M12 2v20" stroke="#FFFFFF" stroke-width="0.8"/></svg>`
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    keywords: ['postgres', 'postgresql', 'sql', 'psql'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#336791"/><path d="M12 4C8 4 6 7 6 11c0 4.5 3 8 6 9 3-1 6-4.5 6-9 0-4-2-7-6-7z" fill="#4169E1"/><ellipse cx="12" cy="11" rx="3.5" ry="2" fill="#FFFFFF" fill-opacity="0.3"/><circle cx="9.5" cy="10" r="0.8" fill="#FFFFFF"/><circle cx="14.5" cy="10" r="0.8" fill="#FFFFFF"/></svg>`
  },
  {
    id: 'redis',
    name: 'Redis',
    keywords: ['redis', 'cache'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8l9-5 9 5v8l-9 5-9-5V8z" fill="#DC382D"/><path d="M3 8l9 5 9-5" stroke="#FFFFFF" stroke-width="1.2"/><path d="M12 13v9" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="12" cy="8" r="1.5" fill="#FFFFFF"/></svg>`
  },
  {
    id: 'docker',
    name: 'Docker',
    keywords: ['docker', 'container', 'containers'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="10" width="3" height="3" rx="0.5" fill="#2496ED"/><rect x="7" y="10" width="3" height="3" rx="0.5" fill="#2496ED"/><rect x="11" y="10" width="3" height="3" rx="0.5" fill="#2496ED"/><rect x="7" y="6" width="3" height="3" rx="0.5" fill="#2496ED"/><rect x="11" y="6" width="3" height="3" rx="0.5" fill="#2496ED"/><rect x="15" y="10" width="3" height="3" rx="0.5" fill="#2496ED"/><path d="M2 14c1 4 6 6 13 6 4 0 6-2 7-3s-1-2-3-2c0-1-1-2-3-2H2z" fill="#2496ED"/><circle cx="19" cy="13" r="0.7" fill="#FFFFFF"/></svg>`
  },
  {
    id: 'aws',
    name: 'AWS',
    keywords: ['aws', 'amazon', 'ec2', 's3', 'lambda', 'cloud'],
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#232F3E"/><path d="M18.8 15.5c-2.4 1.8-6.1 2.7-9.5 2.7-4.6 0-8.8-1.7-12-4.6-.3-.2 0-.6.3-.4 3.1 1.7 6.9 2.8 10.9 2.8 3.1 0 6.5-.8 9.7-2.3.5-.3.9.3.6.8zm1-1.3c-.3-.4-1.9-.2-2.6 0-.2 0-.3-.2-.1-.4 1.1-.9 2.9-.6 3.1-.4.3.3.1 2.2-.9 3.2-.2.2-.3.1-.3 0 .2-.8.8-2 .8-2.4z" fill="#FF9900"/><text x="4.5" y="11" font-family="sans-serif" font-size="7" font-weight="900" fill="#FFFFFF">AWS</text></svg>`
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    keywords: ['git', 'github', 'version-control'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#F05032"/><circle cx="7" cy="7" r="2.2" fill="#FFFFFF"/><circle cx="7" cy="17" r="2.2" fill="#FFFFFF"/><circle cx="17" cy="10" r="2.2" fill="#FFFFFF"/><path d="M7 9.2v5.6M7 9.2c0 3 3.5 4.5 7.8 2.2" stroke="#FFFFFF" stroke-width="1.8"/></svg>`
  },
  {
    id: 'postman',
    name: 'Postman',
    keywords: ['postman', 'api-testing'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#FF6C37"/><circle cx="12" cy="12" r="7" stroke="#FFFFFF" stroke-width="1.8"/><path d="M12 9l3 3-3 3M9 12h6" stroke="#FFFFFF" stroke-width="1.8"/></svg>`
  },
  {
    id: 'jwt',
    name: 'JWT Auth',
    keywords: ['jwt', 'authentication', 'auth'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#000000"/><rect x="4" y="11" width="16" height="10" rx="2" fill="#D63AFF"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#D63AFF" stroke-width="2"/><circle cx="12" cy="16" r="1.5" fill="#FFFFFF"/></svg>`
  },
  {
    id: 'api',
    name: 'RESTful APIs',
    keywords: ['api', 'rest', 'restful', 'graphql'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#6366F1"/><rect x="4" y="7" width="16" height="10" rx="2" stroke="#FFFFFF" stroke-width="1.5"/><circle cx="7.5" cy="12" r="1.5" fill="#FACC15"/><circle cx="12" cy="12" r="1.5" fill="#34D399"/><circle cx="16.5" cy="12" r="1.5" fill="#60A5FA"/></svg>`
  },
  {
    id: 'openai',
    name: 'OpenAI / LLMs',
    keywords: ['openai', 'chatgpt', 'gpt', 'llm', 'ai'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#10A37F"/><circle cx="12" cy="12" r="7" stroke="#FFFFFF" stroke-width="1.6"/><path d="M12 5v14M5 12h14" stroke="#FFFFFF" stroke-width="1.6"/><circle cx="12" cy="12" r="3.2" fill="#FFFFFF"/></svg>`
  },
  {
    id: 'langchain',
    name: 'LangChain',
    keywords: ['langchain', 'agent', 'rag'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#1C3C3C"/><path d="M9 13a4 4 0 0 0 6 .4l3-3a4 4 0 0 0-5.7-5.7L11 6" stroke="#22C55E" stroke-width="2"/><path d="M15 11a4 4 0 0 0-6-.4l-3 3a4 4 0 0 0 5.7 5.7L13 18" stroke="#FACC15" stroke-width="2"/></svg>`
  },
  {
    id: 'pinecone',
    name: 'Pinecone / Vector',
    keywords: ['pinecone', 'vector', 'embeddings'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#000000"/><polygon points="12 3 21 8.5 21 15.5 12 21 3 15.5 3 8.5" stroke="#38BDF8" stroke-width="1.8"/><line x1="12" y1="21" x2="12" y2="13" stroke="#38BDF8" stroke-width="1.5"/><polyline points="21 8.5 12 13 3 8.5" stroke="#38BDF8" stroke-width="1.5"/></svg>`
  },
  {
    id: 'figma',
    name: 'Figma',
    keywords: ['figma', 'design', 'ui', 'ux'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="15.5" cy="12" r="3.5" fill="#1ABCFE"/><path d="M8.5 5A3.5 3.5 0 0 0 5 8.5 3.5 3.5 0 0 0 8.5 12H12V5H8.5z" fill="#F24E1E"/><path d="M8.5 12A3.5 3.5 0 0 0 5 15.5 3.5 3.5 0 0 0 8.5 19 3.5 3.5 0 0 0 12 15.5V12H8.5z" fill="#0ACF83"/><path d="M12 5h3.5A3.5 3.5 0 0 1 19 8.5 3.5 3.5 0 0 1 15.5 12H12V5z" fill="#FF7262"/><circle cx="12" cy="15.5" r="3.5" fill="#A259FF"/></svg>`
  },
  {
    id: 'linux',
    name: 'Linux / Unix',
    keywords: ['linux', 'ubuntu', 'unix', 'bash', 'terminal'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#FCC624"/><ellipse cx="12" cy="13" rx="5" ry="7" fill="#000000"/><circle cx="10" cy="10" r="1.5" fill="#FFFFFF"/><circle cx="14" cy="10" r="1.5" fill="#FFFFFF"/><polygon points="12 11 10 13 14 13" fill="#FFA500"/><ellipse cx="12" cy="14" rx="3" ry="4" fill="#FFFFFF"/></svg>`
  },
  {
    id: 'nginx',
    name: 'Nginx',
    keywords: ['nginx', 'reverse-proxy'],
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#009639"/><text x="2.5" y="16" font-family="sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF">NGINX</text></svg>`
  },
  {
    id: 'pm2',
    name: 'PM2 / Process',
    keywords: ['pm2', 'devops', 'process'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#2B037A"/><polygon points="6 3 18 12 6 21" fill="#22C55E"/></svg>`
  }
];

export const findPresetByKeyword = (text = '') => {
  if (!text) return null;
  const lower = text.toLowerCase().trim();
  return TECH_ICON_PRESETS.find(
    (p) => p.id === lower || p.keywords.some((kw) => lower.includes(kw))
  ) || null;
};

/**
 * Robustly extracts the <svg>...</svg> XML node, strips extraneous XML prologues/comments,
 * and ensures responsive width/height scaling while 100% preserving all original colors,
 * fills, strokes, gradients, and defs.
 */
export const extractAndCleanSvg = (rawString) => {
  if (!rawString || typeof rawString !== 'string') return null;
  const str = rawString.trim();

  // If it's an image URL, base64 data URL, or local path, return as-is
  if (
    str.startsWith('data:image') ||
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    str.startsWith('/')
  ) {
    return str;
  }

  // Find the start of <svg and end of </svg>
  const svgStartIndex = str.indexOf('<svg');
  const svgEndIndex = str.lastIndexOf('</svg>');

  if (svgStartIndex === -1 || svgEndIndex === -1) {
    return null;
  }

  // Extract from <svg to </svg>
  let cleanSvg = str.substring(svgStartIndex, svgEndIndex + 6);

  // Normalize width and height so the SVG is fluid inside its container
  cleanSvg = cleanSvg.replace(/<svg\b([^>]*)>/i, (match, attrs) => {
    let newAttrs = attrs;
    const hasViewBox = /viewBox\s*=/i.test(attrs);

    // If viewBox is missing, but numerical width/height exist, synthesize a viewBox
    if (!hasViewBox) {
      const widthMatch = attrs.match(/width=["'](\d+)(?:px)?["']/i);
      const heightMatch = attrs.match(/height=["'](\d+)(?:px)?["']/i);
      if (widthMatch && heightMatch) {
        newAttrs += ` viewBox="0 0 ${widthMatch[1]} ${heightMatch[1]}"`;
      }
    }

    // Replace hardcoded pixel width/height with 100% so it inherits container size cleanly
    newAttrs = newAttrs
      .replace(/\s+width=["'][^"']*["']/i, ' width="100%"')
      .replace(/\s+height=["'][^"']*["']/i, ' height="100%"');

    return `<svg${newAttrs}>`;
  });

  return cleanSvg;
};

// Component to render skill icon cleanly with full color preservation
export const SkillIconRenderer = ({ 
  skill, 
  className = 'w-4 h-4',
  fallbackText = ''
}) => {
  // skill can be:
  // 1) string: "React.js"
  // 2) object: { name: "React.js", icon: "react", svg: "<svg...>", imageUrl: "..." }
  const skillName = typeof skill === 'string' ? skill : (skill?.name || fallbackText || '');
  const rawSvg = typeof skill === 'object' ? (skill?.svg || skill?.imageUrl || skill?.iconUrl) : null;
  const iconId = typeof skill === 'object' ? skill?.icon : null;

  // Case 1: Custom SVG string or image URL supplied
  const cleaned = extractAndCleanSvg(rawSvg);
  if (cleaned) {
    if (cleaned.startsWith('http') || cleaned.startsWith('data:image') || cleaned.startsWith('/')) {
      return (
        <img
          src={cleaned}
          alt={skillName}
          className={`object-contain shrink-0 ${className}`}
          loading="lazy"
        />
      );
    }
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full ${className}`}
        dangerouslySetInnerHTML={{ __html: cleaned }}
      />
    );
  }

  // Case 2: Icon preset ID specified or auto-matched from colorful presets library
  const preset = (iconId && TECH_ICON_PRESETS.find((p) => p.id === iconId)) || findPresetByKeyword(skillName);
  if (preset) {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full ${className}`}
        dangerouslySetInnerHTML={{ __html: preset.svg }}
      />
    );
  }

  // Case 3: Clean minimal fallback bullet
  return (
    <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
  );
};
