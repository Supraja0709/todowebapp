# 🎓 Student Productivity Dashboard

A comprehensive full-stack application designed to help students manage their academic tasks, stay focused with a Pomodoro timer, and track their progress through interactive analytics. Built as a professional-grade portfolio/internship project.

## ✨ Key Features

- **🔐 Secure Authentication**: JWT-based registration and login system with persistent sessions.
- **✅ Task Management (CRUD)**:
  - Create, view, edit, and delete tasks.
  - **Priority Levels**: High, Medium, Low with color-coded tags.
  - **Categories**: Group tasks by subject or topic (e.g., Math, CSS, Research).
  - **Due Dates**: Track deadlines with smart status tags (Overdue, Due Today, Due Soon).
- **🔍 Advanced Filtering & Search**:
  - Filter by status (All, Active, Completed).
  - Filter by specific categories.
  - Real-time search by task title or category.
- **📈 Insightful Analytics**:
  - Beautiful Pie charts (Recharts) for Priority and Category distribution.
  - Stacked Bar charts for progress tracking.
  - Overall completion progress bar.
- **🍅 Pomodoro Timer**: Integrated focus timer with custom work/break intervals.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
- **🎨 Premium UI**: Glassmorphism aesthetics, smooth animations, and a sleek dark mode.
- **🔔 Real-time Notifications**: Toast feedback for every user action (success, error, warning).
- **⏳ Polished UX**: Skeleton loading states while fetching data to reduce perceived latency.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Recharts (Data Visualization)
- React Icons (Modern Iconography)
- Context API (State Management & Toasts)
- Vanilla CSS (Glassmorphism & Custom Layouts)

**Backend:**
- Node.js & Express
- MySQL (Database)
- JWT (JSON Web Tokens)
- Bcrypt.js (Password Hashing)
- Express Validation Middleware

## 🚀 Getting Started

### 1. Database Setup
Ensure you have MySQL installed and running.
1. Create a database named `todo_app`.
2. Execute the queries in `backend/schema.sql` to create the `users` and `todos` tables.

### 2. Backend Configuration
1. Navigate to the `backend` folder.
2. Create/edit `.env` file:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=todo_app
   JWT_SECRET=your_super_secret_key
   ```
3. Run `npm install`.
4. Run `npm start`.

### 3. Frontend Configuration
1. Navigate to the `frontend` folder.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open [http://localhost:5173](http://localhost:5173).

## 📊 Evaluation Readiness
This project fulfills typical senior-level internship requirements:
- [x] Full-stack integration
- [x] Secure Auth & Protected Routes
- [x] Input Validation (Frontend & Backend)
- [x] Error Handling & User Feedback
- [x] Interactive UI/UX and Data Viz
- [x] Responsive layout
- [x] Performance considerations (Skeleton loaders, pagination)
