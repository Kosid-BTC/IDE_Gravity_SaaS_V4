# Public Deploy Guide

## Vercel
1. Import `frontend/` as project.
2. Set env:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_AI_API_URL
3. Deploy.

## Render/Railway
Deploy `ai-engine/`.

Start command:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Set:
```env
ALLOWED_ORIGINS=https://your-frontend-domain.com
```
