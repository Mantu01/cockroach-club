# Cockroach Club — Monorepo

Welcome to **Cockroach Club**, a resilient platform built to survive modern ATS automated rejections and interview processes. This project is structured as a monorepo managed by [Turborepo](https://turborepo.org/) and uses `pnpm` as the package manager.

## 🏗️ Repository Architecture

This monorepo consists of:

### Apps (`/apps`)
- **`web`**: A modern and dense Next.js client application serving as the primary survival interface (Studio, Dashboard, Resume Forge, Settings).
- **`api`**: A Node.js / Express backend service providing persistent endpoints, Clerk webhook processing, database sync, and prep management.

### Shared Packages (`/packages`)
- **`@repo/eslint-config`**: Shared ESLint configurations across the workspaces.
- **`@repo/typescript-config`**: Shared compiler settings and tsconfig blueprints.

---

## ⚙️ Configuration & Environment

Before starting the application, configure the environments for both apps. Sample files are provided in their respective directories.

### Web Client (`apps/web/.env.sample`)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Express API (`apps/api/.env.sample`)
```env
PORT=5000
MONGODB_URI="mongodb://127.0.0.1:27017/cockroach-club"
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

---

## 🚀 Setting Up the Application

Follow these steps to configure and run Cockroach Club locally:

### 1. Prerequisites
- **Node.js**: Ensure Node.js (version `>=18.0.0`) is installed.
- **pnpm**: Install pnpm if not already present:
  ```sh
  npm install -g pnpm
  ```
- **MongoDB**: Ensure a local MongoDB instance is running, or obtain a remote connection string.

### 2. Install Dependencies
Run the following command at the root of the workspace to install all packages:
```sh
pnpm install
```

### 3. Configure Environments
Copy the sample environment files to live config files:
```sh
cp apps/web/.env.sample apps/web/.env.local
cp apps/api/.env.sample apps/api/.env
```
Fill in the values for Clerk authentication and MongoDB connection.

### 4. Running the App Locally (Development Mode)
Start the dev servers for both the Express api and the Next.js client concurrently:
```sh
pnpm dev
```
- Web App URL: [http://localhost:3000](http://localhost:3000)
- Backend API URL: [http://localhost:5000](http://localhost:5000)

### 5. Running Build
Build all workspaces for production:
```sh
pnpm build
```

---

## 🛠️ Workspaces & Commands

You can run commands for specific workspaces using pnpm filters or turbo filters:

- **Run only the web client**:
  ```sh
  pnpm --filter web dev
  ```
- **Run only the backend api**:
  ```sh
  pnpm --filter api dev
  ```
- **Lint the whole codebase**:
  ```sh
  pnpm lint
  ```
- **Format code using Prettier**:
  ```sh
  pnpm format
  ```
