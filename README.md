# DataViz - Excel Data Visualization Platform

A full-stack web application for uploading Excel files and creating interactive 2D/3D data visualizations with user authentication and admin management.

## 🚀 Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library
- **Redux Toolkit** - State management
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Chart.js** - 2D charts and graphs
- **Three.js** - 3D visualizations
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **SheetJS/xlsx** - Excel file parsing

## 📁 Project Structure

```
DataViz/
├── client/                        # Frontend React application
│   ├── public/
│   │   ├── favicon.ico
│   │   └── charts/                # Static chart exports
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── ErrorBoundary.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── upload/
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   ├── FilePreview.jsx
│   │   │   │   └── UploadProgress.jsx
│   │   │   ├── charts/
│   │   │   │   ├── ChartContainer.jsx
│   │   │   │   ├── Chart2D.jsx
│   │   │   │   ├── Chart3D.jsx
│   │   │   │   ├── ChartControls.jsx
│   │   │   │   └── ChartExport.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardStats.jsx
│   │   │   │   ├── RecentUploads.jsx
│   │   │   │   └── QuickActions.jsx
│   │   │   └── admin/
│   │   │       ├── UserManagement.jsx
│   │   │       ├── UserTable.jsx
│   │   │       └── AdminStats.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── VisualizePage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── dataSlice.js
│   │   │   │   ├── chartSlice.js
│   │   │   │   ├── uploadSlice.js
│   │   │   │   └── adminSlice.js
│   │   │   └── middleware/
│   │   │       └── authMiddleware.js
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance
│   │   │   ├── auth.service.js
│   │   │   ├── data.service.js
│   │   │   ├── chart.service.js
│   │   │   └── admin.service.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   └── chartConfig.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useFileUpload.js
│   │   │   ├── useChart.js
│   │   │   └── useLocalStorage.js
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── styles/
│   │   │       └── components.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                        # Backend Node.js application
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── data.controller.js
│   │   ├── user.controller.js
│   │   └── admin.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── admin.middleware.js
│   │   ├── upload.middleware.js
│   │   └── error.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Dataset.model.js
│   │   └── Chart.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── data.routes.js
│   │   ├── user.routes.js
│   │   └── admin.routes.js
│   ├── services/
│   │   ├── excel.service.js
│   │   ├── auth.service.js
│   │   └── email.service.js
│   ├── utils/
│   │   ├── database.js
│   │   ├── jwt.js
│   │   ├── validation.js
│   │   └── constants.js
│   ├── uploads/                   # File upload directory
│   ├── config/
│   │   ├── database.config.js
│   │   └── app.config.js
│   ├── package.json
│   └── server.js
└── README.md
```

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based user authentication
- Role-based access control (User/Admin)
- Protected routes and API endpoints
- User registration and login

### 📊 Data Management
- Excel file upload (.xlsx, .xls)
- Data parsing and validation
- Dynamic column mapping
- Upload history tracking

### 📈 Visualization
- **2D Charts**: Bar, Line, Pie, Scatter, Area charts
- **3D Visualizations**: Interactive 3D charts with Three.js
- Real-time chart customization
- Export charts as images/PDFs

### 👥 User Management
- User dashboard with upload history
- Admin panel for user management
- Usage statistics and analytics
- Bulk operations support

### 🎨 User Experience
- Responsive design with TailwindCSS
- Real-time upload progress
- Interactive chart controls
- Modern, clean interface

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (v5+)
- npm or yarn

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Environment Variables
Create `.env` file in server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dataviz
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

## 🚀 Development Workflow

### Commit Message Convention
```
feat: add new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code restructuring
test: adding tests
chore: maintenance
```

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Bug fixes

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Data Endpoints
- `POST /api/data/upload` - Upload Excel file
- `GET /api/data/datasets` - Get user datasets
- `GET /api/data/dataset/:id` - Get specific dataset
- `DELETE /api/data/dataset/:id` - Delete dataset

### Chart Endpoints
- `POST /api/charts/create` - Create chart configuration
- `GET /api/charts/user` - Get user charts
- `PUT /api/charts/:id` - Update chart
- `DELETE /api/charts/:id` - Delete chart

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get platform statistics

## 🔧 Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run test         # Run tests
npm run seed         # Seed database
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

