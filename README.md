<div align="center">

# 🎓 AttendAI Pro
### AI-Powered Smart Attendance Management System

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-purple?style=for-the-badge&logo=auth0)](https://authjs.dev/)

<p align="center">
  <strong>Secure • Contactless • Intelligent Attendance Platform</strong><br>
  Combining AI Face Recognition, Dynamic Time-Expiring QR Codes, GPS Geofencing, and Real-Time Classroom Streaming.
</p>

[Key Features](#-key-features) • [Architecture Diagrams](#-system-architecture--structural-diagrams) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Routes](#-api-endpoints) • [Default Credentials](#-default-demo-credentials)

---

</div>

## 📌 Overview

**AttendAI Pro** is an enterprise-grade smart attendance management system designed for universities and educational institutions. It completely eliminates proxy attendance and buddy-punching by pairing **biometric AI facial verification** and **dynamic expiring QR codes** with **real-time classroom streaming** and **geolocation validation**.

---

## 📐 System Architecture & Structural Diagrams

### 1. High-Level System Architecture

```mermaid
graph TB
    subgraph Client_Tier ["🖥️ Client Tier (Responsive Web & Mobile)"]
        A1["📱 Student Mobile Camera<br>(Native QR Scanner)"]
        A2["💻 Student Web Portal<br>(Face Camera / On-Screen QR)"]
        A3["👨‍🏫 Faculty Dashboard<br>(Live QR Broadcast & Stream)"]
        A4["👑 Admin Console<br>(Analytics & User Management)"]
    end

    subgraph Application_Tier ["⚡ Next.js 15 Application Tier (App Router)"]
        subgraph Security_Layer ["🔒 Security & RBAC"]
            B1["Auth.js v5 (NextAuth)<br>JWT & Session Management"]
            B2["Zod Schema Validation"]
            B3["Role-Based Middleware<br>(ADMIN / FACULTY / STUDENT)"]
        end

        subgraph AI_Engine ["🤖 AI Computer Vision Engine"]
            C1["Face-API.js Detection<br>(TinyFaceDetector)"]
            C2["128-D Feature Embedding<br>Extraction & Normalizer"]
            C3["Cosine Similarity Engine<br>(Threshold >= 0.82)"]
        end

        subgraph Attendance_Engine ["📡 Attendance Processing Engine"]
            D1["Dynamic QR Session Generator<br>(Crypto Nonce & Expiry)"]
            D2["GPS Geofencing Validator"]
            D3["Real-Time Live Polling &<br>Stream Dispatcher"]
        end
    end

    subgraph Persistence_Tier ["🗄️ Persistence & Storage Tier"]
        E1["Prisma ORM Client"]
        E2[("PostgreSQL Database")]
        E3["Dynamic Memory Fallback Stores<br>(attendanceStore, faceStore, qrStore)"]
    end

    %% Client to App Layer Connections
    A1 -->|Scans QR URL /attend/:id| D1
    A2 -->|Transmits Facial Descriptor| C2
    A3 -->|Creates Live QR / Polls Stream| D3
    A4 -->|Queries System Analytics| B3

    %% App Layer to Persistence Connections
    C3 -->|Validates Stored Profile| E1
    D1 -->|Saves Session State| E1
    D2 -->|Logs Geolocation & Timestamp| E1
    E1 -->|Primary Storage| E2
    E1 -.->|Fallback when DB offline| E3
```

---

### 2. End-to-End Attendance Verification Flow

```mermaid
sequenceDiagram
    autonumber
    actor Faculty as 👨‍🏫 Faculty
    actor Student as 🎓 Student (Mobile/Web)
    participant Server as ⚡ Next.js API & Security
    participant AI as 🤖 AI Biometric Engine
    participant DB as 🗄️ Database / Store
    participant LiveStream as 📡 Faculty Live Stream

    %% Phase 1: Faculty Starts Session
    rect rgb(240, 245, 255)
    Note over Faculty,LiveStream: Phase 1: Dynamic Session Generation
    Faculty->>Server: POST /api/qr/create { courseId, expiryMinutes }
    Server->>DB: Create QRSession with crypto code & expiry
    Server-->>Faculty: Return { sessionId, attendUrl, expiresAt }
    Faculty->>Faculty: Display Dynamic QR on Classroom Screen
    end

    %% Phase 2: Student Marks Attendance
    rect rgb(240, 255, 245)
    Note over Faculty,LiveStream: Phase 2: Student Scanning & Biometric Verification
    alt Mobile QR Code Scan
        Student->>Student: Points Native Phone Camera at Screen
        Student->>Server: GET /attend/:sessionId?course=:id
        Server->>DB: POST /api/qr/verify (Check expiry & status)
        Server->>DB: POST /api/attendance (Log GPS & Student Record)
    else AI Face Recognition
        Student->>AI: Capture Webcam Stream
        AI->>AI: Extract 128-D Facial Vector
        Student->>Server: POST /api/face/verify { faceEmbedding }
        Server->>DB: Query Registered FaceProfile
        Server->>AI: Compute Cosine Similarity (Score >= 82%)
        Server->>DB: POST /api/attendance { method: 'FACE' }
    end
    end

    %% Phase 3: Real-Time Broadcast & Dashboard Update
    rect rgb(255, 250, 240)
    Note over Faculty,LiveStream: Phase 3: Real-Time Synchronization
    Server->>LiveStream: Broadcast Attendee Pop-in Event
    LiveStream-->>Faculty: Increment "Present" Counter & Animate Badge
    Server-->>Student: Update Subject Progress (e.g. 22/25 ➔ 23/26)
    end
```

---

### 3. Entity Relationship & Data Model (ERD)

```mermaid
erDiagram
    USER ||--o{ ATTENDANCE : "marks"
    USER ||--o| FACE_PROFILE : "registers"
    USER ||--o{ QR_SESSION : "creates (Faculty)"
    COURSE ||--o{ ATTENDANCE : "records"
    COURSE ||--o{ QR_SESSION : "hosts"

    USER {
        string id PK
        string name
        string email UK
        string password
        string role "STUDENT | FACULTY | ADMIN"
        string department
        string rollNumber
        datetime createdAt
    }

    FACE_PROFILE {
        string id PK
        string userId FK, UK
        string faceEmbedding "128-D Vector JSON"
        boolean verified
        datetime updatedAt
    }

    COURSE {
        string id PK
        string code UK
        string name
        int credits
        string facultyName
        string scheduleTime
        string room
    }

    QR_SESSION {
        string id PK
        string code UK
        string courseId FK
        string createdById FK
        datetime expiresAt
        datetime createdAt
    }

    ATTENDANCE {
        string id PK
        string studentId FK
        string courseId FK
        string method "QR | FACE | MANUAL"
        string status "PRESENT | LATE | ABSENT"
        string location "GPS Lat,Long"
        datetime date
        datetime time
    }
```

---

## ✨ Key Features

### 👤 1. AI Face Recognition & Biometric Matching
- **One-Time Face Profile Registration**: Students capture their biometric face profile via webcam or mobile sensor.
- **128-D Feature Embedding**: Extracts facial descriptors and normalizes unit vectors.
- **Cosine Similarity Verification**: Compares live facial descriptors against stored embeddings with high confidence scoring (~97%).
- **Liveness & Angle Robustness**: Built-in micro-noise tolerance simulating variable lighting and head tilts.

### 📱 2. Dynamic QR Code Attendance
- **On-Screen Session QR**: Faculty projects a time-expiring QR code on classroom displays.
- **Native Phone Camera Scanning**: Students point their smartphone camera at the screen to open `/attend/[sessionId]` and verify attendance automatically.
- **Anti-Proxy Protection**: Cryptographically generated single-session codes with configurable expiry (2, 5, 10, 15 minutes).
- **1-Click Test Simulation**: Test mode available on both student and faculty portals.

### 📡 3. Real-Time Classroom Live Stream
- **Live Faculty Dashboard**: Faculty views incoming student scans in real time as they happen.
- **Live Counters**: Dynamic `Present in Class` counter increments with pulsing indicators while `Absent` decreases.
- **Attendee Stream Feed**: Populates with student initials, name, roll number, verification method (`QR` / `Face`), and exact timestamp.

### 📊 4. Live Student Metrics & Dashboard
- **Live Subject Calculations**: Marking attendance immediately increments subject sessions (e.g. `22/25` ➔ `23/26`) and recalculates percentages.
- **Course Progress Tracking**: Visual progress bars with low attendance alerts (< 75%).
- **Today's Schedule**: Automatically updates subject status from `Upcoming` to `✓ Attended`.
- **Recent Attendance Log**: Comprehensive audit trail of historical attendance submissions.

### 🛡️ 5. Role-Based Access Control (RBAC)
- **Admin Portal**: Institutional analytics, user management, system audit logs.
- **Faculty Portal**: Course scheduling, live QR broadcasting, attendance reports.
- **Student Portal**: Face profile setup, attendance marking, subject progress tracking.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Server Components & Actions) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & Custom Glassmorphism System |
| **Authentication** | [Auth.js / NextAuth v5](https://authjs.dev/) with bcrypt encryption |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) & [Prisma ORM](https://www.prisma.io/) (with automatic memory fallback) |
| **Computer Vision** | [Face-API.js](https://justadudewhohacks.github.io/face-api.js/docs/index.html) |
| **QR Code Engine** | `qrcode` & `html5-qrcode` |
| **Icons & UI** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18.18.0 or higher
- [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), or [yarn](https://yarnpkg.com/)
- (Optional) PostgreSQL database instance

### 1. Clone the Repository
```bash
git clone https://github.com/Sg-2003/Smart-Attendence-System.git
cd Smart-Attendence-System
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/attendai?schema=public"
AUTH_SECRET="your-generated-auth-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. (Optional) Run Database Migrations
If using a PostgreSQL instance:
```bash
npx prisma db push
```
> **Note:** The system includes automatic in-memory fallback stores (`attendanceStore.ts`, `faceStore.ts`, `qrStore.ts`, `userStore.ts`), allowing full functionality even without an active database connection.

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Demo Credentials

You can sign in with any of the following pre-configured accounts:

| Role | Email | Password | Access Level |
|---|---|---|---|
| 👑 **Admin** | `admin@attendai.com` | `admin123` | Full Institutional Management (`/admin`) |
| 👨‍🏫 **Faculty** | `faculty@attendai.com` | `faculty123` | Session Creation & Live QR (`/faculty`) |
| 🎓 **Student** | `student@attendai.com` | `student123` | Face Profile & Attendance (`/student`) |

*Or register a new account on the [Registration Page](http://localhost:3000/register).*

---

## 📂 Project Structure

```text
attendai-pro/
├── prisma/
│   └── schema.prisma                 # Database schema definitions
├── src/
│   ├── app/
│   │   ├── (admin)/admin/            # Admin dashboard & user management
│   │   ├── (auth)/                   # Login & registration pages
│   │   ├── (faculty)/faculty/        # Faculty dashboard & Live QR streaming
│   │   ├── (student)/student/        # Student dashboard, courses, attendance, face profile
│   │   ├── api/
│   │   │   ├── attendance/           # Mark attendance, fetch history, live stream
│   │   │   ├── auth/                 # NextAuth authentication handlers
│   │   │   ├── face/                 # Face registration, verification, stored embeddings
│   │   │   └── qr/                   # QR session creation & verification
│   │   ├── attend/[sessionId]/       # Mobile phone camera attendance target page
│   │   ├── globals.css               # Global Tailwind CSS & glassmorphic tokens
│   │   ├── layout.tsx                # Root layout with MediaErrorSuppressor
│   │   └── page.tsx                  # Modern SaaS landing page
│   ├── components/
│   │   ├── attendance/               # FaceCamera, QRGenerator, QRScanner
│   │   ├── dashboard/                # StatsCard and metrics components
│   │   ├── layout/                   # Navbar, Footer, Admin/Faculty/Student Sidebars
│   │   └── MediaErrorSuppressor.tsx  # Global browser media lifecycle safety
│   ├── lib/
│   │   ├── attendanceStore.ts        # Dynamic live attendance & metrics store
│   │   ├── faceStore.ts              # In-memory biometric embeddings store
│   │   ├── prisma.ts                 # Prisma ORM singleton client
│   │   ├── qrStore.ts                # Dynamic QR session store
│   │   ├── userStore.ts              # In-memory user authentication store
│   │   └── validations.ts            # Zod validation schemas
│   └── auth.ts                       # Auth.js / NextAuth configuration & RBAC callbacks
└── package.json
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user with role assignment |
| `POST` | `/api/attendance` | Mark student attendance (`QR` / `FACE`) |
| `GET` | `/api/attendance` | Fetch attendance history records |
| `GET` | `/api/attendance/live` | Real-time live attendance feed for faculty sessions |
| `POST` | `/api/face/register` | Register student biometric face embedding vector |
| `GET` | `/api/face/register` | Check student face registration status |
| `POST` | `/api/face/verify` | Verify face descriptor using cosine similarity |
| `GET` | `/api/face/stored-embedding` | Retrieve stored face embedding for client matching |
| `POST` | `/api/qr/create` | Generate a new time-expiring attendance QR session |
| `POST` | `/api/qr/verify` | Validate active QR session for mobile scanning |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Developed with ❤️ by <a href="https://github.com/Sg-2003">Sukumar Gope</a>
</div>
