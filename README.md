# 🛡️ CampusShield Pro — Campus Safety & Incident Management Platform

A full-stack, enterprise-grade **Campus Safety, Anti-Ragging, and Incident Management Platform** engineered specifically for university campuses. Built with **Spring Boot 4**, **Java 21**, **MySQL 8.4**, and **React 19 (Vite)**.

---

## 🎯 The Core Problem CampusShield Pro Solves

Traditional college campuses handle grievances, anti-ragging complaints, laboratory hazards, and harassment through slow, paper-based forms or manual complaint boxes. Students often hesitate to report sensitive issues due to fear of retaliation, and faculty lack a unified digital system to investigate and document resolution findings.

**CampusShield Pro digitizes the entire campus safety lifecycle into 3 connected roles:**

```
   [🎓 Student Portal]          [👨‍🏫 Faculty Committee]         [🏛️ Admin Command]
  - Report incidents           - Assigned inquiry queue        - Incident triage
  - Anonymous toggle           - Inspect evidence/CCTV         - Committee assignment
  - Track live status          - Add resolution remarks        - Safety analytics
```

---

## 🌟 Key Functional Modules

### 1. 🎓 Student Safety Portal
- **Emergency Hotline Bar**: Instant access to 24x7 Anti-Ragging Helpline (`1800-180-5522`), Campus Security, and Medical SOS.
- **Incident Reporting Modal**:
  - Categories: **Anti-Ragging**, **Bullying & Harassment**, **Lab & Campus Hazard**, **Property Damage**, **Suspicious Activity**, **Medical Emergency**.
  - Priority levels: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`.
  - Specific campus location (`Science Block, Physics Lab 2`, `Hostel C 2nd Floor`, etc.).
  - **🔒 Anonymous Reporting Mode**: Complete identity masking (`protected@campusshield.internal`) to protect victims reporting ragging or harassment without fear.
- **Live Complaint Tracking**: Real-time status cards showing `REPORTED` ➔ `UNDER_INVESTIGATION` ➔ `RESOLVED`.
- **Official Findings Visibility**: Displays committee resolution remarks and actions taken.

### 2. 👨‍🏫 Faculty Safety Committee Dashboard
- **Active Inquiries Queue**: Filter incidents assigned to the Anti-Ragging Squad, Women's Safety Cell, or Lab Safety Wardens.
- **Case Review & Action Modal**:
  - Update status to `UNDER_INVESTIGATION` or `RESOLVED`.
  - Record official investigation findings and disciplinary sanctions into the permanent audit trail.

### 3. 🏛️ Admin Incident Command Center
- **Safety Analytics KPIs**: Total complaints, pending triage, active inquiries, resolution rate (%), and critical high-priority alerts.
- **Master Incident Triage Table**: Search, filter by category/priority, and assign faculty leads.
- **Master Safety Export**: 1-click download of all safety logs as an Excel/CSV spreadsheet.
- **Campus Roster (Supporting Module)**: Student enrollment directory and **Digital Security Gate Pass Generator** with printable student clearance passes.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 4.1.2, Spring Data JPA, Hibernate ORM, Jakarta Validation, Springdoc OpenAPI 2.8.13 |
| **Frontend** | React 19, Vite 8, Modern CSS (Plus Jakarta Sans, JetBrains Mono, CSS Grid/Flexbox) |
| **Database** | MySQL 8.4+ (Tables: `incidents`, `student`) |
| **Tooling** | Maven Wrapper (`mvnw`), npm |

---

## 📡 REST API Reference

### Campus Incident Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/incidents` | Get all safety incidents (paginated) |
| `GET` | `/incidents/all` | Get full list of all incidents |
| `GET` | `/incidents/{id}` | Get incident details by ID |
| `POST` | `/incidents` | Submit a new safety complaint |
| `PUT` | `/incidents/{id}/status` | Update status & resolution remarks (Faculty/Admin) |
| `PUT` | `/incidents/{id}/assign` | Assign incident to faculty committee (Admin) |
| `GET` | `/incidents/stats` | Get safety analytics & category breakdowns |
| `DELETE` | `/incidents/{id}` | Delete incident record |

### Campus Roster Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/students` | Get enrolled students (paginated & sortable) |
| `POST` | `/students` | Register student in campus roster |
| `PUT` | `/students/{id}` | Update student record |
| `DELETE` | `/students/{id}` | Delete student record |
| `GET` | `/v3/api-docs` | OpenAPI 3 JSON specification |

---

## 🚀 How to Run the Project

### 1. One-Click Launch (Windows)
Double-click:
```bat
start-all.bat
```

### 2. Manual Commands
**Terminal 1 (Backend)**:
```powershell
.\mvnw.cmd spring-boot:run
```
- API & Swagger: `http://localhost:8080/swagger-ui/index.html`

**Terminal 2 (Frontend)**:
```powershell
cd frontend
npm run dev
```
- Web Application: **`http://localhost:5173`**

---

## 🎓 Viva & Placement Presentation Guide

When showcasing CampusShield Pro to evaluators or interviewers:
1. **Explain the Motivation**: *"Traditional colleges lack an anonymous, transparent safety mechanism. CampusShield transforms anti-ragging and campus safety into an auditable digital platform."*
2. **Demonstrate Role Workflows Live**:
   - Use the **Top Role Switcher** to select **🎓 Student Portal**.
   - Click **"Report Safety Incident"** and report a demo Ragging or Lab Hazard incident with the **"Anonymous"** toggle turned ON.
   - Switch to **👨‍🏫 Faculty Committee** to inspect the complaint, review the location, and click **"Investigate"** to enter official resolution remarks.
   - Switch to **🏛️ Admin Command Center** to show the resolution rate percentage update live on the dashboard!
3. **Showcase Database & REST APIs**: Open `http://localhost:8080/swagger-ui/index.html` to showcase the clean Spring Boot controllers and MySQL entity relationships.
