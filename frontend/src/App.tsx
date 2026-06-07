import "./styles.css";
import React, { useEffect, useMemo, useState } from "react";
import { createClient, Session } from "@supabase/supabase-js";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer
} from "recharts";
import { LogOut, Sparkles, FileText, ShieldCheck } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AI_API_URL = import.meta.env.VITE_AI_API_URL;

type VrioRow = {
  v:number; r:number; i:number; o:number; g_growth:number; g_gravity:number; vrio6g_score:number;
};

function Login({ onSession }: { onSession: (s: Session|null)=>void }) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [mode,setMode] = useState<"login"|"signup">("login");
  const [msg,setMsg] = useState("");

  async function submit() {
    setMsg("");
    const res = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (res.error) setMsg(res.error.message);
    else {
      onSession(res.data.session);
      setMsg(mode === "signup" ? "Signup complete. Please check email if confirmation is enabled." : "Login success.");
    }
  }

  return <div className="page center">
    <div className="card login">
      <h1>AI Gravity Engine</h1>
      <p>For Thai SMEs to IDE — Public SaaS Ready</p>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={submit}>{mode === "login" ? "Login" : "Create Account"}</button>
      <button className="ghost" onClick={()=>setMode(mode==="login"?"signup":"login")}>
        {mode === "login" ? "Create new account" : "Back to login"}
      </button>
      {msg && <small>{msg}</small>}
    </div>
  </div>
}

function Dashboard({ session }: { session: Session }) {
  const [vrio,setVrio] = useState<VrioRow|null>(null);
  const [gravity,setGravity] = useState(10432);
  const [step,setStep] = useState(14);
  const [insight,setInsight] = useState("Click Generate Insight to run AI Copilot.");

  useEffect(()=>{
    async function load() {
      const v = await supabase.from("vrio6g_index").select("*").order("created_at",{ascending:false}).limit(1);
      if (v.data && v.data[0]) setVrio(v.data[0] as VrioRow);
      else setVrio({v:8.5,r:8.7,i:8.3,o:8.5,g_growth:8.2,g_gravity:8.8,vrio6g_score:8.5});

      const g = await supabase.from("simulation_log").select("*").order("created_at",{ascending:false}).limit(1);
      if (g.data && g.data[0]) setGravity(g.data[0].f_ide);
    }
    load();
  },[]);

  const radarData = useMemo(()=> {
    const d = vrio || {v:8.5,r:8.7,i:8.3,o:8.5,g_growth:8.2,g_gravity:8.8,vrio6g_score:8.5};
    return [
      { subject:"V", value:d.v },
      { subject:"R", value:d.r },
      { subject:"I", value:d.i },
      { subject:"O", value:d.o },
      { subject:"G", value:d.g_growth },
      { subject:"Gv", value:d.g_gravity }
    ];
  },[vrio]);

  async function generateInsight() {
    try {
      const res = await fetch(`${AI_API_URL}/copilot`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ step, vrio, gravity })
      });
      const data = await res.json();
      setInsight(data.insight || data.result || "No insight returned.");
    } catch {
      setInsight("AI Engine unavailable. Check VITE_AI_API_URL and CORS.");
    }
  }

  async function exportReport() {
    window.open(`${AI_API_URL}/report?step=${step}&gravity=${gravity}`, "_blank");
  }

  return <div className="page">
    <header>
      <div>
        <h1>IDE Strategy Command Center</h1>
        <p>MIT24 → VRIO6G → Gravity Engine → AI Copilot</p>
      </div>
      <button className="ghost" onClick={()=>supabase.auth.signOut()}><LogOut size={16}/> Logout</button>
    </header>

    <section className="grid">
      <div className="card">
        <h2>MIT24 Orbit</h2>
        <div className="steps">
          {Array.from({length:24},(_,i)=>i+1).map(n =>
            <button key={n} className={step===n?"active":""} onClick={()=>setStep(n)}>{n}</button>
          )}
        </div>
        <p>Current MIT Step: <b>{step}/24</b></p>
      </div>

      <div className="card radar">
        <h2>VRIO6G Radar</h2>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#00C8FF" />
            <PolarAngleAxis dataKey="subject" stroke="#dffaff" />
            <Radar dataKey="value" stroke="#00FFFF" fill="#00C8FF" fillOpacity={0.55} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2>Gravity Pulse</h2>
        <div className="pulse" style={{"--glow": Math.min(1, gravity/12000)} as React.CSSProperties}>
          <Sparkles size={64}/>
        </div>
        <h3>F_IDE: {Math.round(gravity).toLocaleString()}</h3>
        <p>VRIO6G Score: {vrio?.vrio6g_score?.toFixed(2) || "8.50"}</p>
      </div>

      <div className="card">
        <h2>AI Copilot</h2>
        <p className="insight">{insight}</p>
        <button onClick={generateInsight}><Sparkles size={16}/> Generate Insight</button>
        <button onClick={exportReport}><FileText size={16}/> Export Executive PDF</button>
      </div>
    </section>

    <footer><ShieldCheck size={16}/> Multi-tenant Supabase SaaS Starter · RLS Ready</footer>
  </div>
}

export default function App() {
  const [session,setSession] = useState<Session|null>(null);
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e,s)=>setSession(s));
    return ()=>sub.subscription.unsubscribe();
  },[]);
  return session ? <Dashboard session={session}/> : <Login onSession={setSession}/>;
}
