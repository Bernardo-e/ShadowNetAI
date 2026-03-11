import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════
   SHADOWNET AI v4 — ULTIMATE FINAL
   ✅ Company Presets (Hospital / Bank / Government / Tech)
   ✅ Live Threat Feed ticker
   ✅ Zoom & Pan topology
   ✅ Curved bezier edges
   ✅ Risk over time chart
   ✅ Attack speed control
   ✅ Simulation counter
   ✅ Replay button
   ✅ Flying packets on ALL edges
   ✅ Attack trail glow
   ✅ Sound toggle
   ══════════════════════════════════════════════════════════════ */

// ── Company Presets ───────────────────────────────────────────
const COMPANY_PRESETS = {
  hospital: {
    name: "City General Hospital",
    icon: "🏥",
    color: "#00ccff",
    desc: "Healthcare Network",
    nodes: [
      { id:"inet",   name:"INTERNET",        type:"internet",    ip:"0.0.0.0",    patch:0,    fw:0,    cves:0, x:440,y:44  },
      { id:"fw",     name:"PERIMETER FW",    type:"firewall",    ip:"192.168.0.1",patch:0.80, fw:0.85, cves:0, x:440,y:130 },
      { id:"router", name:"CORE SWITCH",     type:"router",      ip:"192.168.1.1",patch:0.55, fw:0.45, cves:1, x:440,y:220 },
      { id:"ehr",    name:"EHR SERVER",      type:"server",      ip:"192.168.2.5",patch:0.45, fw:0.40, cves:3, x:200,y:220 },
      { id:"web",    name:"PATIENT PORTAL",  type:"server",      ip:"192.168.2.10",patch:0.60,fw:0.55, cves:2, x:150,y:330 },
      { id:"app",    name:"MED RECORDS APP", type:"server",      ip:"192.168.2.20",patch:0.50,fw:0.40, cves:2, x:440,y:330 },
      { id:"iot",    name:"IoT DEVICES",     type:"workstation", ip:"192.168.3.0", patch:0.20,fw:0.15, cves:4, x:680,y:220 },
      { id:"pdb",    name:"PATIENT DB",      type:"database",    ip:"192.168.4.10",patch:0.85,fw:0.80, cves:0, x:290,y:430 },
      { id:"bdb",    name:"BILLING DB",      type:"database",    ip:"192.168.4.20",patch:0.30,fw:0.25, cves:2, x:580,y:430 },
      { id:"admin",  name:"ADMIN STATION",   type:"admin_pc",    ip:"192.168.5.5", patch:0.75,fw:0.65, cves:0, x:750,y:330 },
      { id:"ws1",    name:"NURSE STATION A", type:"workstation", ip:"192.168.5.10",patch:0.35,fw:0.25, cves:1, x:100,y:430 },
      { id:"ws2",    name:"NURSE STATION B", type:"workstation", ip:"192.168.5.20",patch:0.70,fw:0.55, cves:0, x:810,y:430 },
    ],
    edges:[["inet","fw"],["fw","router"],["fw","ehr"],["router","web"],["router","app"],["router","iot"],["router","admin"],["ehr","web"],["app","pdb"],["app","bdb"],["admin","pdb"],["admin","bdb"],["router","ws1"],["router","ws2"],["iot","app"]],
    threatContext: "HIPAA compliance risk detected",
  },
  bank: {
    name: "NexusBank Financial",
    icon: "🏦",
    color: "#ffaa00",
    desc: "Financial Network",
    nodes: [
      { id:"inet",   name:"INTERNET",        type:"internet",    ip:"0.0.0.0",    patch:0,    fw:0,    cves:0, x:440,y:44  },
      { id:"fw",     name:"NEXT-GEN FW",     type:"firewall",    ip:"10.0.0.1",   patch:0.95, fw:0.95, cves:0, x:440,y:130 },
      { id:"waf",    name:"WEB APP FW",      type:"firewall",    ip:"10.0.0.2",   patch:0.90, fw:0.90, cves:0, x:220,y:130 },
      { id:"router", name:"CORE ROUTER",     type:"router",      ip:"10.1.0.1",   patch:0.70, fw:0.60, cves:0, x:440,y:220 },
      { id:"web",    name:"BANKING PORTAL",  type:"server",      ip:"10.1.1.10",  patch:0.80, fw:0.75, cves:1, x:160,y:330 },
      { id:"app",    name:"TRANSACTION SRV", type:"server",      ip:"10.1.1.20",  patch:0.65, fw:0.55, cves:2, x:440,y:330 },
      { id:"swift",  name:"SWIFT GATEWAY",   type:"server",      ip:"10.1.1.30",  patch:0.55, fw:0.50, cves:2, x:700,y:330 },
      { id:"coredb", name:"CORE BANKING DB", type:"database",    ip:"10.2.0.10",  patch:0.90, fw:0.88, cves:0, x:300,y:430 },
      { id:"txdb",   name:"TRANSACTION DB",  type:"database",    ip:"10.2.0.20",  patch:0.40, fw:0.35, cves:2, x:570,y:430 },
      { id:"admin",  name:"SOC WORKSTATION", type:"admin_pc",    ip:"10.3.0.5",   patch:0.85, fw:0.80, cves:0, x:780,y:220 },
      { id:"atm",    name:"ATM NETWORK",     type:"workstation", ip:"10.3.1.0",   patch:0.30, fw:0.20, cves:3, x:100,y:430 },
      { id:"teller", name:"TELLER SYSTEM",   type:"workstation", ip:"10.3.1.10",  patch:0.60, fw:0.50, cves:1, x:810,y:430 },
    ],
    edges:[["inet","fw"],["inet","waf"],["waf","web"],["fw","router"],["router","web"],["router","app"],["router","swift"],["router","admin"],["app","coredb"],["app","txdb"],["swift","txdb"],["admin","coredb"],["admin","txdb"],["router","atm"],["router","teller"]],
    threatContext: "PCI-DSS violation risk — transaction data exposed",
  },
  government: {
    name: "Gov Defense Agency",
    icon: "🏛️",
    color: "#00ff88",
    desc: "Government Network",
    nodes: [
      { id:"inet",   name:"INTERNET",        type:"internet",    ip:"0.0.0.0",    patch:0,    fw:0,    cves:0, x:440,y:44  },
      { id:"fw1",    name:"BORDER FW",       type:"firewall",    ip:"172.16.0.1", patch:0.95, fw:0.98, cves:0, x:300,y:130 },
      { id:"fw2",    name:"INTERNAL FW",     type:"firewall",    ip:"172.16.0.2", patch:0.92, fw:0.95, cves:0, x:580,y:130 },
      { id:"router", name:"CLASSIFIED RTR",  type:"router",      ip:"172.16.1.1", patch:0.75, fw:0.70, cves:0, x:440,y:220 },
      { id:"web",    name:"PUBLIC PORTAL",   type:"server",      ip:"172.16.2.5", patch:0.70, fw:0.65, cves:1, x:160,y:330 },
      { id:"app",    name:"CLASSIFIED SRV",  type:"server",      ip:"172.16.2.10",patch:0.60, fw:0.55, cves:2, x:440,y:330 },
      { id:"intel",  name:"INTEL SERVER",    type:"server",      ip:"172.16.2.20",patch:0.50, fw:0.45, cves:2, x:700,y:220 },
      { id:"db1",    name:"CLASSIFIED DB",   type:"database",    ip:"172.16.3.10",patch:0.88, fw:0.85, cves:0, x:300,y:430 },
      { id:"db2",    name:"PERSONNEL DB",    type:"database",    ip:"172.16.3.20",patch:0.35, fw:0.30, cves:2, x:570,y:430 },
      { id:"admin",  name:"ADMIN TERMINAL",  type:"admin_pc",    ip:"172.16.4.5", patch:0.88, fw:0.82, cves:0, x:780,y:330 },
      { id:"ws1",    name:"OFFICER WS-A",    type:"workstation", ip:"172.16.4.10",patch:0.45, fw:0.35, cves:1, x:100,y:430 },
      { id:"ws2",    name:"OFFICER WS-B",    type:"workstation", ip:"172.16.4.20",patch:0.80, fw:0.70, cves:0, x:810,y:430 },
    ],
    edges:[["inet","fw1"],["inet","fw2"],["fw1","router"],["fw2","router"],["fw2","intel"],["router","web"],["router","app"],["router","admin"],["app","db1"],["app","db2"],["admin","db1"],["admin","db2"],["intel","app"],["router","ws1"],["router","ws2"]],
    threatContext: "Nation-state APT activity detected on perimeter",
  },
  tech: {
    name: "TechCorp HQ",
    icon: "💻",
    color: "#bf44ff",
    desc: "Tech Startup Network",
    nodes: [
      { id:"inet",   name:"INTERNET",        type:"internet",    ip:"0.0.0.0",    patch:0,    fw:0,    cves:0, x:440,y:44  },
      { id:"fw",     name:"CLOUD FW",        type:"firewall",    ip:"10.0.0.1",   patch:0.75, fw:0.70, cves:0, x:440,y:130 },
      { id:"lb",     name:"LOAD BALANCER",   type:"router",      ip:"10.0.1.1",   patch:0.65, fw:0.55, cves:1, x:440,y:220 },
      { id:"api",    name:"API GATEWAY",     type:"server",      ip:"10.1.0.10",  patch:0.60, fw:0.50, cves:2, x:200,y:220 },
      { id:"web",    name:"WEB SERVER",      type:"server",      ip:"10.1.1.10",  patch:0.70, fw:0.60, cves:1, x:150,y:330 },
      { id:"app",    name:"APP SERVER",      type:"server",      ip:"10.1.1.20",  patch:0.45, fw:0.35, cves:3, x:440,y:330 },
      { id:"ci",     name:"CI/CD PIPELINE",  type:"server",      ip:"10.1.1.30",  patch:0.40, fw:0.30, cves:3, x:700,y:220 },
      { id:"db1",    name:"USER DB",         type:"database",    ip:"10.2.0.10",  patch:0.85, fw:0.80, cves:0, x:290,y:430 },
      { id:"db2",    name:"ANALYTICS DB",    type:"database",    ip:"10.2.0.20",  patch:0.25, fw:0.20, cves:3, x:580,y:430 },
      { id:"admin",  name:"DEV WORKSTATION", type:"admin_pc",    ip:"10.3.0.5",   patch:0.70, fw:0.60, cves:1, x:770,y:330 },
      { id:"ws1",    name:"EMPLOYEE WS-A",   type:"workstation", ip:"10.3.1.10",  patch:0.35, fw:0.25, cves:2, x:100,y:430 },
      { id:"ws2",    name:"EMPLOYEE WS-B",   type:"workstation", ip:"10.3.1.20",  patch:0.65, fw:0.55, cves:1, x:810,y:430 },
    ],
    edges:[["inet","fw"],["fw","lb"],["fw","api"],["lb","web"],["lb","app"],["api","app"],["app","db1"],["app","db2"],["ci","app"],["admin","db1"],["admin","db2"],["admin","app"],["lb","ws1"],["lb","ws2"],["lb","ci"]],
    threatContext: "Supply chain attack via CI/CD pipeline detected",
  },
};

