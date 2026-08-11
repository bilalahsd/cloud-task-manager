☁️ CLOUD TASK MANAGER

A full-stack, multi-user task management application built with React, Node.js, Express, MySQL, and AWS.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 PROJECT OVERVIEW

Cloud Task Manager is a full-stack task management application designed to demonstrate practical frontend development, backend API development, relational database management, authentication, and cloud deployment.

Users can securely register, log in, and manage their own tasks through a modern responsive dashboard.

The project was developed and tested locally first and was then successfully deployed using AWS cloud services.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ FEATURES

🔐 AUTHENTICATION
• User registration
• User login
• JWT-based authentication
• Protected API routes
• Multi-user support
• User-specific task access
• Logout functionality

📋 TASK MANAGEMENT
• Create tasks
• View tasks
• Edit tasks
• Update task status
• Set and edit due dates
• Delete tasks
• Confirmation modal before deletion
• Pending, In Progress, and Completed states

🎨 DASHBOARD
• Modern dark-themed interface
• Responsive layout
• Task statistics
• Clean task cards
• Create/Edit task form
• Loading states
• Refresh functionality
• Responsive task controls
• User logout

☁️ CLOUD DEPLOYMENT
• Backend deployed on Amazon EC2
• MySQL database deployed on Amazon RDS
• Frontend hosted using Amazon S3
• AWS VPC networking
• IAM access management
• CloudWatch monitoring and logging

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛠️ TECHNOLOGY STACK

🎨 FRONTEND
• React
• JavaScript
• HTML5
• CSS3
• Vite

⚙️ BACKEND
• Node.js
• Express.js
• REST API
• JWT

🗄️ DATABASE
• MySQL
• Amazon RDS

☁️ AWS
• Amazon EC2
• Amazon RDS
• Amazon S3
• Amazon VPC
• AWS IAM
• Amazon CloudWatch

📦 VERSION CONTROL
• Git
• GitHub

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏗️ APPLICATION ARCHITECTURE

                    ┌──────────────────────┐
                    │    React Frontend    │
                    │       Dashboard      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Amazon S3        │
                    │  Frontend Hosting    │
                    └──────────────────────┘


                    ┌──────────────────────┐
                    │   Node.js / Express  │
                    │       REST API       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Amazon EC2       │
                    │    Backend Server    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Amazon RDS      │
                    │       MySQL          │
                    └──────────────────────┘

                               │
                               ▼
                    ┌──────────────────────┐
                    │    Amazon CloudWatch │
                    │   Monitoring & Logs  │
                    └──────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 HOW THE APPLICATION WORKS

1. A user registers or logs into the application.
2. The backend authenticates the user and generates a JWT.
3. The frontend uses the JWT when accessing protected API routes.
4. Authenticated users can create and manage their own tasks.
5. The Node.js/Express backend processes API requests.
6. Task and user data are stored in MySQL.
7. In the AWS deployment, the backend runs on Amazon EC2.
8. The database is hosted using Amazon RDS.
9. The React frontend is hosted using Amazon S3.
10. CloudWatch is used for monitoring and application/infrastructure logs.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 AUTHENTICATION FLOW

Registration
     ↓
User credentials
     ↓
Backend validation
     ↓
User stored in MySQL
     ↓
Login
     ↓
JWT generated
     ↓
Protected API requests
     ↓
User-specific task access

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🗄️ DATABASE DESIGN

The application uses a relational MySQL database.

USERS
• Stores registered user accounts
• Each user receives a unique ID

TASKS
• Stores user-created tasks
• Each task is associated with a user
• Stores title, description, status, due date, and creation time

RELATIONSHIP

Users
  │
  │ 1
  │
  │
  │ N
  ▼
Tasks

A user can have multiple tasks, while each task belongs to a specific user.

The task relationship uses a foreign key with cascading deletion so that a user's associated tasks are removed when that user is deleted.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 TESTING COMPLETED

The application was tested through the complete core workflow.

✅ User registration
✅ User login
✅ Multiple user accounts
✅ User-specific task isolation
✅ Create task
✅ Read tasks
✅ Edit task
✅ Update task status
✅ Update task due date
✅ Delete task
✅ Delete confirmation workflow
✅ Logout and login
✅ Frontend restart
✅ Backend restart
✅ Database persistence
✅ Date persistence after restart
✅ CRUD functionality after restart
✅ AWS deployment and connectivity testing

The database was also cleaned of development/test accounts before finalizing the Phase 1 project state.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☁️ AWS DEPLOYMENT

The completed application was deployed to AWS using multiple cloud services.

AMAZON EC2
Purpose:
• Hosts the Node.js / Express backend
• Runs the REST API

AMAZON RDS
Purpose:
• Hosts the MySQL database
• Provides managed relational database infrastructure

