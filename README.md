# DataViz

A full-stack web application for uploading Excel files and creating interactive 2D/3D data visualizations, with user authentication and admin management.

---

## 🚀 Tech Stack

**Frontend**

- React 19, Redux Toolkit, Vite, TailwindCSS
- Chart.js (2D charts), Three.js (3D charts)
- React Router, Radix UI, Shadcn UI

**Backend**

- Node.js, Express.js, MongoDB + Mongoose
- JWT (Authentication), Multer (File uploads)
- SheetJS/xlsx (Excel parsing)
- Gemini API (AI summaries)

---

## 📁 Project Structure

```
DataViz/
├── client/         # React frontend
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── server/         # Node.js backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   └── package.json
└── README.md
```

---

## ✨ Features

- **User Authentication:** JWT-based, with role-based access (User/Admin)
- **Excel Upload & Parsing:** Upload `.xlsx`/`.xls` files, parse and validate data
- **Data Visualization:** Interactive 2D (Chart.js) and 3D (Three.js) charts
- **User Dashboard:** Upload history, profile management, chart analytics
- **Admin Panel:** User management, platform stats, edit/delete users
- **AI Summary:** Generate AI-powered summaries of your data (Gemini integration, requires API key)
- **Download Options:** Export your data and charts
- **Responsive UI:** Modern, mobile-friendly design with TailwindCSS and Shadcn UI

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (v5+)
- npm
- (Optional) Gemini API key for AI summaries

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your values (see below)
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
cp .env.example .env # (optional, only if you want to override API URL)
npm run dev
```

---

## ⚙️ Environment Variables

### Backend (`server/.env.example`)

```env
# MongoDB connection string (required)
MONGODB_URI=mongodb://localhost:27017/dataviz

# JWT secret key (required)
JWT_SECRET=your_jwt_secret_key

# JWT expiration (optional, default: 7d)
JWT_EXPIRES_IN=7d

# Node environment (optional, default: development)
NODE_ENV=development

# Port for backend server (optional, default: 5000)
PORT=5000

# Frontend URL for CORS (required in production)
FRONTEND_URL=http://localhost:5173

# Gemini API Key (required for AI summary features)
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend (`client/.env.example`)

```env
# Base URL for backend API (optional, default: http://localhost:5000/api)
VITE_API_URL=http://localhost:5000/api
```

---

## 🚦 Development Workflow

- **Frontend:** `npm run dev` (Vite dev server)
- **Backend:** `npm run dev` (Nodemon/Express)
- **Build frontend:** `npm run build`
- **Lint frontend:** `npm run lint`

---

## 🧑‍💻 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📚 API Overview

### Auth

- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/profile` — Get profile
- `PUT /api/auth/profile` — Update profile
- `PUT /api/auth/change-password` — Change password

### Data

- `POST /api/dashboard/upload` — Upload Excel file
- `GET /api/dashboard/uploads` — Get upload history
- `DELETE /api/dashboard/uploads/:id` — Delete upload
- `POST /api/dashboard/analysis/:uploadId` — Save chart analysis
- `GET /api/dashboard/analysis/:uploadId` — Get analysis history
- `POST /api/dashboard/gemini/:uploadId` — Get AI summary (requires GEMINI_API_KEY)

### Admin

- `GET /api/admin/users` — List users
- `PUT /api/admin/users/:id` — Update user
- `DELETE /api/admin/users/:id` — Delete user
- `GET /api/admin/stats` — Platform statistics
