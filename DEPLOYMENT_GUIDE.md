# 🚀 KAMWALAA - COMPLETE DEPLOYMENT GUIDE

**Technology Stack:** Vercel + Railway + Supabase

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Vercel - Frontend Deployment](#vercel---frontend-deployment)
3. [Railway - Backend Deployment](#railway---backend-deployment)
4. [Supabase - Database Setup](#supabase---database-setup)
5. [Additional Services](#additional-services)
6. [Environment Variables](#environment-variables)
7. [Deployment Checklist](#deployment-checklist)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 OVERVIEW

### **Architecture Diagram**

```
┌─────────────────────────────────────────────────────┐
│                    USERS                             │
│              (Web Browsers, Mobile)                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              VERCEL (Frontend)                       │
│  ┌──────────────────────────────────────────────┐  │
│  │  React + Vite Application                     │  │
│  │  - Homepage                                   │  │
│  │  - Service Pages                              │  │
│  │  - Booking Flow                               │  │
│  │  - User Dashboard                             │  │
│  └──────────────────────────────────────────────┘  │
│  Global CDN • SSL • Auto-deploy from GitHub        │
└─────────────────────────────────────────────────────┘
                        ↓ API Calls
┌─────────────────────────────────────────────────────┐
│              RAILWAY (Backend)                       │
│  ┌──────────────────────────────────────────────┐  │
│  │  Node.js + Express API Server                │  │
│  │  - Authentication (JWT + OTP)                │  │
│  │  - Service Management                        │  │
│  │  - Booking System                            │  │
│  │  - Payment Integration                       │  │
│  │  - Partner Management                        │  │
│  └──────────────────────────────────────────────┘  │
│  24/7 Server • Auto-deploy • Logs                  │
└─────────────────────────────────────────────────────┘
                        ↓ Database Queries
┌─────────────────────────────────────────────────────┐
│              SUPABASE (Database)                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                         │  │
│  │  - Users                                     │  │
│  │  - Services                                  │  │
│  │  - Bookings                                  │  │
│  │  - Partners                                  │  │
│  │  - Reviews                                   │  │
│  └──────────────────────────────────────────────┘  │
│  Managed DB • Auto Backup • Real-time              │
└─────────────────────────────────────────────────────┘
```

---

## 📦 VERCEL - FRONTEND DEPLOYMENT

### **What is Vercel?**

Vercel is a cloud platform for **static sites and serverless functions**. It's perfect for deploying React, Next.js, and Vite applications with automatic HTTPS, global CDN, and continuous deployment.

---

### **🎯 Step-by-Step Setup**

#### **Step 1: Prepare Your Frontend**

```bash
# Create React + Vite project
npm create vite@latest kamwalaa-frontend -- --template react
cd kamwalaa-frontend

# Install dependencies
npm install
npm install react-router-dom axios zustand react-icons react-hook-form

# Test locally
npm run dev
# Open http://localhost:5173
```

#### **Step 2: Configure for Production**

Create `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  }
})
```

Create `.env.production`:
```env
VITE_API_URL=https://api.kamwalaa.com
```

Create `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

#### **Step 3: Push to GitHub**

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repository on GitHub (github.com/new)
# Then push
git remote add origin https://github.com/yourusername/kamwalaa-frontend.git
git branch -M main
git push -u origin main
```

#### **Step 4: Deploy to Vercel**

**Option A: Via Vercel Website (Recommended for beginners)**

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" → Choose "Continue with GitHub"
3. Authorize Vercel to access your repositories
4. Click "New Project"
5. Import your `kamwalaa-frontend` repository
6. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
7. Add Environment Variables:
   - `VITE_API_URL` = `https://api.kamwalaa.com` (update after Railway setup)
8. Click "Deploy"
9. Wait 2-3 minutes ⏱️
10. **Done!** ✅ Your site is live!

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? Your account
# Link to existing project? No
# Project name? kamwalaa-frontend
# Directory? ./
# Override settings? No

# Production deployment
vercel --prod
```

#### **Step 5: Custom Domain Setup**

1. Go to your Vercel project → Settings → Domains
2. Add your domain: `www.kamwalaa.com`
3. Vercel will show DNS records to add:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Add these records in your domain registrar (GoDaddy, Namecheap, etc.)
5. Wait 24-48 hours for DNS propagation
6. **Done!** SSL certificate is automatic ✅

---

### **📊 Vercel Plans & Limits**

| Feature | Free | Pro (₹1,600/month) |
|---------|------|-------------------|
| **Bandwidth** | 100 GB/month | 1 TB/month |
| **Deployments** | Unlimited | Unlimited |
| **Projects** | Unlimited | Unlimited |
| **Team Members** | 1 | Unlimited |
| **Build Time** | 6000 minutes/month | 24000 minutes/month |
| **Serverless Functions** | 100 GB-hours | 1000 GB-hours |
| **Support** | Community | Email |
| **Analytics** | Basic | Advanced |
| **SSL** | ✅ Free | ✅ Free |
| **Custom Domains** | Unlimited | Unlimited |

**When to Upgrade?**
- ❌ More than 100 GB bandwidth/month (~12,500 users)
- ❌ Need team collaboration features
- ❌ Need advanced analytics

---

### **🔧 Vercel Commands**

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls

# View logs
vercel logs [deployment-url]

# Remove project
vercel remove kamwalaa-frontend

# Set environment variable
vercel env add VITE_API_URL production

# Pull environment variables
vercel env pull
```

---

### **⚡ Performance Optimization**

```javascript
// 1. Code Splitting
import { lazy, Suspense } from 'react';

const Services = lazy(() => import('./pages/Services'));
const Booking = lazy(() => import('./pages/Booking'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/services" element={<Services />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </Suspense>
  );
}

// 2. Image Optimization
<img 
  src="service.jpg" 
  loading="lazy" 
  width="400" 
  height="300"
  alt="Service"
/>

// 3. Use Vercel Analytics
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

---

## 🚂 RAILWAY - BACKEND DEPLOYMENT

### **What is Railway?**

Railway is a modern platform for deploying backend applications. It provides persistent servers (not serverless), making it perfect for Node.js APIs, databases, and background jobs.

---

### **🎯 Step-by-Step Setup**

#### **Step 1: Prepare Your Backend**

```bash
# Create backend folder
mkdir kamwalaa-backend
cd kamwalaa-backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express pg cors dotenv jsonwebtoken bcryptjs
npm install twilio razorpay nodemailer
npm install -D nodemon
```

Create `package.json` scripts:
```json
{
  "name": "kamwalaa-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

Create `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Kamwalaa API is running' });
});

// Routes
app.get('/api/services', (req, res) => {
  res.json({ message: 'Services endpoint' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Create `.env`:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your_super_secret_key_change_this
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
```

Create `.gitignore`:
```
node_modules/
.env
.env.local
.DS_Store
*.log
```

#### **Step 2: Push to GitHub**

```bash
git init
git add .
git commit -m "Initial backend setup"
git remote add origin https://github.com/yourusername/kamwalaa-backend.git
git branch -M main
git push -u origin main
```

#### **Step 3: Deploy to Railway**

**Via Railway Website:**

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Authorize Railway to access GitHub
5. Select `kamwalaa-backend` repository
6. Railway will auto-detect Node.js
7. Click "Deploy Now"
8. Wait 2-3 minutes for deployment

**Configure Environment Variables:**

1. Go to your project → Variables tab
2. Add all variables from your `.env`:
   ```
   DATABASE_URL = [Supabase connection string]
   JWT_SECRET = [your secret]
   TWILIO_ACCOUNT_SID = [your sid]
   TWILIO_AUTH_TOKEN = [your token]
   RAZORPAY_KEY_ID = [your key]
   RAZORPAY_SECRET = [your secret]
   PORT = 3000
   ```
3. Click "Deploy" to restart with new variables

**Get Your Backend URL:**

1. Go to Settings → Domains
2. Click "Generate Domain"
3. You'll get: `kamwalaa-backend-production.up.railway.app`
4. Or add custom domain: `api.kamwalaa.com`

#### **Step 4: Custom Domain (Optional)**

1. In Railway → Settings → Domains
2. Add custom domain: `api.kamwalaa.com`
3. Add CNAME record in your DNS:
   ```
   Type: CNAME
   Name: api
   Value: kamwalaa-backend-production.up.railway.app
   ```
4. SSL is automatic ✅

---

### **📊 Railway Plans & Limits**

| Feature | Trial | Hobby (₹400) | Developer (₹800) | Pro (₹1,600) |
|---------|-------|--------------|------------------|--------------|
| **Credits** | $5 | $5/month | $10/month | $20/month |
| **RAM** | 512 MB | 512 MB | 8 GB | 32 GB |
| **CPU** | Shared | Shared | 8 vCPU | 32 vCPU |
| **Deployment** | 1 | Unlimited | Unlimited | Unlimited |
| **Plugins** | Limited | Full | Full | Full |
| **Support** | Community | Community | Email | Priority |
| **Users** | 10K | 10K | 15K | 50K+ |

**When to Upgrade?**
- ❌ More than 10,000 active users
- ❌ Need more RAM for heavy processing
- ❌ Running multiple services

---

### **🔧 Railway Commands (CLI)**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Run command in Railway environment
railway run node server.js

# Add environment variable
railway variables set JWT_SECRET=your_secret

# Deploy
git push origin main  # Auto-deploys!
```

---

### **📊 Monitoring & Logs**

**View Logs:**
1. Go to Railway project → Deployments
2. Click on latest deployment
3. View real-time logs

**Metrics:**
1. Go to Metrics tab
2. See:
   - CPU usage
   - Memory usage
   - Network activity
   - Request count

**Set Up Alerts:**
```javascript
// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Use external monitoring (optional)
// - UptimeRobot (free)
// - Pingdom
// - New Relic
```

---

## 💾 SUPABASE - DATABASE SETUP

### **What is Supabase?**

Supabase is an open-source **Firebase alternative** built on PostgreSQL. It provides:
- Managed PostgreSQL database
- Built-in authentication
- Real-time subscriptions
- File storage
- Auto-generated APIs

---

### **🎯 Step-by-Step Setup**

#### **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub
4. Click "New Project"
5. Fill in details:
   - **Name:** Kamwalaa
   - **Database Password:** [Strong password - SAVE THIS!]
   - **Region:** Southeast Asia (Singapore) or India
   - **Plan:** Free tier
6. Click "Create new project"
7. Wait 2-3 minutes for setup

#### **Step 2: Get Connection Details**

1. Go to Project Settings → Database
2. Copy **Connection String**:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
3. **Connection Pooling** (recommended for production):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
   ```

#### **Step 3: Create Database Schema**

**Option A: Using SQL Editor (Web Interface)**

1. Go to SQL Editor tab
2. Click "New Query"
3. Copy your entire schema from `DATABASE_SCHEMA.md`
4. Click "Run"
5. Tables will be created ✅

**Option B: Using TablePlus/pgAdmin**

1. Download [TablePlus](https://tableplus.com) (free)
2. Create new connection:
   - **Host:** db.[PROJECT-REF].supabase.co
   - **Port:** 5432
   - **User:** postgres
   - **Password:** [Your password]
   - **Database:** postgres
3. Connect
4. Run your SQL schema

**Option C: Using Node.js Script**

```javascript
// setup-database.js
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
  try {
    const schema = fs.readFileSync('./schema.sql', 'utf8');
    await pool.query(schema);
    console.log('✅ Database schema created successfully');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();
```

Run:
```bash
node setup-database.js
```

#### **Step 4: Insert Kamwalaa Services**

1. Go to SQL Editor
2. Copy content from `KAMWALAA_DATABASE_SERVICES.md`
3. Run the INSERT statements
4. Verify in Table Editor → services table
5. You should see all 54 services ✅

#### **Step 5: Enable Row Level Security (RLS)**

```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Allow users to view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Public can view services
CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  USING (true);
```

#### **Step 6: Setup Storage (for images)**

1. Go to Storage tab
2. Create new bucket: `service-images`
3. Make it public:
   - Click bucket → Settings
   - Public bucket: ON
4. Create folders:
   - `/services`
   - `/partners`
   - `/work-photos`

Upload policy:
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'service-images' 
    AND auth.role() = 'authenticated'
  );

-- Anyone can view
CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'service-images');
```

---

### **📊 Supabase Plans & Limits**

| Feature | Free | Pro (₹2,000/month) | Team (₹2,000/user) |
|---------|------|-------------------|-------------------|
| **Database** | 500 MB | 8 GB | 8 GB |
| **Storage** | 1 GB | 100 GB | 100 GB |
| **Bandwidth** | 2 GB | 50 GB | 50 GB |
| **Users** | 50,000 MAU | Unlimited | Unlimited |
| **Backups** | None | Daily | Daily |
| **Support** | Community | Email | Priority |
| **Regions** | 1 | Multiple | Multiple |

**When to Upgrade?**
- ❌ Database >500 MB (~30,000 users)
- ❌ Bandwidth >2 GB/month (~10,000 users)
- ❌ Need daily backups (highly recommended!)

---

### **🔧 Connect from Backend**

```javascript
// Using pg (PostgreSQL driver)
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Connected to Supabase:', res.rows[0]);
  }
});

// Query example
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services WHERE is_active = true');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

```javascript
// Using Supabase Client (easier)
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Query example
app.get('/api/services', async (req, res) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true);

  if (error) return res.status(500).json({ error });
  res.json(data);
});
```

---

### **🔧 Supabase CLI Commands**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to project
supabase link --project-ref [your-project-ref]

# Pull schema
supabase db pull

# Push migrations
supabase db push

# Generate types for TypeScript
supabase gen types typescript --local > types/supabase.ts

# View logs
supabase functions logs

# Run migrations
supabase migration up
```

---

### **📊 Database Optimization**

```sql
-- 1. Add indexes for faster queries
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);

-- 2. Use connection pooling
-- Already configured in Railway with pgbouncer=true

-- 3. Monitor slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- 4. Vacuum regularly (automatic in Supabase)
VACUUM ANALYZE;
```

---

## 📧 ADDITIONAL SERVICES

### **1. Cloudinary (Image Storage)**

**Setup:**
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free
3. Get credentials:
   - Cloud Name
   - API Key
   - API Secret

**Free Tier:**
- 25 GB storage
- 25 GB bandwidth/month
- Image transformations

**Integration:**
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image
app.post('/api/upload', async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: 'kamwalaa/services'
  });
  res.json({ url: result.secure_url });
});
```

---

### **2. Twilio (SMS/OTP)**

**Setup:**
1. Go to [twilio.com](https://twilio.com)
2. Sign up and verify phone
3. Get trial credits ($15)
4. Get credentials:
   - Account SID
   - Auth Token
   - Phone Number

**Send OTP:**
```javascript
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendOTP(phoneNumber, otp) {
  await client.messages.create({
    body: `Your Kamwalaa verification code is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
}
```

---

### **3. Razorpay (Payments)**

**Setup:**
1. Go to [razorpay.com](https://razorpay.com)
2. Sign up and complete KYC
3. Go to Settings → API Keys
4. Generate Test/Live keys

**Integration:**
```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

// Create order
app.post('/api/payment/create', async (req, res) => {
  const options = {
    amount: req.body.amount * 100, // paise
    currency: 'INR',
    receipt: `booking_${Date.now()}`
  };

  const order = await razorpay.orders.create(options);
  res.json(order);
});
```

---

## 🔐 ENVIRONMENT VARIABLES

### **Complete List**

#### **Frontend (.env.production)**
```env
VITE_API_URL=https://api.kamwalaa.com
VITE_RAZORPAY_KEY=rzp_live_xxxxx
VITE_APP_NAME=Kamwalaa
```

#### **Backend (Railway Variables)**
```env
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:6543/postgres?pgbouncer=true

# JWT
JWT_SECRET=your_super_secret_key_min_32_characters_long

# Twilio (OTP)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_SECRET=your_razorpay_secret

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (NodeMailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_app_password

# Supabase (if using client)
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

---

## 🧠 LLM / AI MODEL CONFIGURATION

If your backend or serverless functions call an LLM (Anthropic/Claude, OpenAI, etc.), control the model via an environment variable so it can be updated without code changes.

Recommended environment variables (Backend):

```env
# Model name to use for all clients. Example: claude-haiku-4.5
LLM_MODEL=claude-haiku-4.5

# Provider API key (example: Anthropic)
ANTHROPIC_API_KEY=sk-xxx
```

How to set the variable:

- Railway: `railway env set LLM_MODEL claude-haiku-4.5`
- Vercel (for serverless functions): `vercel env add LLM_MODEL production` then paste `claude-haiku-4.5`.
- Or add to your server `.env` for local development.

Server-side usage (Node.js example):

```javascript
// Read model from env and fallback to a safe default
const MODEL = process.env.LLM_MODEL || 'claude-instant-1';

// Example pseudo-code for Anthropic client
// const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
// const res = await anthropic.completions.create({ model: MODEL, prompt });
```

Safety and fallback:

- Validate `LLM_MODEL` value at startup and log if unavailable.
- Provide a fallback model or disable LLM features when the configured model is not reachable.
- Track usage and errors in logs/monitoring.

## ✅ DEPLOYMENT CHECKLIST

### **Pre-Deployment**

- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend runs locally (`npm start`)
- [ ] Database schema is ready
- [ ] All environment variables documented
- [ ] `.gitignore` includes `.env` files
- [ ] API endpoints tested with Postman
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] CORS configured properly

### **Frontend (Vercel)**

- [ ] GitHub repository created
- [ ] Code pushed to main branch
- [ ] Vercel project created
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Custom domain added (optional)
- [ ] SSL certificate active
- [ ] Test deployment successful
- [ ] Production deployment done

### **Backend (Railway)**

- [ ] GitHub repository created
- [ ] package.json has "engines" field
- [ ] "start" script defined
- [ ] Code pushed to main branch
- [ ] Railway project created
- [ ] Environment variables added
- [ ] Database connection tested
- [ ] Custom domain added (optional)
- [ ] Health check endpoint works
- [ ] Logs are clean

### **Database (Supabase)**

- [ ] Project created
- [ ] Connection string saved securely
- [ ] Database schema executed
- [ ] Sample data inserted
- [ ] Row Level Security enabled
- [ ] Indexes created
- [ ] Backup strategy in place
- [ ] Connection from backend successful

### **Testing**

- [ ] Homepage loads
- [ ] API calls work
- [ ] Services display correctly
- [ ] Booking flow works
- [ ] Payment integration tested (test mode)
- [ ] OTP sending works
- [ ] Email notifications work
- [ ] Mobile responsive
- [ ] No console errors

---

## 🐛 TROUBLESHOOTING

### **Vercel Issues**

**Build Failed:**
```bash
# Check build logs in Vercel dashboard
# Common issues:

# 1. Missing dependencies
npm install --save [missing-package]

# 2. Build command wrong
# In Vercel settings: npm run build (not npm build)

# 3. Node version mismatch
# Add to package.json:
"engines": {
  "node": "18.x"
}
```

**API Calls Failing:**
```javascript
// Check CORS in backend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://kamwalaa.com',
    'https://www.kamwalaa.com'
  ],
  credentials: true
}));

// Check API URL in frontend .env
VITE_API_URL=https://api.kamwalaa.com  // No trailing slash!
```

---

### **Railway Issues**

**Deployment Failed:**
```bash
# Check logs in Railway dashboard

# Common issues:

# 1. Port binding
# Railway assigns PORT automatically
const PORT = process.env.PORT || 3000;
app.listen(PORT);

# 2. Start script missing
# package.json must have:
"scripts": {
  "start": "node server.js"
}

# 3. Database connection timeout
# Use connection pooling:
DATABASE_URL=...?pgbouncer=true&connection_limit=10
```

**High Memory Usage:**
```javascript
// Add connection limits
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

---

### **Supabase Issues**

**Connection Refused:**
```javascript
// Enable SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false  // Required for Supabase
  }
});
```

**Too Many Connections:**
```
Error: remaining connection slots are reserved

