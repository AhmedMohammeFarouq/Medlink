# MEDLINK

MEDLINK is a healthcare platform connecting patients, doctors, and clinics with streamlined medical workflows and secure communication.

## Technology Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Socket.IO
- **Frontend**: Angular, TypeScript, Standalone Components, Reactive Forms
- **Authentication**: JWT & bcryptjs
- **File Storage**: Multer & Cloudinary
- **Containerization**: Docker Compose

## Project Structure

```text
medlink/
├── backend/
├── frontend/
├── docs/
├── .gitignore
├── README.md
└── docker-compose.yml
```

## Setup & Installation

### 1. Database Infrastructure (Docker)
```bash
docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
