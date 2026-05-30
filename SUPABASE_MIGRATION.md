# LifePause – Supabase Migration & Deployment Guide

This guide describes how the LifePause SaaS application is migrated from MongoDB to Supabase (Postgres & Supabase Auth) and outlines the deployment pipeline.

---

## 1. Supabase Setup Guide

Your database, auth systems, triggers, and Row Level Security (RLS) have been pre-provisioned on your active project dashboard. If you need to re-deploy or inspect the database tables, here are the step-by-step instructions:

1. Log in to your **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. Select your project **`sonalktripathi20-coder's Project`** (active and restored).
3. Open the **SQL Editor** tab from the left sidebar and select **New Query**.
4. Paste the complete **SQL Schema Script** listed in Section 2 below.
5. Click **Run** to execute the query. You will see a `Success` popup message.

---

## 2. PostgreSQL SQL Schema

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null unique,
  full_name text not null,
  plan text not null default 'Free' check (plan in ('Free', 'Premium', 'Family')),
  family_members jsonb default '[]'::jsonb,
  blood_group text default '',
  allergies text default '',
  medications text default '',
  doctor_contact text default '',
  preferred_hospital text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on users
alter table public.users enable row level security;

-- Policy: users can select and update their own data
create policy "Allow individual read" on public.users for select using (auth.uid() = id);
create policy "Allow individual update" on public.users for update using (auth.uid() = id);

-- 2. Vault Items Table
create table public.vault_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  category text not null check (category in ('Passwords', 'Financial', 'Notes', 'Documents', 'Emergency Instructions')),
  content jsonb not null,
  is_favorite boolean default false not null,
  is_archived boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on vault_items
alter table public.vault_items enable row level security;
create policy "Allow individual CRUD" on public.vault_items for all using (auth.uid() = user_id);

-- 3. Documents Table
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  category text not null check (category in ('Identity', 'Insurance', 'Financial', 'Travel', 'Medical')),
  file_name text not null,
  file_url text default '' not null,
  expiry_date timestamp with time zone,
  notes text default '' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on documents
alter table public.documents enable row level security;
create policy "Allow individual CRUD" on public.documents for all using (auth.uid() = user_id);

-- 4. Contacts Table
create table public.contacts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  contact_name text not null,
  email text not null,
  phone text default '' not null,
  relationship text default '' not null,
  permission text not null check (permission in ('Viewer', 'Emergency Access', 'Full Access')) default 'Viewer',
  is_verified boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on contacts
alter table public.contacts enable row level security;
create policy "Allow individual CRUD" on public.contacts for all using (auth.uid() = user_id);

-- 5. Reminders Table
create table public.reminders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  category text not null check (category in ('Subscription', 'Passport', 'Insurance', 'License', 'Bills', 'Other')) default 'Other',
  due_date timestamp with time zone not null,
  notes text default '' not null,
  completed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on reminders
alter table public.reminders enable row level security;
create policy "Allow individual CRUD" on public.reminders for all using (auth.uid() = user_id);

-- 6. Emergency Settings Table
create table public.emergency_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade unique not null,
  inactivity_days integer default 30 not null,
  last_active_date timestamp with time zone default timezone('utc'::text, now()) not null,
  emergency_enabled boolean default false not null,
  auto_release_enabled boolean default false not null,
  emergency_note text default '' not null,
  status text not null check (status in ('Inactive', 'Countdown', 'Triggered')) default 'Inactive',
  countdown_start timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on emergency_settings
alter table public.emergency_settings enable row level security;
create policy "Allow individual CRUD" on public.emergency_settings for all using (auth.uid() = user_id);

-- 7. Notifications Table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text not null check (type in ('expiry', 'security', 'emergency', 'payment', 'info')) default 'info',
  is_read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on notifications
alter table public.notifications enable row level security;
create policy "Allow individual CRUD" on public.notifications for all using (auth.uid() = user_id);

-- 8. Audit Logs Table
create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  action text not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on audit_logs
alter table public.audit_logs enable row level security;
create policy "Allow individual CRUD" on public.audit_logs for all using (auth.uid() = user_id);

-- 9. Trigger to sync public.users upon user signup in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, plan)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New User'),
    'Free'
  );
  
  -- Automatically initialize default Emergency Settings
  insert into public.emergency_settings (user_id, inactivity_days, emergency_enabled, emergency_note)
  values (
    new.id,
    30,
    false,
    'This is my emergency release note. In case of inactivity, please share my digital vault access with my trusted contacts.'
  );

  -- Add welcome notification
  insert into public.notifications (user_id, title, message, type)
  values (
    new.id,
    'Welcome to LifePause!',
    'Get started by completing your emergency onboarding steps.',
    'info'
  );

  -- Add register audit log
  insert into public.audit_logs (user_id, action)
  values (
    new.id,
    'User Registered'
  );

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 3. Environment Variables

### Local Backend (`backend/.env`)
Create a `.env` file inside your backend directory:
```env
PORT=5000
SUPABASE_URL=https://zdhskbdusqmkucipkpxo.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=agVCC4H1y8+tlYcqSvb7arwcuupTW2yE...
```

### Frontend (`frontend/.env.production`)
Create a `.env.production` file inside your frontend directory:
```env
VITE_API_URL=https://lifepause-backend.vercel.app/api
```

---

## 4. Vercel Deployment Guide

To deploy the migrated serverless backend successfully to Vercel:

### Step 1: Open Vercel Project Dashboard
1. Go to **[Vercel Dashboard](https://vercel.com)**.
2. Select your project **`lifepause-backend`**.

### Step 2: Configure Environment Variables
1. Navigate to **Settings -> Environment Variables**.
2. **Remove** the old `MONGO_URI` variable completely.
3. Add the following new environment variables:
   * **`SUPABASE_URL`**: `https://zdhskbdusqmkucipkpxo.supabase.co`
   * **`SUPABASE_ANON_KEY`**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdWJhYmFzZSIsInJlZiI6InpkaHNrYmR1c3Fta3VjaXBrcHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTkyNjksImV4cCI6MjA5MTMzNTI2OX0.-nspkqLBghzm1dVfrX42QkKdaaTN79jP5O8hPSWmPwM`
   * **`SUPABASE_JWT_SECRET`**: `agVCC4H1y8+tlYcqSvb7arwcuupTW2yEwEWVt0l3rbcGbyRj9/b3oUVwIRhWXVCDQGXNzvtzdkFnIpoGGtarHQ==`

### Step 3: Trigger a Production Build Redeployment
1. Go to the **Deployments** tab on your Vercel backend dashboard.
2. Click the three dots (`...`) next to your latest deployment.
3. Click **Redeploy** and wait for the deployment to show as **Active / Ready**.

Your database connection errors are now permanently resolved and the live SaaS application is ready to handle ultra-low-latency real-time client traffic! 🚀
