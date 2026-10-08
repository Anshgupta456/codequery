const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../../.env' });

const Admin = require('../models/Admin');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Skill = require('../models/Skill');
const Education = require('../models/Education');
const Achievement = require('../models/Achievement');
const Message = require('../models/Message');

const seedAll = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ Cannot seed: MONGO_URI is missing in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB. Clearing existing collections...');

    await Promise.all([
      Admin.deleteMany(),
      Profile.deleteMany(),
      Project.deleteMany(),
      Experience.deleteMany(),
      Skill.deleteMany(),
      Education.deleteMany(),
      Achievement.deleteMany(),
      Message.deleteMany()
    ]);

    console.log('Seeding initial Admin credentials...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);
    await Admin.create({
      username: 'admin',
      passwordHash,
      name: 'Anshika Gupta',
      role: 'Administrator'
    });

    console.log('Seeding Profile...');
    await Profile.create({
      name: 'Anshika Gupta',
      title: 'Software Engineer',
      headline: 'I build modern web applications with a focus on clean code, great user experiences, and real impact.',
      summary: 'Software Engineer with hands-on experience developing scalable full-stack web applications, RESTful APIs, and responsive user interfaces. Passionate about solving real-world challenges through elegant, maintainable code.',
      email: 'anshikagupta.work@gmail.com',
      phone: '+91 98765 43210',
      location: 'New Delhi / Remote, India',
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
    });

    console.log('Seeding Projects...');
    await Project.insertMany([
      {
        title: 'Paawani Healthcare Portal',
        description: 'Production web platform serving patients, healthcare providers, and administrative staff with real-time appointment booking, records, and billing.',
        bulletPoints: [
          'Engineered full-stack healthcare management system handling 1,000+ monthly patient visits and digital health records.',
          'Implemented secure JWT authentication and role-based access control for doctors, patients, and clinic administrators.',
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
    ]);

    console.log('Seeding Experience...');
    await Experience.insertMany([
      {
        company: 'Paawani Group',
        role: 'Full Stack Software Engineer',
        location: 'Noida / Hybrid, India',
        startDate: 'Jan 2024',
        endDate: '',
        isCurrent: true,
        bulletPoints: [
          'Spearheaded development of core web platforms, streamlining operations across multiple business divisions.',
          'Designed and deployed 15+ secure RESTful API micro-endpoints using Express.js and MongoDB with 99.9% uptime.',
          'Led client-side performance audits, decreasing first-contentful-paint (FCP) by 35% through code splitting and asset pipeline optimizations.'
        ],
        order: 1
      },
      {
        company: 'Tehri District Administration',
        role: 'Software Engineering Intern / Consultant',
        location: 'Uttarakhand, India',
        startDate: 'May 2023',
        endDate: 'Dec 2023',
        isCurrent: false,
        bulletPoints: [
          'Contributed to the digitalization of citizen grievance ticketing and administrative workflow tracking.',
          'Built administrative forms and data validation pipelines cutting grievance processing turn-around time by 30%.',
          'Drafted technical documentation, user training manuals, and conducted onboarding sessions for 40+ civil staff members.'
        ],
        order: 2
      }
    ]);

    console.log('Seeding Skills...');
    await Skill.insertMany([
      {
        category: 'Languages',
        items: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'HTML5', 'CSS3 / Sass', 'SQL'],
        order: 1
      },
      {
        category: 'Frontend',
        items: ['React.js', 'Next.js', 'Tailwind CSS', 'Redux Toolkit', 'Vite', 'Responsive Design'],
        order: 2
      },
      {
        category: 'Backend & APIs',
        items: ['Node.js', 'Express.js', 'RESTful APIs', 'GraphQL Basics', 'Authentication (JWT / OAuth)', 'Middleware Architecture'],
        order: 3
      },
      {
        category: 'Databases & Storage',
        items: ['MongoDB / Mongoose', 'PostgreSQL', 'MySQL', 'Redis (Caching)', 'Cloudinary'],
        order: 4
      },
      {
        category: 'Tools & DevOps',
        items: ['Git & GitHub', 'Docker', 'Postman', 'Linux / Bash', 'AWS (EC2, S3)', 'Nginx', 'CI/CD Actions'],
        order: 5
      },
      {
        category: 'AI-Augmented Development',
        items: ['LangChain', 'OpenAI APIs', 'Vector Databases', 'Prompt Engineering', 'AI Coding Workflows'],
        order: 6
      }
    ]);

    console.log('Seeding Education...');
    await Education.insertMany([
      {
        degree: 'Bachelor of Technology in Computer Science & Engineering',
        institution: 'Graphic Era Hill University',
        location: 'Dehradun, Uttarakhand, India',
        startDate: '2020',
        endDate: '2024',
        cgpa: '8.6 / 10.0',
        order: 1
      },
      {
        degree: 'Senior Secondary (Class XII) — PCM',
        institution: 'Central Board of Secondary Education (CBSE)',
        location: 'India',
        startDate: '2018',
        endDate: '2020',
        cgpa: '91.4%',
        order: 2
      }
    ]);

    console.log('Seeding Achievements...');
    await Achievement.insertMany([
      {
        title: '1st Place — National Level Smart India Hackathon Internal Round',
        description: 'Built an AI-assisted disaster management tracking prototype for emergency civic response teams.',
        date: 'Sept 2023',
        link: 'https://sih.gov.in',
        order: 1
      },
      {
        title: 'LeetCode 300+ Problems Solved & Knight Contender',
        description: 'Consistent problem solver across Data Structures & Algorithms, Graph theory, Dynamic Programming.',
        date: 'Feb 2024',
        link: 'https://leetcode.com',
        order: 2
      },
      {
        title: 'Merit Scholarship for Academic Excellence',
        description: 'Awarded university scholarship for consistent top-percentile academic standing in Computer Science.',
        date: '2021 - 2024',
        link: '',
        order: 3
      }
    ]);

    console.log('Seeding Initial Messages...');
    await Message.insertMany([
      {
        name: 'Rohan Sharma',
        email: 'rohan.sharma@techlead.co',
        message: 'Hi Anshika, loved your portfolio and work on Paawani Healthcare. We have a Full Stack Software Engineer role open at our startup and would love to chat!',
        isRead: false
      },
      {
        name: 'Dr. Arvind Mehta',
        email: 'arvind@healthventures.org',
        message: 'Great interface design on your recent projects. Are you open to freelance consulting for an EHR integration prototype next month?',
        isRead: true
      }
    ]);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedAll();
}

module.exports = seedAll;
