# Zidio Project

A full-stack web application built with React (frontend) and Node.js/Express (backend) using MongoDB as the database.

## 🚀 Tech Stack

### Frontend
- **React** 19.1.0 with JavaScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Redux Toolkit** for state management
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **CORS** enabled

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local installation) or MongoDB Atlas account
- [Git](https://git-scm.com/)

## 🛠️ Local Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Het-Jethva/DataViz.git
cd DataViz
```

### 2. Environment Setup

Create a `.env` file in the `server` directory:
```bash
cd server
copy .env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/zidio
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Backend Setup

Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Start the backend server:
```bash
# For development (with nodemon)
npm run dev

# For production
npm start
```

The server will run on `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal and navigate to the client directory:
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

### 5. Database Setup

#### Option A: Local MongoDB with Docker (Recommended)
Run MongoDB using Docker:
```bash
docker run -d --name dataviz-mongo -p 27017:27017 -v dataviz-mongo-data:/data/db mongo:latest
```

This command:
- Runs MongoDB in a Docker container
- Maps port 27017 to your local machine
- Creates a persistent volume for data storage

#### Option B: Local MongoDB Installation
1. Make sure MongoDB is running locally
2. The application will automatically connect to `mongodb://localhost:27017/dataviz`

#### Option C: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Update the `MONGO_URI` in your `.env` file with your Atlas connection string

## 🔧 Available Scripts

### Frontend (client directory)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (server directory)
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## 📁 Project Structure

```
DataViz/
├── client/                 # React frontend
│   ├── src/
│   │   ├── redux/         # Redux store and slices
│   │   ├── App.jsx        # Main App component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── server.js         # Main server file
│   └── package.json
└── README.md
```

## 🌐 API Endpoints

The backend server exposes RESTful API endpoints. Once the server is running, you can access:
- Base URL: `http://localhost:5000`
- API documentation will be available based on your route definitions

## 🔒 Authentication

This project uses JWT (JSON Web Tokens) for authentication. Make sure to:
1. Set a strong `JWT_SECRET` in your `.env` file
2. Include the JWT token in the Authorization header for protected routes

## 🚨 Troubleshooting

### Common Issues:

1. **Port already in use**
   - Change the port in your `.env` file or kill the process using the port

2. **MongoDB connection failed**
   - Ensure MongoDB is running locally or check your Atlas connection string
   - Verify the `MONGO_URI` in your `.env` file

3. **Module not found errors**
   - Delete `node_modules` and `package-lock.json`, then run `npm install` again

4. **CORS errors**
   - The backend is configured with CORS enabled for development

## 📝 Development Tips

1. Both frontend and backend support hot reloading during development
2. Use the browser's developer tools for debugging the frontend
3. Check the terminal/console for backend logs and errors
4. Use MongoDB Compass for database visualization and management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request