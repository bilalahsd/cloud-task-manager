# Cloud Task Manager

A full-stack task management application built with React, Node.js, Express, and MySQL, designed for deployment on AWS.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected task APIs
- Create, read, update, and delete tasks
- MySQL database integration
- React frontend
- RESTful backend API
- CORS support

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- MySQL
- bcryptjs
- JSON Web Tokens
- CORS

### Cloud / DevOps
- AWS EC2
- AWS RDS
- AWS S3
- AWS VPC
- AWS IAM
- AWS CloudWatch

## Project Structure

```text
cloud-task-manager/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md