Solution:
1. Use connection pooling URL (port 6543, not 5432)
2. Limit connections in Pool config
3. Close connections properly after use
```

**Slow Queries:**
```sql
-- Add indexes
CREATE INDEX idx_bookings_user_date 
ON bookings(user_id, booking_date DESC);

-- Analyze query performance
EXPLAIN ANALYZE
SELECT * FROM bookings WHERE user_id = 'xxx';
```

---

## 📊 MONITORING & ANALYTICS

### **1. Vercel Analytics**

```javascript
// Add to frontend
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### **2. Railway Logs**

```bash
# View in real-time
railway logs --follow

# Filter by error
railway logs | grep ERROR
```

### **3. Supabase Monitoring**

1. Go to Supabase Dashboard → Reports
2. View:
   - API requests
   - Database size
   - Bandwidth usage
   - Active connections

### **4. External Monitoring**

**UptimeRobot (Free):**
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add monitors:
   - Frontend: https://kamwalaa.com
   - Backend: https://api.kamwalaa.com/health
3. Get alerts via email/SMS if down

---

## 🚀 SCALING STRATEGY

### **When to Scale Each Service:**

#### **Vercel (Frontend)**
```
0-12K users: FREE ✅
12K-100K users: Pro (₹1,600) ✅
100K+ users: Enterprise (Contact Vercel)
```

