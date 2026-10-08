# Anshika Gupta — Portfolio Website
## Project Structure & Architecture Reference Document

**Stack:** React.js (Frontend) · Node.js + Express.js (Backend) · MongoDB (Database) · JavaScript (ES6+)

**Core Requirement:** Fully dynamic, admin-manageable portfolio — no code edits or redeployment needed to update content. Every section (experience, projects, skills, achievements, etc.) is stored in the database and edited through a private Admin Dashboard.

---

## 1. High-Level Architecture

```
┌─────────────────────┐         ┌──────────────────────┐         ┌─────────────────┐
│   PUBLIC WEBSITE     │  HTTPS  │   EXPRESS.JS API      │  Driver │    MONGODB       │
│   (React - Vite)     │◄───────►│   (Node.js)           │◄───────►│  (Atlas Cloud)   │
│   Public visitors    │  REST   │   /api/v1/*           │         │                  │
└─────────────────────┘         │                       │         └─────────────────┘
                                  │                       │
┌─────────────────────┐         │   - Public routes     │
│   ADMIN DASHBOARD    │  HTTPS  │   - Protected routes  │
│   (React - same app, │◄───────►│     (JWT Auth)        │
│   /admin route,      │  REST   │   - File upload       │
│   auth-gated)        │         │     (images/resume)   │
└─────────────────────┘         └──────────────────────┘
```

**Two frontend experiences, one React app:**
- **Public site** (`/`, `/projects`, `/experience`, etc.) — reads data from API, renders content, no login needed.
- **Admin panel** (`/admin/login`, `/admin/dashboard/*`) — login-gated, lets you edit every section via forms instead of touching code.

**Monorepo layout** (recommended for a solo-maintained project):
```
anshika-portfolio/
├── client/     → React frontend (public site + admin panel)
├── server/     → Node/Express backend (API)
└── README.md
```

---

## 2. Backend Folder Structure (`/server`)

```
server/
├── src/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection (Mongoose)
│   │   └── cloudinary.js         # Image/file upload config (for project images, resume PDF, profile photo)
│   │
│   ├── models/
│   │   ├── Admin.js              # Admin login credentials (single user - you)
│   │   ├── Profile.js            # Name, title, summary, contact info, social links
│   │   ├── Education.js
│   │   ├── Experience.js
│   │   ├── Project.js
│   │   ├── Skill.js
│   │   ├── Achievement.js
│   │   └── Message.js            # Contact form submissions
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── educationController.js
│   │   ├── experienceController.js
│   │   ├── projectController.js
│   │   ├── skillController.js
│   │   ├── achievementController.js
│   │   └── messageController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── educationRoutes.js
│   │   ├── experienceRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── skillRoutes.js
│   │   ├── achievementRoutes.js
│   │   └── messageRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification for admin routes
│   │   ├── uploadMiddleware.js   # Multer config for file uploads
│   │   └── errorMiddleware.js    # Centralized error handling
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── validators.js
│   │
│   └── app.js                    # Express app setup
│
├── server.js                     # Entry point
├── .env                          # PORT, MONGO_URI, JWT_SECRET, CLOUDINARY_KEYS
└── package.json
```

---

## 3. Frontend Folder Structure (`/client`)

```
client/
├── src/
│   ├── assets/                   # Static icons/fonts (not content images — those come from DB/Cloudinary)
│   │
│   ├── components/
│   │   ├── public/                # Reusable public-site pieces
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── ExperienceCard.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── SkillBadge.jsx
│   │   │   ├── AchievementCard.jsx
│   │   │   └── ContactForm.jsx
│   │   │
│   │   ├── admin/                 # Admin-only components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── DashboardStats.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── forms/
│   │   │   │   ├── ProfileForm.jsx
│   │   │   │   ├── ExperienceForm.jsx
│   │   │   │   ├── ProjectForm.jsx
│   │   │   │   ├── SkillForm.jsx
│   │   │   │   ├── EducationForm.jsx
│   │   │   │   └── AchievementForm.jsx
│   │   │   └── tables/
│   │   │       ├── ExperienceTable.jsx
│   │   │       ├── ProjectTable.jsx
│   │   │       └── MessagesInbox.jsx
│   │   │
│   │   └── common/
│   │       ├── Loader.jsx
│   │       ├── Modal.jsx
│   │       ├── ImageUploader.jsx
│   │       └── ConfirmDialog.jsx
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.jsx           # Hero + summary + quick highlights
│   │   │   ├── About.jsx          # Summary + education
│   │   │   ├── Experience.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Achievements.jsx
│   │   │   └── Contact.jsx
│   │   │
│   │   └── admin/
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx      # Overview + message count
│   │       ├── ManageProfile.jsx
│   │       ├── ManageExperience.jsx
│   │       ├── ManageProjects.jsx
│   │       ├── ManageSkills.jsx
│   │       ├── ManageEducation.jsx
│   │       ├── ManageAchievements.jsx
│   │       └── Messages.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx        # Admin auth state (JWT stored in httpOnly cookie or memory)
│   │
│   ├── services/                  # Axios API calls, one file per resource
│   │   ├── api.js                 # Base axios instance
│   │   ├── authService.js
│   │   ├── profileService.js
│   │   ├── experienceService.js
│   │   ├── projectService.js
│   │   ├── skillService.js
│   │   └── messageService.js
│   │
│   ├── hooks/
│   │   └── useAuth.js
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx          # react-router-dom route definitions
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── vite.config.js
└── package.json
```