AMAZON S3
Purpose:
• Hosts the React frontend/static application files

AMAZON VPC
Purpose:
• Provides the AWS networking environment
• Controls communication between cloud resources

AWS IAM
Purpose:
• Manages permissions and access to AWS resources

AMAZON CLOUDWATCH
Purpose:
• Application and infrastructure monitoring
• Log collection and troubleshooting

The complete application was successfully deployed and tested end-to-end.

💡 The AWS resources were intentionally shut down after deployment/testing to avoid unnecessary ongoing AWS charges.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔒 SECURITY CONSIDERATIONS

• JWT authentication is used for protected routes.
• Users can only access their own tasks.
• Database credentials are stored using environment variables.
• JWT secrets are stored using environment variables.
• The .env file is excluded from Git.
• A .env.example file is provided as a configuration template.
• AWS IAM is used for access control.
• AWS networking/security controls are used to restrict resource access.
• No real passwords, JWT secrets, or AWS credentials are stored in this repository.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 PROJECT STRUCTURE

cloud-task-manager/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── api.js
│   │   └── index.css
│   │
│   ├── package.json
│   └── ...
│
├── README.md
└── .gitignore

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💻 LOCAL DEVELOPMENT

1️⃣ Clone the repository

git clone <repository-url>

cd cloud-task-manager


2️⃣ Install backend dependencies

cd backend

npm install


3️⃣ Configure environment variables

Create a .env file inside the backend directory using backend/.env.example as a reference.

Example:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cloud_task_manager
DB_PORT=3306
PORT=5000
JWT_SECRET=your_jwt_secret


4️⃣ Start the backend

node server.js


5️⃣ Install frontend dependencies

Open another terminal and run:

cd frontend

npm install


6️⃣ Start the frontend

npm run dev


The frontend can then be accessed using the local development URL provided by Vite.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 DEVELOPMENT TIMELINE

PHASE 1 — FULL-STACK MVP

🧱 Project Foundation
• Project structure created
• Frontend and backend initialized
• MySQL database configured
• Basic application architecture established

🔐 Authentication
• User registration implemented
• User login implemented
• JWT authentication implemented
• Protected API routes implemented
• Multi-user authentication tested

⚙️ REST API & CRUD
• Task creation API
• Task retrieval API
• Task update API
• Task deletion API
• User-specific task access
• Database relationships

🎨 Dashboard Development
• React dashboard implemented
• Task statistics added
• Task cards designed
• Create/Edit task interface added
• Responsive styling added
• Loading states added
• Delete confirmation modal added
• Dashboard visual polish completed

🐛 Bug Fixing & Stabilization
• Task editing fixed
• Delete workflow fixed
• Date display formatting fixed
• Date persistence/timezone issue fixed
• Multiple-user behavior verified
• Backend/frontend restart behavior verified

🧹 Finalization
• Development/test users removed
• Database cleaned
• Project README created
• Git repository cleaned
• Local MVP committed to Git
• Repository pushed to GitHub

☁️ AWS Deployment
• AWS infrastructure configured
• Amazon RDS MySQL configured
• Amazon EC2 backend deployment completed
• Amazon S3 frontend deployment completed
• VPC/security configuration completed
• IAM permissions configured
• CloudWatch monitoring/logging configured
• End-to-end AWS deployment tested

🟢 PHASE 1 STATUS: COMPLETE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔮 PHASE 2 — PLANNED ENHANCEMENTS

The following features are intentionally reserved for a future phase.

👨‍💼 ADMIN DASHBOARD
• Admin/user role separation
• Admin authentication
• View registered users
• View all user tasks
• User activity overview
• Task priority management
• User management

📧 EMAIL VERIFICATION
• Email OTP during registration
• OTP verification page
• Account verification workflow

💬 COMMUNICATION
• Admin-to-user messaging
• User-to-admin communication
• Task priority "buzz" notifications
• Admin notifications
• User notification center
• Text-based communication interface

These features are not part of the completed Phase 1 scope.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 PROJECT STATUS

🟢 PHASE 1 — COMPLETE

The Phase 1 application has been:

DEVELOPED → TESTED → DEPLOYED → DOCUMENTED

The completed Phase 1 project demonstrates:

✓ Full-stack application development
✓ REST API development
✓ JWT authentication
✓ Relational database design
✓ Multi-user data isolation
✓ Responsive frontend development
✓ CRUD operations
✓ AWS cloud deployment
✓ Basic cloud networking
✓ IAM access control
✓ Cloud monitoring
✓ Git/GitHub workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👨‍💻 DEVELOPER

Bilal Ahmed Siddiqui

Computer Science Engineering
Cloud & DevOps Engineering

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⭐ PHASE 1 COMPLETE

Built from the ground up, tested locally, deployed to AWS, and finalized as a complete full-stack cloud project.
