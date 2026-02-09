# User Management API

## Overview

The User Management API is a secure RESTful backend service built using Node.js and Express. It provides authentication, user management, administrative controls, and a puzzle-based secret endpoint. The project focuses on implementing secure authentication, input validation, role-based access control, and best backend development practices.

---

## Live Deployment

Production API:
https://medable-usermanagement.onrender.com

Swagger Documentation:
https://medable-usermanagement.onrender.com/api-docs

---

## Features

- JWT-based authentication  
- Secure password hashing using bcrypt  
- User registration with validation  
- Role-based authorization (admin and user roles)  
- User update and deletion controls  
- Self-deletion prevention  
- Pagination support for user listing  
- Rate limiting for security  
- Puzzle-based secret endpoint with multiple access methods  
- Swagger documentation for API testing  

---

## Tech Stack

- Node.js  
- Express.js  
- JSON Web Tokens (JWT)  
- bcrypt.js  
- Validator.js  
- Swagger (swagger-ui-express, swagger-jsdoc)  
- Express Rate Limit  
- Render (Deployment)  

---

## Local Setup Instructions

### Prerequisites

- Node.js version 18 or higher  
- npm  

---

### Clone Repository

git clone https://github.com/Vikranth2024/Medable-UserManagement.git
cd Medable-UserManagement


---

### Install Dependencies

npm install


---

### Configure Environment Variables

Create a `.env` file in the project root.

JWT_SECRET=your_secure_jwt_secret
SECRET_HEADER_VALUE=find_me_if_you_can_2024
PORT=8888


---

### Run Application

Development Mode:

npm run dev


Production Mode:

npm start


---

### Access Application

Local API: http://localhost:8888


Swagger Documentation: http://localhost:8888/api-docs


---

## API Endpoints

Authentication:

- POST /api/auth/login  
- POST /api/auth/register  

User Management:

- GET /api/users  
- GET /api/users/:id  
- PUT /api/users/:id  
- DELETE /api/users/:id (Admin only)  

Puzzle Endpoint:

- GET /api/users/secret-stats  

---

## Security Highlights

- All protected routes require JWT authentication  
- Passwords are securely hashed  
- Input validation prevents invalid or weak credentials  
- Role-based authorization protects administrative actions  
- Rate limiting protects against brute force attacks  
- Sensitive data is never exposed in API responses  

---

## Puzzle Challenge

Secret Header Value: find_me_if_you_can_2024

Hidden Endpoint: /api/users/secret-stats

Decoded Secret Message: Congratulations! You found the secret endpoint. The final clue is: SHC_Header_Puzzle_2024


Access Methods:

- Secret header  
- Query parameter  
- JWT token  

---

## Deployment

The application is deployed using Render and configured using environment variables.

---

## Author

Vikranth S  
https://github.com/Vikranth2024


