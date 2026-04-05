import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  LayoutDashboard, Target, Image, Users, ShoppingBag, Film, CheckSquare,
  Calendar, FolderOpen, FileText, Search, Moon, Sun, Plus, X, ChevronRight,
  ChevronDown, ExternalLink, Zap, TrendingUp,
  Edit3, Trash2, Check, Star, BarChart3, Play, LogOut, Crown,
  Store, Activity, Circle, Wifi, WifiOff
} from "lucide-react";
import { subscribeToData, saveData } from "./firebase";

/* ═══════════════════════ TEAM ═══════════════════════ */
const TEAM = [
  { id:"thomas", name:"Thomas", email:"thomas98macedo@gmail.com", role:"Founder / Ecommerce", channel:"Ecommerce / Site", color:"#2D6A4F", initials:"TM", isAdmin:true, responsibilities:["Estratégia geral","Ecommerce próprio","Branding","Decisões de produto","Financeiro"] },
  { id:"kauan", name:"Kauan", email:"kauancabralpereira@gmail.com", role:"TikTok Shop", channel:"TikTok Shop", color:"#E040FB", initials:"KC", isAdmin:false, responsibilities:["TikTok Shop","Criativos TikTok","UGC","Trends","Lives"] },
  { id:"dantas", name:"Dantas", email:"filipexaxa65@gmail.com", role:"Mercado Livre", channel:"Mercado Livre", color:"#FFD600", initials:"DT", isAdmin:false, responsibilities:["Mercado Livre","Anúncios ML","Fulfillment ML","Métricas ML","Atendimento ML"] },
  { id:"marcos", name:"Marcos", email:"marcos.roberto98@outlook.com", role:"Shopee", channel:"Shopee", color:"#FF5722", initials:"MR", isAdmin:false, responsibilities:["Shopee","Anúncios Shopee","Promoções","Métricas Shopee","Atendimento Shopee"] }
];

const TASK_ST = ["A fazer","Em andamento","Revisão","Concluído"];
const TASK_PR = ["Urgente","Alta","Média","Baixa"];
const CREAT_ST = ["Ideia","Gravar","Editar","Publicado"];
const CREAT_TY = ["UGC","Lifestyle","Oferta","Prova Social"];
const PROD_ST = ["Ideia","Produção","Pronto"];
const PROD_CAT = ["Camisa","Cropped","Lifestyle","Acessório"];
const DRIVE_CAT = ["Fotos","Vídeos","Criativos","Branding"];

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const ts = () => new Date().toLocaleString("pt-BR", { day:"2-digit", month:"2-digit", year:"2-digit", hour:"2-digit", minute:"2-digit" });

/* ═══════════════════ DEFAULT DATA ═══════════════════ */
const DEFAULTS = {
  tasks: [], creatives: [], products: [], competitors: [], references: [], notes: [], driveFiles: [], activity: [],
  roadmapChecked: {},
  metrics: { criativos:0, produtos:0, plataformas:0 },
  launchStatus: "Em construção",
  strategy: {
    posicionamento: "VesteBrasil é uma marca de moda esportiva premium que celebra a identidade brasileira.",
    publicoAlvo: "Jovens de 18-35 anos, apaixonados por futebol e moda streetwear.",
    ofertaPrincipal: "Camisas da Copa do Mundo com design exclusivo e qualidade premium.",
    diferenciais: "Design autoral, qualidade de acabamento, identidade brasileira moderna, presença forte no TikTok.",
    precoMargem: "Preço médio: R$89-149 | Custo: R$25-45 | Margem: 60-70%",
    estrategiaTrafego: "TikTok Ads como canal principal, Meta Ads para retargeting, Google Shopping para captura de demanda.",
    estrategiaConteudo: "UGC + lifestyle + prova social. 3-5 criativos por semana. Foco em hooks virais.",
    estrategiaCanal: "TikTok Shop (Kauan) | Shopee (Marcos) | Mercado Livre (Dantas) | Site próprio (Thomas)"
  },
  roadmap: [
    { id:1, name:"Estruturação", items:["Definir marca","Identidade visual","Registrar CNPJ","Contas bancárias"], progress:0 },
    { id:2, name:"Criação de Produtos", items:["Fornecedores","Catálogo inicial","Amostras","Fotografar"], progress:0 },
    { id:3, name:"Criação de Criativos", items:["Roteiros","Gravar UGCs","Editar vídeos","Thumbnails"], progress:0 },
    { id:4, name:"Setup Plataformas", items:["Shopee (Marcos)","TikTok Shop (Kauan)","Mercado Livre (Dantas)","Site (Thomas)"], progress:0 },
    { id:5, name:"Pré-lançamento", items:["Testar checkout","Aquecimento","Lista de espera","Influenciadores"], progress:0 },
    { id:6, name:"Lançamento", items:["Ativar campanhas","Monitorar métricas","Ajustar criativos","Atendimento"], progress:0 },
    { id:7, name:"Escala", items:["Escalar budget","Novos criativos","Expandir catálogo","Otimizar margem"], progress:0 },
  ]
};

/* ═══════════════════ THEME ═══════════════════ */
const mkT = (d) => d ? {
  bg:"#0B0B0B",bgC:"#141414",bgH:"#1C1C1C",bgI:"#181818",bd:"#232323",tx:"#E8E6E3",
  tm:"#8A8A8A",td:"#505050",gr:"#2D6A4F",gl:"#40916C",gb:"#52B788",yl:"#D4A017",
  bl:"#3B82F6",dn:"#EF4444",sc:"#22C55E",sb:"#0F0F0F",pp:"#A855F7"
} : {
  bg:"#F4F4F0",bgC:"#FFF",bgH:"#EDEDEA",bgI:"#F8F8F5",bd:"#E0E0DB",tx:"#1A1A1A",
  tm:"#666",td:"#999",gr:"#2D6A4F",gl:"#40916C",gb:"#52B788",yl:"#B8860B",
  bl:"#3B82F6",dn:"#EF4444",sc:"#22C55E",sb:"#E8E8E4",pp:"#A855F7"
};

const CSS = (t) => `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',system-ui,sans-serif;background:${t.bg};color:${t.tx};-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${t.bd};border-radius:3px}
input,textarea,select{font-family:inherit;background:${t.bgI};color:${t.tx};border:1px solid ${t.bd};border-radius:8px;padding:9px 12px;font-size:13px;outline:none;transition:border .2s;width:100%}
input:focus,textarea:focus,select:focus{border-color:${t.gr}}
textarea{resize:vertical;min-height:80px}select{cursor:pointer}::placeholder{color:${t.td}}
.fi{animation:fi .25s ease}@keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
`;

