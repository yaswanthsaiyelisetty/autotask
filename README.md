# AutoTask – AI-Powered Task Automation Platform

A sophisticated, full-stack task management system with AI-powered natural language understanding, WhatsApp integration, and a premium dark UI built with elegant typography and rich animations.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Azure Cosmos DB](https://img.shields.io/badge/Azure%20Cosmos%20DB-0078D4?style=flat&logo=microsoftazure&logoColor=white)
![NVIDIA AI](https://img.shields.io/badge/NVIDIA%20AI-76B900?style=flat&logo=nvidia&logoColor=white)
![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=flat&logo=twilio&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## Features

- **User Authentication** – Secure sign-up/login with JWT tokens, bcrypt password hashing, and unique phone validation
- **Task Management** – Full CRUD with status tracking (pending, completed, missed)
- **Flexible Scheduling** – One-time, daily, weekly, and monthly recurring tasks with time-based reminders
- **AI Task Parsing** – Type naturally ("Remind me to submit project on March 15 at 10 AM") and AI extracts structured task data with auto priority detection
- **AI Daily Schedule** – Generates a motivating daily summary sent every morning at 7 AM via WhatsApp
- **WhatsApp Bot** – Create tasks by messaging the bot directly; reply "done" to complete reminded tasks
- **Automated Reminders** – Cron job checks every minute and sends WhatsApp reminders at the exact scheduled time
- **Premium Dark UI** – Playfair Display serif headings, glassmorphism, gold accents, elegant dividers, smooth cubic-bezier animations, and ambient background orbs
- **Responsive Design** – Mobile-friendly with collapsible sidebar and adaptive layouts
- **Per-User Data Isolation** – Each user only sees their own tasks

---

## Tech Stack

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Frontend    | React 18 + Vite + Tailwind CSS       |
| Backend     | Node.js + Express                    |
| Database    | Azure Cosmos DB (MongoDB API)        |
| AI Model    | NVIDIA Qwen 2.5 Coder 32B Instruct  |
| Messaging   | Twilio WhatsApp Sandbox API          |
| Tunnel      | ngrok (for webhook forwarding)       |
| Automation  | node-cron                            |
| Auth        | JWT + bcryptjs                       |

---

## UI Design

The interface features a premium, fine-dining-inspired dark aesthetic:

- **Typography** – Playfair Display (serif) for headings, Inter (sans-serif) for body text
- **Color Palette** – Deep violet primary (`#8b5cf6`) with gold accents (`#fbbf24`) on a near-black background (`#070b14`)
- **Glass Effects** – Gradient glassmorphism cards with 20px backdrop blur and saturation
- **Animations** – Smooth cubic-bezier (`0.16, 1, 0.3, 1`) transitions, floating ambient orbs, staggered reveals, button hover shimmer
- **Details** – Elegant gradient dividers, decorative corner accents, gradient active indicators, top accent lines on cards

---

## Project Structure

```
autotask/
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIInput.jsx        # AI natural language task input
│   │   │   ├── Layout.jsx         # App shell with ambient orbs
│   │   │   ├── ProtectedRoute.jsx # Auth guard
│   │   │   ├── Sidebar.jsx        # Responsive navigation
│   │   │   ├── StatsCards.jsx     # Dashboard statistics
│   │   │   ├── TaskCard.jsx       # Individual task display
│   │   │   ├── TaskForm.jsx       # Create/edit task modal
│   │   │   └── TodayTasks.jsx     # Today's task list
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state management
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # Main dashboard
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Profile.jsx        # Profile & WhatsApp setup
│   │   │   ├── Signup.jsx         # Registration page
│   │   │   └── Tasks.jsx          # Task management page
│   │   ├── services/
│   │   │   └── api.js             # Axios API layer
│   │   ├── App.jsx                # Router & toast config
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles & design system
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js         # Premium design tokens
│   └── package.json
├── server/                        # Node.js backend
│   ├── config/
│   │   └── db.js                  # Cosmos DB connection
│   ├── controllers/
│   │   ├── authController.js      # Auth + phone uniqueness
│   │   ├── taskController.js      # Task CRUD
│   │   ├── aiController.js        # AI parsing endpoint
│   │   └── whatsappController.js  # Twilio webhook handler
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   └── errorHandler.js        # Global error handler
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Task.js                # Task schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── aiRoutes.js
│   │   └── whatsappRoutes.js
│   ├── services/
│   │   ├── aiService.js           # NVIDIA AI integration
│   │   ├── twilioService.js       # WhatsApp messaging
│   │   └── scheduler.js           # Cron reminders & daily schedule
│   ├── setup-indexes.js           # Cosmos DB index setup
│   ├── server.js                  # Express entry point
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Azure Cosmos DB account (MongoDB API) or MongoDB Atlas
- NVIDIA AI API key (from [build.nvidia.com](https://build.nvidia.com))
- Twilio account with WhatsApp sandbox enabled
- ngrok (for webhook tunneling in development)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/autotask.git
cd autotask
npm run install:all
```

### 2. Configure Environment

```bash
cp .env.example server/.env
```

Edit `server/.env` with your credentials:

| Variable                 | Description                              |
|--------------------------|------------------------------------------|
| `MONGO_URI`              | Azure Cosmos DB or MongoDB connection URI |
| `JWT_SECRET`             | Random secret for JWT signing            |
| `NVIDIA_API_KEY`         | NVIDIA AI API key                        |
| `TWILIO_ACCOUNT_SID`     | Twilio account SID                       |
| `TWILIO_AUTH_TOKEN`       | Twilio auth token                        |
| `TWILIO_WHATSAPP_NUMBER` | Twilio WhatsApp sandbox number           |

### 3. Run Development Servers

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173) concurrently.

### 4. Set Up WhatsApp Webhooks (Development)

```bash
ngrok http 5000
```

Copy the ngrok HTTPS URL and configure it in Twilio Console → WhatsApp Sandbox → Webhook URL:
```
https://your-ngrok-url.ngrok-free.dev/api/whatsapp/webhook
```

---

## API Endpoints

### Auth
| Method | Endpoint           | Description           |
|--------|--------------------|-----------------------|
| POST   | /api/auth/signup   | Create account        |
| POST   | /api/auth/login    | Login                 |
| GET    | /api/auth/me       | Get current user      |
| PUT    | /api/auth/profile  | Update profile        |

### Tasks
| Method | Endpoint                  | Description         |
|--------|---------------------------|---------------------|
| GET    | /api/tasks                | Get all tasks       |
| GET    | /api/tasks/today          | Get today's tasks   |
| GET    | /api/tasks/stats          | Get task statistics |
| POST   | /api/tasks                | Create task         |
| PUT    | /api/tasks/:id            | Update task         |
| DELETE | /api/tasks/:id            | Delete task         |
| PATCH  | /api/tasks/:id/complete   | Mark complete       |

### AI
| Method | Endpoint        | Description                    |
|--------|-----------------|--------------------------------|
| POST   | /api/ai/parse   | Parse natural language to task |

### WhatsApp
| Method | Endpoint               | Description        |
|--------|------------------------|--------------------|
| POST   | /api/whatsapp/webhook  | Twilio webhook     |

---

## WhatsApp Bot Usage

Send messages to the Twilio WhatsApp sandbox number:

- `Remind me to study OS at 8 PM` → Creates a task
- `Submit project tomorrow at 10 AM and attend meeting at 2 PM` → Creates multiple tasks
- `done` → Marks the last reminded task as completed

---

## Skills Demonstrated

- Full-stack development (React 18 + Node.js/Express)
- Premium UI/UX design (Playfair Display, glassmorphism, rich animations)
- Cloud database integration (Azure Cosmos DB with MongoDB API)
- AI integration (NVIDIA API with Qwen model)
- Webhook handling & tunneling (Twilio + ngrok)
- Authentication & authorization (JWT + bcrypt + phone uniqueness)
- Task scheduling & automation (node-cron)
- RESTful API design
- Responsive mobile-first design (Tailwind CSS)

---

## License

MIT
