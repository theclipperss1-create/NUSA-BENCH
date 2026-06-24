# 🇮🇩 NUSA-BENCH — Premium Custom IT Agency Platform & Cognitive Benchmark

[![React Version](https://img.shields.io/badge/React-19.2-blue.svg?logo=react&logoColor=white)](https://react.dev)
[![Vite Bundler](https://img.shields.io/badge/Vite-8.0-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Express Backend](https://img.shields.io/badge/Express-4.21-green.svg?logo=express&logoColor=white)](https://expressjs.com)
[![Supabase DB](https://img.shields.io/badge/Supabase-Enabled-3ECF8E.svg?logo=supabase&logoColor=white)](https://supabase.com)
[![Security Audited](https://img.shields.io/badge/Security-Helmet%20%26%20Rate%20Limit-red.svg?logo=auth0&logoColor=white)](#-security-first-architecture)

**NUSA-BENCH** is a premium, full-stack custom platform designed specifically for high-end software development agencies. It seamlessly integrates a modern **Bento Grid** interface, an interactive **Project Estimation Calculator**, an integrated **Service Booking Form**, and a **National Cognitive Leaderboard** (brain benchmark) featuring real-time data visualization.

---

## 🎨 Design Aesthetics & User Experience (UI/UX)

*   **Bento Grid Layout:** Implements a sleek, responsive Bento Grid to map out various agency services elegantly.
*   **Distinctive Typography:** Features Outfit and modern Sans-Serif font pairs, avoiding generic browser defaults.
*   **Liquid Glassmorphism:** Subtle `backdrop-blur` mixed with 1px transparent borders (`border-white/10`) to provide high-end visual depth.
*   **Anti-AI Slop (No Clichés):** Completely free from generic stock visuals and AI copywriting buzzwords. Every interaction is calculated, utilizing HSL color tokens.
*   **Spring Physics Micro-Animations:** Every button, input field, and modal is driven by fluid transition curves (default `stiffness: 100, damping: 20`) for a responsive, tactile feel.

---

## 🔒 Security-First Architecture

Engineered with production-grade security measures across the entire stack:

1.  **Secure HTTP Headers (Helmet):** Integrates the `helmet` middleware on the Express server to set essential secure HTTP response headers (preventing XSS, Clickjacking, and MIME-sniffing).
2.  **API Abuse Prevention (Rate Limiter):** Protects endpoints from brute-force and DDoS attempts using `express-rate-limit` (capped at 200 requests per 15 minutes per IP).
3.  **Strict Input Validation (Zod):** Payloads (signups, profiles, scores) are validated on the backend:
    *   *Username constraints:* Only alphanumeric characters, underscores, and hyphens (`^[a-zA-Z0-9_-]+$`) are allowed, preventing Stored XSS.
    *   *Score sanitization:* Rejects arbitrary or irrational values on the leaderboard submit route.
4.  **Secure CORS Policy:** Restricts cross-origin resource sharing to specified URLs via the `CLIENT_URL` environment variable.
5.  **Credential Isolation:** Avoids hardcoded secrets. All sensitive keys (Supabase Service Role Key, Database Connection String) are stored in `.env` and excluded from Git commits via `.gitignore`.

---

## 📂 Project Architecture

```
NUSA-BENCH/
├── frontend/                 # Client SPA (Vite + React 19)
│   ├── src/
│   │   ├── components/       # BentoServices, Estimator, Navbar, Onboarding Modal
│   │   ├── context/          # Global Auth & Project State
│   │   ├── services/         # Axios API Services
│   │   ├── pages/            # Dashboard, Leaderboard, Login, Profile Pages
│   │   └── index.css         # CSS Design Tokens & HSL Variables
│   └── package.json
│
├── backend/                  # Server API (Node.js + Express)
│   ├── config/               # Supabase & Local Simulated DB Handlers
│   ├── controllers/          # Score & Profile Business Logic
│   ├── middleware/           # Auth JWT Guard
│   ├── data/                 # Local JSON Database storage (db.json)
│   ├── routes/               # API v1 Router Handlers
│   ├── app.js                # Express Application Configuration
│   └── package.json
│
├── .env.example              # Env template for developers
└── .gitignore                # Recursive Git exclusions (.env, .antigravity, etc.)
```

---

## ⚡ Local Development Setup

### Prerequisites
*   Node.js (v18 or above recommended)
*   NPM / Yarn

### Step 1: Set Up Environment Variables (.env)
Copy the example environment template to `.env` at the root directory:
```bash
cp .env.example .env
```
By default, `USE_LOCAL_DB=true` is enabled. This triggers the local JSON database simulation (`backend/data/db.json`), allowing you to test the app out-of-the-box without setting up an external database.

### Step 2: Start the Backend Server (API Port 5000)
```bash
cd backend
npm install
npm run dev
```
The backend server runs on: **`http://localhost:5000`**

### Step 3: Start the Frontend Application (Vite Port 5173)
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to: **`http://localhost:5173`**

---

## ☁️ Live Production URLs

*   **Frontend Client:** [https://frontend-beta-six-5imx5jr7p4.vercel.app](https://frontend-beta-six-5imx5jr7p4.vercel.app)
*   **Backend API Server:** [https://backend-xi-virid-44.vercel.app](https://backend-xi-virid-44.vercel.app)
