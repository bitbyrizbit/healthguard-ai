# HealthGuard — Patient & Medical Inventory Management System

A full-stack healthcare operations platform engineered with Next.js 16 (App Router), TypeScript, Tailwind CSS, and a polyglot persistence architecture integrating PostgreSQL (via Prisma 7 ORM) and MongoDB (via Mongoose 9 ODM). The platform implements dynamic routing, server actions, transactional relational data operations, embedded document schemas, session-based authentication with role-based access control, and containerized deployment via Docker Compose.

---

## 1. Project Overview & Motivation

HealthGuard is designed to serve as an integrated clinical operations system. Modern enterprise systems typically manage distinct data workloads that benefit from different database paradigms:

- **Relational Data (PostgreSQL)**: Handles structured entities requiring strict referential integrity, foreign key relations, and ACID transactions (e.g., internal staff communications, user accounts, authentication sessions).
- **Document-Oriented Data (MongoDB)**: Handles semi-structured, nested entities with flexible schemas (e.g., medical supplies, consumables catalog, warehouse inventory with sub-document specifications).
- **Core Clinical Patient Records**: Demonstrates file-system App Router design, nested layouts, Server Actions for mutations, and Route Handlers for external REST integration.

---

## 2. System Architecture & Data Flow

```
                                HEALTHGUARD PLATFORM
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                                │                                │
  PATIENT RECORDS              STAFF ANNOUNCEMENTS              SUPPLY INVENTORY
(Clinical Management)         (Relational / ACID)             (Document / Catalog)
        │                                │                                │
  Data: Local Store / REST       Data: PostgreSQL 16              Data: MongoDB 7
  Engine: Server Actions         Engine: Prisma 7 ORM             Engine: Mongoose 9 ODM
  Routes: /patients, /patients/[id] Route: /blog-db               Route: /supplies
  Pattern: Dynamic Segments      Pattern: Interactive Tx          Pattern: Embedded Subdocs
```

### Request and Data Flow
1. **Client Interaction**: Client requests enter through Next.js 16 App Router pages.
2. **Proxy / Middleware Layer (`proxy.ts`)**: Requests to protected routes (such as `/dashboard`) are evaluated against active session credentials managed by Better Auth.
3. **Server Execution**:
   - Patient mutations trigger Server Actions (`app/patients/actions.ts`), invoking file system utilities with automatic path revalidation (`revalidatePath`).
   - Announcements trigger `createAuthorWithPostAction`, which executes an interactive ACID transaction via Prisma 7 across the User and Post tables in PostgreSQL.
   - Medical inventory updates trigger Mongoose operations (`app/actions/supplyActions.ts`), utilizing a cached MongoDB connection to insert or update documents containing embedded inventory schemas.

---

## 3. Core Modules & Implementation Details

### 3.1 Clinical Patient Management (`/patients`)
- **Routing Structure**:
  - `/patients`: Directory listing supporting real-time search and clinical status filtering.
  - `/patients/add`: Intake form for onboarding new patients.
  - `/patients/[id]`: Dynamic route segment rendering individual medical history, vital signs (Blood Pressure, Heart Rate, Cholesterol), and edit capabilities.
  - `app/patients/layout.tsx`: Nested layout providing dedicated sub-navigation across patient views.
- **Data Handling**:
  - Implements full CRUD operations (Create, Read, Update, Delete).
  - Uses Server Actions with progressive enhancement, eliminating manual fetch boilerplate.
  - Provides REST Route Handlers at `/api/patients` and `/api/patients/[id]` for external system interoperability.

### 3.2 Staff Announcements & Broadcasts (`/blog-db`)
- **Technology**: PostgreSQL 16, Prisma 7 ORM, `@prisma/adapter-pg` driver.
- **Data Modeling**: Relational 1:N relationship between `User` (Author) and `Post` (Announcement).
- **ACID Transaction Implementation**:
  ```typescript
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email },
      update: { name },
      create: { name, email },
    });

    await tx.post.create({
      data: {
        title,
        content,
        authorId: user.id,
      },
    });
  });
  ```
  This interactive transaction guarantees that author upsert and post creation execute as an atomic unit. If either query fails, all operations roll back entirely, preventing orphaned records.

