# Cloud Task Manager

A full-stack, multi-user task management application built with React, Node.js, Express, MySQL, and AWS.

## Overview

Cloud Task Manager lets users create and manage their own tasks through a responsive dashboard. It also includes an admin dashboard for managing users and tasks, task assignment, messaging, notifications, and basic activity tracking.

The application was developed locally and deployed to AWS for testing.

## Features

- JWT-based authentication and protected routes
- Multi-user task management
- Create, edit, update, and delete tasks
- Task status, due dates, and priorities
- Admin dashboard and user management
- Assign and reassign tasks between users
- Admin task deletion and task history
- Admin ↔ user messaging
- Read receipts and unread message indicators
- Notification center with unread count
- Notification pop-ups for new messages and task updates
- Responsive dark-themed interface

## Tech Stack

**Frontend**
- React
- JavaScript
- CSS
- Vite

**Backend**
- Node.js
- Express.js
- REST API
- JWT

**Database**
- MySQL
- Amazon RDS

**AWS**
- Amazon EC2 — backend
- Amazon RDS — MySQL database
- Amazon S3 — frontend hosting
- Amazon VPC — networking
- AWS IAM — access control
- Amazon CloudWatch — monitoring and logs

**Tools**
- Git
- GitHub

## Architecture

```text
React Frontend
      │
      ▼
   Amazon S3
      │
      │ API requests
      ▼
Node.js / Express
      │
      ▼
  Amazon EC2
      │
      ▼
 Amazon RDS
    MySQL

CloudWatch → monitoring and logs
```

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd cloud-task-manager
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env` using `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cloud_task_manager
DB_PORT=3306
PORT=5000
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
node server.js
```

### 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL provided by Vite.

## AWS Deployment

The application was deployed using:

- **EC2** for the Node.js/Express backend
- **RDS** for MySQL
- **S3** for the React frontend
- **VPC** for AWS networking
- **IAM** for access control
- **CloudWatch** for monitoring and logs

The deployment was tested end-to-end. AWS resources were shut down after testing to avoid unnecessary ongoing charges.

## Project Status

**Phase 1 — Complete**

Full-stack MVP, authentication, task CRUD, database integration, responsive dashboard, and AWS deployment.

**Phase 2 — Complete**

Admin dashboard, user/task management, task assignment and reassignment, messaging, read receipts, notifications, and UI improvements.

## Developer

**Bilal Ahmed Siddiqui**  
Computer Science Engineering  
Cloud & DevOps Engineering
