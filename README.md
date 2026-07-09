# Muhammad Bilal Tariq | Interactive Developer Portfolio

A premium, state-of-the-art developer portfolio website designed for **Muhammad Bilal Tariq**, Computer Science student at NUST H-12, Islamabad. The project is styled with a custom Cyberpunk/Cosmic Dark Theme and features interactive client-side interfaces.

## 🚀 Features

- **Cosmic Dark Theme**: A deep-indigo space aesthetic with neon cyan and glowing violet accents designed to feel high-tech.
- **Interactive Terminal Emulator**: A fully functional shell model built directly on the page, letting users type bash-like commands (`about`, `skills`, `projects`, `contact`, `clear`) to inspect Bilal's credentials in ASCII lists.
- **Canvas Node Network**: Hover-linked floating canvas particles that glide across the viewport and interact with mouse positioning.
- **Expandable Projects Grid**: Custom card layouts displaying Bilal's core projects (Qalam Clone, Bank Management System, Library Management System) with interactive detail panel toggles.
- **Intersection Observer Animations**: Smooth scroll-triggered fade-in animations for section cards.
- **High-Performance Static Structure**: Built using pure HTML5 semantic blocks, modular CSS3 variables, and vanilla Javascript. Loads instantly and scores high on SEO/Performance audits.

## 📂 Project Structure

```
d:\bilal-portfolio/
│
├── index.html        # Main HTML5 layout, meta properties, and sections structure
├── style.css         # Reset configurations, cosmic theme colors, grids, & glassmorphism
├── script.js         # Canvas particles, terminal emulator, scroll observer, & details toggle
├── vercel.json       # Hosting redirections and URL clean configurations for Vercel
└── README.md         # Documentation and deploy guides
```

## 💻 Running Locally

Since this portfolio is built using pure static assets, you can run it locally without installing heavy npm dependencies:

### Method 1: Python HTTP Server (If Python is in path)
1. Open PowerShell or Terminal in the root folder.
2. Run:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your web browser.

### Method 2: Node.js (npx serve)
1. Open PowerShell in the root folder.
2. Run:
   ```bash
   npx serve
   ```
3. Open `http://localhost:3000` in your browser.

### Method 3: VS Code Extension
- Open the project in VS Code, right-click `index.html`, and choose **Open with Live Server**.

## ☁️ Deploying on Vercel (Free Tier)

This portfolio is fully optimized for **Vercel's free hosting tier** using the included `vercel.json` file. Follow these steps to deploy it:

### Step 1: Create a GitHub Repository
1. Initialize a Git repository in the `bilal-portfolio` folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Bilal's Portfolio Website"
   ```
2. Go to [github.com](https://github.com) and create a new repository named `bilal-portfolio`.
3. Link and push your local files:
   ```bash
   git remote add origin https://github.com/itsbilaltariq/bilal-portfolio.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Import Project to Vercel
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and sign in using your GitHub account.
2. Click **Add New** > **Project**.
3. Import your newly pushed `bilal-portfolio` repository.
4. Under **Framework Preset**, keep it as **Other** (Vercel automatically detects the HTML/CSS/JS static structure).
5. Click **Deploy**.
6. Within a few seconds, your site will be live on a free `vercel.app` subdomain! (e.g., `bilal-portfolio.vercel.app`).
