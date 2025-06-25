Absolutely! Here’s a rewritten, modern, and clear README for your DataViz project, tailored to your actual codebase and best practices:

---

# DataViz

A full-stack web application for uploading Excel files and creating interactive 2D/3D data visualizations, with user authentication and admin management.

---

## 🚀 Tech Stack

**Frontend**
- React 19
- Redux Toolkit
- Vite
- TailwindCSS
- Chart.js (2D charts)
- Three.js (3D charts)
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- Multer (File uploads)
- SheetJS/xlsx (Excel parsing)

---

## 📁 Project Structure

```
DataViz/
├── client/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── lib/
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
- **User Dashboard:** Upload history, profile management
- **Admin Panel:** User management, platform stats
- **Responsive UI:** Modern, mobile-friendly design with TailwindCSS

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (v5+)
- npm or yarn

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
npm run dev
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dataviz
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
# Required in production for CORS
FRONTEND_URL=http://localhost:5173
```
- `MONGODB_URI` and `JWT_SECRET` are required.
- `FRONTEND_URL` is required in production for CORS.
- `PORT`, `JWT_EXPIRES_IN`, and `NODE_ENV` are optional but recommended.

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```
- If not set, defaults to `http://localhost:5000/api`.

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

### Data
- `POST /api/dashboard/upload` — Upload Excel file
- `GET /api/dashboard/history` — Get upload history

### Admin
- `GET /api/admin/users` — List users
- `PUT /api/admin/users/:id` — Update user
- `DELETE /api/admin/users/:id` — Delete user

