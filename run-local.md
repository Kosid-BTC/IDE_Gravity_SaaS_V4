# Run Local

Terminal 1:
```bash
cd ai-engine
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Terminal 2:
```bash
cd frontend
npm install
cp .env.production.example .env
npm run dev
```
