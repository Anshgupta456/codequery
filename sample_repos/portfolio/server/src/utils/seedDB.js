const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../models/Admin');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Skill = require('../models/Skill');
const Education = require('../models/Education');
const Achievement = require('../models/Achievement');
const Message = require('../models/Message');

const seedData = {
  admin: {
    username: 'admin',
    password: 'admin123',
    name: 'Anshika Gupta',
    role: 'Administrator'
  },
  profile: {
    name: 'Anshika Gupta',
    title: 'Software Engineer',
    headline: 'I build scalable, modern web applications with clean code, robust architectures, and great user experiences.',
    summary: 'Software Engineer with hands-on experience designing and developing scalable full-stack web applications, RESTful APIs, and responsive user interfaces. Passionate about solving real-world challenges through elegant, maintainable code and modern architectural patterns.',
    email: 'anshikagupta.work@gmail.com',
    phone: '+91 98765 43210',
    location: 'Dehradun / Remote, India',
    github: 'https://github.com/anshikagupta',
    linkedin: 'https://linkedin.com/in/anshikagupta',
    twitter: 'https://x.com/anshikagupta',
    leetcode: 'https://leetcode.com/anshikagupta',
    codeforces: 'https://codeforces.com/profile/anshikagupta',
    resumeFileUrl: '/Anshika_Gupta_Resume.pdf',
    profileImageUrl: '/anshika_bnw.png',
    colorImageUrl: '/anshika_col.png',
    yearsExperience: '2+',
    projectsCompleted: '12+',
    contributions: '500+'
  },
  projects: [
    {
      title: 'Paawani Healthcare Portal',
      description: 'Production web platform serving patients, healthcare providers, and administrative staff with real-time appointment booking, digital health records, and billing.',
      bulletPoints: [
        'Engineered full-stack healthcare management system handling 1,000+ monthly patient visits and digital health records.',
        'Implemented secure JWT authentication and role-based access control (RBAC) for doctors, patients, and clinic administrators.',
        'Optimized database indexing and queries, cutting patient search and appointment scheduling latency by 45%.'
      ],
      techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
      liveLink: 'https://paawanigroup.com',
      githubLink: 'https://github.com/anshikagupta/paawani-healthcare',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
      featured: true,
      order: 1
    },
    {
      title: 'Tehri District Administrative Dashboard',
      description: 'Official public administrative portal and monitoring dashboard for Tehri Garhwal district civil governance operations.',
      bulletPoints: [
        'Built responsive civic portal and internal grievance tracker for district administrative departments.',
        'Designed dynamic analytics dashboard for monitoring regional infrastructure projects, citizen grievances, and welfare schemes.',
        'Integrated automated email/SMS status notifications and bilingual interface support (Hindi & English).'
      ],
      techStack: ['React.js', 'REST APIs', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      liveLink: 'https://tehri.nic.in',
      githubLink: 'https://github.com/anshikagupta/tehri-governance',
      imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
      featured: true,
      order: 2
    },
    {
      title: 'ChatPDF — Intelligent Doc Assistant',
      description: 'AI-augmented document intelligence application enabling conversational semantic search and querying over uploaded PDF reports.',
      bulletPoints: [
        'Built vector embedding pipeline with LangChain and OpenAI embeddings to enable high-accuracy semantic document search.',
        'Designed intuitive, minimalist chat workspace with streaming citations and page-referenced responses.',
        'Handled multi-document concurrent processing with persistent chat session histories in MongoDB.'
      ],
      techStack: ['Next.js', 'TypeScript', 'Python', 'FastAPI', 'OpenAI API', 'Pinecone'],
      liveLink: 'https://chatpdf-demo.vercel.app',
      githubLink: 'https://github.com/anshikagupta/chatpdf-ai',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      featured: true,
      order: 3
    },
    {
      title: 'CodeSnippet Vault & Collaboration',
      description: 'Cloud-native developer snippet manager with real-time syntax highlighting, tags, versioning, and team sharing.',
      bulletPoints: [
        'Architected real-time snippet sharing platform with instant markdown preview and 40+ language syntax highlights.',
        'Built instant fuzzy search with client-side indexing for microsecond query response across thousands of snippets.'
      ],
      techStack: ['React.js', 'Express.js', 'MongoDB', 'Docker', 'PrismJS'],
      liveLink: 'https://snippetvault.io',
      githubLink: 'https://github.com/anshikagupta/code-snippet-vault',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      featured: false,
      order: 4
    }
  ],
  experience: [
    {
      company: 'Paawani Group',
      role: 'Software Engineer',
      location: 'India',
      startDate: '2024 — Present',
      endDate: '',
      isCurrent: true,
      bulletPoints: [
        'Architected and deployed full-stack web platforms using React.js, Node.js, Express, and MongoDB, supporting production workloads with 99.9% uptime.',
        'Engineered secure RESTful APIs with JWT authentication, custom role-based access control (RBAC), and optimized database indexing.',
        'Automated cloud deployment pipelines on AWS EC2 with Nginx reverse proxy, PM2 process management, and SSL security via Let’s Encrypt.',
        'Adopted modern AI-augmented engineering workflows to accelerate delivery velocity, refactor legacy modules, and maintain high test coverage.'
      ],
      order: 1
    },
    {
      company: 'DCodePro Software Solutions',
      role: 'Software Engineering Intern',
      location: 'India',
      startDate: '2023',
      endDate: '2024',
      isCurrent: false,
      bulletPoints: [
        'Developed interactive, responsive user interfaces and administrative dashboards using React.js, Tailwind CSS, and modern JavaScript (ES6+).',
        'Implemented end-to-end API integrations, form validation pipelines, and state management solutions for seamless user journeys.',
        'Collaborated in an agile sprint team, participating in regular code reviews, bug triaging, and performance profiling.',
        'Reduced client dashboard bundle size and optimized UI render performance across multiple viewport breakpoints.'
      ],
      order: 2
    },
    {
      company: 'Tehri District Administration',
      role: 'Software Developer Intern',
      location: 'Tehri Garhwal, Uttarakhand, India',
      startDate: '2023',
      endDate: '2023',
      isCurrent: false,
      bulletPoints: [
        'Contributed to the development and maintenance of administrative web portals and civic service management systems.',
        'Assisted in relational database modeling, structured query optimization, and digitizing legacy departmental records.',
        'Collaborated with administrative stakeholders to gather operational requirements and deliver accessible, user-friendly digital tools.',
        'Ensured high data integrity, reliability, and security compliance for public-sector data management workflows.'
      ],
      order: 3
    }
  ],
  skills: [
    {
      category: 'Frontend & UI',
      items: ['React.js', 'Next.js', 'JavaScript (ES6+)', 'TypeScript', 'Tailwind CSS', 'HTML5 & CSS3', 'Framer Motion'],
      order: 1
    },
    {
      category: 'Backend & APIs',
      items: ['Node.js', 'Express.js', 'RESTful APIs', 'JWT Authentication', 'Python', 'FastAPI', 'Microservices'],
      order: 2
    },
    {
      category: 'Databases',
      items: ['MongoDB (Mongoose)', 'PostgreSQL', 'MySQL', 'Redis', 'Database Indexing', 'Aggregation Pipelines'],
      order: 3
    },
    {
      category: 'Cloud, DevOps & Tools',
      items: ['AWS (EC2, S3)', 'Docker', 'Nginx Reverse Proxy', 'Git & GitHub', 'Postman', 'PM2 Process Manager', 'CI/CD Pipelines'],
      order: 4
    },
    {
      category: 'AI-Augmented Development',
      items: ['LangChain', 'OpenAI APIs', 'Vector Embeddings', 'Pinecone', 'AI Prompt Engineering', 'Cursor & Copilot Workflows'],
      order: 5
    }
  ],
  education: [
    {
      degree: 'Bachelor of Technology (B.Tech)',
      institution: 'Graphic Era Hill University',
      location: 'Dehradun, Uttarakhand, India',
      startDate: '2020',
      endDate: '2024',
      cgpa: '8.7 / 10',
      order: 1
    },
    {
      degree: 'Senior Secondary (Class XII)',
      institution: 'Central Board of Secondary Education (CBSE)',
      location: 'India',
      startDate: '2018',
      endDate: '2020',
      cgpa: '92.4%',
      order: 2
    },
    {
      degree: 'Secondary School (Class X)',
      institution: 'Central Board of Secondary Education (CBSE)',
      location: 'India',
      startDate: '2016',
      endDate: '2018',
      cgpa: '93.6%',
      order: 3
    }
  ],
  achievements: [
    {
      title: 'Smart India Hackathon Finalist',
      description: 'Built a collaborative resource-sharing portal under government problem statements with real-time tracking.',
      date: '2023',
      link: '',
      order: 1
    },
    {
      title: '500+ LeetCode & Coding Problems Solved',
      description: 'Demonstrated strong algorithmic foundations, data structures mastery, and problem-solving discipline.',
      date: '2024',
      link: 'https://leetcode.com',
      order: 2
    }
  ],
  messages: [
    {
      name: 'Welcome Inquiry',
      email: 'recruiter@techventures.io',
      message: 'Hi Anshika! Impressed by your full-stack projects and technical background. We would love to discuss a Software Engineering opportunity with our team.',
      isRead: false
    }
  ]
};

const autoSeedIfEmpty = async () => {
  try {
    // 1. Check Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(seedData.admin.password, salt);
      await Admin.create({
        username: seedData.admin.username,
        passwordHash: hash,
        name: seedData.admin.name,
        role: seedData.admin.role
      });
      console.log('🌱 Admin user seeded: admin / admin123');
    }

    // 2. Check Profile
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      await Profile.create(seedData.profile);
      console.log('🌱 Profile information seeded');
    }

    // 3. Check Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(seedData.projects);
      console.log(`🌱 Seeded ${seedData.projects.length} projects`);
    }

    // 4. Check Experience
    const experienceCount = await Experience.countDocuments();
    if (experienceCount === 0) {
      await Experience.insertMany(seedData.experience);
      console.log(`🌱 Seeded ${seedData.experience.length} experiences`);
    }

    // 5. Check Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany(seedData.skills);
      console.log(`🌱 Seeded ${seedData.skills.length} skill categories`);
    }

    // 6. Check Education
    const educationCount = await Education.countDocuments();
    if (educationCount === 0) {
      await Education.insertMany(seedData.education);
      console.log(`🌱 Seeded ${seedData.education.length} education records`);
    }

    // 7. Check Achievements
    const achievementCount = await Achievement.countDocuments();
    if (achievementCount === 0) {
      await Achievement.insertMany(seedData.achievements);
      console.log(`🌱 Seeded ${seedData.achievements.length} achievements`);
    }

    // 8. Check Messages
    const messageCount = await Message.countDocuments();
    if (messageCount === 0) {
      await Message.insertMany(seedData.messages);
      console.log(`🌱 Seeded ${seedData.messages.length} demo message`);
    }

    console.log('✨ Database verification & auto-seed completed.');
  } catch (err) {
    console.error('⚠️ Auto-seed error:', err.message);
  }
};

const runSeedScript = async () => {
  const dns = require('dns');
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {}

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is missing from .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for explicit seeding...');

    // Clear existing data if --force flag passed
    if (process.argv.includes('--force')) {
      console.log('Clearing existing collections (--force detected)...');
      await Promise.all([
        Admin.deleteMany({}),
        Profile.deleteMany({}),
        Project.deleteMany({}),
        Experience.deleteMany({}),
        Skill.deleteMany({}),
        Education.deleteMany({}),
        Achievement.deleteMany({}),
        Message.deleteMany({})
      ]);
    }

    await autoSeedIfEmpty();
    console.log('🚀 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error running seed script:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  runSeedScript();
}

module.exports = { autoSeedIfEmpty, seedData };
