# Serviz — سيرفيز
**Algeria's largest freelance marketplace**

---

## ⚡ Setup in 5 minutes

### 1. Install
```bash
npm install
```

### 2. Create `.env`
```bash
cp .env.example .env
```
Fill in:
```env
DATABASE_URL="postgresql://USER:PASS@HOST/DB?sslmode=require&pgbouncer=true&connection_limit=1"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```
> **Database**: Get a free PostgreSQL from [neon.tech](https://neon.tech)

### 3. Initialize database
```bash
npm run db:push     # creates all tables
npm run db:seed     # loads 14 services, 5 freelancers, 8 categories
```

### 4. Run
```bash
npm run dev
```
Open → **http://localhost:3000**

---

## 👤 Test accounts (after seed)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@serviz.dz | admin123 |
| Client | client@serviz.dz | client123 |
| Designer | karim@serviz.dz | pass123 |
| Marketing | sara@serviz.dz | pass123 |
| Dev | amine@serviz.dz | pass123 |
| Video | nadia@serviz.dz | pass123 |
| Photo | youcef@serviz.dz | pass123 |

---

## 📁 Structure
```
src/
  app/
    page.tsx                    → Homepage (hero + categories + featured services)
    categories/                 → Category & subcategory browsing
    service/[serviceId]/        → Service detail + packages + order button
    checkout/                   → Order requirements form
    orders/[orderId]/           → Order confirmation & tracking
    profile/                    → User profile
    profile/orders/             → My orders list
    search/                     → Full-text search results
    sell/                       → Freelancer landing page
    admin/                      → Admin dashboard
    auth/login + register/      → Authentication pages
    api/                        → REST API routes
  components/
    layout/Navbar.tsx           → Sticky navbar: search, theme toggle, user menu
    layout/Providers.tsx        → SessionProvider + ThemeProvider
    marketplace/ServiceCard.tsx → Reusable service card
    marketplace/OrderButton.tsx → Auth-aware order button
    marketplace/CheckoutForm.tsx→ Order requirements + submission
    ui/Toaster.tsx              → Toast notifications
  lib/
    auth.ts    → NextAuth config (JWT + credentials)
    prisma.ts  → Prisma client singleton
    utils.ts   → cn(), fmt()
  middleware.ts → Route protection (admin, checkout, orders, profile)
```

---

## 🚀 Deploy to Netlify
1. Push to GitHub
2. Connect repo in Netlify
3. Add env vars in Netlify dashboard
4. Build command: `npm run build`
5. Run seed once: `npm run db:seed`

---

## 🔐 Security
- Passwords hashed with **bcrypt** (cost 10)
- Sessions: **JWT** via NextAuth v5
- Routes protected by **Edge middleware** (`getToken()`)
- All inputs validated with **Zod**
- Prisma prevents SQL injection
