// Initial seed data matching Anshika Gupta's resume and portfolio specifications
export const initialProfile = {
  name: "Anshika Gupta",
  title: "Software Engineer",
  headline: "I build modern web applications with a focus on clean code, great user experiences, and real impact.",
  summary: "Software Engineer with hands-on experience developing scalable full-stack web applications, RESTful APIs, and responsive user interfaces. Passionate about solving real-world challenges through elegant, maintainable code and modern architectural patterns.",
  email: "anshikagupta.work@gmail.com",
  phone: "+91 98765 43210",
  location: "New Delhi / Remote, India",
  github: "https://github.com/anshikagupta",
  linkedin: "https://linkedin.com/in/anshikagupta",
  twitter: "https://x.com/anshikagupta",
  leetcode: "https://leetcode.com/anshikagupta",
  codeforces: "https://codeforces.com/profile/anshikagupta",
  resumeFileUrl: "/Anshika_Gupta_Resume.pdf",
  profileImageUrl: "/anshika_bnw.png",
  colorImageUrl: "/anshika_col.png",
  yearsExperience: "2+",
  projectsCompleted: "12+",
  contributions: "500+"
};

export const initialProjectCategories = [
  { id: "cat-1", name: "Full Stack", order: 1 },
  { id: "cat-2", name: "Frontend", order: 2 },
  { id: "cat-3", name: "Backend", order: 3 },
  { id: "cat-4", name: "AI & ML", order: 4 }
];

export const initialProjects = [
  {
    id: "proj-1",
    title: "Paawani Healthcare Portal",
    description: "Production web platform serving patients, healthcare providers, and administrative staff with real-time appointment booking, records, and billing.",
    bulletPoints: [
      "Engineered full-stack healthcare management system handling 1,000+ monthly patient visits and digital health records.",
      "Implemented secure JWT authentication and role-based access control for doctors, patients, and clinic administrators.",
      "Optimized database indexing and queries, cutting patient search and appointment scheduling latency by 45%."
    ],
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    category: "Full Stack",
    liveLink: "https://paawanigroup.com",
    githubLink: "https://github.com/anshikagupta/paawani-healthcare",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    featured: true,
    order: 1
  },
  {
    id: "proj-2",
    title: "Tehri District Administrative Dashboard",
    description: "Official public administrative portal and monitoring dashboard for Tehri Garhwal district civil governance operations.",
    bulletPoints: [
      "Built responsive civic portal and internal grievance tracker for district administrative departments.",
      "Designed dynamic analytics dashboard for monitoring regional infrastructure projects, citizen grievances, and welfare schemes.",
      "Integrated automated email/SMS status notifications and bilingual interface support (Hindi & English)."
    ],
    techStack: ["React.js", "REST APIs", "Node.js", "PostgreSQL", "Tailwind CSS"],
    category: "Frontend",
    liveLink: "https://tehri.nic.in",
    githubLink: "https://github.com/anshikagupta/tehri-governance",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
    featured: true,
    order: 2
  },
  {
    id: "proj-3",
    title: "ChatPDF — Intelligent Doc Assistant",
    description: "AI-augmented document intelligence application enabling conversational semantic search and querying over uploaded PDF reports.",
    bulletPoints: [
      "Built vector embedding pipeline with LangChain and OpenAI embeddings to enable high-accuracy semantic document search.",
      "Designed intuitive, minimalist chat workspace with streaming citations and page-referenced responses.",
      "Handled multi-document concurrent processing with persistent chat session histories in MongoDB."
    ],
    techStack: ["Next.js", "TypeScript", "Python", "FastAPI", "OpenAI API", "Pinecone"],
    category: "AI & ML",
    liveLink: "https://chatpdf-demo.vercel.app",
    githubLink: "https://github.com/anshikagupta/chatpdf-ai",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    featured: true,
    order: 3
  },
  {
    id: "proj-4",
    title: "CodeSnippet Vault & Collaboration",
    description: "Cloud-native developer snippet manager with real-time syntax highlighting, tags, versioning, and team sharing.",
    bulletPoints: [
      "Architected real-time snippet sharing platform with instant markdown preview and 40+ language syntax highlights.",
      "Built instant fuzzy search with client-side indexing for microsecond query response across thousands of snippets."
    ],
    techStack: ["React.js", "Express.js", "MongoDB", "Docker", "PrismJS"],
    category: "Backend",
    liveLink: "https://snippetvault.io",
    githubLink: "https://github.com/anshikagupta/code-snippet-vault",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    featured: false,
    order: 4
  }
];