const ATTACKS = [
  { id:"brute_force",          name:"Brute Force",         icon:"⚡", color:"#ff2244", desc:"SSH/RDP assault" },
  { id:"lateral_movement",     name:"Lateral Movement",    icon:"⇌",  color:"#ff8c00", desc:"Network pivoting" },
  { id:"privilege_escalation", name:"Priv. Escalation",    icon:"↑",  color:"#bf44ff", desc:"Root/SYSTEM exploit" },
  { id:"malware_spread",       name:"Malware Spread",      icon:"⬡",  color:"#ff44bb", desc:"Ransomware wave" },
  { id:"sql_injection",        name:"SQL Injection",       icon:"◈",  color:"#00cfff", desc:"DB exfiltration" },
  { id:"zero_day",             name:"Zero-Day",            icon:"☢",  color:"#ff0022", desc:"Unknown vuln" },
];

const NODE_VIS = {
  internet:    { sym:"◎", label:"NET",  ring:"#445566" },
  firewall:    { sym:"▣", label:"FW",   ring:"#00ff88" },
  router:      { sym:"⬡", label:"RTR",  ring:"#00ccff" },
  server:      { sym:"▪", label:"SRV",  ring:"#4488ff" },
  database:    { sym:"◆", label:"DB",   ring:"#aa44ff" },
  admin_pc:    { sym:"★", label:"ADM",  ring:"#ffaa00" },
  workstation: { sym:"▫", label:"WS",   ring:"#6677cc" },
};

const STATUS_C = { safe:"#00ff88", scanning:"#ffcc00", vulnerable:"#ff8800", compromised:"#ff1144" };

// Live threat feed messages
const THREAT_MSGS = [
  "CVE-2024-21887 — Ivanti Connect Secure RCE — CRITICAL",
  "APT29 lateral movement detected on port 445",
  "Brute force attempt: 14,322 requests/min on SSH",
  "CVE-2024-3400 — PAN-OS Zero-Day actively exploited",
  "Ransomware C2 beacon detected — 185.234.219.21",
  "SQL injection attempt on /api/login endpoint",
  "CVE-2023-44487 — HTTP/2 Rapid Reset DDoS — HIGH",
  "Credential stuffing: 8,442 failed logins in 60s",
  "Cobalt Strike beacon detected in memory — PID 4821",
  "CVE-2024-1709 — ConnectWise ScreenConnect auth bypass",
  "Mimikatz execution detected on ADMIN-PC-03",
  "DNS tunneling exfiltration detected — 2.4GB/hr",
  "Log4Shell attempt on port 8080 — blocked",
  "Suspicious PowerShell: encoded base64 command",
  "Zero-day exploit kit detected — signature unknown",
];

// ── AI Data ──────────────────────────────────────────────────
const ATK_PATTERNS = {
  brute_force:"Credential-Based Intrusion (T1110)",
  lateral_movement:"Lateral Movement via Pass-the-Hash (T1550)",
  privilege_escalation:"Privilege Escalation via SUID Abuse (T1548)",
  malware_spread:"Ransomware Propagation (T1486)",
  sql_injection:"SQL Injection Data Exfiltration (T1190)",
  zero_day:"Zero-Day Exploitation — Unclassified CVE",
};
const MITRE_TACTICS = {
  brute_force:["Initial Access","Credential Access","Persistence"],
  lateral_movement:["Lateral Movement","Defense Evasion","Collection"],
  privilege_escalation:["Privilege Escalation","Execution","Impact"],
  malware_spread:["Execution","Impact","Exfiltration"],
  sql_injection:["Initial Access","Collection","Exfiltration"],
  zero_day:["Initial Access","Execution","Privilege Escalation","Impact"],
};
const AI_FIXES = {
  brute_force:["Enable MFA on all remote access endpoints","Enforce account lockout after 5 failed attempts","Deploy fail2ban / brute-force protection","Rotate all compromised credentials immediately"],
  lateral_movement:["Segment network with VLANs — isolate critical assets","Disable NTLM authentication where possible","Deploy Privileged Access Workstations (PAW)","Enable Windows Credential Guard"],
  privilege_escalation:["Audit and restrict SUID/SGID binaries on all hosts","Apply principle of least privilege to all accounts","Patch OS kernel to latest stable release","Deploy EDR with behavioral detection"],
  malware_spread:["Isolate infected nodes from network immediately","Restore affected systems from last clean backup","Block C2 IP ranges at perimeter firewall","Enforce application whitelisting policy"],
  sql_injection:["Replace dynamic SQL with parameterized queries","Enable and tune Web Application Firewall rules","Restrict database user permissions to minimum","Encrypt all sensitive columns in databases"],
  zero_day:["Apply emergency vendor patch or virtual patch now","Isolate affected systems until patch is available","Enable Advanced Threat Protection (ATP)","Report to CERT/CC for CVE assignment"],
};
const ATTACKER_ORIGINS = ["Russia (APT29)","China (APT41)","North Korea (Lazarus)","Iran (APT35)","Unknown Actor"];

// ── Simulation engine ─────────────────────────────────────────
function simulate(nodes, attackId) {
  const msgs = {
    brute_force:["SSH brute force started","10k combos tested","Hash cracked","Shell obtained"],
    lateral_movement:["Trust enum done","Pass-the-hash sent","NTLM relay done","Segment pivoted"],
    privilege_escalation:["SUID scan done","Sudo exploit triggered","Kernel exploit done","ROOT obtained"],
    malware_spread:["Dropper delivered","C2 beacon active","Persistence written","Encryption started"],
    sql_injection:["Injection found","UNION bypass done","Schema dumped","10GB exfiltrated"],
    zero_day:["0-day armed","Defenses bypassed","Memory corrupted","Full takeover done"],
  };
  const nodeMap = {};
  nodes.forEach(n => nodeMap[n.id] = { ...n, status:"safe", risk:0 });
  const order = nodes.filter(n=>n.type!=="internet").map(n=>n.id);
  const events = []; let attacker = "inet";
  for (let i = 0; i < order.length; i++) {
    const tid = order[i]; const t = nodeMap[tid]; if (!t) continue;
    const defense = t.patch * 0.4 + t.fw * 0.4;
    const vuln = t.cves * 0.1;
    const zd = attackId === "zero_day" ? 0.22 : 0;
    const prob = Math.max(0.08, Math.min(0.94, 0.55 + vuln - defense + zd));
    const success = Math.random() < prob;
    const desc = (msgs[attackId]||msgs.brute_force)[Math.floor(Math.random()*4)];
    events.push({ src:attacker, tgt:tid, success, desc:`[${t.name}] ${desc}`, prob, risk:success?prob*42:prob*13 });
    if (success) { nodeMap[tid].status="compromised"; nodeMap[tid].risk=Math.min(100,prob*42); attacker=tid; }
    else { nodeMap[tid].status=prob>0.35?"vulnerable":"scanning"; nodeMap[tid].risk=Math.min(100,prob*13); }
  }
  return { events, finalNodes: nodes.map(n => nodeMap[n.id] || n) };
}

// ── Animated packet ───────────────────────────────────────────
function Packet({ sx, sy, ex, ey, color, onDone, id }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf, start = null;
    const dur = 650;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const e = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
      setT(e);
      if (p < 1) raf = requestAnimationFrame(step);
      else onDone(id);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  const x = sx + (ex - sx) * t, y = sy + (ey - sy) * t;
  return (
    <g>
      <circle cx={x} cy={y} r={5.5} fill={color} opacity={0.95} style={{filter:`drop-shadow(0 0 6px ${color})`}}/>
      <circle cx={x} cy={y} r={10} fill="none" stroke={color} strokeWidth={1} opacity={0.35}/>
    </g>
  );
}

// ── Star field canvas ─────────────────────────────────────────
function StarField() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const pts = Array.from({length:70},()=>({
      x:Math.random()*c.width, y:Math.random()*c.height,
      vx:(Math.random()-.5)*.22, vy:(Math.random()-.5)*.22,
      r:Math.random()*1.3+.3, a:Math.random()*.4+.1
    }));
    let raf;
    const draw = () => {
      const ctx = c.getContext("2d"); ctx.clearRect(0,0,c.width,c.height);
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>c.width)p.vx*=-1; if(p.y<0||p.y>c.height)p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(0,200,120,${p.a*.35})`; ctx.fill();
      });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
        if(d<85){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle=`rgba(0,200,120,${(1-d/85)*.055})`;ctx.lineWidth=.5;ctx.stroke();}
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>;
}

// ── Risk chart ────────────────────────────────────────────────
function RiskChart({ history }) {
  const W = 260, H = 80;
  if (history.length < 2) return (
    <div style={{width:"100%",height:H,display:"flex",alignItems:"center",justifyContent:"center",
      color:"#0d2040",fontSize:9,letterSpacing:2}}>RUN SIMULATION TO SEE RISK TREND</div>
  );
  const max = 100;
  const pts = history.map((v,i) => ({
    x: (i/(history.length-1))*(W-20)+10,
    y: H - 10 - (v/max)*(H-20)
  }));
  const pathD = pts.map((p,i)=>i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`).join(" ");
  const areaD = `${pathD} L${pts[pts.length-1].x},${H-10} L${pts[0].x},${H-10} Z`;
  const last = history[history.length-1];
  const lc = last>60?"#ff1144":last>30?"#ff8800":"#00ff88";
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lc} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={lc} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[25,50,75].map(v=>(
        <line key={v} x1={10} y1={H-10-(v/max)*(H-20)} x2={W-10} y2={H-10-(v/max)*(H-20)}
          stroke="#0d2040" strokeWidth={0.5} strokeDasharray="3,3"/>
      ))}
      <path d={areaD} fill="url(#chartGrad)"/>
      <path d={pathD} fill="none" stroke={lc} strokeWidth={2}
        style={{filter:`drop-shadow(0 0 4px ${lc})`}}/>
      {pts.map((p,i)=>i===pts.length-1&&(
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={lc}
          style={{filter:`drop-shadow(0 0 4px ${lc})`}}/>
      ))}
      <text x={W-8} y={H-10-(last/max)*(H-20)-4} textAnchor="end"
        fontSize={8} fill={lc} fontFamily="monospace" fontWeight={700}>{Math.round(last)}%</text>
    </svg>
  );
}

