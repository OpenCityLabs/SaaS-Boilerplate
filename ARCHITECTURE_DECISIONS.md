# Architecture Decisions for alignhealthcare.ai Migration

**Date:** 2026-02-02
**Status:** Planning Phase Complete

---

## ✅ DECISION: Option A - Frontend Only (CONFIRMED)

We will use the SaaS Boilerplate **UI/components only** and keep our existing backend infrastructure.

---

## Current Infrastructure (ocl.network)

### Databases
- ✅ **MongoDB** (opencitylabs database)
  - Collections: users, organizations, api_keys, agent_usage, agents, training_jobs
  - Running on: host.docker.internal:27017
  - **KEEP THIS** - working perfectly

- ✅ **FalkorDB** (Graph database via Redis module)
  - Graphs: ocl_agent_registry, ocl_directory, ocl_provenance
  - Running on: localhost:6380
  - **KEEP THIS** - critical for agent relationships

- ✅ **Redis** (Caching)
  - Running on: localhost:6381
  - **KEEP THIS** - used for sessions/cache

### Authentication System
- ✅ **Custom FastAPI Auth** (L0-L3 verification)
  - Email/password registration
  - Email verification (L1)
  - 2FA TOTP + SMS (L2)
  - Organization verification (L3)
  - Password reset
  - API key management
  - **KEEP THIS** - unique 2FA implementation

### Backend APIs
- ✅ **Python FastAPI** (port 8082)
  - Endpoints: auth, embeddings, training, agents, billing
  - Deployed: Docker on Google Cloud Run
  - **KEEP THIS** - production-ready

- ✅ **Node.js API** (port 8081)
  - Recommendations & orchestration
  - **KEEP THIS** - working well