/* ═══════════════════ UI COMPONENTS ═══════════════════ */
const Av = ({ m, s=32 }) => <div style={{ width:s,height:s,borderRadius:s/2,background:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:s*.38,color:"#fff",flexShrink:0 }}>{m.initials}</div>;
const Bg = ({ children, c, t }) => <span style={{ display:"inline-flex",alignItems:"center",padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:500,background:`${c||t.gr}18`,color:c||t.gb }}>{children}</span>;
const Hd = ({ title, sub, right, t }) => <div style={{ display:"flex",alignItems:"center",marginBottom:28 }}><div><h1 style={{ fontSize:26,fontWeight:700,letterSpacing:"-.5px" }}>{title}</h1>{sub&&<p style={{ color:t.tm,fontSize:14,marginTop:4 }}>{sub}</p>}</div>{right&&<div style={{ marginLeft:"auto",display:"flex",gap:8,alignItems:"center" }}>{right}</div>}</div>;
const Bt = ({ children, v="ghost", onClick, style={}, t }) => {
  const b = { display:"inline-flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,fontSize:13,fontWeight:500,cursor:"pointer",border:"none",transition:"all .15s",fontFamily:"inherit" };
  const vs = { primary:{background:t.gr,color:"#fff"}, ghost:{background:"transparent",color:t.tm,border:`1px solid ${t.bd}`}, danger:{background:t.dn+"22",color:t.dn} };
  return <button style={{...b,...vs[v],...style}} onClick={onClick}>{children}</button>;
};
const Md = ({ children, onClose, t, wide }) => <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)" }} onClick={onClose}><div className="fi" style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:16,padding:28,maxWidth:wide?680:520,width:"92%",maxHeight:"85vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}>{children}</div></div>;
const MdH = ({ title, onClose, t }) => <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}><h3 style={{ fontWeight:700,fontSize:17 }}>{title}</h3><X size={18} style={{ cursor:"pointer",color:t.tm }} onClick={onClose} /></div>;
const Empty = ({ icon:I, text, t }) => <div style={{ textAlign:"center",padding:"60px 0",color:t.td }}><I size={42} style={{ marginBottom:12,opacity:.25 }} /><div style={{ fontSize:14 }}>{text}</div></div>;

/* ═══════════════════ LOGIN ═══════════════════ */
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const go = () => { const m = TEAM.find(x => x.email.toLowerCase() === email.trim().toLowerCase()); if (m) onLogin(m); else setErr("Email não autorizado."); };
  return (
    <div style={{ minHeight:"100vh",background:"#0B0B0B",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');`}</style>
      <div style={{ width:420,padding:44,background:"#141414",borderRadius:20,border:"1px solid #232323" }}>
        <div style={{ textAlign:"center",marginBottom:36 }}>
          <div style={{ width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,#2D6A4F,#52B788)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:20,color:"#fff",marginBottom:16 }}>VB</div>
          <h1 style={{ fontSize:24,fontWeight:700,color:"#E8E6E3" }}>VesteBrasil</h1>
          <p style={{ color:"#8A8A8A",fontSize:14,marginTop:6 }}>Launch Operating System</p>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:4,marginTop:8 }}><Wifi size={12} color="#22C55E" /><span style={{ fontSize:11,color:"#22C55E" }}>Tempo real</span></div>
        </div>
        <div style={{ display:"flex",justifyContent:"center",gap:8,marginBottom:30 }}>
          {TEAM.map(m => <div key={m.id} onClick={()=>setEmail(m.email)} style={{ cursor:"pointer",textAlign:"center" }}><Av m={m} s={40} /><div style={{ fontSize:10,color:"#8A8A8A",marginTop:4 }}>{m.name}</div></div>)}
        </div>
        <input type="email" placeholder="seu@email.com" value={email} onChange={e=>{setEmail(e.target.value);setErr("")}} onKeyDown={e=>e.key==="Enter"&&go()}
          style={{ background:"#181818",color:"#E8E6E3",border:"1px solid #232323",borderRadius:10,padding:"12px 14px",fontSize:14,width:"100%",outline:"none",fontFamily:"inherit",marginBottom:12 }} />
        {err && <div style={{ color:"#EF4444",fontSize:12,marginBottom:12 }}>{err}</div>}
        <button onClick={go} style={{ width:"100%",padding:"12px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#2D6A4F,#40916C)",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Entrar</button>
        <div style={{ textAlign:"center",marginTop:16,fontSize:11,color:"#505050" }}>Acesso restrito à equipe</div>
      </div>
    </div>
  );
}

/* ═══════════════════ MAIN APP ═══════════════════ */
export default function App() {
  const [user, setUser] = useState(() => { try { const v = localStorage.getItem("vb_user"); return v ? JSON.parse(v) : null; } catch { return null; } });
  const [dark, setDark] = useState(true);
  const [sec, setSec] = useState("dashboard");
  const [connected, setConnected] = useState(false);

  // ─── SHARED DATA (synced via Firebase) ───
  const [D, setD] = useState(DEFAULTS);
  const skipSave = useRef(false);

  // Save user to localStorage
  useEffect(() => { try { localStorage.setItem("vb_user", JSON.stringify(user)); } catch {} }, [user]);

  // Subscribe to Firebase real-time updates
  useEffect(() => {
    const unsub = subscribeToData((data) => {
      if (data) {
        skipSave.current = true;
        setD(prev => ({ ...DEFAULTS, ...prev, ...data }));
        setConnected(true);
        setTimeout(() => { skipSave.current = false; }, 100);
      } else {
        // First time - save defaults
        saveData(DEFAULTS);
        setConnected(true);
      }
    });
    return () => unsub();
  }, []);

  // Helper: update a field and sync to Firebase
  const up = useCallback((field, value) => {
    setD(prev => {
      const next = { ...prev, [field]: typeof value === "function" ? value(prev[field]) : value };
      if (!skipSave.current) saveData({ [field]: next[field] });
      return next;
    });
  }, []);

  // Helper: add activity
  const act = useCallback((text) => {
    up("activity", prev => [{ id: uid(), text, userId: user?.id, time: ts() }, ...(prev||[])].slice(0, 50));
  }, [user, up]);

  const progress = useMemo(() => {
    const rm = D.roadmap || [];
    if (!rm.length) return 0;
    const total = rm.reduce((a,p) => a + (p.items?.length||0), 0);
    const done = rm.reduce((a,p) => a + Math.round((p.progress||0)/100*(p.items?.length||0)), 0);
    return total ? Math.round(done/total*100) : 0;
  }, [D.roadmap]);

  if (!user) return <Login onLogin={m => setUser(m)} />;
  const me = TEAM.find(m => m.id === user.id) || user;
  const t = mkT(dark);

  const navItems = [
    { id:"dashboard",l:"Dashboard",i:LayoutDashboard },
    { id:"equipe",l:"Equipe",i:Users },
    { id:"estrategia",l:"Estratégia",i:Target },
    { id:"referencias",l:"Referências",i:Image },
    { id:"concorrentes",l:"Concorrentes",i:Store },
    { id:"produtos",l:"Produtos",i:ShoppingBag },
    { id:"criativos",l:"Criativos",i:Film },
    { id:"tarefas",l:"Tarefas",i:CheckSquare },
    { id:"roadmap",l:"Roadmap",i:Calendar },
    { id:"arquivos",l:"Arquivos",i:FolderOpen },
    { id:"anotacoes",l:"Anotações",i:FileText },
  ];

  const P = { t, me, up, act, D };

  return (
    <div style={{ display:"flex",height:"100vh",overflow:"hidden",background:t.bg }}>
      <style>{CSS(t)}</style>

      {/* SIDEBAR */}
      <div style={{ width:250,minWidth:250,background:t.sb,borderRight:`1px solid ${t.bd}`,display:"flex",flexDirection:"column" }}>
        <div style={{ padding:"20px",borderBottom:`1px solid ${t.bd}`,display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#2D6A4F,#52B788)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:"#fff" }}>VB</div>
          <div><div style={{ fontWeight:700,fontSize:15,letterSpacing:"-.3px" }}>VesteBrasil</div><div style={{ fontSize:11,color:t.tm }}>Launch OS</div></div>
        </div>
        <div style={{ padding:"14px 16px",borderBottom:`1px solid ${t.bd}`,display:"flex",alignItems:"center",gap:10 }}>
          <Av m={me} s={30} />
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontWeight:600,fontSize:13 }}>{me.name}</div>
            <div style={{ fontSize:10,color:t.tm,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{me.role}</div>
          </div>
          {me.isAdmin && <Crown size={13} color={t.yl} />}
          {connected ? <Wifi size={12} color={t.sc} /> : <WifiOff size={12} color={t.dn} />}
        </div>
        <div style={{ flex:1,padding:"10px 8px",overflowY:"auto" }}>
          {navItems.map(s => { const I = s.i; const a = sec===s.id; return (
            <div key={s.id} onClick={()=>setSec(s.id)} style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,cursor:"pointer",marginBottom:1,background:a?`${t.gr}15`:"transparent",color:a?t.gb:t.tm,fontWeight:a?600:400,fontSize:13,transition:"all .12s" }}>
              <I size={17} /><span>{s.l}</span>{a&&<div style={{ marginLeft:"auto",width:5,height:5,borderRadius:3,background:t.gb }} />}
            </div>
          ); })}
        </div>
        <div style={{ padding:"8px",borderTop:`1px solid ${t.bd}` }}>
          <div onClick={()=>setDark(!dark)} style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,cursor:"pointer",color:t.tm,fontSize:13 }}>
            {dark?<Sun size={17}/>:<Moon size={17}/>}<span>{dark?"Claro":"Escuro"}</span>
          </div>
          <div onClick={()=>setUser(null)} style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,cursor:"pointer",color:t.dn,fontSize:13 }}>
            <LogOut size={17}/><span>Sair</span>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
        <div style={{ height:52,borderBottom:`1px solid ${t.bd}`,display:"flex",alignItems:"center",padding:"0 24px",gap:14,flexShrink:0 }}>
          <Search size={15} color={t.td} />
          <input placeholder="Buscar..." style={{ background:"transparent",border:"none",fontSize:13,flex:1,padding:4 }} />
          <div style={{ display:"flex" }}>{TEAM.map((m,i) => <div key={m.id} style={{ marginLeft:i?-6:0,zIndex:4-i }}><Av m={m} s={26} /></div>)}</div>
          <Bg color={D.launchStatus==="Rodando"?t.sc:D.launchStatus==="Pré-lançamento"?t.yl:t.gr} t={t}>{D.launchStatus}</Bg>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"24px 28px" }} className="fi" key={sec}>
          {sec==="dashboard" && <Dashboard {...P} progress={progress} />}
          {sec==="equipe" && <Equipe {...P} />}
          {sec==="estrategia" && <Estrategia {...P} />}
          {sec==="referencias" && <Referencias {...P} />}
          {sec==="concorrentes" && <Concorrentes {...P} />}
          {sec==="produtos" && <Produtos {...P} />}
          {sec==="criativos" && <Criativos {...P} />}
          {sec==="tarefas" && <Tarefas {...P} />}
          {sec==="roadmap" && <RoadmapV {...P} />}
          {sec==="arquivos" && <Arquivos {...P} />}
          {sec==="anotacoes" && <Anotacoes {...P} />}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ DASHBOARD ═══════════════════ */
