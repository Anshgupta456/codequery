# Anshika Gupta — Modern Full-Stack Portfolio & Dynamic CMS

A minimal, high-performance personal portfolio and dynamic Content Management System (CMS) built with the MERN stack. Every section (Profile, Experience, Projects, Skills, Education, Achievements, and Contact Messages) is managed dynamically in real-time through a private Admin Dashboard.

---

## ✨ Features

### 🌐 Public Website
- **Developer-Forward Editorial Design**: Confident typography, sleek monochrome palette with subtle ambient glow accents, and responsive layout.
- **3D Cascading Skills Deck**: Interactive fanned card stack with real-time responsive spacing, smooth pointer-swiping, and high-fidelity colorful tech stack icons.
- **Projects Showcase**: Grid of featured work with live demo/GitHub repository links, tag filters, and a dedicated **All Projects** explorer.
- **Experience & Education Timelines**: Detailed career milestones, responsibilities, and academic background.
- **Contact & Inbox System**: Direct visitor inquiry form that validates submissions and saves them immediately to MongoDB.
- **One-Click Resume**: Integrated, resilient PDF delivery that opens cleanly in all browser PDF viewers.

### ⚡ Private Admin Dashboard (`/admin/login`)
- **Secure JWT Authentication**: Protected routes with token-based session management.
- **Modern Dark & Yellow UI**: Purpose-built admin interface tailored for rapid content updates.
- **Manage Profile**: Edit headline, biography, avatars, social links, and upload updated resume PDFs.
- **Manage Projects**: Create, edit, reorder, delete, and toggle featured projects.
- **Manage Skills**: Organize skill categories and pick from an extensive library of authentic, colorful tech stack SVGs or upload custom SVGs.
- **Manage Experience & Education**: Add and update timeline cards with bullet points and dates.
- **Messages Inbox**: Review contact inquiries, view sender details, toggle read status, and manage incoming messages.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React, Axios |
| **Backend** | Node.js, Express.js, Mongoose, JWT, Multer, Cors |
| **Database** | MongoDB Atlas (Managed Cloud) |
| **Media / Storage** | Cloudinary (CDN) + Resilient Local Storage |
| **Tooling** | Concurrently, Nodemon, ESLint |

---

## 📁 Repository Structure

```text
portfolio/
├── client/                     # Frontend (React + Vite + Tailwind)
│   ├── public/                 # Static assets, fallback resume, icons
│   └── src/
│       ├── components/
│       │   ├── admin/          # Admin UI, SVG picker, sidebar, forms
│       │   └── public/         # Hero, Skills, Projects, Navbar, Footer
│       ├── context/            # AuthContext, PortfolioContext
│       ├── pages/
│       │   ├── admin/          # Dashboard, ManageProjects, ManageProfile...
│       │   └── public/         # Home, AllProjects
│       └── services/           # Axios API services
│
├── server/                     # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/             # MongoDB and Cloudinary config
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Auth (JWT) & Upload (Multer) middleware
│   │   ├── models/             # Mongoose schemas (Profile, Project, Skill...)
│   │   ├── routes/             # REST API endpoints
│   │   └── utils/              # Seed data & verification helpers
│   ├── server.js               # Express application entrypoint
│   └── .env                    # Environment variables (private)
│
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.x or higher recommended)
- **npm** (v9.x or higher)
- **MongoDB Atlas** database URI
- **Cloudinary** account (Cloud name, API Key, API Secret)

---

### 2. Clone the Repository
```bash
git clone https://github.com/Anshgupta456/portfolio_anshika.git
cd portfolio_anshika
```

---

### 3. Install Dependencies
Install all root, backend, and frontend dependencies with one command:
```bash
npm run install:all
```
*(Or manually run `npm install` inside both `/server` and `/client`)*.

---

### 4. Configure Environment Variables
Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Initial Admin Credentials (used during auto-seed)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

---

### 5. Run the Application in Development
Launch both the backend API and frontend dev server simultaneously from the root:
```bash
npm run dev
```

- **Public Website**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **Admin Login**: `http://localhost:5173/admin/login`

---

## 🔑 Available Scripts

From the repository root:
- `npm run dev`: Starts both backend (`localhost:5000`) and client (`localhost:5173`) concurrently with live reload.
- `npm run dev:server`: Starts only the Express backend server with nodemon.
- `npm run dev:client`: Starts only the Vite React frontend.
- `npm run build:client`: Compiles and bundles the frontend for production into `client/dist`.
- `npm run seed`: Seeds the database with default profile, project, and skill records.

---

## 🛡️ Admin Portal Access
The Admin Portal is intentionally unlinked from public navigation to keep it private:
- Navigate to: `http://localhost:5173/admin/login` (or `yourdomain.com/admin/login`)
- Log in using your configured `ADMIN_USERNAME` and `ADMIN_PASSWORD`.

---

## 🚢 Deployment Architecture

This project is optimized for deployment on a single cloud VM (e.g. AWS EC2, DigitalOcean Droplet, or Ubuntu VPS):
- **Frontend**: Built via `npm run build:client` and served statically via **Nginx**.
- **Backend**: Kept alive on port `5000` with **PM2** (`pm2 start server.js`).
- **Nginx Reverse Proxy**:
  - `/` → Serves React static files (`client/dist`).
  - `/api/*` and `/uploads/*` → Proxies to Express on `http://localhost:5000`.
- **Database**: Cloud-hosted on **MongoDB Atlas**.
- **SSL**: Free SSL certificate automated via **Let's Encrypt (Certbot)**.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
