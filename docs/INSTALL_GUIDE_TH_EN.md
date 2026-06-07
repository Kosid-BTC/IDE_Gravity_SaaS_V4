# IDE Gravity SaaS V4 — Public Installation Guide

## TH
ระบบนี้เป็น SaaS Starter ที่พร้อม public deploy:
- Frontend: React + Vite
- Auth/Data: Supabase
- AI Engine: FastAPI
- Report: PDF Export
- Multi-tenant: organizations/profiles + RLS starter

### Local Run
```bash
cd ai-engine
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

เปิดอีก terminal:
```bash
cd frontend
npm install
cp .env.production.example .env
npm run dev
```

### Production
Frontend: Vercel / Netlify  
AI Engine: Render / Railway / VPS  
Database: Supabase Cloud

## EN
Public deploy-ready SaaS starter for AI Strategy Command Center.
