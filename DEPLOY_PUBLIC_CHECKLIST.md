# Public SaaS Deployment Checklist

## 1. Supabase
- [ ] Create Supabase project
- [ ] Run `database/schema.sql`
- [ ] Enable Email Auth
- [ ] Confirm RLS is enabled
- [ ] Copy Project URL and Anon Key

## 2. AI Engine
Deploy `ai-engine/` to Render/Railway/VPS.

Environment:
```env
ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:5173
```

## 3. Frontend
Deploy `frontend/` to Vercel or Netlify.

Environment:
```env
VITE_SUPABASE_URL=<YOUR_SUPABASE_URL>
VITE_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
VITE_AI_API_URL=<YOUR_AI_ENGINE_PUBLIC_URL>
```

## 4. Public Test
- [ ] Register new user
- [ ] Login
- [ ] Create / view dashboard
- [ ] Run AI Copilot
- [ ] Generate Executive Report