function Dashboard({ t, me, D, up, progress }) {
  const myT = (D.tasks||[]).filter(x=>x.responsavel===me.name);
  const pend = myT.filter(x=>x.status!=="Concluído");
  const done = myT.filter(x=>x.status==="Concluído");
  const SC = ({l,v,i:I,c}) => <div style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:12,padding:"18px 20px",flex:1,minWidth:150 }}><div style={{ display:"flex",justifyContent:"space-between" }}><div><div style={{ fontSize:10,color:t.tm,marginBottom:6,textTransform:"uppercase",letterSpacing:".6px",fontWeight:500 }}>{l}</div><div style={{ fontSize:28,fontWeight:700,color:c||t.tx }}>{v}</div></div><div style={{ width:34,height:34,borderRadius:8,background:`${c||t.gr}12`,display:"flex",alignItems:"center",justifyContent:"center" }}><I size={17} color={c||t.gr} /></div></div></div>;

  return <div>
    <Hd t={t} title={`Olá, ${me.name}`} sub={`${me.role} • ${me.channel}`} />
    <div style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:14,padding:"22px 24px",marginBottom:18,display:"flex",alignItems:"center",gap:20 }}>
      <Zap size={20} color={t.yl} />
      <div style={{ flex:1 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
          <span style={{ fontSize:13,fontWeight:600 }}>Progresso do Lançamento</span>
          {me.isAdmin && <select value={D.launchStatus} onChange={e=>up("launchStatus",e.target.value)} style={{ marginLeft:8,padding:"3px 8px",fontSize:11,borderRadius:6,width:"auto" }}>
            {["Em construção","Pré-lançamento","Rodando"].map(s=><option key={s}>{s}</option>)}
          </select>}
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ flex:1,height:8,background:t.bgH,borderRadius:4,overflow:"hidden" }}><div style={{ height:"100%",borderRadius:4,background:`linear-gradient(90deg,${t.gr},${t.gb})`,width:`${progress}%`,transition:"width .5s" }}/></div>
          <span style={{ fontSize:15,fontWeight:700,color:t.gb }}>{progress}%</span>
        </div>
      </div>
    </div>
    <div style={{ display:"flex",gap:12,marginBottom:18,flexWrap:"wrap" }}>
      <SC l="Minhas Pendentes" v={pend.length} i={CheckSquare} c={t.bl} />
      <SC l="Concluídas" v={done.length} i={Check} c={t.sc} />
      <SC l="Criativos" v={(D.creatives||[]).length} i={Film} c={t.pp} />
      <SC l="Produtos" v={(D.products||[]).length} i={ShoppingBag} c={t.yl} />
    </div>
    {me.isAdmin && <div style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:12,padding:"16px 20px",marginBottom:18 }}>
      <div style={{ fontSize:12,fontWeight:600,marginBottom:10 }}>Métricas Manuais</div>
      <div style={{ display:"flex",gap:14,flexWrap:"wrap" }}>
        {[{k:"criativos",l:"Criativos"},{k:"produtos",l:"Produtos"},{k:"plataformas",l:"Plataformas"}].map(m=><div key={m.k} style={{ display:"flex",alignItems:"center",gap:6 }}><label style={{ fontSize:12,color:t.tm }}>{m.l}:</label><input type="number" value={D.metrics?.[m.k]||0} onChange={e=>up("metrics",{...D.metrics,[m.k]:parseInt(e.target.value)||0})} style={{ width:60,textAlign:"center",padding:"4px 6px" }}/></div>)}
      </div>
    </div>}
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
      <div style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:12,padding:"18px 20px" }}>
        <div style={{ fontSize:13,fontWeight:600,marginBottom:14,display:"flex",alignItems:"center",gap:6 }}><CheckSquare size={15} color={t.gb} /> Minhas Tarefas</div>
        {pend.length===0?<div style={{ color:t.td,fontSize:13 }}>Tudo em dia!</div>:pend.slice(0,6).map(x=><div key={x.id} style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${t.bd}11` }}><div style={{ width:6,height:6,borderRadius:3,background:x.prioridade==="Urgente"?t.dn:x.prioridade==="Alta"?"#F97316":t.yl }}/><span style={{ fontSize:13,flex:1 }}>{x.titulo}</span><Bg c={x.status==="Em andamento"?t.bl:t.td} t={t}>{x.status}</Bg></div>)}
      </div>
      <div style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:12,padding:"18px 20px" }}>
        <div style={{ fontSize:13,fontWeight:600,marginBottom:14,display:"flex",alignItems:"center",gap:6 }}><Users size={15} color={t.yl} /> Equipe</div>
        {TEAM.map(m=>{const mt=(D.tasks||[]).filter(x=>x.responsavel===m.name);const d=mt.filter(x=>x.status==="Concluído").length;const p=mt.length?Math.round(d/mt.length*100):0;return <div key={m.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${t.bd}11` }}><Av m={m} s={26}/><div style={{ flex:1 }}><div style={{ fontSize:13,fontWeight:500 }}>{m.name} <span style={{ color:t.td,fontWeight:400 }}>— {m.channel}</span></div><div style={{ display:"flex",alignItems:"center",gap:8,marginTop:3 }}><div style={{ flex:1,height:3,background:t.bgH,borderRadius:2,overflow:"hidden",maxWidth:100 }}><div style={{ height:"100%",borderRadius:2,background:m.color,width:`${p}%` }}/></div><span style={{ fontSize:10,color:t.tm }}>{d}/{mt.length}</span></div></div></div>})}
      </div>
      <div style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:12,padding:"18px 20px",gridColumn:"span 2" }}>
        <div style={{ fontSize:13,fontWeight:600,marginBottom:14,display:"flex",alignItems:"center",gap:6 }}><Activity size={15} color={t.bl} /> Atividade Recente <span style={{ fontSize:10,color:t.sc,marginLeft:4 }}>● ao vivo</span></div>
        {(D.activity||[]).length===0?<div style={{ color:t.td,fontSize:13 }}>Nenhuma atividade</div>:(D.activity||[]).slice(0,8).map(a=>{const am=TEAM.find(m=>m.id===a.userId);return <div key={a.id} style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 0",fontSize:13 }}>{am&&<Av m={am} s={20}/>}<span style={{ color:t.tm }}>{a.text}</span><span style={{ fontSize:10,color:t.td,marginLeft:"auto",whiteSpace:"nowrap" }}>{a.time}</span></div>})}
      </div>
    </div>
  </div>;
}

/* ═══════════════════ EQUIPE ═══════════════════ */
function Equipe({ t, D }) {
  return <div><Hd t={t} title="Equipe" sub="Membros e responsabilidades" />
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
      {TEAM.map(m=>{const mt=(D.tasks||[]).filter(x=>x.responsavel===m.name);const d=mt.filter(x=>x.status==="Concluído").length;const pend=mt.filter(x=>x.status!=="Concluído");const p=mt.length?Math.round(d/mt.length*100):0;return <div key={m.id} style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:14,padding:24,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:m.color }}/>
        <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:18 }}><Av m={m} s={48}/><div><div style={{ fontWeight:700,fontSize:17,display:"flex",alignItems:"center",gap:6 }}>{m.name} {m.isAdmin&&<Crown size={14} color={t.yl}/>}</div><div style={{ fontSize:13,color:t.tm }}>{m.role}</div><div style={{ fontSize:12,color:m.color,fontWeight:500 }}>{m.channel}</div></div></div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18 }}>
          <div style={{ textAlign:"center",padding:10,background:t.bgH,borderRadius:8 }}><div style={{ fontSize:20,fontWeight:700 }}>{mt.length}</div><div style={{ fontSize:10,color:t.tm }}>Total</div></div>
          <div style={{ textAlign:"center",padding:10,background:t.bgH,borderRadius:8 }}><div style={{ fontSize:20,fontWeight:700,color:t.sc }}>{d}</div><div style={{ fontSize:10,color:t.tm }}>Feitas</div></div>
          <div style={{ textAlign:"center",padding:10,background:t.bgH,borderRadius:8 }}><div style={{ fontSize:20,fontWeight:700,color:pend.length?t.yl:t.sc }}>{pend.length}</div><div style={{ fontSize:10,color:t.tm }}>Pendentes</div></div>
        </div>
        <div style={{ marginBottom:16 }}><div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:t.tm,marginBottom:4 }}><span>Progresso</span><span>{p}%</span></div><div style={{ height:6,background:t.bgH,borderRadius:3,overflow:"hidden" }}><div style={{ height:"100%",borderRadius:3,background:m.color,width:`${p}%` }}/></div></div>
        <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>{m.responsibilities.map(r=><Bg key={r} c={m.color} t={t}>{r}</Bg>)}</div>
        <div style={{ marginTop:14,fontSize:11,color:t.td }}>{m.email}</div>
      </div>})}
    </div>
  </div>;
}

