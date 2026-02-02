# Phase 3: Add Your Backend Connections

**Started:** 2026-02-02
**Status:** In Progress
**Estimated Time:** 2-3 hours

---

## 🎯 Objectives

Connect the Next.js frontend to existing backend infrastructure:
- MongoDB (primary document store)
- FalkorDB (graph database for agent registry)
- Redis (caching layer)

---

## 📋 Tasks

### Task 3.1: Install Database Clients
- [ ] Install MongoDB driver (`mongodb`)
- [ ] Install Redis client (`redis`)
- [ ] Install FalkorDB client (`falkordb`)
- [ ] Install React Query for API state management (`@tanstack/react-query`)

### Task 3.2: Create Connection Utilities
- [ ] Create `src/libs/mongodb.ts` - MongoDB connection singleton
- [ ] Create `src/libs/falkordb.ts` - FalkorDB connection singleton
- [ ] Create `src/libs/redis.ts` - Redis connection singleton

### Task 3.3: Configure Environment Variables
- [ ] Create `.env.local` with database URIs
- [ ] Update `.env.example` with new variables
- [ ] Add environment validation

### Task 3.4: Test Connections
- [ ] Create test script to verify MongoDB connection
- [ ] Create test script to verify FalkorDB connection
- [ ] Create test script to verify Redis connection
- [ ] Run all connection tests

### Task 3.5: Create API Routes (Next.js)
- [ ] Create `/api/health` endpoint to test DB connections
- [ ] Create `/api/test/mongodb` endpoint
- [ ] Create `/api/test/falkordb` endpoint
- [ ] Create `/api/test/redis` endpoint

---

## 🔧 Implementation Details

### Database Configuration

**MongoDB:**
- URI: `mongodb://host.docker.internal:27017/opencitylabs`
- Database: `opencitylabs`
- Collections: users, organizations, billing, agents, training_jobs

**FalkorDB:**
- Host: `localhost` (or Docker service)
- Port: `6379` (Redis protocol)
- Graphs: `ocl_agent_registry`, `ocl_directory`, `ocl_provenance`

**Redis:**
- Host: `localhost` (or Docker service)
- Port: `6379`
- Use: Caching, sessions

---

## 📦 Package Installation Commands

```bash
cd /Users/Owner/opencitylabs/alignhealthcare

# Install database clients
npm install mongodb redis falkordb

# Install React Query for API state management
npm install @tanstack/react-query

# Install types
npm install -D @types/mongodb
```

---

## 🔐 Environment Variables

Create `.env.local`:
```env
# MongoDB
MONGODB_URI=mongodb://host.docker.internal:27017/opencitylabs
MONGODB_DATABASE=opencitylabs

# FalkorDB
FALKORDB_HOST=localhost
FALKORDB_PORT=6379
FALKORDB_GRAPH_NAME=ocl_agent_registry

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:8082
PYTHON_API_URL=http://localhost:8082
NODE_API_URL=http://localhost:8081
```

---

## 📝 Files to Create

1. **`src/libs/mongodb.ts`** - MongoDB connection utility
2. **`src/libs/falkordb.ts`** - FalkorDB connection utility
3. **`src/libs/redis.ts`** - Redis connection utility
4. **`src/app/api/health/route.ts`** - Health check endpoint
5. **`src/app/api/test/mongodb/route.ts`** - MongoDB test endpoint
6. **`src/app/api/test/falkordb/route.ts`** - FalkorDB test endpoint
7. **`src/app/api/test/redis/route.ts`** - Redis test endpoint
8. **`.env.local`** - Local environment configuration

---

## ✅ Success Criteria

- [ ] All packages installed without errors
- [ ] Connection utilities created
- [ ] Environment variables configured
- [ ] MongoDB connection test passes
- [ ] FalkorDB connection test passes
- [ ] Redis connection test passes
- [ ] Health check endpoint returns 200
- [ ] No TypeScript errors
- [ ] Production build still succeeds

---

**Status:** Ready to begin
**Next Step:** Install database client packages
