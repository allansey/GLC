# Backend Setup Instructions

## Step 1: Install Dependencies

The required packages should already be installed. If not, run:
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs resend
```

## Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://olnwchgqlotyprjbypbp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Admin Email
ADMIN_EMAIL=allansey22@gmail.com

# Resend API Key (get from https://resend.com/api-keys)
RESEND_API_KEY=your_resend_api_key_here
```

### Where to find Supabase keys:
1. Go to your Supabase project: https://supabase.com/dashboard/project/olnwchgqlotyprjbypbp
2. Navigate to **Project Settings** → **API**
3. Copy:
   - **Project URL** (already filled in above)
   - **anon/public key** → Replace `your_anon_key_here`
   - **service_role key** → Replace `your_service_role_key_here`

### Get Resend API Key:
1. Sign up at https://resend.com (free tier: 100 emails/day)
2. Go to **API Keys** section
3. Create a new API key
4. Copy and replace `your_resend_api_key_here`

## Step 3: Run Database Migrations

Execute the SQL scripts in your Supabase SQL Editor:

1. Go to https://supabase.com/dashboard/project/olnwchgqlotyprjbypbp/sql
2. Run each migration file in order:
   - `supabase/migrations/001_contact_submissions.sql`
   - `supabase/migrations/002_events.sql`
   - `supabase/migrations/003_sermons.sql`

## Step 4: Create Storage Buckets

In Supabase Dashboard → Storage:

1. Create bucket: `event-images`
   - Public bucket: Yes
   - File size limit: 5MB
   - Allowed MIME types: image/*

2. Create bucket: `sermon-media`
   - Public bucket: Yes
   - File size limit: 500MB
   - Allowed MIME types: video/*, audio/*, image/*

3. Create bucket: `sermon-notes`
   - Public bucket: Yes
   - File size limit: 10MB
   - Allowed MIME types: application/pdf

## Step 5: Verify Setup

Run the development server:
```bash
npm run dev
```

The backend should now be ready! Next steps:
- Contact form will save to database
- Events will be fetched from Supabase
- Sermons will be managed through database