/* ═══════════════════ ESTRATÉGIA ═══════════════════ */
function Estrategia({ t, D, up }) {
  const [ed, setEd] = useState(null);
  const secs = [{k:"posicionamento",l:"Posicionamento",i:Target},{k:"publicoAlvo",l:"Público-Alvo",i:Users},{k:"ofertaPrincipal",l:"Oferta Principal",i:Zap},{k:"diferenciais",l:"Diferenciais",i:Star},{k:"precoMargem",l:"Preço e Margem",i:BarChart3},{k:"estrategiaTrafego",l:"Estratégia de Tráfego",i:TrendingUp},{k:"estrategiaConteudo",l:"Estratégia de Conteúdo",i:Film},{k:"estrategiaCanal",l:"Estratégia por Canal",i:LayoutDashboard}];
  return <div><Hd t={t} title="Estratégia" sub="Fundamentos da marca" />
    <div style={{ display:"grid",gap:12 }}>{secs.map(s=>{const I=s.i;const e=ed===s.k;return <div key={s.k} style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:12,padding:"20px 22px" }}>
      <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}><I size={16} color={t.gb}/><span style={{ fontWeight:600,fontSize:14 }}>{s.l}</span><Bt t={t} v="ghost" style={{ marginLeft:"auto",padding:"4px 10px",fontSize:11 }} onClick={()=>setEd(e?null:s.k)}><Edit3 size={12}/> {e?"Salvar":"Editar"}</Bt></div>
      {e?<textarea value={D.strategy?.[s.k]||""} onChange={e=>up("strategy",{...D.strategy,[s.k]:e.target.value})} style={{ minHeight:100,fontSize:13,lineHeight:1.7 }}/>:<div style={{ fontSize:13,lineHeight:1.8,color:t.tm,whiteSpace:"pre-wrap" }}>{D.strategy?.[s.k]}</div>}
    </div>})}</div>
  </div>;
}

