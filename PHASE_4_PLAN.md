# Phase 4: Connect Existing Authentication

**Started:** 2026-02-02
**Status:** In Progress
**Estimated Time:** 2-3 hours

---

## 🎯 Objectives

Integrate the existing FastAPI authentication system with the Next.js frontend:
- Connect to FastAPI auth endpoints (login, signup, logout, verify)
- Create React auth context for session management
- Protect routes with middleware
- Replace placeholder UI components with real auth components
- Handle JWT tokens and session storage

---

## 📋 Tasks

### Task 4.1: Create Next.js API Proxy Routes
- [ ] Create `/api/auth/login` - Proxy to FastAPI login
- [ ] Create `/api/auth/signup` - Proxy to FastAPI signup
- [ ] Create `/api/auth/logout` - Proxy to FastAPI logout
- [ ] Create `/api/auth/me` - Get current user from FastAPI
- [ ] Create `/api/auth/verify-2fa` - Proxy 2FA verification
- [ ] Create `/api/auth/refresh` - Refresh JWT tokens

### Task 4.2: Create Auth Context Provider
- [ ] Create `src/contexts/AuthContext.tsx` - React context for auth state
- [ ] Implement login/logout functions
- [ ] Implement token storage (httpOnly cookies)
- [ ] Implement user session management
- [ ] Add loading states

### Task 4.3: Create Login/Signup Pages
- [ ] Create `/sign-in` page with email/password form
- [ ] Create `/sign-up` page with registration form
- [ ] Add 2FA verification modal/page
- [ ] Add error handling and validation
- [ ] Add "Remember me" functionality

### Task 4.4: Update Middleware for Auth Protection
- [ ] Check JWT token in middleware
- [ ] Redirect unauthenticated users to /sign-in
- [ ] Allow public routes (/, /sign-in, /sign-up)
- [ ] Protect dashboard routes

### Task 4.5: Replace Placeholder UI Components
- [ ] Create UserButton component (replace "User" text)
- [ ] Create OrganizationSwitcher component (replace "Organization" text)
- [ ] Update DashboardHeader with real components
- [ ] Add user profile dropdown
- [ ] Add organization selection dropdown

### Task 4.6: Test Authentication Flow
- [ ] Test login flow
- [ ] Test signup flow
- [ ] Test 2FA verification
- [ ] Test logout
- [ ] Test protected routes
- [ ] Test token refresh

---

## 🔧 FastAPI Backend Endpoints

Based on your existing FastAPI backend (ocl-ai-governance):

### Authentication Endpoints:
```
POST /auth/login              - Login with email/password
POST /auth/register           - Create new user account
POST /auth/logout             - Logout current user
GET  /auth/me                 - Get current user info
POST /auth/verify-2fa         - Verify 2FA code
POST /auth/refresh            - Refresh JWT access token
POST /auth/request-password-reset
POST /auth/reset-password
```

### User Endpoints:
```
GET  /users/me                - Get current user profile
PATCH /users/me               - Update user profile
GET  /users/me/organizations  - Get user's organizations
```

### Organization Endpoints:
```
GET  /organizations           - List organizations
GET  /organizations/{id}      - Get organization details
POST /organizations           - Create organization
PATCH /organizations/{id}     - Update organization
```

---

## 📦 Additional Packages Needed

```bash
# JWT handling
npm install jose

# Cookie handling
npm install cookies-next

# Form validation
npm install zod react-hook-form @hookform/resolvers

# HTTP client (for API calls)
# Already have fetch built-in
```

---

## 🔐 Authentication Flow

### Login Flow:
1. User enters email/password on `/sign-in` page
2. Next.js calls `/api/auth/login` (proxy to FastAPI)
3. FastAPI validates credentials, returns JWT tokens
4. Next.js stores tokens in httpOnly cookies
5. If 2FA enabled, show 2FA verification page
6. After 2FA, redirect to `/dashboard`

### Session Management:
1. JWT access token stored in httpOnly cookie (short-lived, 15 min)
2. JWT refresh token stored in httpOnly cookie (long-lived, 7 days)
3. Middleware checks token on each request
4. Auto-refresh before token expires
5. Logout clears cookies and invalidates session

### Protected Routes:
- `/dashboard/*` - Requires authentication
- `/api/*` - Some routes require authentication
- `/sign-in`, `/sign-up`, `/` - Public routes

---

## 📝 Files to Create

### API Routes:
1. **`src/app/api/auth/login/route.ts`**
2. **`src/app/api/auth/signup/route.ts`**
3. **`src/app/api/auth/logout/route.ts`**
4. **`src/app/api/auth/me/route.ts`**
5. **`src/app/api/auth/verify-2fa/route.ts`**
6. **`src/app/api/auth/refresh/route.ts`**

### Auth Context:
7. **`src/contexts/AuthContext.tsx`**
8. **`src/hooks/useAuth.ts`**

### Pages:
9. **`src/app/[locale]/(auth)/(center)/sign-in/page.tsx`**
10. **`src/app/[locale]/(auth)/(center)/sign-up/page.tsx`**
11. **`src/app/[locale]/(auth)/verify-2fa/page.tsx`**

### Components:
12. **`src/components/auth/LoginForm.tsx`**
13. **`src/components/auth/SignupForm.tsx`**
14. **`src/components/auth/TwoFactorVerification.tsx`**
15. **`src/components/auth/UserButton.tsx`**
16. **`src/components/auth/OrganizationSwitcher.tsx`**

### Utilities:
17. **`src/libs/auth.ts`** - Auth helper functions
18. **`src/libs/api-client.ts`** - API client for FastAPI

---

## 🔒 Security Considerations

1. **JWT Tokens:**
   - Access token: httpOnly cookie, 15 min expiry
   - Refresh token: httpOnly cookie, 7 days expiry
   - Secure flag in production (HTTPS only)
   - SameSite=Lax for CSRF protection

2. **API Communication:**
   - All auth requests go through Next.js API routes (not directly from browser)
   - FastAPI backend URL not exposed to client
   - CORS properly configured

3. **Session Storage:**
   - Never store tokens in localStorage or sessionStorage
   - Use httpOnly cookies to prevent XSS attacks
   - Implement CSRF protection

4. **Password Security:**
   - Never log passwords
   - Use HTTPS in production
   - Enforce strong password requirements (handled by FastAPI)

---

## ✅ Success Criteria

- [ ] User can login with email/password
- [ ] User can signup for new account
- [ ] 2FA verification works (TOTP/SMS)
- [ ] JWT tokens stored securely in httpOnly cookies
- [ ] Protected routes redirect to /sign-in if not authenticated
- [ ] User can logout and session is cleared
- [ ] Token auto-refresh works
- [ ] User profile displays in header
- [ ] Organization switcher works
- [ ] No security vulnerabilities (XSS, CSRF, token leakage)

---

## 📊 Environment Variables Needed

Add to `.env.local`:
```env
# FastAPI Backend URL (server-side only)
PYTHON_API_URL=http://localhost:8082

# JWT Secret (should match FastAPI backend)
JWT_SECRET=<your-jwt-secret>

# Session Configuration
SESSION_COOKIE_NAME=alignhealthcare_session
SESSION_MAX_AGE=604800  # 7 days
```

---

**Status:** Ready to begin
**Next Step:** Install required packages and create API proxy routes