export const initialExperience = [
  {
    id: "exp-1",
    company: "Paawani Group",
    role: "Full Stack Software Engineer",
    location: "Noida / Hybrid, India",
    startDate: "2024-01",
    endDate: "",
    isCurrent: true,
    bulletPoints: [
      "Spearheaded development of core web platforms, streamlining operations across multiple business divisions.",
      "Designed and deployed 15+ secure RESTful API micro-endpoints using Express.js and MongoDB with 99.9% uptime.",
      "Led client-side performance audits, decreasing first-contentful-paint (FCP) by 35% through code splitting and asset pipeline optimizations.",
      "Collaborated with cross-functional design and product leads to ship responsive, accessible UI features."
    ],
    order: 1
  },
  {
    id: "exp-2",
    company: "Tehri District Administration",
    role: "Software Engineering Intern / Consultant",
    location: "Uttarakhand, India",
    startDate: "2023-05",
    endDate: "2023-12",
    isCurrent: false,
    bulletPoints: [
      "Contributed to the digitalization of citizen grievance ticketing and administrative workflow tracking.",
      "Built administrative forms and data validation pipelines cutting grievance processing turn-around time by 30%.",
      "Drafted technical documentation, user training manuals, and conducted onboarding sessions for 40+ civil staff members."
    ],
    order: 2
  }
];

export const initialSkills = [
  {
    id: "skill-1",
    category: "Languages",
    items: ["JavaScript (ES6+)", "TypeScript", "Python", "HTML5", "CSS3 / Sass", "SQL"],
    order: 1
  },
  {
    id: "skill-2",
    category: "Frontend",
    items: ["React.js", "Next.js", "Tailwind CSS", "Redux Toolkit", "Vite", "Responsive Design", "Web Accessibility (a11y)"],
    order: 2
  },
  {
    id: "skill-3",
    category: "Backend & APIs",
    items: ["Node.js", "Express.js", "RESTful APIs", "GraphQL Basics", "Authentication (JWT / OAuth)", "Middleware Architecture"],
    order: 3
  },
  {
    id: "skill-4",
    category: "Databases & Storage",
    items: ["MongoDB / Mongoose", "PostgreSQL", "MySQL", "Redis (Caching)", "Cloudinary"],
    order: 4
  },
  {
    id: "skill-5",
    category: "Tools & DevOps",
    items: ["Git & GitHub", "Docker", "Postman", "Linux / Bash", "AWS (EC2, S3)", "Nginx", "CI/CD Actions"],
    order: 5
  },
  {
    id: "skill-6",
    category: "AI-Augmented Development",
    items: ["LangChain", "OpenAI APIs", "Vector Databases", "Prompt Engineering", "AI Coding Workflows"],
    order: 6
  }
];

export const initialEducation = [
  {
    id: "edu-1",
    degree: "Bachelor of Technology in Computer Science & Engineering",
    institution: "Graphic Era Hill University",
    location: "Dehradun, Uttarakhand, India",
    startDate: "2020",
    endDate: "2024",
    cgpa: "8.6 / 10.0",
    order: 1
  },
  {
    id: "edu-2",
    degree: "Senior Secondary (Class XII) — PCM",
    institution: "Central Board of Secondary Education (CBSE)",
    location: "India",
    startDate: "2018",
    endDate: "2020",
    cgpa: "91.4%",
    order: 2
  }
];

export const initialAchievements = [
  {
    id: "ach-1",
    title: "1st Place — National Level Smart India Hackathon Internal Round",
    description: "Built an AI-assisted disaster management tracking prototype for emergency civic response teams.",
    date: "2023-09",
    link: "https://sih.gov.in",
    order: 1
  },
  {
    id: "ach-2",
    title: "LeetCode 300+ Problems Solved & Knight Contender",
    description: "Consistent problem solver across Data Structures & Algorithms, Graph theory, Dynamic Programming.",
    date: "2024-02",
    link: "https://leetcode.com",
    order: 2
  },
  {
    id: "ach-3",
    title: "Merit Scholarship for Academic Excellence",
    description: "Awarded university scholarship for consistent top-percentile academic standing in Computer Science.",
    date: "2021 - 2024",
    link: "",
    order: 3
  }
];

export const initialMessages = [
  {
    id: "msg-1",
    name: "Rohan Sharma",
    email: "rohan.sharma@techlead.co",
    message: "Hi Anshika, loved your portfolio and work on Paawani Healthcare. We have a Full Stack Software Engineer role open at our startup and would love to chat!",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
  },
  {
    id: "msg-2",
    name: "Dr. Arvind Mehta",
    email: "arvind@healthventures.org",
    message: "Great interface design on your recent projects. Are you open to freelance consulting for an EHR integration prototype next month?",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString()
  },
  {
    id: "msg-3",
    name: "Priya Nair",
    email: "priya.nair@recruitment-partner.io",
    message: "Hello Anshika, reviewing your GitHub repositories and impressed by your clean code structure. Let's connect on LinkedIn.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
  }
];