/* ═══════════════════ REFERÊNCIAS ═══════════════════ */
function Referencias({ t, D, up, act, me }) {
  const [show, setShow] = useState(false);
  const [f, setF] = useState({url:"",tags:"",notes:""});
  const [exp, setExp] = useState(null);
  const [tagF, setTagF] = useState("");
  const refs = D.references||[];
  const add = () => { if(!f.url)return; up("references",[...refs,{id:uid(),url:f.url,tags:f.tags.split(",").map(x=>x.trim()).filter(Boolean),notes:f.notes,by:me.name,date:ts()}]); act(`${me.name} adicionou referência`); setF({url:"",tags:"",notes:""}); setShow(false); };
  const allTags = [...new Set(refs.flatMap(r=>r.tags||[]))];
  const filtered = tagF ? refs.filter(r=>(r.tags||[]).includes(tagF)) : refs;
  return <div>
    <Hd t={t} title="Referências" sub="Moodboard visual" right={<Bt t={t} v="primary" onClick={()=>setShow(true)}><Plus size={15}/> Adicionar</Bt>} />
    {allTags.length>0&&<div style={{ display:"flex",gap:6,marginBottom:18,flexWrap:"wrap" }}><span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:500,cursor:"pointer",background:!tagF?t.gr:t.bgH,color:!tagF?"#fff":t.tm }} onClick={()=>setTagF("")}>Todas</span>{allTags.map(tag=><span key={tag} style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:500,cursor:"pointer",background:tagF===tag?t.gr:t.bgH,color:tagF===tag?"#fff":t.tm }} onClick={()=>setTagF(tag)}>{tag}</span>)}</div>}
    <div style={{ columnCount:3,columnGap:14 }}>{filtered.map(r=><div key={r.id} style={{ breakInside:"avoid",marginBottom:14,background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:12,overflow:"hidden",cursor:"pointer" }} onClick={()=>setExp(r)}><div style={{ width:"100%",paddingTop:"70%",background:`url(${r.url}) center/cover`,backgroundColor:t.bgH }}/><div style={{ padding:"10px 12px" }}>{(r.tags||[]).length>0&&<div style={{ display:"flex",gap:3,flexWrap:"wrap",marginBottom:4 }}>{r.tags.map(x=><Bg key={x} t={t}>{x}</Bg>)}</div>}{r.notes&&<div style={{ fontSize:11,color:t.tm }}>{r.notes}</div>}</div></div>)}</div>
    {filtered.length===0&&<Empty icon={Image} text="Nenhuma referência" t={t}/>}
    {show&&<Md t={t} onClose={()=>setShow(false)}><MdH title="Nova Referência" onClose={()=>setShow(false)} t={t}/><div style={{ display:"grid",gap:10 }}><input placeholder="URL da imagem" value={f.url} onChange={e=>setF({...f,url:e.target.value})}/><input placeholder="Tags (vírgula)" value={f.tags} onChange={e=>setF({...f,tags:e.target.value})}/><textarea placeholder="Notas" value={f.notes} onChange={e=>setF({...f,notes:e.target.value})}/><Bt t={t} v="primary" onClick={add}>Salvar</Bt></div></Md>}
    {exp&&<Md t={t} wide onClose={()=>setExp(null)}><div style={{ display:"flex",justifyContent:"space-between",marginBottom:12 }}><div style={{ display:"flex",gap:4 }}>{(exp.tags||[]).map(x=><Bg key={x} t={t}>{x}</Bg>)}</div><div style={{ display:"flex",gap:8 }}><Trash2 size={16} style={{ cursor:"pointer",color:t.dn }} onClick={()=>{up("references",refs.filter(r=>r.id!==exp.id));setExp(null)}}/><X size={18} style={{ cursor:"pointer",color:t.tm }} onClick={()=>setExp(null)}/></div></div><img src={exp.url} alt="" style={{ width:"100%",borderRadius:10,marginBottom:10 }} onError={e=>{e.target.style.display="none"}}/>{exp.notes&&<div style={{ fontSize:13,color:t.tm }}>{exp.notes}</div>}{exp.by&&<div style={{ fontSize:11,color:t.td,marginTop:6 }}>Por {exp.by} • {exp.date}</div>}</Md>}
  </div>;
}

/* ═══════════════════ CONCORRENTES ═══════════════════ */
function Concorrentes({ t, D, up, act, me }) {
  const [show, setShow] = useState(false);
  const [eid, setEid] = useState(null);
  const empty = {nome:"",link:"",plataforma:"",precoMedio:"",diferencial:"",pontosFortes:"",pontosFracos:"",ideias:""};
  const [f, setF] = useState(empty);
  const comps = D.competitors||[];
  const save = () => { if(!f.nome)return; if(eid) up("competitors",comps.map(c=>c.id===eid?{...c,...f}:c)); else { up("competitors",[...comps,{id:uid(),...f}]); act(`${me.name} adicionou concorrente: ${f.nome}`); } setF(empty); setEid(null); setShow(false); };
  return <div>
    <Hd t={t} title="Concorrentes" sub="Análise competitiva" right={<Bt t={t} v="primary" onClick={()=>{setF(empty);setEid(null);setShow(true)}}><Plus size={15}/> Adicionar</Bt>} />
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14 }}>
      {comps.map(c=><div key={c.id} style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:12,padding:"18px 20px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}><div style={{ fontWeight:600,fontSize:15 }}>{c.nome}</div><div style={{ display:"flex",gap:6 }}><Edit3 size={14} style={{ cursor:"pointer",color:t.tm }} onClick={()=>{setF(c);setEid(c.id);setShow(true)}}/><Trash2 size={14} style={{ cursor:"pointer",color:t.dn }} onClick={()=>up("competitors",comps.filter(x=>x.id!==c.id))}/></div></div>
        <div style={{ fontSize:12,color:t.tm,marginBottom:8 }}>{c.plataforma} • <span style={{ color:t.yl }}>{c.precoMedio}</span></div>
        {c.diferencial&&<div style={{ fontSize:12,color:t.gb,marginBottom:6 }}>{c.diferencial}</div>}
        <div style={{ fontSize:12,color:t.tm,lineHeight:1.6 }}>{c.pontosFortes&&<div><strong style={{color:t.sc}}>+</strong> {c.pontosFortes}</div>}{c.pontosFracos&&<div><strong style={{color:t.dn}}>−</strong> {c.pontosFracos}</div>}{c.ideias&&<div><strong style={{color:t.yl}}>★</strong> {c.ideias}</div>}</div>
      </div>)}
    </div>
    {comps.length===0&&<Empty icon={Store} text="Nenhum concorrente" t={t}/>}
    {show&&<Md t={t} onClose={()=>setShow(false)}><MdH title={(eid?"Editar":"Novo")+" Concorrente"} onClose={()=>setShow(false)} t={t}/><div style={{ display:"grid",gap:10 }}><input placeholder="Nome" value={f.nome} onChange={e=>setF({...f,nome:e.target.value})}/><input placeholder="Link" value={f.link} onChange={e=>setF({...f,link:e.target.value})}/><input placeholder="Plataforma" value={f.plataforma} onChange={e=>setF({...f,plataforma:e.target.value})}/><input placeholder="Preço médio" value={f.precoMedio} onChange={e=>setF({...f,precoMedio:e.target.value})}/><input placeholder="Diferencial" value={f.diferencial} onChange={e=>setF({...f,diferencial:e.target.value})}/><textarea placeholder="Pontos fortes" value={f.pontosFortes} onChange={e=>setF({...f,pontosFortes:e.target.value})} style={{minHeight:50}}/><textarea placeholder="Pontos fracos" value={f.pontosFracos} onChange={e=>setF({...f,pontosFracos:e.target.value})} style={{minHeight:50}}/><textarea placeholder="Ideias copiáveis" value={f.ideias} onChange={e=>setF({...f,ideias:e.target.value})} style={{minHeight:50}}/><Bt t={t} v="primary" onClick={save}>Salvar</Bt></div></Md>}
  </div>;
}

