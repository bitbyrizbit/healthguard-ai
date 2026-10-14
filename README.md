# HealthGuard — Patient & Medical Inventory Management System

A production-grade, full-stack healthcare operations platform engineered with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and a **polyglot persistence layer** combining **PostgreSQL (Prisma 7 ORM)**, **MongoDB (Mongoose ODM)**, and local storage. The platform features role-based authentication, interactive transactional data operations, embedded inventory tracking, and multi-stage **Docker Compose** containerization for self-hosted deployment.

---

## 🌟 Key Highlights

- **Next.js 16 App Router & Server Actions**: Zero-client data fetching, streaming responses, dynamic and nested routing, Route Handlers, and cache revalidation (`revalidatePath`).
- **PostgreSQL Layer (Prisma 7 + Driver Adapter)**: Internal hospital announcements powered by Prisma ORM using `@prisma/adapter-pg` with native pg connection pooling and atomic ACID transactions (`prisma.$transaction`).
- **MongoDB Layer (Mongoose ODM)**: Medical supplies and consumable catalog featuring schema-level constraints, enumeration, embedded sub-documents (`IInventory`), and persistent global connection caching for serverless/hot-reload safety.
- **Authentication & RBAC**: Better Auth integration backed by PostgreSQL and managed by Next.js `proxy` (middleware) route guards.
- **Enterprise Containerization**: Multi-stage `Dockerfile` (deps → builder → runner) leveraging Next.js standalone output bundling to create an isolated production image running under an unprivileged `nextjs` Alpine user.

---

## 🏛️ System Architecture

```
                                  HEALTHGUARD PLATFORM
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
   PATIENT RECORDS               INTERNAL ANNOUNCEMENTS            SUPPLY INVENTORY
   (Clinical Management)         (Staff Broadcasts)               (Medical Catalog)
         │                                 │                                 │
   • Server Actions / REST         • Prisma 7 ORM                   • Mongoose ODM
   • Nested Dynamic Routes         • PostgreSQL 16                  • MongoDB 7
   • Client & Server Components    • ACID Transactions              • Embedded Sub-documents
   • Local Data Store              • Relational 1:N User-Post       • Schema Constraints
```

---

## 🛠️ Tech Stack & Database Topology

| Component | Technology | Role & Implementation Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3 (Turbopack) | React 19 Server Components, Nested Layouts, Server Actions |
| **Language** | TypeScript 5 | Strict static typing across schema models, props, and actions |
| **Styling** | Tailwind CSS 4 | Clean, accessible, medical-grade responsive light UI |
| **Relational DB** | PostgreSQL 16 (Alpine) | Structured relational data for staff accounts and announcements |
| **Relational ORM** | Prisma 7.9+ & `@prisma/adapter-pg` | Programmatic config (`prisma.config.ts`), migrations, ACID transactions |
| **Document DB** | MongoDB 7 | Flexible schema for medical catalog and stock replenishment |
| **Document ODM** | Mongoose 9 | Embedded schemas, schema validation, persistent connection caching |
| **Auth & Security** | Better Auth + Next.js Proxy | Session-based authentication, RBAC, edge-compatible proxy protection |
| **Orchestration** | Docker & Docker Compose | Multi-container setup with internal DNS resolution & volume persistence |

---

## 📂 Project Structure

```
healthguard-ai/
├── app/
│   ├── layout.tsx                # Root layout shell with Navbar and Sidebar
│   ├── page.tsx                  # Landing portal
│   ├── dashboard/page.tsx        # System metrics & clinical overview
│   ├── patients/
│   │   ├── layout.tsx            # Nested patient section layout
│   │   ├── page.tsx              # Patient directory with live search & filters
│   │   ├── add/page.tsx          # Patient intake form (Server Actions)
│   │   ├── [id]/page.tsx         # Dynamic patient detail view & editor
│   │   └── actions.ts            # Patient CRUD Server Actions
│   ├── blog-db/                  # Staff Announcements (Prisma + PostgreSQL)
│   │   └── page.tsx              # ACID transactional post creator and feed
│   ├── supplies/                 # Medical Inventory (Mongoose + MongoDB)
│   │   └── page.tsx              # Catalog management & stock updater
│   ├── login/page.tsx            # Authentication portal (OAuth & credentials)
│   ├── actions/
│   │   ├── blogDbActions.ts      # prisma.$transaction mutations
│   │   └── supplyActions.ts      # Mongoose CRUD & inventory atomic updates
│   ├── api/
│   │   ├── auth/[...all]/        # Better Auth route handler
│   │   └── patients/             # Patient REST API route handlers
│   ├── lib/
│   │   ├── mongodb.ts            # Cached Mongoose connection singleton
│   │   └── prisma.ts             # Cached PrismaClient with PostgreSQL adapter
│   └── models/
│       └── MedicalSupply.ts      # Mongoose schema with embedded InventorySchema
├── components/
│   ├── Navbar.tsx                # Navigation header with auth indicator
│   ├── Sidebar.tsx               # Primary dashboard navigation
│   └── AuthButton.tsx            # Dynamic session trigger / user profile
├── lib/
│   ├── auth.ts                   # Better Auth server configuration
│   ├── auth-client.ts            # Client-side auth provider hook
│   └── patients.ts               # Core patient business logic
├── prisma/
│   └── schema.prisma             # PostgreSQL data model (User, Session, Post)
├── docker-compose.yml            # Multi-service stack (Next.js, Postgres, Mongo)
├── Dockerfile                    # Multi-stage production container build
├── next.config.ts                # Standalone output configuration
├── proxy.ts                      # Next.js 16 edge proxy / route security
└── package.json                  # Dependencies & execution scripts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20.19.0+ or v22+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for containerized DBs or full stack)
- Git

---

### Method A: Local Development Setup (Quickest)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bitbyrizbit/healthguard-ai.git
   cd healthguard-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   # PostgreSQL Connection (Docker container mapped to port 5433)
   DATABASE_URL="postgresql://devuser:devpassword@localhost:5433/nextjs_blog_db?schema=public"

   # MongoDB Connection
   MONGODB_URI="mongodb://localhost:27017/healthguard_medical_supplies"

   # Better Auth Settings
   BETTER_AUTH_SECRET="your-super-secret-key-min-32-chars-long"
   BETTER_AUTH_URL="http://localhost:3000"

   # Optional Social OAuth
   GITHUB_CLIENT_ID=""
   GITHUB_CLIENT_SECRET=""
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   ```