### 3.3 Medical Supplies Catalog & Inventory (`/supplies`)
- **Technology**: MongoDB 7, Mongoose 9 ODM.
- **Embedded Schema Architecture**:
  - Primary document: `MedicalSupply` (Title, Slug, Price, Category, Tags, InStock status).
  - Embedded sub-document: `Inventory` (SKU, Stock Count, Warehouse Location).
- **Schema Validation Rules**:
  - SKU validation: Mandatory, trimmed, uppercase enforcement.
  - Stock validation: Non-negative numerical constraints (`min: [0, 'Stock cannot be negative']`).
  - Enumeration: Category restricted to `['PPE', 'Medication', 'Surgical', 'Diagnostics', 'Other']`.
- **Persistent Connection Cache (`app/lib/mongodb.ts`)**:
  Next.js development and serverless environments frequently reload execution contexts. The connection utility caches the Mongoose connection promise globally (`global.mongooseCache`), preventing socket exhaustion.

### 3.4 Authentication & Route Protection (`proxy.ts`, `lib/auth.ts`)
- **Authentication Engine**: Better Auth configured with a Prisma PostgreSQL adapter.
- **Access Control**: Role-based access control supporting guest and administrator privilege tiers.
- **Next.js 16 Edge Proxy**: Implemented in `proxy.ts` (the Next.js 16 convention replacing legacy middleware). Evaluates session tokens before delegating requests to route handlers or views.

### 3.5 Docker Multi-Stage Containerization
- **Output Mode**: Configured with `output: "standalone"` in `next.config.ts`.
- **Build Stages**:
  1. `deps`: Installs production dependencies using `npm ci` on Node 20 Alpine.
  2. `builder`: Generates Prisma clients, compiles TypeScript, and runs Next.js standalone build.
  3. `runner`: Minimal Alpine Linux image containing only standalone artifacts and static assets. Runs under an unprivileged `nextjs` system user for container security.
- **Compose Orchestration (`docker-compose.yml`)**:
  Defines three interconnected services: `next-app`, `postgres-db`, and `mongo-db`, using Docker internal network DNS (`postgres-db:5432`, `mongo-db:27017`) with named persistent storage volumes.

---

## 4. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| Application Framework | Next.js (App Router) | 16.3.1 | Core application server, routing, server actions |
| Language | TypeScript | 5.x | Static typing, interface definitions |
| UI Styling | Tailwind CSS | 4.x | Responsive styling, component layouts |
| Relational Database | PostgreSQL | 16-alpine | User accounts, sessions, internal announcements |
| Relational ORM | Prisma | 7.9+ | Migrations, query construction, ACID transactions |
| Relational Driver | pg + @prisma/adapter-pg | 8.x / 7.x | Connection pooling and native driver adapter |
| Document Database | MongoDB | 7.x | Medical supplies and inventory catalog |
| Document ODM | Mongoose | 9.x | Schema modeling, validation, embedded sub-documents |
| Authentication | Better Auth | 1.7.x | Session management, OAuth, user schema |
| Containerization | Docker & Docker Compose | Engine 24+ | Multi-stage image build, service orchestration |

---

## 5. Repository Directory Structure

```
healthguard-ai/
├── app/
│   ├── layout.tsx                  # Root layout shell with navigation
│   ├── page.tsx                    # Application home page
│   ├── dashboard/page.tsx          # System analytics and overview
│   ├── patients/                   # Patient records module
│   │   ├── layout.tsx              # Nested patient navigation layout
│   │   ├── page.tsx                # Patient directory with filtering
│   │   ├── add/page.tsx            # Patient registration form
│   │   ├── [id]/page.tsx           # Dynamic individual record view
│   │   └── actions.ts              # Server Actions for patient mutations
│   ├── blog-db/                    # Staff announcements module (Prisma + Postgres)
│   │   └── page.tsx                # Announcement list and publication form
│   ├── supplies/                   # Medical supplies module (Mongoose + MongoDB)
│   │   └── page.tsx                # Catalog view and stock submission form
│   ├── login/page.tsx              # Authentication entry point
│   ├── actions/
│   │   ├── blogDbActions.ts        # ACID transactional mutations for announcements
│   │   └── supplyActions.ts        # Mongoose server actions for inventory
│   ├── api/
│   │   ├── auth/[...all]/          # Better Auth API route handler
│   │   └── patients/               # Patient REST API route handlers
│   │       ├── route.ts            # GET (list) and POST (create)
│   │       └── [id]/route.ts       # GET, PUT, DELETE by patient ID
│   ├── lib/
│   │   ├── mongodb.ts              # Global cached Mongoose connection
│   │   └── prisma.ts               # PrismaClient instance with PostgreSQL adapter
│   └── models/
│       └── MedicalSupply.ts        # Mongoose schema with embedded InventorySchema
├── components/
│   ├── Navbar.tsx                  # Header navigation bar
│   ├── Sidebar.tsx                 # Main application sidebar navigation
│   └── AuthButton.tsx              # User authentication status indicator
├── lib/
│   ├── auth.ts                     # Better Auth configuration
│   ├── auth-client.ts              # Client-side authentication helpers
│   └── patients.ts                 # Patient business logic and data access
├── prisma/
│   ├── schema.prisma               # Prisma schema defining User, Session, Post
│   └── migrations/                 # PostgreSQL database migrations
├── docker-compose.yml              # Multi-container orchestration definition
├── Dockerfile                      # Three-stage production Docker build
├── next.config.ts                  # Next.js configuration with standalone output
├── prisma.config.ts                # Prisma 7 programmatic configuration
├── proxy.ts                        # Next.js 16 edge proxy / route security
├── package.json                    # Project metadata, scripts, and dependencies
└── tsconfig.json                   # TypeScript compiler configuration
```