// ── Topology SVG ──────────────────────────────────────────────
function Topology({ nodes, edges, selected, onSelect, liveEdges, packets, attackColor, trails, zoom, pan, onZoom, onPanStart }) {
  const W=880, H=510;
  const nm={}; nodes.forEach(n=>nm[n.id]=n);
  const ac = attackColor||"#ff2244";

  // Bezier curve control points
  const bezier = (x1,y1,x2,y2) => {
    const mx=(x1+x2)/2, my=(y1+y2)/2;
    const dx=x2-x1, dy=y2-y1;
    const cx1=x1+dx*0.15+dy*0.18, cy1=y1+dy*0.15-dx*0.18;
    const cx2=x2-dx*0.15+dy*0.18, cy2=y2-dy*0.15-dx*0.18;
    return `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
  };

  return (
    <svg width="100%" height="100%"
      viewBox={`${-pan.x/zoom} ${-pan.y/zoom} ${W/zoom} ${H/zoom}`}
      style={{display:"block",cursor:"grab"}}
      onWheel={e=>{e.preventDefault();onZoom(e.deltaY<0?0.12:-0.12,e.clientX,e.clientY);}}
      onMouseDown={onPanStart}>
      <defs>
        <filter id="glow-safe"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="glow-compromised"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="eglow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <marker id="a-dim" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,1 L6,3.5 L0,6z" fill="#0d2a4a"/>
        </marker>
        <marker id="a-live" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,1 L7,4 L0,7z" fill={ac}/>
        </marker>
        <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M44,0 L0,0 0,44" fill="none" stroke="#08182e" strokeWidth="0.7"/>
        </pattern>
        <radialGradient id="nodebg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#0d1f38"/><stop offset="100%" stopColor="#05101e"/>
        </radialGradient>
        <radialGradient id="zone-a" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#223344" stopOpacity="0.25"/><stop offset="100%" stopColor="#223344" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="zone-b" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#002233" stopOpacity="0.22"/><stop offset="100%" stopColor="#002233" stopOpacity="0"/>
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill="url(#grid)"/>

      {/* Zone backgrounds */}
      <ellipse cx={440} cy={44} rx={200} ry={32} fill="url(#zone-a)"/>
      <rect x={80} y={185} width={760} height={345} rx={6} fill="url(#zone-b)"
        stroke="#0a1e30" strokeWidth={0.6} strokeDasharray="5,3"/>
      <text x={88} y={200} fontSize={7} fill="#0d2a40" fontFamily="monospace" letterSpacing={2}>INTERNAL NETWORK</text>
      <text x={360} y={28} fontSize={7} fill="#1a3040" fontFamily="monospace" letterSpacing={2}>EXTERNAL</text>

      {/* Trail glow on breached edges */}
      {trails.map((tr,i)=>{
        const sn=nm[tr.src],tn=nm[tr.tgt]; if(!sn||!tn) return null;
        return <path key={i} d={bezier(sn.x,sn.y,tn.x,tn.y)}
          fill="none" stroke={ac} strokeWidth={6} strokeOpacity={0.08} filter="url(#eglow)"/>;
      })}

      {/* Edges */}
      {edges.map(([s,t],i)=>{
        const sn=nm[s],tn=nm[t]; if(!sn||!tn) return null;
        const live=liveEdges.has(`${s}-${t}`);
        const d=bezier(sn.x,sn.y,tn.x,tn.y);
        return (
          <g key={i}>
            {live&&<path d={d} fill="none" stroke={ac} strokeWidth={9} strokeOpacity={0.1}/>}
            <path d={d} fill="none"
              stroke={live?ac:"#0d2a4a"} strokeWidth={live?2:0.9}
              strokeOpacity={live?1:0.65}
              strokeDasharray={live?"10,4":"none"}
              markerEnd={`url(#a-${live?"live":"dim"})`}
              filter={live?"url(#eglow)":"none"}
              style={live?{animation:"dash 0.38s linear infinite"}:{}}/>
          </g>
        );
      })}

      {/* Packets */}
      {packets.map(p=>{
        const sn=nm[p.src],tn=nm[p.tgt]; if(!sn||!tn) return null;
        return <Packet key={p.id} id={p.id} sx={sn.x} sy={sn.y} ex={tn.x} ey={tn.y}
          color={p.color} onDone={p.onDone}/>;
      })}

      {/* Nodes */}
      {nodes.map(n=>{
        const vis=NODE_VIS[n.type]||NODE_VIS.server;
        const sc=STATUS_C[n.status]||"#00ff88";
        const sel=selected?.id===n.id;
        const hit=n.status==="compromised";
        const sz=n.type==="internet"?22:n.type==="firewall"||n.type==="router"?30:26;
        const oct=Array.from({length:8},(_,i)=>{const a=(i*45-22.5)*Math.PI/180;return `${Math.cos(a)*(sz+2)},${Math.sin(a)*(sz+2)}`;}).join(" ");
        const octIn=Array.from({length:8},(_,i)=>{const a=(i*45-22.5)*Math.PI/180;return `${Math.cos(a)*(sz-5)},${Math.sin(a)*(sz-5)}`;}).join(" ");
        return (
          <g key={n.id} transform={`translate(${n.x},${n.y})`}
            onClick={()=>onSelect(n)} style={{cursor:"pointer"}}>
            <circle r={sz+20} fill={sc} opacity={hit?0.06:0.025} filter={`url(#glow-${hit?"compromised":"safe"})`}/>
            {hit&&<>
              <circle r={sz+9} fill="none" stroke={sc} strokeWidth={1.5} opacity={0.5} style={{animation:"rp 1.3s ease-out infinite"}}/>
              <circle r={sz+15} fill="none" stroke={sc} strokeWidth={0.8} opacity={0.25} style={{animation:"rp 1.3s ease-out infinite",animationDelay:"0.35s"}}/>
            </>}
            {sel&&<circle r={sz+11} fill="none" stroke="#fff" strokeWidth={1.2} strokeDasharray="3,3" opacity={0.5} style={{animation:"rd 4s linear infinite"}}/>}
            <polygon points={oct} fill="#05101e" stroke={sc} strokeWidth={sel?2:1.3}
              style={{filter:hit?`drop-shadow(0 0 14px ${sc})`:`drop-shadow(0 0 6px ${sc}40)`}}/>
            <polygon points={octIn} fill="url(#nodebg)"/>
            <circle r={sz-7} fill="none" stroke={sc} strokeWidth={0.5} opacity={0.25}/>
            <text textAnchor="middle" dominantBaseline="central"
              fontSize={sz>28?14:11} fontFamily="monospace" fontWeight={900}
              fill={sc} style={{userSelect:"none",filter:`drop-shadow(0 0 4px ${sc})`}}>{vis.sym}</text>
            <text y={sz+13} textAnchor="middle" fontSize={8} fontFamily="'Courier New',monospace"
              fontWeight={700} fill={sel?"#fff":sc} opacity={0.85} style={{userSelect:"none"}}>{n.name}</text>
            <text y={sz+22} textAnchor="middle" fontSize={6.5} fontFamily="monospace"
              fill="#1e3a5f" style={{userSelect:"none"}}>{n.ip}</text>
            {n.risk>3&&(
              <g transform={`translate(${sz-1},${-sz+1})`}>
                <rect x={-14} y={-9} width={28} height={14} rx={3} fill={sc} opacity={0.9}/>
                <text textAnchor="middle" y={3.5} fontSize={8} fontFamily="monospace"
                  fontWeight={900} fill="#000" style={{userSelect:"none"}}>{Math.round(n.risk)}%</text>
              </g>
            )}
            <circle cx={-sz+4} cy={-sz+4} r={3.5} fill={sc} style={{filter:`drop-shadow(0 0 4px ${sc})`}}/>
          </g>
        );
      })}
      <style>{`
        @keyframes dash{to{stroke-dashoffset:-28}}
        @keyframes rp{0%{transform:scale(1);opacity:0.6}100%{transform:scale(1.55);opacity:0}}
        @keyframes rd{from{stroke-dashoffset:0}to{stroke-dashoffset:-24}}
      `}</style>
    </svg>
  );
}