/* ═══════════════════ PRODUTOS ═══════════════════ */
function Produtos({ t, D, up, act, me }) {
  const [show, setShow] = useState(false);
  const [eid, setEid] = useState(null);
  const empty = {nome:"",categoria:"Camisa",descricao:"",preco:"",custo:"",status:"Ideia",linkFornecedor:"",obs:""};
  const [f, setF] = useState(empty);
  const prods = D.products||[];
  const save = () => { if(!f.nome)return; const mg=f.preco&&f.custo?Math.round((1-parseFloat(f.custo)/parseFloat(f.preco))*100):null; if(eid) up("products",prods.map(x=>x.id===eid?{...x,...f,margem:mg}:x)); else { up("products",[...prods,{id:uid(),...f,margem:mg}]); act(`${me.name} adicionou produto: ${f.nome}`); } setF(empty); setEid(null); setShow(false); };
  const sc = s => s==="Pronto"?t.sc:s==="Produção"?t.yl:t.tm;
  return <div>
    <Hd t={t} title="Produtos" sub="Catálogo e SKUs" right={<Bt t={t} v="primary" onClick={()=>{setF(empty);setEid(null);setShow(true)}}><Plus size={15}/> Novo Produto</Bt>} />
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14 }}>
      {prods.map(p=><div key={p.id} style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:12,padding:"18px 20px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}><div><div style={{ fontWeight:600,fontSize:15 }}>{p.nome}</div><Bg c={t.gr} t={t}>{p.categoria}</Bg></div><Bg c={sc(p.status)} t={t}>{p.status}</Bg></div>
        {p.descricao&&<div style={{ fontSize:12,color:t.tm,marginBottom:8,lineHeight:1.6 }}>{p.descricao}</div>}
        <div style={{ display:"flex",gap:14,fontSize:13 }}>{p.preco&&<div>Preço: <strong style={{color:t.gb}}>R${p.preco}</strong></div>}{p.custo&&<div>Custo: <span style={{color:t.tm}}>R${p.custo}</span></div>}{p.margem!=null&&<div>Margem: <strong style={{color:p.margem>50?t.sc:t.yl}}>{p.margem}%</strong></div>}</div>
        <div style={{ display:"flex",gap:6,marginTop:10 }}><Bt t={t} v="ghost" style={{padding:"4px 10px",fontSize:11}} onClick={()=>{setF(p);setEid(p.id);setShow(true)}}><Edit3 size={12}/> Editar</Bt><Bt t={t} v="danger" style={{padding:"4px 10px",fontSize:11}} onClick={()=>up("products",prods.filter(x=>x.id!==p.id))}><Trash2 size={12}/></Bt></div>
      </div>)}
    </div>
    {prods.length===0&&<Empty icon={ShoppingBag} text="Nenhum produto" t={t}/>}
    {show&&<Md t={t} onClose={()=>setShow(false)}><MdH title={(eid?"Editar":"Novo")+" Produto"} onClose={()=>setShow(false)} t={t}/><div style={{ display:"grid",gap:10 }}><input placeholder="Nome" value={f.nome} onChange={e=>setF({...f,nome:e.target.value})}/><select value={f.categoria} onChange={e=>setF({...f,categoria:e.target.value})}>{PROD_CAT.map(c=><option key={c}>{c}</option>)}</select><textarea placeholder="Descrição" value={f.descricao} onChange={e=>setF({...f,descricao:e.target.value})}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><input placeholder="Preço R$" type="number" value={f.preco} onChange={e=>setF({...f,preco:e.target.value})}/><input placeholder="Custo R$" type="number" value={f.custo} onChange={e=>setF({...f,custo:e.target.value})}/></div><select value={f.status} onChange={e=>setF({...f,status:e.target.value})}>{PROD_ST.map(s=><option key={s}>{s}</option>)}</select><input placeholder="Link fornecedor" value={f.linkFornecedor} onChange={e=>setF({...f,linkFornecedor:e.target.value})}/><textarea placeholder="Observações" value={f.obs} onChange={e=>setF({...f,obs:e.target.value})}/><Bt t={t} v="primary" onClick={save}>Salvar</Bt></div></Md>}
  </div>;
}

/* ═══════════════════ CRIATIVOS ═══════════════════ */
function Criativos({ t, D, up, act, me }) {
  const [show, setShow] = useState(false);
  const [eid, setEid] = useState(null);
  const empty = {nome:"",tipo:"UGC",roteiro:"",hook:"",plataforma:"TikTok",status:"Ideia",link:"",metricas:"",responsavel:me.name};
  const [f, setF] = useState(empty);
  const [drag, setDrag] = useState(null);
  const crs = D.creatives||[];
  const save = () => { if(!f.nome)return; if(eid) up("creatives",crs.map(c=>c.id===eid?{...c,...f}:c)); else { up("creatives",[...crs,{id:uid(),...f}]); act(`${me.name} criou criativo: ${f.nome}`); } setF(empty); setEid(null); setShow(false); };
  const drop = st => { if(drag){ up("creatives",crs.map(c=>c.id===drag?{...c,status:st}:c)); act(`${me.name} moveu criativo → ${st}`); setDrag(null); }};
  const tc = x => x==="UGC"?t.pp:x==="Lifestyle"?t.bl:x==="Oferta"?t.yl:t.gb;
  return <div>
    <Hd t={t} title="Criativos" sub="Onde o dinheiro é feito" right={<Bt t={t} v="primary" onClick={()=>{setF({...empty,responsavel:me.name});setEid(null);setShow(true)}}><Plus size={15}/> Novo</Bt>} />
    <div style={{ display:"grid",gridTemplateColumns:`repeat(${CREAT_ST.length},1fr)`,gap:12,minHeight:400 }}>
      {CREAT_ST.map(st=><div key={st} onDragOver={e=>e.preventDefault()} onDrop={()=>drop(st)} style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:12,padding:12,minHeight:300 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}><div style={{ width:8,height:8,borderRadius:4,background:st==="Publicado"?t.sc:st==="Editar"?t.yl:st==="Gravar"?t.bl:t.td }}/><span style={{ fontWeight:600,fontSize:13 }}>{st}</span><span style={{ fontSize:11,color:t.td,marginLeft:"auto" }}>{crs.filter(c=>c.status===st).length}</span></div>
        {crs.filter(c=>c.status===st).map(c=>{const r=TEAM.find(m=>m.name===c.responsavel);return <div key={c.id} draggable onDragStart={()=>setDrag(c.id)} style={{ background:t.bg,border:`1px solid ${t.bd}`,borderRadius:8,padding:"12px 14px",marginBottom:8,cursor:"grab" }}>
          <div style={{ display:"flex",justifyContent:"space-between" }}><div style={{ fontWeight:500,fontSize:13 }}>{c.nome}</div><Edit3 size={12} style={{cursor:"pointer",color:t.td}} onClick={()=>{setF(c);setEid(c.id);setShow(true)}}/></div>
          <div style={{ display:"flex",gap:4,marginTop:6,alignItems:"center" }}><Bg c={tc(c.tipo)} t={t}>{c.tipo}</Bg><Bg c={t.td} t={t}>{c.plataforma}</Bg>{r&&<Av m={r} s={18}/>}</div>
          {c.hook&&<div style={{ fontSize:11,color:t.tm,marginTop:6,fontStyle:"italic" }}>"{c.hook}"</div>}
        </div>})}
      </div>)}
    </div>
    {show&&<Md t={t} onClose={()=>setShow(false)}><MdH title={(eid?"Editar":"Novo")+" Criativo"} onClose={()=>setShow(false)} t={t}/><div style={{ display:"grid",gap:10 }}><input placeholder="Nome" value={f.nome} onChange={e=>setF({...f,nome:e.target.value})}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><select value={f.tipo} onChange={e=>setF({...f,tipo:e.target.value})}>{CREAT_TY.map(x=><option key={x}>{x}</option>)}</select><select value={f.status} onChange={e=>setF({...f,status:e.target.value})}>{CREAT_ST.map(x=><option key={x}>{x}</option>)}</select></div><select value={f.responsavel} onChange={e=>setF({...f,responsavel:e.target.value})}>{TEAM.map(m=><option key={m.id}>{m.name}</option>)}</select><input placeholder="Hook (3s)" value={f.hook} onChange={e=>setF({...f,hook:e.target.value})}/><textarea placeholder="Roteiro" value={f.roteiro} onChange={e=>setF({...f,roteiro:e.target.value})}/><input placeholder="Plataforma" value={f.plataforma} onChange={e=>setF({...f,plataforma:e.target.value})}/><input placeholder="Link vídeo" value={f.link} onChange={e=>setF({...f,link:e.target.value})}/><Bt t={t} v="primary" onClick={save}>Salvar</Bt></div></Md>}
  </div>;
}