#### **Railway (Backend)**
```
0-5K users: Hobby (₹400) ✅
5K-15K users: Developer (₹800) ✅
15K-50K users: Pro (₹1,600) ✅
50K+ users: Multiple instances or migrate to AWS
```

#### **Supabase (Database)**
```
0-10K users: Free ✅
10K-100K users: Pro (₹2,000) ✅
100K+ users: Team/Enterprise
```

---

## 💰 TOTAL COST SUMMARY

### **Month 1-6 (Testing Phase)**
```
Vercel: FREE
Railway: ₹400 (Hobby)
Supabase: FREE
Cloudinary: FREE
Twilio: ₹500 (as needed)

TOTAL: ₹900/month
```

### **Month 7-12 (Growth Phase)**
```
Vercel: FREE
Railway: ₹800 (Developer)
Supabase: FREE
Cloudinary: FREE
Twilio: ₹1,000
Razorpay: 2% per transaction

TOTAL: ₹1,800/month + transaction fees
```

### **Year 2+ (Scale Phase)**
```
Vercel: ₹1,600 (Pro)
Railway: ₹1,600 (Pro)
Supabase: ₹2,000 (Pro)
Cloudinary: ₹500 (Paid)
Twilio: ₹2,000
Razorpay: 2% per transaction

TOTAL: ₹7,700/month + transaction fees
```