### Current Landing Page
- **docs-site/** (Next.js 14)
  - Pages to migrate:
    - / (home page with cards)
    - /docs/* (documentation)
    - /dashboard (authenticated)
    - /training (authenticated)
    - /agents (authenticated)
    - /onboarding (authenticated)

---

## SaaS Boilerplate (What We're Adding)

### What It Includes (WILL USE)
- ✅ Next.js 14 + TypeScript + Tailwind CSS
- ✅ Shadcn UI components (beautiful, modern)
- ✅ Landing page templates (hero, features, pricing)
- ✅ Responsive design
- ✅ SEO optimization
- ✅ i18n support (multi-language)
- ✅ Monitoring (Sentry)
- ✅ Testing framework (Vitest, Playwright)

### What It Includes (WILL REMOVE)
- ❌ **Clerk** authentication - conflicts with our custom auth
- ❌ **Drizzle ORM** - SQL only, we use MongoDB
- ❌ **PostgreSQL/PGlite** - we use MongoDB + FalkorDB
- ❌ **Stripe billing** (optional) - we have custom billing in MongoDB

---

## Proposed Architecture

```
┌─────────────────────────────────────────────┐
│ alignhealthcare.ai                          │
│ (SaaS Boilerplate - Marketing Only)        │
│ ├── Landing page (hero, features, pricing) │
│ ├── /about                                  │
│ ├── /pricing                                │
│ ├── /contact                                │
│ └── Static content                          │
│                                             │
│ NO database connections needed              │
│ NO auth needed (just marketing)             │
└─────────────────────────────────────────────┘
              │
              │ Sign up / Login CTAs
              ▼
┌─────────────────────────────────────────────┐
│ app.alignhealthcare.ai                      │
│ (Your docs-site Rebranded)                 │
│ ├── /dashboard (authenticated)              │
│ ├── /teams (authenticated)                  │
│ ├── /training (authenticated)               │
│ ├── /agents (authenticated)                 │
│ ├── /onboarding (auth flow)                 │
│ └── /docs                                   │
│                                             │
│ Backend connections:                        │
│ ├── MongoDB ✅                              │
│ ├── FalkorDB ✅                             │
│ └── Redis ✅                                │
└─────────────────────────────────────────────┘
              │
              │ API calls
              ▼
┌─────────────────────────────────────────────┐
│ api.alignhealthcare.ai                      │
│ (Your FastAPI Backend - Unchanged)         │
│ ├── POST /v1/auth/register                  │
│ ├── POST /v1/auth/login                     │
│ ├── POST /v1/auth/2fa/setup                 │
│ ├── POST /v1/embeddings                     │
│ ├── GET  /v1/billing/usage/summary          │
│ └── All existing endpoints                  │
│                                             │
│ Database layer:                             │
│ ├── MongoDB (users, billing, FHIR)          │
│ ├── FalkorDB (agent registry)               │
│ └── Redis (caching)                         │
└─────────────────────────────────────────────┘
```

---

## Domain Strategy

### DNS Configuration (Cloudflare)
```
alignhealthcare.ai          → CloudRun (marketing site)
www.alignhealthcare.ai      → CloudRun (marketing site)
app.alignhealthcare.ai      → CloudRun (platform/docs-site)
api.alignhealthcare.ai      → CloudRun (FastAPI backend)
```

### User Flow
1. User visits `alignhealthcare.ai` → sees marketing page
2. Clicks "Start Free Trial" → redirects to `app.alignhealthcare.ai/signup`
3. After signup → `app.alignhealthcare.ai/onboarding`
4. After onboarding → `app.alignhealthcare.ai/dashboard`
5. User never sees "ocl.network" ✅

---

## Database Strategy: KEEP MONGODB + FALKORDB

### Why NOT PostgreSQL?
- ❌ Would require migrating all MongoDB collections
- ❌ Would lose graph database capabilities (FalkorDB)
- ❌ Would need to rewrite all queries
- ❌ 4-6 weeks of migration work
- ❌ High risk of data loss
- ❌ MongoDB already optimized and working

### Why KEEP MongoDB + FalkorDB?
- ✅ Already working in production
- ✅ All data already in MongoDB
- ✅ FalkorDB provides graph capabilities PostgreSQL lacks
- ✅ Zero migration effort
- ✅ Proven stable and fast
- ✅ Billing system already uses MongoDB

---

## Authentication Strategy: KEEP CUSTOM AUTH

### Why NOT Clerk?
- ❌ We already have L0-L3 verification system
- ❌ We have 2FA TOTP + SMS working
- ❌ We have organization verification
- ❌ Clerk doesn't support our verification levels
- ❌ Would lose custom onboarding flow

### Why KEEP Custom Auth?
- ✅ Unique L0-L3 verification levels
- ✅ 2FA with TOTP and SMS
- ✅ Organization verification
- ✅ Custom onboarding flow
- ✅ Already integrated with MongoDB
- ✅ API key management built-in

### How to Integrate
```typescript
// alignhealthcare.ai (marketing) - NO auth
// Just CTA buttons that link to app.alignhealthcare.ai

// app.alignhealthcare.ai - Your auth system
// Copy existing auth components from docs-site
```

---

## Billing Strategy: KEEP MONGODB BILLING

### Why NOT Stripe from Boilerplate?
- ❌ We already have usage tracking in MongoDB
- ❌ We already track per-customer costs
- ❌ We already generate invoices
- ❌ Stripe integration is complex

### Why KEEP MongoDB Billing?
- ✅ Per-customer usage tracking ✅
- ✅ Provider cost breakdown (Google, OpenAI, Anthropic)
- ✅ OCL markup calculation (35-40%)
- ✅ Invoice generation working
- ✅ Billing endpoints ready

---

## Deployment Strategy: GOOGLE CLOUD RUN

### Why Google Cloud Run?
- ✅ Already deployed there (docs-site, APIs)
- ✅ Easy MongoDB connections (same VPC)
- ✅ Familiar deployment process
- ✅ Docker-based (we have Dockerfiles)
- ✅ Auto-scaling built-in
- ✅ Custom domain mapping easy

### Why NOT Cloudflare Pages?
- ⚠️ Edge Runtime has Node.js limitations
- ⚠️ MongoDB connections need external setup
- ⚠️ More complex configuration
- ⚠️ Less familiar to our team

### Why NOT Vercel?
- ⚠️ MongoDB connections are external
- ⚠️ Different deployment model
- ⚠️ Additional cost
- ⚠️ Our APIs are on GCP (cross-cloud latency)

---

## What Gets Removed from Boilerplate

### Dependencies to Remove
```bash
npm uninstall @clerk/nextjs @clerk/themes @clerk/localizations @clerk/testing
npm uninstall drizzle-orm drizzle-kit pg @electric-sql/pglite
npm uninstall stripe  # Optional - if not using Stripe
```

### Files to Delete
- `src/models/*` - Drizzle schemas (we use MongoDB)
- `drizzle.config.ts` - Drizzle configuration
- Any Clerk middleware in `src/middleware.ts`
- `src/libs/Clerk.tsx` - Clerk provider
- `src/features/billing/*` - If using our MongoDB billing

### Code to Remove
- All `@clerk` imports
- All `drizzle-orm` imports
- All Clerk components (SignIn, SignUp, UserButton)
- Database queries using Drizzle

---

## What Gets Added

### Dependencies to Add
```bash
npm install mongodb redis falkordb
npm install @tanstack/react-query  # For API calls
```

### Files to Create
- `src/libs/mongodb.ts` - MongoDB connection utility
- `src/libs/falkordb.ts` - FalkorDB connection utility
- `src/components/AuthProvider.tsx` - Custom auth context
- `src/middleware.ts` - Update with custom auth check
- `src/app/api/auth/*` - Proxy routes to FastAPI

### Files to Copy from docs-site
- `app/onboarding/*` - Your onboarding flow
- `app/dashboard/*` - Your dashboard pages
- `app/agents/*` - Agent registry pages
- `app/training/*` - Training platform pages
- Auth components and utilities

---

## Timeline

### Phase 1: Setup ✅ COMPLETE
- [x] Clone repository
- [x] Install dependencies
- [x] Verify dev server runs
- [x] Document architecture decisions

### Phase 2: Remove Dependencies (1 day)
- [ ] Remove Clerk
- [ ] Remove Drizzle/PostgreSQL
- [ ] Clean up imports
- [ ] Test build works

### Phase 3: Add Backend (1 day)
- [ ] Install MongoDB/Redis clients
- [ ] Create connection utilities
- [ ] Test connections work

### Phase 4-11: See ALIGNHEALTHCARE_MIGRATION_TODO.md

---

## Success Criteria

- ✅ alignhealthcare.ai shows marketing page
- ✅ app.alignhealthcare.ai shows authenticated platform
- ✅ api.alignhealthcare.ai serves backend APIs
- ✅ MongoDB queries work
- ✅ FalkorDB queries work
- ✅ Auth flows work (signup, login, 2FA)
- ✅ No "ocl.network" visible to users
- ✅ SSL certificates working
- ✅ Performance > 90 on Lighthouse

---

## Risk Mitigation

### Risk 1: Auth Integration Issues
**Mitigation:** Test auth early in Phase 4. Copy working code from docs-site.

### Risk 2: Database Connection Problems
**Mitigation:** Test MongoDB/FalkorDB connections in Phase 3 before proceeding.

### Risk 3: Build Errors After Removing Clerk
**Mitigation:** Search for all Clerk imports, remove systematically, test build frequently.

### Risk 4: DNS/SSL Issues
**Mitigation:** Configure DNS 48 hours before launch. Use low TTL initially.

---

## Questions Answered

1. **Keep MongoDB + FalkorDB?** ✅ YES
2. **Keep custom auth + 2FA?** ✅ YES
3. **Remove Clerk?** ✅ YES
4. **Remove Drizzle/PostgreSQL?** ✅ YES
5. **Deploy to Google Cloud Run?** ✅ YES
6. **Use separate subdomains?** ✅ YES (marketing + app)
7. **Keep MongoDB billing?** ✅ YES

---

## Next Steps

1. ✅ Phase 1 complete - Repository cloned and running
2. ➡️ Phase 2 next - Remove Clerk and Drizzle
3. Monitor progress with: `tail -f /tmp/align-dev.log`
4. Access dev server: http://localhost:3005

---

**Decision Date:** 2026-02-02
**Approved By:** Architecture review complete
**Status:** Ready to proceed to Phase 2