---

## 4. Database Schema (MongoDB Collections)

Each section of your resume becomes its own collection, editable independently from the admin panel.

### `profiles` (single document)
| Field | Type | Notes |
|---|---|---|
| name | String | "Anshika Gupta" |
| title | String | "Software Engineer" |
| summary | String | Rich text, shown on Home/About |
| phone | String | |
| email | String | |
| github | String | URL |
| linkedin | String | URL |
| resumeFileUrl | String | Uploaded via admin, downloadable button on site |
| profileImageUrl | String | |

### `education`
| Field | Type |
|---|---|
| degree | String |
| institution | String |
| location | String |
| startDate / endDate | Date |
| cgpa | String |
| order | Number (for display sorting) |

### `experiences`
| Field | Type |
|---|---|
| company | String |
| role | String |
| location | String |
| startDate / endDate | Date (endDate nullable = "Present") |
| bulletPoints | [String] |
| order | Number |

### `projects`
| Field | Type |
|---|---|
| title | String |
| description | String |
| bulletPoints | [String] |
| techStack | [String] |
| liveLink | String |
| githubLink | String |
| imageUrl | String |
| featured | Boolean |
| order | Number |

### `skills`
| Field | Type |
|---|---|
| category | String — e.g. "Languages", "Frontend", "Backend", "Tools & DevOps", "AI-Augmented Development" |
| items | [String] |
| order | Number |

### `achievements`
| Field | Type |
|---|---|
| title | String |
| description | String |
| date | Date |

### `messages` (contact form submissions)
| Field | Type |
|---|---|
| name | String |
| email | String |
| message | String |
| isRead | Boolean |
| createdAt | Date |

### `admins`
| Field | Type |
|---|---|
| username | String |
| passwordHash | String (bcrypt) |

---

## 5. API Route Map

