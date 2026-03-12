# صانع.ma — Sani3.ma v2.0

> منصة البحث عن الحرفيين في المغرب | Plateforme de recherche d'artisans au Maroc

## 🚀 Quick Start

```bash
npm install
cp .env.example .env   # Fill in your keys
npm start
```

## 🔑 Environment Variables

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
REACT_APP_GOOGLE_MAPS_KEY=your-google-maps-api-key
REACT_APP_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxx
REACT_APP_TWILIO_AUTH_TOKEN=your-auth-token
REACT_APP_TWILIO_PHONE=+1xxxxxxxxxx
```

## 🌍 Routes

| URL           | Page           | Protected? |
|---------------|----------------|------------|
| /             | Home           | No         |
| /search       | Search + Maps  | No         |
| /worker/:id   | Worker Profile | No         |
| /login        | Login          | No         |
| /signup       | Signup         | No         |
| /dashboard    | Dashboard      | ✅ Yes     |
| /booking/:id  | Book Appt.     | ✅ Yes     |
| /chat/:id     | Real-time Chat | ✅ Yes     |
| /admin        | Admin Panel    | ✅ Yes     |

## ✨ New Features v2.0

1. **🗺️ Google Maps** — real interactive map with worker markers & info windows
2. **👷 Worker Profiles** — full bio, reviews, map tab, booking + chat buttons
3. **📅 Booking System** — visual date/time picker, 3-step flow, SMS trigger
4. **💬 Real-time Chat** — messaging UI with typing indicator, Supabase Realtime ready
5. **⭐ Reviews** — star rating form, breakdown chart, review list
6. **🛡️ Admin Panel** — worker table, verification management, bookings, SMS config
7. **✓ Verified Badge** — admin can verify workers, badge shows on cards & profiles
8. **📱 Twilio SMS** — booking confirmation SMS, Node.js backend code included

## 🔧 Setup Guides

### Google Maps
1. Enable Maps JavaScript API in Google Cloud Console
2. Add key to .env: `REACT_APP_GOOGLE_MAPS_KEY=your-key`

### Twilio SMS
1. Get credentials at twilio.com
2. Fill in .env
3. See Admin > SMS tab for Node.js backend code

### Admin Access
Set role in Supabase:
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'
WHERE email = 'your-admin@email.com';
```

## 🗄️ Supabase Tables

```sql
create table workers (id uuid primary key default uuid_generate_v4(), user_id uuid references auth.users, name text, service text, city text, lat float, lng float, phone text, price text, bio_ar text, bio_fr text, verified boolean default false, available boolean default true, rating float default 5.0, created_at timestamp default now());

create table bookings (id uuid primary key default uuid_generate_v4(), worker_id uuid references workers, client_id uuid references auth.users, date date, time text, notes text, status text default 'pending', created_at timestamp default now());

create table reviews (id uuid primary key default uuid_generate_v4(), worker_id uuid references workers, client_id uuid references auth.users, rating int, comment text, created_at timestamp default now());

create table messages (id uuid primary key default uuid_generate_v4(), chat_id text, sender_id uuid references auth.users, text text, created_at timestamp default now());
```
