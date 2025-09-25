# 🚀 AI-Powered-Interview

A comprehensive **AI-powered interview preparation platform** that helps users practice **technical and behavioral interviews** with **real-time feedback**, **speech recognition**, and **detailed analytics**.

---

## ✨ Features

### 🎯 Interview Practice
- AI-powered mock interviews (Technical + Behavioral)
- Real-time speech recognition & feedback
- Detailed analytics and reports

### 📅 Smart Session Management
- Flexible time slots: **20, 30, 45, or 50 minutes**
- Timer with **5-minute & 4-minute reminders**
- Categorized **Question Bank** by topic & difficulty

---

## ⚡ Quick Start

### ✅ Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

---

## 🔧 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sandeepMasai/AI-Powered-Interview.git
   cd AI-Powered-Interview
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

---

## ⚙️ Environment Setup

Create a `.env` file in the **backend** directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interview-platform
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000

# Cloudinary (optional - for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## ▶️ Running the Application

1. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   ```

2. **Run Backend**
   ```bash
   cd backend
   npm run dev
   ```

3. **Run Frontend**
   ```bash
   cd frontend
   npm start
   ```

---

## 🌐 Access the Application

- **Frontend:** [https://ai-powered-interview-1.onrender.com/](https://ai-powered-interview-1.onrender.com/)  
- **Backend API:** [https://ai-powered-interview-mfag.onrender.com/](https://ai-powered-interview-mfag.onrender.com/)

---

## 📂 Project Structure

```
interview-platform/
├── backend/
│   ├── config/          # Database and service configurations
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   └── contexts/    # React contexts
│   └── package.json
└── README.md
```

---

## 📡 API Endpoints

### 🔑 Authentication
- `POST /api/auth/register` → User registration  
- `POST /api/auth/login` → User login  
- `GET /api/auth/profile` → Get user profile  

### ❓ Questions
- `GET /api/questions` → Get all questions (with filtering)  
- `POST /api/questions` → Create new question  

---

## 📝 Creating Your First Practice Session

1. Register/Login to your account  
2. Navigate to **Dashboard → "New Practice Session"**  
3. Select **Categories** (Technical, Behavioral, etc.)  
4. Choose **Difficulty** (Easy, Medium, Hard)  
5. Set **Duration** (20, 30, 45, or 50 minutes)  
6. Schedule your session 🚀  

---

## 💡 Tech Stack
- **Frontend:** React, Context API, TailwindCSS  
- **Backend:** Node.js, Express.js, MongoDB, JWT  
- **Services:** Cloudinary (optional for uploads)  

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/your-feature`)  
3. Commit changes (`git commit -m 'Add new feature'`)  
4. Push branch (`git push origin feature/your-feature`)  
5. Open a Pull Request 🚀  

---

## 📜 License

This project is licensed under the **MIT License**.