---

## 🎯 FINAL RECOMMENDATION

**Your Perfect Stack:**

1. **Frontend → Vercel** ✅
   - FREE for first year
   - Global CDN
   - Automatic SSL
   - Easy deployment

2. **Backend → Railway** ✅
   - ₹800/month for 15K users
   - No cold starts
   - Easy to manage
   - Auto-deploy from GitHub

3. **Database → Supabase** ✅
   - FREE for first 10K users
   - PostgreSQL (perfect for your data)
   - Automatic backups on paid plan
   - Real-time features

**This combination gives you:**
- ✅ Best performance
- ✅ Lowest cost
- ✅ Easy scaling
- ✅ Professional infrastructure
- ✅ Industry-standard stack

---

## 📞 SUPPORT RESOURCES

**Vercel:**
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord
- Status: https://vercel-status.com

**Railway:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

**Supabase:**
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- Status: https://status.supabase.com

---

## ✅ YOU'RE READY TO DEPLOY!

Follow this guide step-by-step, and your Kamwalaa platform will be live in production! 🎉

**Start with:**
1. Deploy frontend to Vercel (20 minutes)
2. Deploy backend to Railway (30 minutes)
3. Setup Supabase database (30 minutes)
4. Connect all three (10 minutes)
5. **TOTAL:** 90 minutes to full deployment! 🚀

**Good luck!** 💪

---

*Document Version: 1.0*  
*Last Updated: January 21, 2026*  
*Prepared By: Antigravity AI*