/* ═══════════════════ TAREFAS ═══════════════════ */
function Tarefas({ t, D, up, act, me }) {
  const [show, setShow] = useState(false);
  const [eid, setEid] = useState(null);
  const empty = {titulo:"",responsavel:me.name,prioridade:"Média",status:"A fazer",dataLimite:""};
  const [f, setF] = useState(empty);
  const [fp, setFp] = useState("");
  const [drag, setDrag] = useState(null);
  const tasks = D.tasks||[];
  const save = () => { if(!f.titulo)return; if(eid){up("tasks",tasks.map(x=>x.id===eid?{...x,...f}:x));act(`${me.name} atualizou: ${f.titulo}`)} else{up("tasks",[...tasks,{id:uid(),...f,criadoPor:me.name,criadoEm:ts()}]);act(`${me.name} criou tarefa: ${f.titulo} → ${f.responsavel}`)} setF(empty);setEid(null);setShow(false); };
  const drop = st => { if(drag){const tk=tasks.find(x=>x.id===drag);up("tasks",tasks.map(x=>x.id===drag?{...x,status:st}:x));if(st==="Concluído")act(`${me.name} concluiu: ${tk?.titulo}`);else act(`${me.name} moveu "${tk?.titulo}" → ${st}`);setDrag(null)} };
  const filtered = fp ? tasks.filter(x=>x.responsavel===fp) : tasks;
  const pc = p => p==="Urgente"?t.dn:p==="Alta"?"#F97316":p==="Média"?t.yl:t.td;
  return <div>
    <Hd t={t} title="Tarefas" sub="Motor de execução" right={<><select value={fp} onChange={e=>setFp(e.target.value)} style={{padding:"6px 10px",fontSize:12,borderRadius:6,width:"auto"}}><option value="">Todos</option>{TEAM.map(m=><option key={m.id}>{m.name}</option>)}</select><Bt t={t} v="primary" onClick={()=>{setF({...empty,responsavel:me.name});setEid(null);setShow(true)}}><Plus size={15}/> Nova</Bt></>} />
    <div style={{ display:"grid",gridTemplateColumns:`repeat(${TASK_ST.length},1fr)`,gap:12,minHeight:400 }}>
      {TASK_ST.map(st=><div key={st} onDragOver={e=>e.preventDefault()} onDrop={()=>drop(st)} style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:12,padding:12,minHeight:300 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}><div style={{ width:8,height:8,borderRadius:4,background:st==="Concluído"?t.sc:st==="Revisão"?t.pp:st==="Em andamento"?t.bl:t.td }}/><span style={{ fontWeight:600,fontSize:13 }}>{st}</span><span style={{ fontSize:11,color:t.td,marginLeft:"auto" }}>{filtered.filter(x=>x.status===st).length}</span></div>
        {filtered.filter(x=>x.status===st).map(x=>{const r=TEAM.find(m=>m.name===x.responsavel);return <div key={x.id} draggable onDragStart={()=>setDrag(x.id)} style={{ background:t.bg,border:`1px solid ${t.bd}`,borderRadius:8,padding:"12px 14px",marginBottom:8,cursor:"grab" }}>
          <div style={{ display:"flex",justifyContent:"space-between" }}><div style={{ fontWeight:500,fontSize:13 }}>{x.titulo}</div><Edit3 size={12} style={{cursor:"pointer",color:t.td}} onClick={()=>{setF(x);setEid(x.id);setShow(true)}}/></div>
          <div style={{ display:"flex",gap:6,marginTop:8,alignItems:"center" }}><div style={{ width:5,height:5,borderRadius:3,background:pc(x.prioridade) }}/>{r&&<Av m={r} s={18}/>}<span style={{ fontSize:11,color:t.tm }}>{x.responsavel}</span>{x.dataLimite&&<span style={{ fontSize:10,color:t.td,marginLeft:"auto" }}>{x.dataLimite}</span>}</div>
        </div>})}
      </div>)}
    </div>
    {show&&<Md t={t} onClose={()=>setShow(false)}><MdH title={(eid?"Editar":"Nova")+" Tarefa"} onClose={()=>setShow(false)} t={t}/><div style={{ display:"grid",gap:10 }}><input placeholder="Título" value={f.titulo} onChange={e=>setF({...f,titulo:e.target.value})}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><select value={f.responsavel} onChange={e=>setF({...f,responsavel:e.target.value})}>{TEAM.map(m=><option key={m.id}>{m.name}</option>)}</select><select value={f.prioridade} onChange={e=>setF({...f,prioridade:e.target.value})}>{TASK_PR.map(p=><option key={p}>{p}</option>)}</select></div><select value={f.status} onChange={e=>setF({...f,status:e.target.value})}>{TASK_ST.map(s=><option key={s}>{s}</option>)}</select><input type="date" value={f.dataLimite} onChange={e=>setF({...f,dataLimite:e.target.value})}/><div style={{display:"flex",gap:8}}><Bt t={t} v="primary" style={{flex:1}} onClick={save}>Salvar</Bt>{eid&&<Bt t={t} v="danger" onClick={()=>{up("tasks",tasks.filter(x=>x.id!==eid));setShow(false)}}><Trash2 size={14}/></Bt>}</div></div></Md>}
  </div>;
}