// ── Boot screen ───────────────────────────────────────────────
function Boot({ onDone }) {
  const [lines, setLines] = useState([]);
  const LINES = [
    {t:"SHADOWNET AI v4.0 — ULTIMATE CYBER OPS CENTER",c:"#00ff88"},
    {t:"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",c:"#0a2818"},
    {t:"NETWORK TOPOLOGY ENGINE .............. ONLINE",c:"#3a7050"},
    {t:"DIGITAL TWIN MATRIX .................. ONLINE",c:"#3a7050"},
    {t:"AI ATTACK SIMULATOR v5 ............... ARMED ",c:"#3a7050"},
    {t:"NEURAL THREAT ANALYSIS ENGINE ........ ONLINE",c:"#3a7050"},
    {t:"ATTACK PATH PREDICTOR AI .............. READY ",c:"#3a7050"},
    {t:"COMPANY PRESET ENGINE ................ LOADED",c:"#3a7050"},
    {t:"LIVE THREAT FEED ..................... ACTIVE",c:"#3a7050"},
    {t:"BEZIER TOPOLOGY RENDERER ............. ONLINE",c:"#3a7050"},
    {t:"ZOOM & PAN ENGINE .................... READY ",c:"#3a7050"},
    {t:"RISK TREND ANALYTICS ................. ONLINE",c:"#3a7050"},
    {t:"PACKET ANIMATION ENGINE .............. READY ",c:"#3a7050"},
    {t:"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",c:"#0a2818"},
    {t:"⚡  ALL SYSTEMS OPERATIONAL — AWAITING ORDERS",c:"#00ff88"},
  ];
  useEffect(()=>{
    let i=0;
    const t=setInterval(()=>{
      if(i>=LINES.length){clearInterval(t);setTimeout(onDone,500);return;}
      setLines(p=>[...p,LINES[i++]]);
    },90);
    return()=>clearInterval(t);
  },[]);
  return (
    <div style={{position:"fixed",inset:0,background:"#000",display:"flex",alignItems:"center",
      justifyContent:"center",fontFamily:"'Courier New',monospace",zIndex:999}}>
      <div style={{width:560,padding:36,border:"1px solid #0a2818",borderRadius:4,
        background:"#010d06",boxShadow:"0 0 80px rgba(0,255,136,0.07)"}}>
        <div style={{marginBottom:20,fontSize:8,color:"#0a2818",letterSpacing:3}}>
          CYBERSENTINELS // BOOT SEQUENCE INITIATED
        </div>
        {lines.map((l,i)=>(
          <div key={i} style={{fontSize:11,color:l.c,letterSpacing:1.2,lineHeight:2,
            animation:"fs .15s ease"}}>{l.t}</div>
        ))}
        <div style={{marginTop:6,fontSize:11,color:"#00ff88",animation:"bk .6s infinite"}}>█</div>
      </div>
      <style>{`@keyframes fs{from{opacity:0;transform:translateX(-5px)}to{opacity:1;transform:none}}@keyframes bk{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ROOT APP
   ══════════════════════════════════════════════════ */
export default function App() {
  const [booted, setBooted]           = useState(false);
  const [preset, setPreset]           = useState("hospital");
  const [nodes, setNodes]             = useState(()=>COMPANY_PRESETS.hospital.nodes.map(n=>({...n,status:"safe",risk:0})));
  const [events, setEvents]           = useState([]);
  const [running, setRunning]         = useState(false);
  const [selected, setSelected]       = useState(null);
  const [activeAtk, setActiveAtk]     = useState(null);
  const [liveEdges, setLiveEdges]     = useState(new Set());
  const [trails, setTrails]           = useState([]);
  const [packets, setPackets]         = useState([]);
  const [tab, setTab]                 = useState("intel");
  const [threatLvl, setThreatLvl]     = useState("NOMINAL");
  const [riskHistory, setRiskHistory] = useState([0]);
  const [simCount, setSimCount]       = useState(0);
  const [speed, setSpeed]             = useState(750);
  const [lastSim, setLastSim]         = useState(null);
  const [aiReport, setAiReport]       = useState(null);
  const [pathPred, setPathPred]       = useState(null);
  const [zoom, setZoom]               = useState(1);
  const [pan, setPan]                 = useState({x:0,y:0});
  const [scanY, setScanY]             = useState(0);
  const [glitch, setGlitch]           = useState(false);
  const [threatFeed, setThreatFeed]   = useState([]);
  const logRef = useRef(); const pkId = useRef(0);
  const panStart = useRef(null);

  // Scanline
  useEffect(()=>{const t=setInterval(()=>setScanY(p=>(p+0.4)%100),30);return()=>clearInterval(t);},[]);

  // Live threat feed
  useEffect(()=>{
    const addMsg = () => {
      const msg = THREAT_MSGS[Math.floor(Math.random()*THREAT_MSGS.length)];
      const time = new Date().toLocaleTimeString("en",{hour12:false});
      setThreatFeed(p=>[{msg,time,id:Date.now()},...p].slice(0,6));
    };
    addMsg();
    const t = setInterval(addMsg, 3500);
    return()=>clearInterval(t);
  },[]);

  const co = COMPANY_PRESETS[preset];
  const atkInfo = ATTACKS.find(a=>a.id===activeAtk);
  const ac = atkInfo?.color||"#00ff88";
  const tlColor = {NOMINAL:"#00ff88",ELEVATED:"#ffcc00",HIGH:"#ff8800",CRITICAL:"#ff1144"}[threatLvl];

  const stats = {
    safe: nodes.filter(n=>n.status==="safe").length,
    compromised: nodes.filter(n=>n.status==="compromised").length,
    vulnerable: nodes.filter(n=>n.status==="vulnerable"||n.status==="scanning").length,
    risk: Math.round(nodes.reduce((s,n)=>s+n.risk,0)/nodes.length),
  };

  // Zoom handler
  const handleZoom = useCallback((delta, cx, cy) => {
    setZoom(z => Math.max(0.4, Math.min(3, z + delta)));
  }, []);

  // Pan handlers
  const handlePanStart = useCallback(e => {
    panStart.current = {x:e.clientX-pan.x, y:e.clientY-pan.y};
    const move = ev => setPan({x:ev.clientX-panStart.current.x, y:ev.clientY-panStart.current.y});
    const up = () => { window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up); };
    window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
  },[pan]);

  const spawnPkt = useCallback((src,tgt,color)=>{
    const id=pkId.current++;
    setPackets(p=>[...p,{id,src,tgt,color,onDone:rid=>setPackets(p=>p.filter(x=>x.id!==rid))}]);
  },[]);

  const switchPreset = (key) => {
    if(running) return;
    setPreset(key);
    setNodes(COMPANY_PRESETS[key].nodes.map(n=>({...n,status:"safe",risk:0})));
    setEvents([]); setActiveAtk(null); setSelected(null);
    setLiveEdges(new Set()); setTrails([]); setPackets([]);
    setThreatLvl("NOMINAL"); setRiskHistory([0]); setAiReport(null); setPathPred(null); setZoom(1); setPan({x:0,y:0});
  };

  const fireAttack = async(atkId)=>{
    if(running) return;
    setRunning(true); setActiveAtk(atkId); setEvents([]);
    setGlitch(true); setTimeout(()=>setGlitch(false),500);
    setThreatLvl("ELEVATED"); setTrails([]);
    const fresh = co.nodes.map(n=>({...n,status:"safe",risk:0}));
    setNodes(fresh);
    const atk = ATTACKS.find(a=>a.id===atkId);
    const col = atk?.color||"#ff2244";
    const {events:evts, finalNodes} = simulate(fresh, atkId);
    setLastSim({atkId, evts, finalNodes});

    for(let i=0;i<evts.length;i++){
      await new Promise(r=>setTimeout(r,speed));
      const ev=evts[i];
      spawnPkt(ev.src,ev.tgt,ev.success?col:"#00ff88");
      setLiveEdges(new Set([`${ev.src}-${ev.tgt}`]));
      if(ev.success) setTrails(p=>[...p,{src:ev.src,tgt:ev.tgt}]);
      setEvents(p=>[...p,ev]);
      setNodes(p=>p.map(n=>n.id===ev.tgt?finalNodes.find(f=>f.id===n.id)||n:n));
      const avgRisk=Math.round(finalNodes.slice(0,i+1).reduce((s,n)=>s+n.risk,0)/finalNodes.length);
      setRiskHistory(p=>[...p,avgRisk]);
    }
    const breached=finalNodes.filter(n=>n.status==="compromised").length;
    setThreatLvl(breached>7?"CRITICAL":breached>4?"HIGH":"ELEVATED");
    setSimCount(p=>p+1);
    setTimeout(()=>setLiveEdges(new Set()),1200);

    // Generate AI report
    const avgRisk = Math.round(finalNodes.reduce((s,n)=>s+n.risk,0)/finalNodes.length);
    const sortedByRisk = [...finalNodes].filter(n=>n.type!=="internet").sort((a,b)=>b.risk-a.risk);
    const mostVuln = sortedByRisk[0];
    // Path prediction
    const scored = finalNodes.filter(n=>n.type!=="internet").map(n=>{
      const v=(1-n.patch)*0.4+(1-n.fw)*0.4+n.cves*0.08;
      const b=(atkId==="sql_injection"&&n.type==="database")?0.15:(atkId==="brute_force"&&n.type==="admin_pc")?0.12:0;
      return {...n, score:Math.min(0.99,v+b)};
    }).sort((a,b)=>b.score-a.score);
    const entry=scored[0], pivot=scored.find(n=>n.type==="server"&&n.id!==scored[0]?.id)||scored[1];
    const target=scored.find(n=>n.type==="database")||scored[scored.length-1];
    const nm2={}; finalNodes.forEach(n=>nm2[n.id]=n);
    const predPath=[
      {id:"inet",name:"ATTACKER",type:"internet",score:1.0,ip:"External"},
      entry,pivot,target
    ].filter((v,i,a)=>v&&a.findIndex(x=>x?.id===v.id)===i);
    const predProb=Math.min(97,Math.max(55,Math.round(predPath.slice(1).reduce((p,n)=>p*(n?.score||0.5),1)*100*2.5)));
    setPathPred({path:predPath, probability:predProb});
    const breachedCount=finalNodes.filter(n=>n.status==="compromised").length;
    setAiReport({
      pattern: ATK_PATTERNS[atkId]||"Unknown Attack Pattern",
      mitre: MITRE_TACTICS[atkId]||[],
      riskScore: avgRisk,
      threatLevel: avgRisk>70?"CRITICAL":avgRisk>45?"HIGH":avgRisk>20?"MEDIUM":"LOW",
      mostVuln: mostVuln?.name||"Unknown",
      breached: breachedCount,
      exposed: finalNodes.filter(n=>n.status==="vulnerable"||n.status==="scanning").length,
      fixes: AI_FIXES[atkId]||[],
      confidence: Math.min(99,72+Math.floor(Math.random()*20)),
      ip: `${Math.floor(Math.random()*200)+10}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
      origin: ATTACKER_ORIGINS[Math.floor(Math.random()*5)],
      breachTime: `${((evts.length*speed)/1000).toFixed(1)}s`,
    });
    setTimeout(()=>setTab("ai"), 100);
    setRunning(false);
  };

  const replay = async()=>{
    if(!lastSim||running) return;
    await fireAttack(lastSim.atkId);
  };

  const reset=()=>{
    if(running)return;
    setNodes(co.nodes.map(n=>({...n,status:"safe",risk:0})));
    setEvents([]); setActiveAtk(null); setSelected(null);
    setLiveEdges(new Set()); setTrails([]); setPackets([]);
    setThreatLvl("NOMINAL"); setRiskHistory([0]); setAiReport(null); setPathPred(null);
  };

  useEffect(()=>{if(logRef.current)logRef.current.scrollTop=logRef.current.scrollHeight;},[events]);

  const recs = nodes.filter(n=>n.risk>5).map(n=>{
    const p=n.risk>60?"CRITICAL":n.risk>30?"HIGH":"MEDIUM";
    const a=[];
    if(n.patch<0.7)a.push(`Patch level ${Math.round(n.patch*100)}% — update now`);
    if(n.fw<0.6)a.push("Harden firewall rules");
    if(n.cves>0)a.push(`${n.cves} CVE(s) — apply patches`);
    return{name:n.name,risk:Math.round(n.risk),priority:p,acts:a,color:{CRITICAL:"#ff1144",HIGH:"#ff8800",MEDIUM:"#ffcc00"}[p]};
  }).sort((a,b)=>b.risk-a.risk);

  if(!booted) return <Boot onDone={()=>setBooted(true)}/>;

  return(
    <div style={{background:"#020817",minHeight:"100vh",color:"#e2e8f0",
      fontFamily:"'Courier New',monospace",position:"relative",overflow:"hidden",cursor:"crosshair"}}>
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes spinR{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}
        @keyframes threatP{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes shimmer{0%{left:-120%}100%{left:200%}}
        @keyframes glitchF{0%{clip-path:inset(30% 0 60% 0)}25%{clip-path:inset(5% 0 85% 0)}50%{clip-path:inset(65% 0 20% 0)}75%{clip-path:inset(45% 0 40% 0)}100%{clip-path:inset(30% 0 60% 0)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#040a15}::-webkit-scrollbar-thumb{background:#0d2040;border-radius:2px}
        button{outline:none;font-family:'Courier New',monospace}
      `}</style>

      <StarField/>

      {/* Scanline */}
      <div style={{position:"fixed",left:0,right:0,height:1.5,
        background:"linear-gradient(90deg,transparent,rgba(0,255,136,0.14) 30%,rgba(0,255,136,0.22) 50%,rgba(0,255,136,0.14) 70%,transparent)",
        top:`${scanY}%`,pointerEvents:"none",zIndex:5,transition:"top 0.03s linear"}}/>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:4,
        background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,136,0.011) 2px,rgba(0,255,136,0.011) 4px)"}}/>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:3,
        background:"radial-gradient(ellipse at 50% 50%,transparent 30%,rgba(0,0,0,0.6) 100%)"}}/>
      {glitch&&<div style={{position:"fixed",inset:0,zIndex:20,pointerEvents:"none",
        background:"rgba(255,17,68,0.05)",animation:"glitchF 0.4s steps(1) forwards"}}/>}

      <div style={{position:"relative",zIndex:10,display:"grid",
        gridTemplateRows:"auto auto auto 1fr",height:"100vh",maxWidth:1700,margin:"0 auto",padding:"0 10px"}}>

        {/* ── LIVE THREAT FEED ── */}
        <div style={{
          borderBottom:"1px solid #071520",overflow:"hidden",height:28,
          display:"flex",alignItems:"center",background:"rgba(2,8,23,0.9)"
        }}>
          <div style={{
            flexShrink:0,padding:"0 12px",fontSize:8,fontWeight:700,letterSpacing:2,
            color:"#ff2244",borderRight:"1px solid #1a0008",whiteSpace:"nowrap",
            display:"flex",alignItems:"center",gap:6
          }}>
            <div style={{width:5,height:5,borderRadius:"50%",background:"#ff2244",
              boxShadow:"0 0 6px #ff2244",animation:"blink 0.8s infinite"}}/>
            LIVE THREATS
          </div>
          <div style={{overflow:"hidden",flex:1,position:"relative",height:"100%",display:"flex",alignItems:"center"}}>
            <div style={{
              display:"flex",gap:0,whiteSpace:"nowrap",
              animation:"ticker 28s linear infinite",willChange:"transform"
            }}>
              {[...threatFeed,...threatFeed].map((f,i)=>(
                <span key={i} style={{
                  fontSize:9,color:"#ff6644",padding:"0 28px",letterSpacing:0.8,
                  borderRight:"1px solid #1a0a08"
                }}>⚠ {f.time} — {f.msg}</span>
              ))}
            </div>
          </div>
          <div style={{
            flexShrink:0,padding:"0 14px",fontSize:9,color:"#0d2040",
            borderLeft:"1px solid #071520",fontFamily:"monospace",letterSpacing:1
          }}>SIM #{simCount.toString().padStart(4,"0")}</div>
        </div>

        {/* ── HEADER ── */}
        <header style={{
          display:"grid",gridTemplateColumns:"300px 1fr 360px",
          alignItems:"center",gap:16,padding:"7px 0",
          borderBottom:"1px solid #071520"
        }}>
          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{position:"relative",width:44,height:44,flexShrink:0}}>
              <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"2px solid transparent",
                borderTopColor:"#ff2244",borderRightColor:"#ff8c00",animation:"spin 2s linear infinite"}}/>
              <div style={{position:"absolute",inset:4,borderRadius:"50%",border:"1.5px solid transparent",
                borderBottomColor:"#00ff88",borderLeftColor:"#00ccff",animation:"spinR 3s linear infinite"}}/>
              <div style={{position:"absolute",inset:10,borderRadius:"50%",background:"#020817",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:13,color:"#00ff88",textShadow:"0 0 10px #00ff88"}}>⚡</div>
            </div>
            <div>
              <div style={{display:"flex",alignItems:"baseline"}}>
                <span style={{fontSize:21,fontWeight:900,letterSpacing:2,color:"#e8f0ff",
                  fontFamily:"'Arial Black',sans-serif",textShadow:"0 0 18px rgba(255,255,255,0.2)"}}>SHADOW</span>
                <span style={{fontSize:21,fontWeight:900,letterSpacing:2,color:"#ff2244",
                  fontFamily:"'Arial Black',sans-serif",textShadow:"0 0 18px rgba(255,34,68,0.7)"}}>NET</span>
                <span style={{fontSize:21,fontWeight:900,letterSpacing:2,color:"#e8f0ff",
                  fontFamily:"'Arial Black',sans-serif"}}>&nbsp;AI</span>
              </div>
              <div style={{fontSize:7,color:"#0d2a40",letterSpacing:3,marginTop:1}}>DIGITAL TWIN CYBER DEFENSE v4.0</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{display:"flex",justifyContent:"center",gap:24}}>
            {[
              {l:"SECURE",  v:stats.safe,        c:"#00ff88"},
              {l:"BREACHED",v:stats.compromised,  c:"#ff1144"},
              {l:"EXPOSED", v:stats.vulnerable,   c:"#ff8800"},
              {l:"AVG RISK",v:`${stats.risk}%`,   c:stats.risk>50?"#ff1144":stats.risk>25?"#ff8800":"#00ff88"},
              {l:"SIMS RUN",v:simCount,           c:"#00ccff"},
            ].map(s=>(
              <div key={s.l} style={{textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:900,color:s.c,lineHeight:1,
                  textShadow:`0 0 12px ${s.c}`,fontFamily:"monospace"}}>{s.v}</div>
                <div style={{fontSize:7,color:"#0d2a40",letterSpacing:2,marginTop:3}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Threat + controls */}
          <div style={{display:"flex",alignItems:"center",gap:14,justifyContent:"flex-end"}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:7,color:"#0d2a40",letterSpacing:3,marginBottom:2}}>THREAT</div>
              <div style={{fontSize:14,fontWeight:900,letterSpacing:3,color:tlColor,
                textShadow:`0 0 16px ${tlColor}`,
                animation:threatLvl==="CRITICAL"?"threatP 0.7s infinite":"none"}}>{threatLvl}</div>
              <div style={{display:"flex",gap:3,marginTop:3,justifyContent:"center"}}>
                {["NOMINAL","ELEVATED","HIGH","CRITICAL"].map((l,i)=>(
                  <div key={l} style={{width:22,height:3,borderRadius:2,
                    background:["NOMINAL","ELEVATED","HIGH","CRITICAL"].indexOf(threatLvl)>=i?tlColor:"#071520",
                    boxShadow:["NOMINAL","ELEVATED","HIGH","CRITICAL"].indexOf(threatLvl)>=i?`0 0 5px ${tlColor}`:"none",
                    transition:"all 0.4s"}}/>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:5}}>
              {lastSim&&!running&&(
                <button onClick={replay} style={{padding:"6px 10px",background:"#071520",
                  border:"1px solid #0d2040",color:"#4488aa",borderRadius:4,cursor:"pointer",
                  fontSize:8,letterSpacing:1}}>↺ REPLAY</button>
              )}
              <button onClick={reset} disabled={running} style={{padding:"6px 12px",background:"transparent",
                border:"1px solid #0d2040",color:"#2a4060",borderRadius:4,
                cursor:running?"not-allowed":"pointer",fontSize:8,letterSpacing:2}}>✕ RESET</button>
            </div>
          </div>
        </header>

        {/* ── COMPANY PRESETS ── */}
        <div style={{
          display:"flex",gap:6,padding:"6px 0",
          borderBottom:"1px solid #071520",alignItems:"center"
        }}>
          <span style={{fontSize:7.5,color:"#0d2a40",letterSpacing:3,marginRight:4,whiteSpace:"nowrap"}}>
            TARGET NETWORK:
          </span>
          {Object.entries(COMPANY_PRESETS).map(([key,cp])=>(
            <button key={key} onClick={()=>switchPreset(key)} style={{
              display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:5,
              background:preset===key?`${cp.color}18`:"#040c18",
              border:`1px solid ${preset===key?cp.color:"#071520"}`,
              cursor:"pointer",transition:"all 0.25s",whiteSpace:"nowrap",
              boxShadow:preset===key?`0 0 14px ${cp.color}40`:"none"
            }}>
              <span style={{fontSize:13}}>{cp.icon}</span>
              <div>
                <div style={{fontSize:9,fontWeight:700,color:preset===key?cp.color:"#2a4060",letterSpacing:0.5}}>{cp.name}</div>
                <div style={{fontSize:7.5,color:"#0d2040"}}>{cp.desc}</div>
              </div>
              {preset===key&&<div style={{width:4,height:4,borderRadius:"50%",background:cp.color,
                boxShadow:`0 0 5px ${cp.color}`,marginLeft:2}}/>}
            </button>
          ))}
          {/* Speed control */}
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:7.5,color:"#0d2a40",letterSpacing:2,whiteSpace:"nowrap"}}>SIM SPEED:</span>
            {[{l:"FAST",v:350},{l:"MED",v:750},{l:"SLOW",v:1400}].map(s=>(
              <button key={s.l} onClick={()=>setSpeed(s.v)} style={{
                padding:"4px 9px",borderRadius:4,cursor:"pointer",fontSize:8,letterSpacing:1,
                background:speed===s.v?"#0d2040":"transparent",
                border:`1px solid ${speed===s.v?"#1e3a5f":"#071520"}`,
                color:speed===s.v?"#00ff88":"#1e3a5f"
              }}>{s.l}</button>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{display:"grid",gridTemplateColumns:"220px 1fr 270px",gap:8,padding:"8px 0",
          overflow:"hidden",minHeight:0}}>

          {/* ════ LEFT: ATTACK CONSOLE ════ */}
          <div style={{display:"flex",flexDirection:"column",gap:6,overflow:"auto"}}>
            <div style={{padding:"5px 9px",borderRadius:5,background:"#040c18",
              border:"1px solid #071520",display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:"#ff2244",
                boxShadow:"0 0 6px #ff2244",animation:"blink 1s infinite"}}/>
              <span style={{fontSize:7.5,color:"#1e3a5f",letterSpacing:3,fontWeight:700}}>ATTACK VECTORS</span>
            </div>

            {ATTACKS.map(a=>{
              const isA=activeAtk===a.id;
              return(
                <button key={a.id} onClick={()=>fireAttack(a.id)} disabled={running}
                  style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:6,
                    background:isA?`${a.color}16`:"#040c18",
                    border:`1px solid ${isA?a.color:"#071520"}`,
                    cursor:running?"not-allowed":"pointer",transition:"all 0.25s",width:"100%",textAlign:"left",
                    boxShadow:isA?`0 0 16px ${a.color}40`:"none",position:"relative",overflow:"hidden"}}>
                  {isA&&<div style={{position:"absolute",top:0,left:"-120%",width:"60%",height:"100%",
                    background:`linear-gradient(90deg,transparent,${a.color}10,transparent)`,
                    animation:"shimmer 2s infinite"}}/>}
                  <div style={{width:32,height:32,borderRadius:6,flexShrink:0,
                    background:isA?`${a.color}20`:"#060f20",
                    border:`1px solid ${isA?a.color:"#0d2040"}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:16,color:a.color,fontFamily:"monospace",
                    boxShadow:isA?`0 0 12px ${a.color}80`:"none",transition:"all 0.3s"}}>{a.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:10,fontWeight:700,color:isA?a.color:"#3a5570",
                      letterSpacing:0.8,whiteSpace:"nowrap"}}>{a.name}</div>
                    <div style={{fontSize:8,color:"#0d2a40",marginTop:1}}>{a.desc}</div>
                  </div>
                  {isA&&running&&<div style={{width:5,height:5,borderRadius:"50%",
                    background:a.color,animation:"blink 0.5s infinite",boxShadow:`0 0 7px ${a.color}`}}/>}
                </button>
              );
            })}

            {/* Progress */}
            <div style={{padding:"9px 10px",borderRadius:6,background:"#040c18",
              border:`1px solid ${running?"#ff224430":"#071520"}`,transition:"all 0.3s"}}>
              <div style={{fontSize:7,color:"#0d2a40",letterSpacing:3,marginBottom:5}}>STATUS</div>
              {running?(
                <>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:"#ff2244",
                      animation:"blink 0.45s infinite",boxShadow:"0 0 7px #ff2244"}}/>
                    <span style={{fontSize:8,color:"#ff2244",letterSpacing:1.5,fontWeight:700}}>ACTIVE</span>
                  </div>
                  <div style={{fontSize:9,color:ac,marginBottom:5,fontFamily:"monospace"}}>{atkInfo?.name}</div>
                  <div style={{height:3,background:"#071520",borderRadius:2,overflow:"hidden",marginBottom:3}}>
                    <div style={{height:"100%",borderRadius:2,transition:"width 0.4s",
                      width:`${(events.length/co.nodes.length)*100}%`,
                      background:`linear-gradient(90deg,${ac}70,${ac})`,boxShadow:`0 0 7px ${ac}`}}/>
                  </div>
                  <div style={{fontSize:7,color:"#0d2040"}}>{events.length}/{co.nodes.length} TARGETS</div>
                </>
              ):(
                <div style={{fontSize:8,color:"#0d2040",letterSpacing:1}}>
                  {activeAtk?"COMPLETE":"SELECT ATTACK"}
                </div>
              )}
            </div>

            {/* Risk chart */}
            <div style={{padding:"9px 10px",borderRadius:6,background:"#040c18",border:"1px solid #071520"}}>
              <div style={{fontSize:7,color:"#0d2040",letterSpacing:3,marginBottom:6}}>RISK TREND</div>
              <RiskChart history={riskHistory}/>
            </div>

            {/* Legend */}
            <div style={{padding:"9px 10px",borderRadius:6,background:"#040c18",border:"1px solid #071520"}}>
              <div style={{fontSize:7,color:"#0d2040",letterSpacing:3,marginBottom:6}}>STATUS LEGEND</div>
              {Object.entries(STATUS_C).map(([s,c])=>(
                <div key={s} style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                  <div style={{width:8,height:8,borderRadius:1,background:c,boxShadow:`0 0 5px ${c}`}}/>
                  <span style={{fontSize:8,color:"#2a4060",letterSpacing:0.8,textTransform:"uppercase",flex:1}}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ════ CENTER: TOPOLOGY ════ */}
          <div style={{background:"linear-gradient(180deg,#040c18,#020917)",
            border:"1px solid #071520",borderRadius:8,
            display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"7px 12px",borderBottom:"1px solid #071520",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"#00ff88",boxShadow:"0 0 7px #00ff88"}}/>
                <span style={{fontSize:8,color:"#2a4060",letterSpacing:3,fontWeight:700}}>LIVE TOPOLOGY</span>
                <span style={{fontSize:7,color:"#071520",letterSpacing:2}}>// {co.name.toUpperCase()}</span>
                <span style={{fontSize:9}}>{co.icon}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                {stats.compromised>0&&(
                  <span style={{fontSize:7.5,color:"#ff1144",animation:"blink 0.9s infinite",letterSpacing:1}}>
                    ⚠ {stats.compromised} BREACH{stats.compromised>1?"ES":""}
                  </span>
                )}
                <div style={{display:"flex",gap:4}}>
                  <button onClick={()=>setZoom(z=>Math.min(3,z+0.2))} style={{width:22,height:22,
                    background:"#071520",border:"1px solid #0d2040",color:"#4a6080",
                    borderRadius:3,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  <button onClick={()=>setZoom(1)} style={{width:22,height:22,
                    background:"#071520",border:"1px solid #0d2040",color:"#4a6080",
                    borderRadius:3,cursor:"pointer",fontSize:8}}>1:1</button>
                  <button onClick={()=>setZoom(z=>Math.max(0.4,z-0.2))} style={{width:22,height:22,
                    background:"#071520",border:"1px solid #0d2040",color:"#4a6080",
                    borderRadius:3,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                </div>
                <span style={{fontSize:7.5,color:"#0d2040",fontFamily:"monospace"}}>{Math.round(zoom*100)}%</span>
              </div>
            </div>

            {/* Corner brackets */}
            {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i)=>(
              <div key={i} style={{position:"absolute",[v]:10,[h]:10,width:16,height:16,
                borderTop:v==="top"?"1px solid #0d2a40":"none",
                borderBottom:v==="bottom"?"1px solid #0d2a40":"none",
                borderLeft:h==="left"?"1px solid #0d2a40":"none",
                borderRight:h==="right"?"1px solid #0d2a40":"none",
                pointerEvents:"none",zIndex:2}}/>
            ))}

            {/* Topology */}
            <div style={{flex:1,overflow:"hidden",position:"relative"}}>
              <Topology nodes={nodes} edges={co.edges}
                selected={selected} onSelect={setSelected}
                liveEdges={liveEdges} packets={packets}
                attackColor={atkInfo?.color} trails={trails}
                zoom={zoom} pan={pan}
                onZoom={handleZoom} onPanStart={handlePanStart}/>
            </div>

            {/* Integrity bar */}
            <div style={{padding:"7px 12px",borderTop:"1px solid #071520",flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:7,color:"#0d2a40",letterSpacing:2}}>NETWORK INTEGRITY</span>
                <span style={{fontSize:10,fontWeight:700,fontFamily:"monospace",
                  color:stats.risk>50?"#ff1144":stats.risk>25?"#ff8800":"#00ff88"}}>{100-stats.risk}%</span>
              </div>
              <div style={{height:4,background:"#071520",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:3,transition:"width 0.7s ease",
                  width:`${100-stats.risk}%`,
                  background:stats.risk>50?"linear-gradient(90deg,#ff880050,#ff1144)":
                    stats.risk>25?"linear-gradient(90deg,#ffaa0050,#ff8800)":
                    "linear-gradient(90deg,#00ff8840,#00ff88)",
                  boxShadow:stats.risk<50?"0 0 8px rgba(0,255,136,0.3)":"0 0 8px rgba(255,17,68,0.3)"}}/>
              </div>
              <div style={{marginTop:4,fontSize:7.5,color:"#0d2040",fontStyle:"italic"}}>
                {co.threatContext}
              </div>
            </div>
          </div>

          {/* ════ RIGHT: INTEL ════ */}
          <div style={{display:"flex",flexDirection:"column",gap:6,overflow:"hidden",minHeight:0}}>
            {/* Tabs */}
            <div style={{display:"flex",background:"#040c18",border:"1px solid #071520",
              borderRadius:6,overflow:"hidden",flexShrink:0}}>
              {[["intel","◈ INTEL"],["logs","▣ LOGS"],["patch","⬡ PATCH"],["ai","🧠 AI"]].map(([id,label])=>{
                const isAiReady = id==="ai" && !!aiReport && tab!==id;
                return(
                <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"7px 4px",
                  border:"none",cursor:"pointer",
                  background:tab===id?"#071520":isAiReady?"rgba(0,255,136,0.07)":"transparent",
                  color:tab===id?"#00ff88":isAiReady?"#00ff88":"#1e3a5f",
                  fontSize:8,fontWeight:700,letterSpacing:1,
                  borderBottom:tab===id?"2px solid #00ff88":isAiReady?"2px solid rgba(0,255,136,0.4)":"2px solid transparent",
                  transition:"all 0.3s",
                  animation:isAiReady?"blink 1s infinite":"none"}}>{label}</button>
                );
              })}
            </div>

            <div style={{background:"#040c18",border:"1px solid #071520",borderRadius:6,
              flex:1,overflow:"hidden",display:"flex",flexDirection:"column",minHeight:0}}>
              <div style={{padding:"5px 9px",borderBottom:"1px solid #071520",
                fontSize:7,color:"#0d2a40",letterSpacing:3,flexShrink:0}}>
                {tab==="intel"?"NODE INTELLIGENCE":tab==="logs"?"ATTACK TIMELINE":tab==="patch"?"REMEDIATION ORDERS":"AI THREAT ANALYSIS"}
              </div>
              <div style={{flex:1,overflowY:"auto",padding:8}} ref={tab==="logs"?logRef:null}>

                {/* Intel */}
                {tab==="intel"&&(selected?(
                  <div style={{animation:"fadeIn 0.2s ease"}}>
                    <div style={{padding:10,borderRadius:6,marginBottom:8,
                      background:`${STATUS_C[selected.status]}0c`,
                      border:`1px solid ${STATUS_C[selected.status]}28`}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                        <div style={{fontSize:22,color:STATUS_C[selected.status],
                          textShadow:`0 0 10px ${STATUS_C[selected.status]}`,fontFamily:"monospace"}}>
                          {NODE_VIS[selected.type]?.sym}</div>
                        <div>
                          <div style={{fontSize:11,fontWeight:700,color:"#c0d0e0"}}>{selected.name}</div>
                          <div style={{fontSize:8,color:"#2a4060",fontFamily:"monospace",marginTop:1}}>{selected.ip}</div>
                        </div>
                        <div style={{marginLeft:"auto",padding:"2px 7px",borderRadius:10,
                          background:`${STATUS_C[selected.status]}18`,color:STATUS_C[selected.status],
                          fontSize:7.5,fontWeight:700,letterSpacing:1,
                          border:`1px solid ${STATUS_C[selected.status]}30`}}>{selected.status.toUpperCase()}</div>
                      </div>
                    </div>
                    {[{l:"PATCH",v:selected.patch,c:"#00ff88"},{l:"FIREWALL",v:selected.fw,c:"#00ccff"}].map(m=>(
                      <div key={m.l} style={{marginBottom:8}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:8,marginBottom:3}}>
                          <span style={{color:"#0d2a40",letterSpacing:2}}>{m.l}</span>
                          <span style={{color:m.c,fontWeight:700}}>{Math.round(m.v*100)}%</span>
                        </div>
                        <div style={{height:4,background:"#071520",borderRadius:2,overflow:"hidden"}}>
                          <div style={{height:"100%",borderRadius:2,width:`${m.v*100}%`,
                            background:`linear-gradient(90deg,${m.c}50,${m.c})`,
                            boxShadow:`0 0 6px ${m.c}50`,transition:"width 0.5s"}}/>
                        </div>
                      </div>
                    ))}
                    <div style={{marginBottom:8}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:8,marginBottom:3}}>
                        <span style={{color:"#0d2a40",letterSpacing:2}}>RISK SCORE</span>
                        <span style={{color:selected.risk>60?"#ff1144":selected.risk>30?"#ff8800":"#00ff88",
                          fontWeight:700,fontSize:12,fontFamily:"monospace"}}>{Math.round(selected.risk)}%</span>
                      </div>
                      <div style={{height:6,background:"#071520",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",borderRadius:3,width:`${selected.risk}%`,transition:"width 0.5s",
                          background:selected.risk>60?"linear-gradient(90deg,#ff880050,#ff1144)":
                            selected.risk>30?"linear-gradient(90deg,#ffaa0050,#ff8800)":
                            "linear-gradient(90deg,#00ff8840,#00ff88)"}}/>
                      </div>
                    </div>
                    {selected.cves>0&&(
                      <div style={{padding:7,borderRadius:5,marginBottom:7,
                        background:"rgba(255,34,68,0.07)",border:"1px solid rgba(255,34,68,0.16)"}}>
                        <div style={{fontSize:8,color:"#ff4455",letterSpacing:1.5,fontWeight:700,marginBottom:2}}>
                          ⚠ {selected.cves} UNPATCHED CVE(S)</div>
                        <div style={{fontSize:8,color:"#8a2233"}}>Critical patches pending</div>
                      </div>
                    )}
                    <div style={{padding:"5px 7px",borderRadius:4,background:"#071520",border:"1px solid #0d2040"}}>
                      <div style={{fontSize:7,color:"#0d2040",letterSpacing:2,marginBottom:2}}>CONNECTIONS</div>
                      <div style={{fontSize:11,color:"#4488aa",fontWeight:700,fontFamily:"monospace"}}>
                        {co.edges.filter(([s,t])=>s===selected.id||t===selected.id).length} LINKS</div>
                    </div>
                  </div>
                ):(
                  <div style={{textAlign:"center",padding:"40px 20px",color:"#071520"}}>
                    <div style={{fontSize:32,marginBottom:10,color:"#0d2040"}}>◈</div>
                    <div style={{fontSize:8,letterSpacing:3,color:"#0d2a40"}}>SELECT NODE</div>
                    <div style={{fontSize:7.5,color:"#071520",marginTop:4}}>CLICK ANY NODE IN TOPOLOGY</div>
                  </div>
                ))}

                {/* Logs */}
                {tab==="logs"&&(events.length===0?(
                  <div style={{textAlign:"center",padding:"40px 0",color:"#071520"}}>
                    <div style={{fontSize:26,marginBottom:8,color:"#0d2040"}}>▣</div>
                    <div style={{fontSize:8,letterSpacing:3,color:"#0d2a40"}}>AWAITING SIMULATION</div>
                  </div>
                ):events.map((e,i)=>(
                  <div key={i} style={{padding:"6px 8px",borderRadius:4,marginBottom:4,
                    background:e.success?"rgba(255,17,68,0.06)":"rgba(0,255,136,0.04)",
                    border:`1px solid ${e.success?"rgba(255,17,68,0.16)":"rgba(0,255,136,0.08)"}`,
                    animation:"slideIn 0.25s ease"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                      <span style={{fontSize:8,color:e.success?"#ff2244":"#00cc66",
                        fontWeight:700,letterSpacing:1}}>{e.success?"✗ BREACH":"✓ BLOCKED"}</span>
                      <span style={{fontSize:7,color:"#071520",fontFamily:"monospace"}}>#{String(i+1).padStart(3,"0")}</span>
                    </div>
                    <div style={{fontSize:8,color:"#2a4060",lineHeight:1.4,marginBottom:2}}>{e.desc}</div>
                    <div style={{fontSize:7,color:"#0d2040",fontFamily:"monospace"}}>
                      {e.src}→{e.tgt} · p={Math.round(e.prob*100)}%</div>
                  </div>
                )))}

                {/* Patch */}
                {tab==="patch"&&(recs.length===0?(
                  <div style={{textAlign:"center",padding:"40px 0"}}>
                    <div style={{fontSize:26,marginBottom:8,color:"#00ff88"}}>⬡</div>
                    <div style={{fontSize:8,letterSpacing:3,color:"#00cc66"}}>ALL SYSTEMS NOMINAL</div>
                  </div>
                ):recs.map((r,i)=>(
                  <div key={i} style={{padding:9,borderRadius:5,marginBottom:6,
                    background:"#020917",border:`1px solid ${r.color}1a`}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:10,fontWeight:700,color:"#b0c0d8"}}>{r.name}</span>
                      <span style={{fontSize:7,padding:"2px 6px",borderRadius:10,fontWeight:700,
                        background:`${r.color}18`,color:r.color,border:`1px solid ${r.color}28`}}>{r.priority}</span>
                    </div>
                    <div style={{height:3,background:"#071520",borderRadius:2,overflow:"hidden",marginBottom:3}}>
                      <div style={{height:"100%",width:`${r.risk}%`,borderRadius:2,
                        background:r.color,boxShadow:`0 0 5px ${r.color}40`}}/>
                    </div>
                    <div style={{fontSize:9,color:r.color,fontWeight:700,marginBottom:4}}>Risk: {r.risk}%</div>
                    {r.acts.map((a,j)=>(
                      <div key={j} style={{display:"flex",gap:4,marginTop:3,fontSize:7.5,color:"#2a4060",lineHeight:1.4}}>
                        <span style={{color:"#0d3060",flexShrink:0}}>→</span>{a}
                      </div>
                    ))}
                  </div>
                )))}
                {/* AI TAB */}
                {tab==="ai"&&(
                  <div style={{display:"flex",flexDirection:"column",gap:8,padding:8}}>
                    {!aiReport?(
                      <div style={{textAlign:"center",padding:"40px 0"}}>
                        <div style={{fontSize:32,marginBottom:10,color:"#0d2040"}}>🧠</div>
                        <div style={{fontSize:8,letterSpacing:3,color:"#0d2a40"}}>AI ENGINE READY</div>
                        <div style={{fontSize:7.5,color:"#071520",marginTop:4}}>RUN A SIMULATION TO ACTIVATE</div>
                      </div>
                    ):(
                      <>
                        <div style={{padding:"10px 12px",borderRadius:7,background:`linear-gradient(135deg,${ac}12,${ac}05)`,border:`1px solid ${ac}35`}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                            <div style={{width:28,height:28,borderRadius:6,background:`${ac}20`,border:`1px solid ${ac}45`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🧠</div>
                            <div>
                              <div style={{fontSize:9.5,fontWeight:700,color:"#e0eaf8"}}>AI THREAT ANALYSIS</div>
                              <div style={{fontSize:7,color:ac,letterSpacing:1.5}}>SHADOWNET NEURAL ENGINE v5</div>
                            </div>
                            <div style={{marginLeft:"auto",padding:"2px 8px",borderRadius:10,
                              background:{CRITICAL:"rgba(255,17,68,0.15)",HIGH:"rgba(255,136,0,0.15)",MEDIUM:"rgba(255,204,0,0.12)",LOW:"rgba(0,255,136,0.10)"}[aiReport.threatLevel],
                              color:{CRITICAL:"#ff1144",HIGH:"#ff8800",MEDIUM:"#ffcc00",LOW:"#00ff88"}[aiReport.threatLevel],
                              fontSize:7.5,fontWeight:700,letterSpacing:1}}>
                              {aiReport.threatLevel}
                            </div>
                          </div>
                          <div style={{fontSize:7,color:"#0d2a40",letterSpacing:2,marginBottom:3}}>DETECTED ATTACK PATTERN</div>
                          <div style={{fontSize:10.5,fontWeight:700,color:ac,textShadow:`0 0 8px ${ac}60`}}>{aiReport.pattern}</div>
                        </div>
                        <div style={{padding:"10px 12px",borderRadius:7,background:"#040c18",border:"1px solid #0a1a2e"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                            <span style={{fontSize:7,color:"#0d2a40",letterSpacing:2}}>OVERALL RISK SCORE</span>
                            <span style={{fontSize:24,fontWeight:900,fontFamily:"monospace",
                              color:aiReport.riskScore>60?"#ff1144":aiReport.riskScore>30?"#ff8800":"#00ff88",
                              textShadow:`0 0 14px ${aiReport.riskScore>60?"#ff1144":aiReport.riskScore>30?"#ff8800":"#00ff88"}`
                            }}>{aiReport.riskScore}%</span>
                          </div>
                          <div style={{height:7,background:"#071520",borderRadius:4,overflow:"hidden",marginBottom:7}}>
                            <div style={{height:"100%",borderRadius:4,width:`${aiReport.riskScore}%`,
                              background:aiReport.riskScore>60?"linear-gradient(90deg,#ff880060,#ff1144)":"linear-gradient(90deg,#ffaa0060,#ff8800)",
                              transition:"width 1s ease"}}/>
                          </div>
                          <div style={{display:"flex",gap:16}}>
                            {[{l:"BREACHED",v:aiReport.breached,c:"#ff1144"},{l:"EXPOSED",v:aiReport.exposed,c:"#ff8800"},{l:"CONFIDENCE",v:`${aiReport.confidence}%`,c:"#00ccff"}].map(s=>(
                              <div key={s.l}>
                                <div style={{fontSize:14,fontWeight:900,color:s.c,fontFamily:"monospace",textShadow:`0 0 8px ${s.c}`}}>{s.v}</div>
                                <div style={{fontSize:7,color:"#0d2040",letterSpacing:1,marginTop:1}}>{s.l}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{padding:"10px 12px",borderRadius:7,background:"#040c18",border:"1px solid #0a1a2e"}}>
                          <div style={{fontSize:7,color:"#0d2a40",letterSpacing:2,marginBottom:6}}>MITRE ATT&CK TACTICS</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                            {aiReport.mitre.map(t=>(
                              <div key={t} style={{padding:"3px 8px",borderRadius:4,background:`${ac}16`,color:ac,fontSize:7.5,fontWeight:700,border:`1px solid ${ac}28`}}>{t}</div>
                            ))}
                          </div>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                          <div style={{padding:"10px 12px",borderRadius:7,background:"rgba(255,17,68,0.06)",border:"1px solid rgba(255,17,68,0.2)"}}>
                            <div style={{fontSize:7,color:"#0d2a40",letterSpacing:2,marginBottom:5}}>MOST VULNERABLE</div>
                            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                              <div style={{width:6,height:6,borderRadius:"50%",background:"#ff1144",boxShadow:"0 0 6px #ff1144",animation:"blink 0.8s infinite"}}/>
                              <span style={{fontSize:10,fontWeight:700,color:"#ff4455"}}>{aiReport.mostVuln}</span>
                            </div>
                            <div style={{fontSize:7.5,color:"#551122"}}>Primary target — patch now</div>
                          </div>
                          <div style={{padding:"10px 12px",borderRadius:7,background:"#040c18",border:"1px solid #0a1a2e"}}>
                            <div style={{fontSize:7,color:"#0d2a40",letterSpacing:2,marginBottom:5}}>ATTACKER INTEL</div>
                            <div style={{fontSize:7.5,color:"#ff8800",fontFamily:"monospace",marginBottom:2}}>{aiReport.ip}</div>
                            <div style={{fontSize:7.5,color:"#ff4444",marginBottom:2}}>{aiReport.origin}</div>
                            <div style={{fontSize:7.5,color:"#ffcc00",fontFamily:"monospace"}}>⏱ {aiReport.breachTime}</div>
                          </div>
                        </div>
                        <div style={{padding:"10px 12px",borderRadius:7,background:"rgba(0,255,136,0.04)",border:"1px solid rgba(0,255,136,0.14)"}}>
                          <div style={{fontSize:7,color:"#00aa55",letterSpacing:2,marginBottom:7}}>🛡 AI RECOMMENDED FIXES</div>
                          {aiReport.fixes.map((f,i)=>(
                            <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
                              <div style={{width:16,height:16,borderRadius:3,flexShrink:0,marginTop:1,background:"rgba(0,255,136,0.12)",border:"1px solid rgba(0,255,136,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#00ff88",fontWeight:700}}>{i+1}</div>
                              <span style={{fontSize:8.5,color:"#3a6050",lineHeight:1.55}}>{f}</span>
                            </div>
                          ))}
                        </div>
                        {pathPred&&(
                          <div style={{padding:"10px 12px",borderRadius:7,background:"rgba(191,68,255,0.06)",border:"1px solid rgba(191,68,255,0.2)"}}>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                              <div>
                                <div style={{fontSize:7,color:"#0d2a40",letterSpacing:2,marginBottom:2}}>PREDICTED BREACH PATH</div>
                                <div style={{fontSize:7,color:"#bf44ff",letterSpacing:1}}>AI NEURAL PATHFINDER</div>
                              </div>
                              <div style={{padding:"3px 10px",borderRadius:10,background:"rgba(191,68,255,0.15)",border:"1px solid rgba(191,68,255,0.3)"}}>
                                <div style={{fontSize:7,color:"#8833aa",marginBottom:1}}>SUCCESS PROB</div>
                                <div style={{fontSize:15,fontWeight:900,color:"#bf44ff",fontFamily:"monospace",textShadow:"0 0 10px #bf44ff80"}}>{pathPred.probability}%</div>
                              </div>
                            </div>
                            <div style={{height:4,background:"#071520",borderRadius:3,overflow:"hidden",marginBottom:10}}>
                              <div style={{height:"100%",borderRadius:3,width:`${pathPred.probability}%`,background:"linear-gradient(90deg,#bf44ff50,#bf44ff)",transition:"width 1s ease"}}/>
                            </div>
                            {pathPred.path.map((node,i)=>{
                              const isLast=i===pathPred.path.length-1;
                              const prob=Math.round((node?.score||0)*100);
                              const syms={internet:"☠",firewall:"▣",router:"⬡",server:"▪",database:"◆",admin_pc:"★",workstation:"▫"};
                              const nc=node?.type==="internet"?"#ff4444":isLast?"#ff1144":"#ff8c00";
                              return(
                                <div key={node?.id||i}>
                                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 9px",borderRadius:6,background:isLast?"rgba(255,17,68,0.09)":"rgba(255,140,0,0.06)",border:`1px solid ${nc}28`}}>
                                    <div style={{width:26,height:26,borderRadius:5,flexShrink:0,background:`${nc}18`,border:`1px solid ${nc}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:nc,fontFamily:"monospace"}}>{syms[node?.type]||"▪"}</div>
                                    <div style={{flex:1}}>
                                      <div style={{fontSize:9,fontWeight:700,color:nc}}>{node?.type==="internet"?"ATTACKER":node?.name}</div>
                                      <div style={{fontSize:7,color:"#1e3a5f",fontFamily:"monospace"}}>{node?.type==="internet"?"External threat actor":node?.ip}</div>
                                    </div>
                                    {node?.type!=="internet"&&<div style={{fontSize:9,fontWeight:900,color:prob>70?"#ff1144":"#ff8800",fontFamily:"monospace"}}>{prob}%</div>}
                                    {isLast&&<span style={{fontSize:9}}>🎯</span>}
                                  </div>
                                  {!isLast&&<div style={{textAlign:"center",fontSize:10,color:"#ff8c00",lineHeight:"18px",opacity:0.6}}>↓</div>}
                                </div>
                              );
                            })}
                            <div style={{marginTop:8,padding:"6px 8px",borderRadius:5,background:"rgba(191,68,255,0.05)",fontSize:7.5,color:"#7733aa",lineHeight:1.6}}>
                              AI predicts <strong style={{color:"#bf44ff"}}>{pathPred.probability}%</strong> chance this exact path will be followed based on live vulnerability scores and network topology.
                            </div>
                          </div>
                        )}
                        <div style={{padding:"10px 12px",borderRadius:7,background:`linear-gradient(135deg,${ac}08,transparent)`,border:`1px solid ${ac}18`}}>
                          <div style={{fontSize:7,color:"#0d2a40",letterSpacing:2,marginBottom:5}}>AI CONCLUSION</div>
                          <div style={{fontSize:8.5,color:"#3a5060",lineHeight:1.7}}>
                            ShadowNet AI detected a <span style={{color:ac,fontWeight:700}}>{aiReport.pattern}</span> from <span style={{color:"#ff8800",fontFamily:"monospace"}}>{aiReport.ip}</span> ({aiReport.origin}). Attack compromised <span style={{color:"#ff1144",fontWeight:700}}>{aiReport.breached} node(s)</span> with network risk at <span style={{color:aiReport.riskScore>60?"#ff1144":"#ff8800",fontWeight:700}}>{aiReport.riskScore}%</span>. Action required: <span style={{color:"#ff1144",fontWeight:700}}>{aiReport.threatLevel==="CRITICAL"?"CRITICAL":"IMMEDIATE"}</span>.
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Sys footer */}
            <div style={{padding:"5px 9px",borderRadius:5,background:"#040c18",
              border:"1px solid #071520",display:"flex",justifyContent:"space-between",
              alignItems:"center",flexShrink:0}}>
              <span style={{fontSize:7,color:"#071520",fontFamily:"monospace",letterSpacing:1}}>
                SHADOWNET v5.0 // CYBERSENTINELS
              </span>
              <div style={{display:"flex",gap:4}}>
                {[["#00ff88",true],["#00ccff",true],["#ff8800",running]].map(([c,on],i)=>(
                  <div key={i} style={{width:4,height:4,borderRadius:"50%",background:on?c:"#0d2040",
                    boxShadow:on?`0 0 5px ${c}`:"none",
                    animation:i===2&&running?"blink 0.5s infinite":"none"}}/>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
