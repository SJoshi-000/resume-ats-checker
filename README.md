<div align="center">

# Resume ATS Checker

### Intelligent Resume Optimization for Modern Hiring Systems

Analyze your resume against job descriptions, measure ATS compatibility, detect missing keywords, and improve your chances of getting shortlisted.

[Live Demo](https://resume-ats-checker-hazel.vercel.app/) • [Backend API](https://resume-ats-checker-a7p1.onrender.com/)

</div>

---

## Overview

Resume ATS Checker is a full-stack web application designed to simulate how Applicant Tracking Systems evaluate resumes.

It helps job seekers understand whether their resumes align with a target job role by analyzing content, extracting keywords, identifying missing requirements, and generating ATS match scores.

This tool is built to bridge the gap between applicants and modern hiring systems.

---

## Core Features

- Resume upload support (PDF / TXT)
- Job description analysis
- ATS compatibility score generation
- Critical keyword extraction
- Missing keyword detection
- Match percentage calculation
- Resume optimization suggestions
- Fast PDF parsing and text extraction
- Production-ready full-stack deployment

---

## Problem It Solves

Most applicants get rejected before a recruiter even reads their resume.

Modern companies use ATS (Applicant Tracking Systems) to filter resumes.

This project helps users:

- Understand ATS behavior
- Improve resume-job matching
- Optimize keyword placement
- Increase interview shortlist probability

---

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Parsing Engine
- PDF-Parse
- Mammoth

### File Handling
- Multer

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## System Architecture

```text
User Uploads Resume
        ↓
Frontend Sends Data
        ↓
Backend Parses Resume
        ↓
Job Description Comparison
        ↓
Keyword Analysis
        ↓
ATS Score Generation
        ↓
Optimization Suggestions
```

---

## Folder Structure

```text
resume-ats-checker
├── client
│   ├── src
│   ├── public
│   └── vite.config.js
│
├── server
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── utils
│   └── server.js
│
└── uploads
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/SJoshi-000/resume-ats-checker.git
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

### Start Frontend

```bash
npm run dev
```

### Start Backend

```bash
npm run dev
```

---

## API Endpoint

```bash
POST /api/analyze
```

---

## Future Enhancements

- User Authentication
- Resume Analysis History
- AI-Powered Resume Improvement Suggestions
- Exportable PDF Reports
- Job Recommendation Engine
- Skill Gap Analysis Dashboard
- Resume Version Tracking

---

## Live Deployment

Frontend: https://resume-ats-checker-hazel.vercel.app/
Backend: https://resume-ats-checker-a7p1.onrender.com/

---

## Author

**Shaurya Joshi**

Computer Science Student | Frontend Developer | MERN Stack Developer

Focused on building practical, scalable, and problem-solving applications.