/* ═══════════════════ ROADMAP ═══════════════════ */
function RoadmapV({ t, D, up }) {
  const [exp, setExp] = useState(null);
  const rm = D.roadmap||[];
  const ck = D.roadmapChecked||{};
  const colors = [t.pp,t.bl,t.gb,t.yl,"#F97316",t.dn,t.sc];
  const toggle = (pid,idx) => {
    const k=`${pid}-${idx}`;const nc={...ck,[k]:!ck[k]};
    up("roadmapChecked",nc);
    const phase=rm.find(p=>p.id===pid);const total=phase.items.length;const done=phase.items.filter((_,i)=>nc[`${pid}-${i}`]).length;
    up("roadmap",rm.map(p=>p.id===pid?{...p,progress:Math.round(done/total*100)}:p));
  };
  return <div><Hd t={t} title="Roadmap de Lançamento" sub="Fases do lançamento" />
    <div style={{ position:"relative" }}>
      <div style={{ position:"absolute",left:19,top:0,bottom:0,width:2,background:`linear-gradient(to bottom,${t.gr},${t.gb}44)` }}/>
      {rm.map((ph,pi)=><div key={ph.id} style={{ marginBottom:6,position:"relative",paddingLeft:48 }}>
        <div style={{ position:"absolute",left:10,top:18,width:20,height:20,borderRadius:10,background:ph.progress===100?t.sc:colors[pi],border:`3px solid ${t.bg}`,zIndex:1,display:"flex",alignItems:"center",justifyContent:"center" }}>{ph.progress===100&&<Check size={10} color="#fff"/>}</div>
        <div style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:12,padding:"16px 20px",cursor:"pointer" }} onClick={()=>setExp(exp===ph.id?null:ph.id)}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            {exp===ph.id?<ChevronDown size={16} color={t.tm}/>:<ChevronRight size={16} color={t.tm}/>}
            <span style={{ fontWeight:600,fontSize:14 }}>{ph.name}</span>
            <div style={{ marginLeft:"auto",display:"flex",alignItems:"center",gap:10 }}><span style={{ fontSize:12,color:t.tm }}>{ph.progress||0}%</span><div style={{ width:80,height:4,background:t.bgH,borderRadius:2,overflow:"hidden" }}><div style={{ height:"100%",borderRadius:2,background:colors[pi],width:`${ph.progress||0}%`,transition:"width .3s" }}/></div></div>
          </div>
          {exp===ph.id&&<div style={{ marginTop:14,paddingTop:14,borderTop:`1px solid ${t.bd}` }}>
            {(ph.items||[]).map((item,idx)=>{const c=ck[`${ph.id}-${idx}`];return <div key={idx} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",cursor:"pointer" }} onClick={e=>{e.stopPropagation();toggle(ph.id,idx)}}>
              <div style={{ width:18,height:18,borderRadius:4,border:`2px solid ${c?t.sc:t.bd}`,background:c?t.sc:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{c&&<Check size={11} color="#fff"/>}</div>
              <span style={{ fontSize:13,textDecoration:c?"line-through":"none",color:c?t.td:t.tx }}>{item}</span>
            </div>})}
          </div>}
        </div>
      </div>)}
    </div>
  </div>;
}

/* ═══════════════════ ARQUIVOS ═══════════════════ */
function Arquivos({ t, D, up, act, me }) {
  const [show, setShow] = useState(false);
  const [f, setF] = useState({nome:"",link:"",categoria:"Fotos"});
  const [fc, setFc] = useState("");
  const files = D.driveFiles||[];
  const save = () => { if(!f.nome||!f.link)return; up("driveFiles",[...files,{id:uid(),...f,by:me.name}]); act(`${me.name} adicionou arquivo: ${f.nome}`); setF({nome:"",link:"",categoria:"Fotos"}); setShow(false); };
  const filtered = fc ? files.filter(x=>x.categoria===fc) : files;
  const cc = c => c==="Fotos"?t.bl:c==="Vídeos"?t.pp:c==="Criativos"?t.yl:t.gb;
  const ci = c => c==="Fotos"?Image:c==="Vídeos"?Play:c==="Criativos"?Film:Star;
  return <div>
    <Hd t={t} title="Arquivos" sub="Google Drive & Links" right={<Bt t={t} v="primary" onClick={()=>setShow(true)}><Plus size={15}/> Adicionar</Bt>} />
    <div style={{ display:"flex",gap:6,marginBottom:18 }}>{["", ...DRIVE_CAT].map(c=><span key={c||"all"} style={{ padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:500,cursor:"pointer",background:fc===c?t.gr:t.bgH,color:fc===c?"#fff":t.tm }} onClick={()=>setFc(c)}>{c||"Todos"}</span>)}</div>
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14 }}>
      {filtered.map(f=>{const I=ci(f.categoria);const c=cc(f.categoria);return <a key={f.id} href={f.link} target="_blank" rel="noopener" style={{textDecoration:"none",color:"inherit"}}><div style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:12,padding:20 }}><div style={{ display:"flex",alignItems:"center",gap:10 }}><div style={{ width:36,height:36,borderRadius:8,background:`${c}15`,display:"flex",alignItems:"center",justifyContent:"center" }}><I size={18} color={c}/></div><div style={{flex:1}}><div style={{ fontWeight:500,fontSize:13 }}>{f.nome}</div><Bg c={c} t={t}>{f.categoria}</Bg></div><ExternalLink size={14} color={t.td}/></div></div></a>})}
    </div>
    {filtered.length===0&&<Empty icon={FolderOpen} text="Nenhum arquivo" t={t}/>}
    {show&&<Md t={t} onClose={()=>setShow(false)}><MdH title="Novo Arquivo" onClose={()=>setShow(false)} t={t}/><div style={{ display:"grid",gap:10 }}><input placeholder="Nome" value={f.nome} onChange={e=>setF({...f,nome:e.target.value})}/><input placeholder="Link Google Drive" value={f.link} onChange={e=>setF({...f,link:e.target.value})}/><select value={f.categoria} onChange={e=>setF({...f,categoria:e.target.value})}>{DRIVE_CAT.map(c=><option key={c}>{c}</option>)}</select><Bt t={t} v="primary" onClick={save}>Salvar</Bt></div></Md>}
  </div>;
}

/* ═══════════════════ ANOTAÇÕES ═══════════════════ */
function Anotacoes({ t, D, up, me }) {
  const [active, setActive] = useState(null);
  const [eT, setET] = useState("");
  const [eC, setEC] = useState("");
  const notes = D.notes||[];
  const add = () => { const n={id:uid(),title:"Nova nota",content:"",by:me.name,timestamp:ts()}; up("notes",[...notes,n]); setActive(n.id); setET(n.title); setEC(n.content); };
  const saveNote = () => { if(!active)return; up("notes",notes.map(n=>n.id===active?{...n,title:eT,content:eC,timestamp:ts()}:n)); };
  const sel = n => { saveNote(); setActive(n.id); setET(n.title); setEC(n.content); };
  useEffect(()=>{const t=setTimeout(saveNote,800);return()=>clearTimeout(t)},[eT,eC]);
  return <div>
    <Hd t={t} title="Anotações" sub="Ideias rápidas" right={<Bt t={t} v="primary" onClick={add}><Plus size={15}/> Nova</Bt>} />
    <div style={{ display:"grid",gridTemplateColumns:"260px 1fr",gap:16,minHeight:500 }}>
      <div style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:12,padding:8,overflowY:"auto" }}>
        {notes.length===0&&<div style={{ padding:20,textAlign:"center",color:t.td,fontSize:13 }}>Nenhuma nota</div>}
        {[...notes].reverse().map(n=><div key={n.id} onClick={()=>sel(n)} style={{ padding:"12px 14px",borderRadius:8,cursor:"pointer",marginBottom:2,background:active===n.id?`${t.gr}15`:"transparent",borderLeft:active===n.id?`3px solid ${t.gb}`:"3px solid transparent" }}><div style={{ fontWeight:500,fontSize:13,marginBottom:2 }}>{n.title||"Sem título"}</div><div style={{ fontSize:10,color:t.td }}>{n.by} • {n.timestamp}</div></div>)}
      </div>
      <div style={{ background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:12,padding:"20px 24px" }}>
        {active?<><div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}><input value={eT} onChange={e=>setET(e.target.value)} style={{ background:"transparent",border:"none",fontSize:20,fontWeight:700,flex:1,padding:0 }}/><Bt t={t} v="danger" style={{padding:"4px 10px",fontSize:11}} onClick={()=>{up("notes",notes.filter(n=>n.id!==active));setActive(null)}}><Trash2 size={12}/></Bt></div><textarea value={eC} onChange={e=>setEC(e.target.value)} placeholder="Comece a escrever..." style={{ width:"100%",minHeight:400,background:"transparent",border:"none",fontSize:14,lineHeight:1.8,resize:"none" }}/></>:<div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:t.td,fontSize:14 }}>Selecione ou crie uma nota</div>}
      </div>
    </div>
  </div>;
}