**Base URL:** `/api/v1`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/login` | Public | Admin login → returns JWT |
| GET | `/profile` | Public | Fetch profile info |
| PUT | `/profile` | Admin | Update profile |
| GET | `/education` | Public | List education entries |
| POST/PUT/DELETE | `/education/:id` | Admin | Manage education |
| GET | `/experience` | Public | List experience entries |
| POST/PUT/DELETE | `/experience/:id` | Admin | Manage experience |
| GET | `/projects` | Public | List all projects |
| GET | `/projects/:id` | Public | Single project detail |
| POST/PUT/DELETE | `/projects/:id` | Admin | Manage projects |
| GET | `/skills` | Public | List skill categories |
| POST/PUT/DELETE | `/skills/:id` | Admin | Manage skills |
| GET | `/achievements` | Public | List achievements |
| POST/PUT/DELETE | `/achievements/:id` | Admin | Manage achievements |
| POST | `/messages` | Public | Submit contact form |
| GET | `/messages` | Admin | View inbox |
| PATCH | `/messages/:id/read` | Admin | Mark as read |
| DELETE | `/messages/:id` | Admin | Delete message |
| POST | `/upload` | Admin | Upload image/resume file (Cloudinary/S3) |

All Admin routes protected via `authMiddleware.js` (JWT in `Authorization: Bearer <token>` header).

---

## 6. Public Website Page Layout

1. **Home** — Hero (name, title, tagline), short summary, CTA buttons (View Projects / Contact / Download Resume), quick highlight stats (years experience, projects shipped, users served).
2. **About** — Full summary + education timeline.
3. **Experience** — Timeline/card layout, most recent first (Paawani Group, Tehri District Administration).
4. **Projects** — Grid of project cards; click-through to detail page with full bullet points, tech stack tags, live/GitHub links.
5. **Skills** — Grouped by category with badges (Languages, Frontend, Backend, Database, Tools & DevOps, AI-Augmented Development).
6. **Achievements** — Card/list layout with dates.
7. **Contact** — Form (name, email, message) → saved to `messages` collection; optionally email notification via Nodemailer.
8. **Footer** — Social links, quick nav, copyright.

## 7. Admin Panel Layout

- `/admin/login` — simple auth form.
- `/admin/dashboard` — overview: message count, quick links to each manager.
- `/admin/profile` — edit hero/summary/contact/social links/resume upload.
- `/admin/education` — add/edit/delete/reorder entries.
- `/admin/experience` — add/edit/delete/reorder entries with rich bullet-point editor.
- `/admin/projects` — add/edit/delete, image upload, mark "featured".
- `/admin/skills` — manage categories and items.
- `/admin/achievements` — add/edit/delete.
- `/admin/messages` — inbox view of contact form submissions.

Every list-based section (experience, projects, skills, achievements, education) supports **drag-and-drop reordering** so display order on the public site is fully controlled by you, no code changes required.

---

## 8. Authentication Flow

1. Admin logs in at `/admin/login` with username + password.
2. Backend verifies against `admins` collection (bcrypt compare) → issues JWT (short expiry, e.g. 7 days).
3. Token stored client-side (httpOnly cookie recommended over localStorage for security).
4. `ProtectedRoute.jsx` on frontend + `authMiddleware.js` on backend both guard admin access.
5. Only one admin account needed (yours) — no public registration endpoint.

---

## 9. Deployment Plan (single EC2 instance — right-sized for this scale)

Since this is a small-scale personal portfolio, everything runs on **one EC2 instance** — no S3/CloudFront needed. Simpler to manage, cheaper, and matches your existing EC2 experience.

| Component | Setup |
|---|---|
| React frontend | Built (`npm run build`) and served as static files via **Nginx** on the same EC2 instance |
| Node/Express backend | Runs on EC2 via **PM2** (process manager, keeps API alive, auto-restarts on crash) |
| Nginx | Acts as reverse proxy: `/` → frontend static build, `/api/*` → proxied to Express on `localhost:5000` |
| MongoDB | MongoDB Atlas (managed, free tier — no need to self-host on EC2) |
| Images/Resume files | Cloudinary (free tier handles this scale easily, avoids managing file storage on EC2 disk) |
| Domain/SSL | Point domain to EC2's Elastic IP → **Certbot (Let's Encrypt)** for free SSL via Nginx |

**Single-instance flow:**
```
Internet → Domain → EC2 (Elastic IP)
                      └── Nginx (port 80/443)
                            ├── / → /var/www/portfolio/client/dist (React build)
                            └── /api → proxy_pass → localhost:5000 (Express, via PM2)
```

CI/CD: GitHub Actions → SSH into EC2 → pull latest → rebuild frontend → `pm2 restart` backend. Matches your existing CI/CD workflow, just deploying to one box instead of multiple services.

*If traffic ever grows beyond what one instance handles, S3+CloudFront for the frontend is an easy later upgrade — but not needed at this stage.*

---

## 10. Branding & Theme Guide (locked in from reference design)

A minimal, monochrome, developer-forward aesthetic. Confident typography, generous white space, black-and-white photography, small code-editor-style accents.

### 10.1 Color Palette
| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-text-primary` | `#0A0A0A` | Headings, primary text |
| `--color-text-secondary` | `#5C5C5C` | Body copy, subtext |
| `--color-accent-black` | `#111111` | Buttons, nav underline, filled elements |
| `--color-surface` | `#F7F7F7` | Card backgrounds, code snippet panel |
| `--color-border` | `#E5E5E5` | Dividers, outlines, card borders |
| `--color-outline-text` | transparent fill, `#111111` stroke | Used for the "Hi," outline-style word in the headline |

No accent colors (no blue/purple/gradient) — strictly black, white, and gray. Any imagery (hero photo, project screenshots) is treated in **grayscale/black-and-white** to match the tone; color only reappears inside actual project screenshots if unavoidable.

### 10.2 Typography
- **Display/Headline font:** Bold, geometric sans-serif (e.g. `Inter`, `General Sans`, or `Space Grotesk`) at very large sizes (60–90px) for the hero name.
- **Hero headline pattern:** Two-line treatment — first line ("Hi, I'm") rendered in **outline/stroke-only** style, second line (the name) in **solid black, extra-bold weight**. This contrast is a signature visual moment — replicate it in CSS with `-webkit-text-stroke` for the outline line.
- **Body font:** Same family, regular weight, `--color-text-secondary`, relaxed line-height (1.6+) for the intro paragraph.
- **Eyebrow/label text:** Small, uppercase, wide letter-spacing (e.g. `SOFTWARE ENGINEER`, `CODE BUILDS BETTER THINGS`) — used as section tags and the vertical side label near the hero image.
- **Nav links:** Medium weight, regular case, generous spacing between items; active link gets a short underline accent.

### 10.3 Layout & Components (Hero section reference)
- **Navbar:** Logo mark (`</>` icon + name) on the left, centered nav links, a solid black **pill-shaped CTA button** ("Let's Talk ↗") on the right. Sticky, transparent/white background.
- **Hero grid:** Two-column split — left column is text (eyebrow label → outline+solid headline → intro paragraph → CTA row → tech-stack icon row), right column is a large black-and-white portrait with an organic soft-gray circular shape bleeding behind it.
- **CTA row:** One primary pill button (solid black, white text, small arrow icon) + one secondary text link with an underline-style arrow, side by side.
- **Tech stack strip:** Row of icon + label pairs (e.g. React, Next.js, Node.js, Python, Git) directly under the CTA row — small monochrome icons, label underneath in small gray text.
- **Floating code snippet card:** A small rounded card overlapping the hero image, styled like a code editor snippet (line numbers, monospace font, `</>` icon top-right, e.g. `const developer = { ... }`) — reinforces the "engineer" identity visually. This pattern can be reused elsewhere (e.g. Projects page) as a decorative accent.
- **Vertical side label:** Small uppercase text stacked vertically along the right edge (`CODE / BUILDS / BETTER / THINGS`) — a subtle brand tagline treatment, paired with a small dot/line divider.
- **Corner/edge treatment:** The hero photo has an angled cut at the bottom-left rather than a hard rectangle — adds a slightly deconstructed, modern edge.

### 10.4 Buttons & Interactive Elements
- **Primary button:** Fully rounded (pill), solid black fill, white text, small icon (arrow) at the end. Used for main CTAs ("Let's Talk", "View My Projects").
- **Secondary link:** No background — just bold text + arrow icon, underline or icon shifts on hover.
- **Cards (Projects/Experience):** Light gray surface (`--color-surface`), thin `--color-border`, generous padding, no heavy shadows — flat, minimal elevation.

### 10.5 Iconography & Imagery
- Tech-stack and skill icons: simple monochrome line/glyph icons (not colored brand logos) to stay on-theme, OR original colored logos rendered in grayscale filter for consistency.
- Photography: portrait/profile images processed in black-and-white to match the reference.
- Decorative motifs: thin horizontal divider lines next to eyebrow labels, small filled dots as separators, soft circular blob shapes as background accents behind photos.

### 10.6 Spacing & Feel
- Generous white space throughout — hero content is left-aligned within roughly half the viewport width, not centered.
- Sections separated by large vertical padding (80–120px) rather than visible dividers.
- Overall tone: confident, minimal, "engineer's portfolio" — more editorial/agency feel than a typical colorful dev-portfolio template.

This theme applies consistently across all public pages (Home, About, Projects, Skills, Experience, Contact) and gets a simplified/functional treatment in the Admin Dashboard (same fonts/colors, but form-first layout instead of marketing layout).

---

## 11. Next Steps

1. ✅ Structure finalized (this document).
2. ✅ Theme/branding locked in — monochrome, editorial developer-portfolio style (Section 10).
3. ⏭ Wireframe/component design pass for remaining pages (About, Projects, Skills, Experience, Contact) using the hero as the style anchor.
4. ⏭ Backend scaffolding (models, routes, auth).
5. ⏭ Frontend scaffolding (public pages + admin panel).
6. ⏭ Seed database with your current resume content as defaults.
7. ⏭ Connect + test end-to-end.
8. ⏭ Deploy.

---

*Once you share the theme/branding direction, this structure will be used as the blueprint to start building actual components and API code.*