---

## 6. Database Schemas

### 6.1 PostgreSQL Relational Model (`prisma/schema.prisma`)
```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified Boolean?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @default(now()) @updatedAt
  role          String    @default("guest")
  posts         Post[]
  sessions      Session[]
  accounts      Account[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(true)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 6.2 MongoDB Document Model (`app/models/MedicalSupply.ts`)
```typescript
interface IInventory {
  sku: string;
  stock: number;
  warehouseLocation: string;
}

interface IMedicalSupply extends Document {
  title: string;
  slug: string;
  price: number;
  category: 'PPE' | 'Medication' | 'Surgical' | 'Diagnostics' | 'Other';
  tags: string[];
  inventory: IInventory;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 7. REST API Endpoints

| Method | Endpoint | Description | Payload / Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/patients` | Retrieve list of all patient records | None |
| `POST` | `/api/patients` | Create a new patient record | JSON Patient object |
| `GET` | `/api/patients/:id` | Fetch details of a specific patient | URL parameter `id` |
| `PUT` | `/api/patients/:id` | Update patient record | JSON partial Patient object |
| `DELETE` | `/api/patients/:id` | Remove patient record | URL parameter `id` |
| `ALL` | `/api/auth/*` | Better Auth session and OAuth routes | Managed by auth client |

---

## 8. Local Setup & Execution Guide

### Prerequisites
- Node.js v20.19.0+ or v22+
- Docker Desktop
- npm v10+

### Step 1: Clone Repository & Install Dependencies
```bash
git clone https://github.com/bitbyrizbit/healthguard-ai.git
cd healthguard-ai
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the project root:
```env
# PostgreSQL connection (port 5433 when mapped through local docker-compose)
DATABASE_URL="postgresql://devuser:devpassword@localhost:5433/nextjs_blog_db?schema=public"

# MongoDB connection
MONGODB_URI="mongodb://localhost:27017/healthguard_medical_supplies"

# Authentication
BETTER_AUTH_SECRET="your-32-character-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
```

### Step 3: Run with Docker Compose
To start the entire environment (Application + PostgreSQL + MongoDB):
```bash
docker compose up --build -d
```

The application will be accessible at: `http://localhost:3000`

### Step 4: Standalone Development Mode
To run database containers in the background while running the Next.js dev server on the host:
```bash
# Start only database containers
docker compose up postgres-db mongo-db -d

# Apply Prisma migrations
npx prisma migrate dev --name init_schema

# Start Next.js development server
npm run dev
```

---

## 9. Verification & Testing Checklist

- **Patient Management**: Navigate to `/patients` to verify listing, addition via `/patients/add`, and individual record updates at `/patients/[id]`.
- **Relational Integrity**: Navigate to `/blog-db` and submit an announcement to verify author upsert and post linking via PostgreSQL transaction.
- **Document Store**: Navigate to `/supplies` and submit an item to verify embedded inventory sub-document insertion in MongoDB.
- **Container Health**: Execute `docker ps` to verify `healthguard_next_app`, `nextjs_postgres_db`, and `nextjs_mongo_db` containers are running.
