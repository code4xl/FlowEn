# 🌐 FlowEn – Agent Workflow Builder & Executor

FlowEn is a powerful, drag-and-drop agent workflow builder that allows users to create, manage, and execute multi-step workflows using AI agents, tool integrations, and scheduling triggers. Designed with a sleek, modern UI and a focus on flexibility, FlowEn empowers users to automate tasks across platforms — without relying on third-party builders.

---

## 🚀 Features

* ⚙️ **Drag-and-Drop Workflow Builder** using React Flow
* 🤖 **AI Agent Integration** with configurable LLMs (OpenAI, Gemini, Anthropic)
* 🔗 **Custom Tool Integration** (Gmail, Google Calendar, GitHub, Google Sheets, Supabase) – built from scratch
* ⏱️ **Trigger-Based Execution** (daily, weekly, monthly, cron support)
* 🔒 **Secure JWT Authentication** with Email + OTP verification
* 🎨 **Modern UI** with dark/light theme (default: Persian Blue dark theme)
* 🗂️ **Dashboard** to manage active, inactive, and executed workflows
* 📥 **Workflow Data Persistence** with JSON-based graph storage
* 📨 **Email-Based OTP system** for registration and password recovery
* 🔁 **Dynamic Node Rendering** – nodes fetched from database and auto-generated based on schema

---

## 🏗️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Redux Toolkit, React Flow, Framer Motion
* **Backend:** Node.js, Express.js, FastAPI (for AI/ML tasks)
* **Database:** Supabase (PostgreSQL, Storage)
* **Auth:** JWT-based auth, Email OTP (Nodemailer/Resend)
* **Deployment:** Vercel, Render (Frontend + Backend separately)
---

## 🔐 Authentication Flow

1. User registers or logs in using email.
2. Email OTP is sent for verification.
3. JWT token is stored securely in cookies.
4. Protected routes require cookie-based session validation.

---

## ⚙️ Running Locally

### Backend

```bash
cd flowen-backend
npm install
npm run dev
```

### Frontend

```bash
cd flowen-frontend
npm install
npm run dev
```

## ✨ Future Improvements

* 🔄 Workflow versioning
* 🖼️ Visual execution tracking
* 📈 Execution analytics dashboard
* 📤 Export/Import workflows

---