# Chapter One Tech Screen

## Full-Stack: Task Manager web app

Production URL: http://44.210.109.165:3000/

A full-stack (Next.js + Express) task management application with a sprint board interface. Allows users to create, organize, and track tasks with features like filtering, searching, assigning, and archiving.

<img width="1920" height="1080" alt="2026-04-09-210951_hyprshot" src="https://github.com/user-attachments/assets/734619bf-d1f5-4260-abb1-49e389d2c8c3" />

<img width="1916" height="1077" alt="2026-04-09-211007_hyprshot" src="https://github.com/user-attachments/assets/7d4a00f2-c5fe-4f93-a8e4-6146f6e90a25" />

## Prerequisites

- Node.js 20+
- pnpm 9+

## Tech Stack

### Backend

- **Express**
- **Prisma ORM**
- **SQLite**

- **Zod**
- **express-rate-limit** - Rate limiting for archive toggle
- **TypeScript**

### Frontend

- **Next.js 16** -(App Router)
- **React 19**
- **Tailwind**
- **react-toastify**

## Project Structure

```
.
├── apps
│   ├── api                    # Express API server
│   │   ├── prisma
│   │   │   ├── migrations/    # Database migrations
│   │   │   ├── schema.prisma  # Database schema
│   │   │   └── seed.ts        # Seed data script
│   │   └── src
│   │       ├── controllers/   # Request handlers
│   │       ├── routes/        # API routes
│   │       ├── schemas/       # Zod validation schemas
│   │       ├── services/      # Business logic
│   │       ├── lib/           # Prisma client
│   │       ├── utils/         # Utilities (limiter, helpers)
│   │       └── index.ts      # Server entry point
│   │
│   └── web                    # Next.js frontend
│       └── src
│           ├── app/           # Next.js pages
│           │   ├── page.tsx               # Main sprint board
│           │   ├── [taskId]/page.tsx      # Task details page
│           │   ├── layout.tsx
│           │   └── globals.css
│           ├── components/   # React components
│           │   ├── tasks/     # Task-related components
│           │   ├── task-details/  # Task detail components
│           │   └── common/    # Shared components
│           ├── lib/           # API client & utilities
│           ├── types/         # TypeScript types
│           └── constants/     # App constants
│
└── package.json              # Root workspace config
```

## Features

### Core Features

- **Create Task** - Add new tasks with title, description, status, priority, category, and due date
- **View Tasks** - Sprint board view grouped by status (Backlog, In Progress, Blocked, Done)
- **Edit Task** - Update task details, change status, priority, or category
- **Delete Task** - Remove tasks from the board
- **Assign Users** - Assign tasks to team members
- **Archive/Restore** - Archive completed tasks and restore them when needed

### Additional Features

- **Filtering** - Filter tasks by status, priority, category
- **Search** - Search tasks by title or description
- **Pagination** - Paginated task list
- **Comments** - Add comments to tasks
- **Activity Log** - Automatic tracking of task changes
- **Timeline** - Combined view of comments and activities

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint                          | Description                                      |
| ------ | --------------------------------- | ------------------------------------------------ |
| GET    | `/tasks`                          | Get paginated tasks with filters                 |
| GET    | `/tasks/:id`                      | Get single task details                          |
| POST   | `/tasks`                          | Create new task                                  |
| PATCH  | `/tasks/:id`                      | Update task                                      |
| PATCH  | `/tasks/:id/assign`               | Assign/unassign task                             |
| PATCH  | `/tasks/:id/archive/toggle`       | Toggle archive status                            |
| POST   | `/comments`                       | Add comment to task                              |
| GET    | `/comments/task/:taskId/timeline` | Get task timeline (activities and comments logs) |
| GET    | `/users`                          | Get assignable users                             |

## Local Setup

1. **Install dependencies:**

```bash
pnpm install
```

2. **Create `apps/api/.env`:**

```env
DATABASE_URL="file:./prisma/dev.db"
DEFAULT_USER_NAME="Your Name"
CORS_ORIGINS="*"
PORT=5000
```

3. **Setup database:**

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

4. **Start development servers:**

```bash
pnpm dev
```

5. **Access the app:**

- Frontend: `http://localhost:3000`
- API: `http://localhost:5000`
