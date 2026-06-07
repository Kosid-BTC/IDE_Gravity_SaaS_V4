from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import os
from datetime import datetime

app = FastAPI(title="IDE Gravity AI Engine")

allowed = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[x.strip() for x in allowed],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "IDE Gravity AI Engine running"}

@app.post("/copilot")
def copilot(data: dict):
    step = data.get("step", 1)
    vrio = data.get("vrio", {}) or {}
    gravity = float(data.get("gravity", 0) or 0)

    if step <= 10:
        focus = "Discovery: refine beachhead market and validate customer pain."
    elif step <= 14:
        focus = "Design: strengthen rarity and imitability barriers."
    elif step <= 21:
        focus = "Deliver: optimize GTM, pricing, onboarding, and retention."
    else:
        focus = "Deploy: scale growth loop, benchmark data, and feedback system."

    if gravity > 9000:
        action = "Scale aggressively with referral loop and partner channel."
    else:
        action = "Increase F_IDE by improving K viral, reducing friction, and strengthening VRIO6G."

    return {
        "insight": f"MIT Step {step}. {focus} Recommended action: {action}"
    }

@app.get("/report")
def report(step: int = 14, gravity: float = 10432):
    path = "/tmp/ide_strategy_report.pdf"
    doc = SimpleDocTemplate(path)
    styles = getSampleStyleSheet()
    story = [
        Paragraph("IDE Strategy Command Center - Executive Report", styles["Title"]),
        Spacer(1, 12),
        Paragraph(f"Generated: {datetime.utcnow().isoformat()} UTC", styles["BodyText"]),
        Paragraph(f"MIT Step: {step}/24", styles["BodyText"]),
        Paragraph(f"Market Gravity F_IDE: {gravity:,.0f}", styles["BodyText"]),
        Spacer(1, 12),
        Paragraph("Recommendation", styles["Heading2"]),
        Paragraph("Strengthen VRIO6G barriers, increase viral coefficient K, reduce adoption friction, and scale through a repeatable AI-assisted strategy loop.", styles["BodyText"]),
    ]
    doc.build(story)
    return FileResponse(path, media_type="application/pdf", filename="IDE_Strategy_Report.pdf")