4. **Spin up PostgreSQL & MongoDB in background:**
   ```bash
   docker compose up postgres-db mongo-db -d
   ```

5. **Run Prisma Migrations:**
   ```bash
   npx prisma migrate dev --name init_schema
   ```

6. **Start the Next.js development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Method B: Self-Hosted Production Stack via Docker Compose

Run the entire ecosystem (Next.js Standalone + PostgreSQL 16 + MongoDB 7) with a single command:

```bash
docker compose up --build -d
```

- **HealthGuard Web Application**: `http://localhost:3000`
- **PostgreSQL Port**: `localhost:5433` (internally mapped to `5432`)
- **MongoDB Port**: `localhost:27017`

To check container health and live logs:
```bash
docker compose ps
docker compose logs -f next-app
```

To gracefully shut down:
```bash
docker compose down
```

---

## 🔬 Core Module Breakdown

### 1. Clinical Patient Management (`/patients`)
- Built using **Next.js App Router dynamic segments** (`/patients/[id]`) and nested layouts.
- Complete clinical attributes: Name, Age, Gender, Contact Info, Blood Pressure, Cholesterol, Heart Rate, and Residential Address.
- Supports dual mutation patterns: **Server Actions** for seamless progressive enhancement forms and **REST Route Handlers** (`/api/patients`) for API consumption.

### 2. Hospital Announcements & Staff Communication (`/blog-db`)
- Powered by **Prisma 7** using the `@prisma/adapter-pg` driver.
- Demonstrates **ACID Transactions**:
  ```typescript
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email },
      update: { name },
      create: { name, email },
    });
    await tx.post.create({
      data: { title, content, authorId: user.id },
    });
  });
  ```
- Guarantees strict transactional integrity: author creation and post publication either succeed together or rollback completely.

### 3. Medical Supplies & Consumables Inventory (`/supplies`)
- Powered by **MongoDB** and **Mongoose 9**.
- Implements an embedded sub-document pattern (`InventorySchema` inside `MedicalSupplySchema`):
  - SKU validation & automatic uppercase formatting.
  - Non-negative stock count rules.
  - Warehouse bin & shelf tracking.
  - Enumerated categories (`PPE`, `Medication`, `Surgical`, `Diagnostics`, `Other`).
- Connection caching singleton (`mongodb.ts`) ensures serverless functions and development reloads do not exhaust database connections.

### 4. Edge Route Security (`proxy.ts`)
- Next.js 16 compatible proxy layer (modern replacement for `middleware.ts`).
- Intercepts requests to `/dashboard` and protected clinical views, verifying active session cookies and user roles.

---

## 🚢 Deployment Guide

### Option 1: Docker on any VPS / Cloud Server (Recommended for Self-Hosting)
1. Provision a VPS (AWS EC2, DigitalOcean Droplet, Hetzner, Linode).
2. Install Docker and Docker Compose on the host.
3. Clone this repository and populate `.env`.
4. Run:
   ```bash
   docker compose up --build -d
   ```
5. Put Nginx, Caddy, or Cloudflare Tunnel in front of port `3000` for SSL termination.

### Option 2: Managed Cloud (Vercel + Hosted DBs)
1. **Database Provisioning**:
   - Create a free PostgreSQL database on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
   - Create a free MongoDB database on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. **Environment Variables**:
   - In your Vercel project settings, add `DATABASE_URL` (pointing to Neon) and `MONGODB_URI` (pointing to Atlas).
   - Add `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` (set to your Vercel domain).
3. **Deploy**:
   - Connect your GitHub repository to Vercel and trigger the build. Prisma generate and the Next.js build run automatically on deploy.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
