# AutoTask – AI-Powered Task Automation Platform

An intelligent task management system that lets you create tasks via a web dashboard or WhatsApp messages, with AI-powered natural language understanding and automated WhatsApp reminders.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)
![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=flat&logo=twilio&logoColor=white)

---

## Features

- **User Authentication** – Secure sign-up/login with JWT tokens and hashed passwords
- **Task Management** – Create, edit, delete, and mark tasks as complete
- **Date + Time Scheduling** – One-time, daily, weekly, and monthly recurring tasks
- **AI Task Parsing** – Type naturally ("Remind me to submit project on March 15 at 10 AM") and AI extracts structured task data
- **AI Priority Detection** – Automatically detects urgent tasks and marks them high priority
- **AI Daily Schedule** – Generates a motivating daily summary sent every morning via WhatsApp
- **WhatsApp Bot** – Create tasks by messaging the WhatsApp bot directly
- **Automated Reminders** – Cron job checks every minute and sends WhatsApp reminders at the right time
- **Professional Dashboard** – Stats cards, today's tasks, and AI quick-add input
- **Per-User Data Isolation** – Each user only sees their own tasks

---

## Tech Stack

| Layer        | Technology           |
|-------------|----------------------|
| Frontend    | React + Vite + Tailwind CSS |
| Backend     | Node.js + Express    |
| Database    | MongoDB Atlas        |
| AI          | OpenAI GPT-3.5       |
| Messaging   | Twilio WhatsApp API  |
| Automation  | node-cron            |

---

## Project Structure

```
autotask/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Auth context provider
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── App.jsx            # Router & app shell
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                    # Node.js backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Auth endpoints
│   │   ├── taskController.js  # Task CRUD
│   │   ├── aiController.js    # AI parsing endpoint
│   │   └── whatsappController.js  # Twilio webhook
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── aiRoutes.js
│   │   └── whatsappRoutes.js
│   ├── services/
│   │   ├── aiService.js       # OpenAI integration
│   │   ├── twilioService.js   # WhatsApp messaging
│   │   └── scheduler.js       # Cron job system
│   ├── server.js              # Express app entry
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
- MongoDB Atlas account
- OpenAI API key
- Twilio account with WhatsApp sandbox

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

Edit `server/.env` with your actual credentials:

- **MONGO_URI** – Your MongoDB Atlas connection string
- **JWT_SECRET** – A random secret string for JWT signing
- **OPENAI_API_KEY** – Your OpenAI API key
- **TWILIO_ACCOUNT_SID** – From Twilio console
- **TWILIO_AUTH_TOKEN** – From Twilio console
- **TWILIO_WHATSAPP_NUMBER** – Twilio WhatsApp sandbox number

### 3. Run Development Servers

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173) concurrently.

---

## API Endpoints

### Auth
| Method | Endpoint           | Description       |
|--------|--------------------|--------------------|
| POST   | /api/auth/signup   | Create account     |
| POST   | /api/auth/login    | Login              |
| GET    | /api/auth/me       | Get current user   |
| PUT    | /api/auth/profile  | Update profile     |

### Tasks
| Method | Endpoint                  | Description        |
|--------|---------------------------|--------------------|
| GET    | /api/tasks                | Get all tasks      |
| GET    | /api/tasks/today          | Get today's tasks  |
| GET    | /api/tasks/stats          | Get task stats     |
| POST   | /api/tasks                | Create task        |
| PUT    | /api/tasks/:id            | Update task        |
| DELETE | /api/tasks/:id            | Delete task        |
| PATCH  | /api/tasks/:id/complete   | Mark complete      |

### AI
| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| POST   | /api/ai/parse   | Parse natural language   |

### WhatsApp
| Method | Endpoint               | Description           |
|--------|------------------------|-----------------------|
| POST   | /api/whatsapp/webhook  | Twilio webhook        |

---

## WhatsApp Bot Usage

Send messages to the Twilio WhatsApp sandbox number:

- `Remind me to study OS at 8 PM` → Creates a task
- `Submit project tomorrow at 10 AM and attend meeting at 2 PM` → Creates multiple tasks
- `done` → Marks the last reminded task as completed

---

## Skills Demonstrated

- Full-stack development (React + Node.js)
- Authentication & authorization (JWT + bcrypt)
- AI integration (OpenAI API)
- Webhook handling (Twilio)
- Task scheduling & automation (node-cron)
- RESTful API design
- Database modeling (MongoDB/Mongoose)
- Responsive UI with Tailwind CSS

---

## License

MIT
