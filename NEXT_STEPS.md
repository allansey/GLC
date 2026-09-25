# 🚀 Backend Setup - Next Steps

## ✅ What's Been Completed

1. **Dependencies Installed**
   - `@supabase/supabase-js`
   - `@supabase/auth-helpers-nextjs`
   - `resend`

2. **Supabase Client Setup**
   - Client-side client: `src/lib/supabase/client.ts`
   - Server-side admin client: `src/lib/supabase/server.ts`

3. **Database Migrations Created**
   - Contact submissions table
   - Events table
   - Sermons table
   - All with Row Level Security (RLS) policies

4. **Contact Form Backend**
   - API route: `/api/contact`
   - Saves to Supabase database
   - Sends email via Resend
   - Form updated with loading states and success/error messages

5. **TypeScript Types**
   - Database types defined in `src/types/database.ts`

---

## 📋 What You Need to Do Now

### Step 1: Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://olnwchgqlotyprjbypbp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<YOUR_SERVICE_ROLE_KEY>

# Admin Email
ADMIN_EMAIL=allansey22@gmail.com

# Resend API Key
RESEND_API_KEY=<YOUR_RESEND_API_KEY>
```

**Where to get the keys:**

1. **Supabase Keys:**
   - Go to: https://supabase.com/dashboard/project/olnwchgqlotyprjbypbp/settings/api
   - Copy **anon/public** key
   - Copy **service_role** key

2. **Resend API Key:**
   - Sign up at: https://resend.com (free: 100 emails/day)
   - Go to API Keys section
   - Create new key and copy it

---

### Step 2: Run Database Migrations

Go to your Supabase SQL Editor:
https://supabase.com/dashboard/project/olnwchgqlotyprjbypbp/sql

Run these SQL files in order:

1. **Contact Submissions Table:**
   ```sql
   -- Copy and paste content from:
   supabase/migrations/001_contact_submissions.sql
   ```

2. **Events Table:**
   ```sql
   -- Copy and paste content from:
   supabase/migrations/002_events.sql
   ```

3. **Sermons Table:**
   ```sql
   -- Copy and paste content from:
   supabase/migrations/003_sermons.sql
   ```

---

### Step 3: Create Storage Buckets

Go to: https://supabase.com/dashboard/project/olnwchgqlotyprjbypbp/storage/buckets

Create 3 buckets:

1. **event-images**
   - Public: ✅ Yes
   - File size limit: 5 MB
   - Allowed MIME types: `image/*`

2. **sermon-media**
   - Public: ✅ Yes
   - File size limit: 500 MB
   - Allowed MIME types: `video/*`, `audio/*`, `image/*`

3. **sermon-notes**
   - Public: ✅ Yes
   - File size limit: 10 MB
   - Allowed MIME types: `application/pdf`

---

### Step 4: Test Contact Form

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Go to: http://localhost:3000/contact

3. Fill out and submit the form

4. Check:
   - ✅ Form shows success message
   - ✅ Data appears in Supabase `contact_submissions` table
   - ✅ Email received at allansey22@gmail.com

---

## 🎯 What's Next

After you complete the above steps, I'll continue with:

### Sprint 3: Event Management
- Create events API routes
- Update events page to fetch from database
- Migrate existing events to Supabase

### Sprint 4: Sermon Management
- Create sermons API routes
- Update sermons page to fetch from database
- Create individual sermon detail pages

### Sprint 5: Admin Dashboard
- Build modern admin UI for managing:
  - Events (create, edit, delete, upload images)
  - Sermons (upload videos, audio, notes)
  - Contact submissions (view, mark as read/replied)
- Add authentication for admin access

---

## 📁 Files Created

### Configuration
- `src/lib/supabase/client.ts` - Client-side Supabase client
- `src/lib/supabase/server.ts` - Server-side Supabase client
- `src/types/database.ts` - TypeScript types

### API Routes
- `src/app/api/contact/route.ts` - Contact form API

### Database
- `supabase/migrations/001_contact_submissions.sql`
- `supabase/migrations/002_events.sql`
- `supabase/migrations/003_sermons.sql`

### Pages
- `src/app/contact/page.tsx` - Updated with API integration

### Documentation
- `BACKEND_SETUP.md` - Detailed setup instructions

---

## ❓ Need Help?

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure database migrations ran successfully
4. Check Supabase dashboard for data

Let me know once you've completed Steps 1-4 and I'll continue with the next features! 🚀
