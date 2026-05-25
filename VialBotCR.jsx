import { useState, useEffect, useRef } from "react";

const injectAssets = () => {
  if (!document.getElementById("vb-fonts")) {
    const l = document.createElement("link");
    l.id = "vb-fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Nunito:wght@400;600;700;800&display=swap";
    document.head.appendChild(l);
  }
  if (!document.getElementById("vb-css")) {
    const s = document.createElement("style");
    s.id = "vb-css";
    s.textContent = `
      @keyframes vbFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      @keyframes vbPulse{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}
      @keyframes vbGlow{0%,100%{box-shadow:0 0 12px rgba(0,188,212,.3)}50%{box-shadow:0 0 28px rgba(0,188,212,.7)}}
      @keyframes vbSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes vbFadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes vbOrbit{from{transform:rotate(0deg) translateX(22px) rotate(0deg)}to{transform:rotate(360deg) translateX(22px) rotate(-360deg)}}
      .vb-3d{transition:transform .2s ease,box-shadow .2s ease}
      .vb-3d:hover{transform:perspective(400px) rotateY(-3deg) rotateX(2deg) scale(1.02);box-shadow:8px 8px 24px rgba(0,0,0,.4)}
      .vb-btn{transition:all .2s ease;cursor:pointer}
      .vb-btn:hover{filter:brightness(1.15);transform:translateY(-1px)}
      .vb-btn:active{transform:scale(.97)}
      *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
      ::-webkit-scrollbar{width:3px;height:3px}
      ::-webkit-scrollbar-track{background:rgba(255,255,255,.04)}
      ::-webkit-scrollbar-thumb{background:rgba(0,188,212,.35);border-radius:2px}
      input::placeholder{color:rgba(200,230,240,.3)!important}
      input:focus{outline:none;border-color:rgba(0,188,212,.6)!important}
    `;
    document.head.appendChild(s);
  }
};

const P = {
  cyan:"#00BCD4", orange:"#FF6B35", navy:"#060E1E",
  navyMid:"#0C1A30", violet:"#7C3AED", gold:"#FFD700",
  cyanDim:"rgba(0,188,212,.15)", orangeDim:"rgba(255,107,53,.12)",
  violetDim:"rgba(124,58,237,.12)", goldDim:"rgba(255,215,0,.1)",
  white:"#E8F4F8", dim:"rgba(200,230,240,.5)",
  glass:"rgba(255,255,255,.055)", glassBright:"rgba(255,255,255,.09)",
  border:"rgba(255,255,255,.08)", borderCyan:"rgba(0,188,212,.25)",
};

const F = { head:"'Orbitron',sans-serif", body:"'Nunito',sans-serif" };

const gc = (extra={}) => ({
  background:P.glass, backdropFilter:"blur(20px)",
  WebkitBackdropFilter:"blur(20px)", border:`1px solid ${P.border}`,
  borderRadius:18, ...extra
});
const card = (extra={}) => ({ ...gc(), padding:"18px 20px", ...extra });

// ─── BACKGROUND ────────────────────────────────────────────────
function Background() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",
      background:`linear-gradient(135deg,${P.navy} 0%,#0A1628 50%,${P.navyMid} 100%)`}}>
      <div style={{position:"absolute",inset:0,backgroundImage:
        `linear-gradient(rgba(0,188,212,.025) 1px,transparent 1px),
         linear-gradient(90deg,rgba(0,188,212,.025) 1px,transparent 1px)`,
        backgroundSize:"48px 48px"}}/>
      {[["-10%","15%","500px",P.cyan,.12],["-5%","70%","400px",P.violet,.1],["60%","-5%","450px",P.orange,.07],["80%","80%","350px",P.gold,.08]]
        .map(([l,t,s,c,o],i)=>(
          <div key={i} style={{position:"absolute",left:l,top:t,width:s,height:s,
            borderRadius:"50%",background:`radial-gradient(circle,${c}${Math.round(o*255).toString(16).padStart(2,"0")} 0%,transparent 70%)`,
            filter:"blur(60px)",pointerEvents:"none"}}/>
        ))}
    </div>
  );
}

// ─── HEADER ────────────────────────────────────────────────────
const screenMeta = {
  home:{title:"VialBot CR",sub:"Tu guía al éxito en el examen"},
  learn:{title:"Aprendizaje",sub:"Gamificado y divertido"},
  chat:{title:"VialBot CR",sub:"Asistente de educación vial"},
  signs:{title:"Señales",sub:"Reconocimiento y catálogo"},
  quiz:{title:"Quiz",sub:"Pon a prueba tu conocimiento"},
};
function Header({screen}){
  const m=screenMeta[screen];
  return (
    <div style={{padding:"20px 18px 10px",display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:38,height:38,borderRadius:"50%",display:"flex",alignItems:"center",
        justifyContent:"center",fontSize:20,background:P.cyanDim,
        border:"1.5px solid rgba(0,188,212,.4)",animation:"vbGlow 3s ease infinite",flexShrink:0}}>
        🤖
      </div>
      <div>
        <div style={{fontFamily:F.head,fontSize:18,color:P.white,fontWeight:700}}>{m.title}</div>
        <div style={{fontFamily:F.body,fontSize:12,color:P.dim,lineHeight:1}}>{m.sub}</div>
      </div>
    </div>
  );
}

// ─── NAVBAR ────────────────────────────────────────────────────
const NAV=[
  {id:"home",icon:"🏠",label:"Inicio"},
  {id:"learn",icon:"🎮",label:"Aprender"},
  {id:"chat",icon:"💬",label:"VialBot"},
  {id:"signs",icon:"🚦",label:"Señales"},
  {id:"quiz",icon:"✏️",label:"Quiz"},
];
function NavBar({active,onNav}){
  return (
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
      width:"100%",maxWidth:480,zIndex:200,...gc({borderRadius:"20px 20px 0 0",
      padding:"10px 6px 14px",borderColor:"rgba(0,188,212,.2)"}),
      display:"flex",justifyContent:"space-around"}}>
      {NAV.map(n=>(
        <button key={n.id} className="vb-btn" onClick={()=>onNav(n.id)} style={{
          display:"flex",flexDirection:"column",alignItems:"center",gap:3,
          background:active===n.id?"rgba(0,188,212,.14)":"transparent",
          border:active===n.id?"1px solid rgba(0,188,212,.4)":"1px solid transparent",
          borderRadius:12,padding:"7px 14px",cursor:"pointer",
          color:active===n.id?P.cyan:P.dim,
          boxShadow:active===n.id?"0 0 18px rgba(0,188,212,.18)":"none",
          transition:"all .25s ease",
        }}>
          <span style={{fontSize:18}}>{n.icon}</span>
          <span style={{fontFamily:F.body,fontSize:10,fontWeight:700,lineHeight:1}}>{n.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── CIRCULAR PROGRESS ─────────────────────────────────────────
function Ring({pct,color,size=72}){
  const r=(size-8)/2, circ=2*Math.PI*r, off=circ*(1-pct/100);
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={4}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        style={{transition:"stroke-dashoffset 1.2s ease",filter:`drop-shadow(0 0 5px ${color})`}}/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize={12} fontWeight="700" fontFamily="Orbitron"
        style={{transform:`rotate(90deg)`,transformOrigin:`${size/2}px ${size/2}px`}}>
        {pct}%
      </text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// ─── SCREEN: HOME ──────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const topics=[
  {name:"Señales de Tránsito",done:4,total:5,color:P.cyan},
  {name:"Prioridad de Paso",done:3,total:4,color:P.violet},
  {name:"Normas de Circulación",done:2,total:4,color:P.orange},
  {name:"Límites de Velocidad",done:4,total:4,color:P.gold},
  {name:"Conducción Defensiva",done:1,total:4,color:"#00E676"},
  {name:"Seguridad Vial",done:2,total:4,color:"#FF4081"},
];
function HomeScreen(){
  const overall=Math.round(topics.reduce((a,b)=>a+b.done/b.total,0)/topics.length*100);
  return (
    <div style={{padding:"0 16px",paddingBottom:90,animation:"vbFadeIn .4s ease"}}>
      {/* Welcome + streak */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <div style={{fontFamily:F.head,fontSize:10,color:P.dim,letterSpacing:3,marginBottom:3}}>BIENVENIDO DE VUELTA</div>
          <div style={{fontFamily:F.head,fontSize:20,color:P.white,fontWeight:700}}>Fabian 👋</div>
        </div>
        <div style={{...gc({padding:"8px 14px",borderRadius:14,borderColor:"rgba(255,107,53,.3)"}),
          display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontSize:18}}>🔥</span>
          <span style={{fontFamily:F.head,fontSize:15,color:P.orange,fontWeight:700}}>7</span>
          <span style={{fontFamily:F.body,fontSize:11,color:P.dim}}>días</span>
        </div>
      </div>

      {/* Hero progress card */}
      <div className="vb-3d" style={{...card({marginBottom:18,position:"relative",overflow:"hidden",
        background:"linear-gradient(135deg,rgba(0,188,212,.13) 0%,rgba(124,58,237,.09) 100%)",
        borderColor:"rgba(0,188,212,.3)"})}}>
        <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(0,188,212,.18) 0%,transparent 70%)"}}/>
        <div style={{display:"flex",alignItems:"center",gap:18}}>
          <Ring pct={overall} color={P.cyan} size={80}/>
          <div style={{flex:1}}>
            <div style={{fontFamily:F.body,fontSize:12,color:P.dim,marginBottom:3}}>Progreso General</div>
            <div style={{fontFamily:F.head,fontSize:30,color:P.white,fontWeight:900,lineHeight:1}}>{overall}%</div>
            <div style={{fontFamily:F.body,fontSize:12,color:P.cyan,marginTop:3}}>¡Vas muy bien! Sigue así 🚀</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:F.head,fontSize:22,color:P.gold,fontWeight:700}}>1,240</div>
            <div style={{fontFamily:F.body,fontSize:10,color:P.dim}}>XP Total</div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18}}>
        {[{icon:"✅",val:"16/25",label:"Temas",c:P.cyan},{icon:"⭐",val:"Nv. 3",label:"Nivel",c:P.gold},{icon:"🏆",val:"4",label:"Badges",c:P.violet}]
          .map(s=>(
          <div key={s.label} className="vb-3d" style={{...card({padding:"14px 10px",textAlign:"center",
            borderColor:`${s.c}30`})}}>
            <div style={{fontSize:22,marginBottom:4}}>{s.icon}</div>
            <div style={{fontFamily:F.head,fontSize:14,color:s.c,fontWeight:700}}>{s.val}</div>
            <div style={{fontFamily:F.body,fontSize:10,color:P.dim}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Daily challenge */}
      <div className="vb-3d" style={{...card({marginBottom:18,
        background:"linear-gradient(135deg,rgba(255,107,53,.13) 0%,rgba(255,215,0,.07) 100%)",
        borderColor:"rgba(255,107,53,.35)"})}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontFamily:F.head,fontSize:12,color:P.orange,fontWeight:700}}>⚡ RETO DEL DÍA</div>
          <div style={{...gc({padding:"3px 10px",borderRadius:8}),fontFamily:F.body,fontSize:11,color:P.gold,fontWeight:700}}>+150 XP</div>
        </div>
        <div style={{fontFamily:F.body,fontSize:14,color:P.white,marginBottom:12,fontWeight:700}}>
          Completa el quiz de Señales con 80% o más
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1,height:6,background:"rgba(255,255,255,.08)",borderRadius:3,overflow:"hidden"}}>
            <div style={{width:"60%",height:"100%",background:`linear-gradient(90deg,${P.orange},${P.gold})`,borderRadius:3}}/>
          </div>
          <span style={{fontFamily:F.body,fontSize:12,color:P.dim}}>3/5</span>
        </div>
      </div>

      {/* Topic progress */}
      <div style={{fontFamily:F.head,fontSize:10,color:P.dim,letterSpacing:3,marginBottom:12}}>PROGRESO POR TEMA</div>
      <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
        {topics.map(t=>{
          const pct=Math.round(t.done/t.total*100);
          const tag=pct===100?"✅ Dominado":pct>=50?"📈 En progreso":"⚠️ Por mejorar";
          return (
            <div key={t.name} className="vb-3d" style={card({padding:"13px 16px"})}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                <div style={{fontFamily:F.body,fontSize:13,color:P.white,fontWeight:700}}>{t.name}</div>
                <div style={{fontFamily:F.body,fontSize:10,color:t.color}}>{tag}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1,height:4,background:"rgba(255,255,255,.07)",borderRadius:3,overflow:"hidden"}}>
                  <div style={{width:`${pct}%`,height:"100%",borderRadius:3,
                    background:`linear-gradient(90deg,${t.color},${t.color}99)`,
                    boxShadow:`0 0 8px ${t.color}55`}}/>
                </div>
                <span style={{fontFamily:F.head,fontSize:10,color:t.color,fontWeight:700,minWidth:30,textAlign:"right"}}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div style={{fontFamily:F.head,fontSize:10,color:P.dim,letterSpacing:3,marginBottom:12}}>RECOMENDACIONES</div>
      {[
        {icon:"🎯",text:"Practica 'Conducción Defensiva' — solo tienes 1/4 completado",action:"Ir ahora"},
        {icon:"📖",text:"'Normas de Circulación' necesita refuerzo antes del examen",action:"Repasar"},
      ].map((r,i)=>(
        <div key={i} style={{...card({marginBottom:10,display:"flex",alignItems:"center",gap:14,
          borderColor:"rgba(0,188,212,.15)"})}}>
          <span style={{fontSize:22}}>{r.icon}</span>
          <span style={{fontFamily:F.body,fontSize:13,color:P.white,flex:1,lineHeight:1.4}}>{r.text}</span>
          <div className="vb-btn" style={{background:P.cyanDim,border:"1px solid rgba(0,188,212,.3)",
            borderRadius:8,padding:"6px 12px",fontFamily:F.body,fontSize:11,color:P.cyan,fontWeight:700,whiteSpace:"nowrap"}}>
            {r.action}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ─── SCREEN: LEARN ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const modules=[
  {id:1,name:"Señales de Tránsito",icon:"🚦",lv:1,xp:200,done:true,color:P.cyan},
  {id:2,name:"Prioridad de Paso",icon:"🔄",lv:2,xp:180,done:true,color:P.violet},
  {id:3,name:"Normas de Circulación",icon:"🛣️",lv:2,xp:220,done:false,color:P.orange},
  {id:4,name:"Límites de Velocidad",icon:"⚡",lv:3,xp:250,done:false,locked:true,color:P.gold},
  {id:5,name:"Conducción Defensiva",icon:"🛡️",lv:4,xp:300,done:false,locked:true,color:"#00E676"},
  {id:6,name:"Seguridad Vial",icon:"🦺",lv:4,xp:280,done:false,locked:true,color:"#FF4081"},
];
const badges=[
  {icon:"🏆",name:"Primera Lección",earned:true},
  {icon:"⚡",name:"Velocista",earned:true},
  {icon:"🎯",name:"Perfecto",earned:true},
  {icon:"🔥",name:"Racha 7 días",earned:true},
  {icon:"🌟",name:"Maestro CR",earned:false},
  {icon:"🦺",name:"Experto Vial",earned:false},
];
const dragSigns=[
  {id:1,icon:"🛑",name:"ALTO",cat:"reg"},
  {id:2,icon:"⚠️",name:"Curva",cat:"prev"},
  {id:3,icon:"🔵",name:"Autopista",cat:"info"},
  {id:4,icon:"⛔",name:"Prohibido",cat:"reg"},
];
const zones=[
  {id:"reg",label:"Reglamentaria",color:P.cyan},
  {id:"prev",label:"Preventiva",color:P.orange},
  {id:"info",label:"Informativa",color:"#4CAF50"},
];
function LearnScreen(){
  const [dragId,setDragId]=useState(null);
  const [dropId,setDropId]=useState(null);
  const [result,setResult]=useState(null);
  const [placed,setPlaced]=useState({});

  const onDrop=(zoneId)=>{
    if(!dragId)return;
    const s=dragSigns.find(x=>x.id===dragId);
    const ok=s&&s.cat===zoneId;
    setResult({id:dragId,ok});
    if(ok) setPlaced(p=>({...p,[dragId]:zoneId}));
    setTimeout(()=>setResult(null),2000);
    setDragId(null); setDropId(null);
  };

  return (
    <div style={{padding:"0 16px",paddingBottom:90,animation:"vbFadeIn .4s ease"}}>
      {/* XP bar */}
      <div style={{...card({marginBottom:18,borderColor:"rgba(255,215,0,.25)"})}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontFamily:F.head,fontSize:12,color:P.gold,fontWeight:700}}>NIVEL 3</span>
            <div style={{...gc({padding:"2px 9px",borderRadius:6}),fontFamily:F.body,fontSize:10,color:P.dim}}>Aprendiz CR</div>
          </div>
          <span style={{fontFamily:F.body,fontSize:12,color:P.gold,fontWeight:700}}>1,240 / 2,000 XP</span>
        </div>
        <div style={{height:7,background:"rgba(255,255,255,.07)",borderRadius:4,overflow:"hidden"}}>
          <div style={{width:"62%",height:"100%",borderRadius:4,
            background:`linear-gradient(90deg,${P.gold},#FFA000)`,
            boxShadow:"0 0 12px rgba(255,215,0,.4)",transition:"width 1.2s ease"}}/>
        </div>
      </div>

      {/* Drag & Drop */}
      <div style={{fontFamily:F.head,fontSize:10,color:P.dim,letterSpacing:3,marginBottom:12}}>EJERCICIO: CLASIFICA LAS SEÑALES</div>
      <div style={{...card({marginBottom:20,
        background:"linear-gradient(135deg,rgba(124,58,237,.11) 0%,rgba(0,188,212,.07) 100%)",
        borderColor:"rgba(124,58,237,.25)"})}}>
        <div style={{fontFamily:F.body,fontSize:12,color:P.dim,marginBottom:14}}>
          Arrastra cada señal a su categoría:
        </div>
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
          {dragSigns.filter(s=>!placed[s.id]).map(s=>(
            <div key={s.id} draggable
              onDragStart={()=>setDragId(s.id)}
              onDragEnd={()=>setDragId(null)}
              style={{...gc({padding:"10px 14px",borderRadius:12,cursor:"grab",
                borderColor:dragId===s.id?"rgba(0,188,212,.5)":P.border}),
                display:"flex",alignItems:"center",gap:8,
                transform:dragId===s.id?"scale(1.06) rotate(2deg)":"scale(1)",
                transition:"transform .15s ease",userSelect:"none"}}>
              <span style={{fontSize:20}}>{s.icon}</span>
              <span style={{fontFamily:F.body,fontSize:11,color:P.white,fontWeight:600}}>{s.name}</span>
            </div>
          ))}
          {Object.keys(placed).length===dragSigns.length&&(
            <div style={{fontFamily:F.body,fontSize:12,color:"#00E676",padding:"10px 0"}}>
              🎉 ¡Ejercicio completado! +100 XP
            </div>
          )}
        </div>
        <div style={{display:"flex",gap:8}}>
          {zones.map(z=>(
            <div key={z.id}
              onDragOver={e=>{e.preventDefault();setDropId(z.id)}}
              onDragLeave={()=>setDropId(null)}
              onDrop={()=>onDrop(z.id)}
              style={{flex:1,minHeight:58,borderRadius:12,display:"flex",
                alignItems:"center",justifyContent:"center",flexDirection:"column",
                gap:4,padding:8,textAlign:"center",
                border:`2px dashed ${dropId===z.id?z.color:"rgba(255,255,255,.14)"}`,
                background:dropId===z.id?`${z.color}18`:"transparent",
                transition:"all .2s ease"}}>
              <span style={{fontFamily:F.body,fontSize:10,color:z.color,fontWeight:700}}>{z.label}</span>
              {Object.entries(placed).filter(([,v])=>v===z.id).map(([k])=>{
                const s=dragSigns.find(x=>x.id===parseInt(k));
                return s?(<span key={k} style={{fontSize:18}}>{s.icon}</span>):null;
              })}
            </div>
          ))}
        </div>
        {result&&(
          <div style={{marginTop:12,padding:"10px 16px",borderRadius:10,textAlign:"center",
            background:result.ok?"rgba(0,230,118,.14)":"rgba(255,87,34,.14)",
            border:`1px solid ${result.ok?"#00E676":"#FF5722"}`,
            fontFamily:F.body,fontSize:14,color:result.ok?"#00E676":"#FF5722",fontWeight:700}}>
            {result.ok?"✅ ¡Correcto! +25 XP":"❌ Inténtalo de nuevo"}
          </div>
        )}
      </div>

      {/* Modules */}
      <div style={{fontFamily:F.head,fontSize:10,color:P.dim,letterSpacing:3,marginBottom:12}}>MÓDULOS DE APRENDIZAJE</div>
      <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:20}}>
        {modules.map(m=>(
          <div key={m.id} className={m.locked?"":"vb-3d"} style={{...card({
            display:"flex",alignItems:"center",gap:14,
            borderColor:m.locked?"rgba(255,255,255,.05)":`${m.color}28`,
            opacity:m.locked?.55:1,position:"relative",overflow:"hidden"})}}>
            {m.done&&<div style={{position:"absolute",top:7,right:10,
              background:"rgba(0,230,118,.15)",borderRadius:20,padding:"2px 8px",
              fontFamily:F.body,fontSize:9,color:"#00E676",fontWeight:700}}>✓ Completado</div>}
            <div style={{width:46,height:46,borderRadius:13,display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:22,
              background:m.locked?"rgba(255,255,255,.04)":`${m.color}1A`,
              border:`1px solid ${m.locked?"rgba(255,255,255,.07)":`${m.color}3A`}`}}>
              {m.locked?"🔒":m.icon}
            </div>
            <div style={{flex:1}}>
              <div style={{fontFamily:F.body,fontSize:13,color:m.locked?P.dim:P.white,fontWeight:700,marginBottom:2}}>{m.name}</div>
              <div style={{display:"flex",gap:12}}>
                <span style={{fontFamily:F.body,fontSize:10,color:P.dim}}>Nivel {m.lv}</span>
                <span style={{fontFamily:F.body,fontSize:10,color:m.color}}>+{m.xp} XP</span>
              </div>
            </div>
            {!m.locked&&(
              <div className="vb-btn" style={{background:`${m.color}18`,
                border:`1px solid ${m.color}3A`,borderRadius:9,padding:"6px 14px",
                fontFamily:F.body,fontSize:11,color:m.color,fontWeight:700}}>
                {m.done?"Repasar":"Iniciar"}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Badges */}
      <div style={{fontFamily:F.head,fontSize:10,color:P.dim,letterSpacing:3,marginBottom:12}}>TUS INSIGNIAS</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        {badges.map(b=>(
          <div key={b.name} style={{...card({padding:"15px 10px",textAlign:"center",
            opacity:b.earned?1:.4,borderColor:b.earned?"rgba(255,215,0,.2)":"rgba(255,255,255,.05)"})}}>
            <div style={{fontSize:26,marginBottom:6,filter:b.earned?"none":"grayscale(100%)"}}>{b.icon}</div>
            <div style={{fontFamily:F.body,fontSize:10,color:b.earned?P.gold:P.dim,fontWeight:700,lineHeight:1.2}}>{b.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ─── SCREEN: CHAT ──────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const SYSTEM=`Eres VialBot CR, un asistente virtual amigable, paciente y motivador especializado en educación vial para Costa Rica. Tu misión es ayudar a los usuarios a prepararse para el examen teórico de manejo del COSEVI (Consejo de Seguridad Vial).

PERSONALIDAD: Amigable, cercano, usa lenguaje simple. Celebra aciertos, anima ante errores. NUNCA hagas sentir mal al usuario. Usa ocasionalmente emojis.

CONOCIMIENTO CLAVE:
- Señales de tránsito: ALTO (octagonal, rojo), preventivas (triangular, amarilla), informativas (rectangular, azul/verde)
- Prioridad de paso: en rotondas ceden los que entran. En cruces sin señal: cede quien viene de la izquierda
- Límites de velocidad: zona urbana 40 km/h, zonas escolares 25 km/h, autopistas 120 km/h, zona residencial 40 km/h
- Cinturón: obligatorio conductor y todos los pasajeros. Reduce 50% riesgo de muerte
- Conducción defensiva: distancia mínima 2 segundos del vehículo delante
- Uso de celular: prohibido al volante en Costa Rica

Responde SIEMPRE en español. Mantén respuestas concisas (máximo 3 párrafos). Incluye ejemplos prácticos de Costa Rica.`;

const SUGGESTIONS=["¿Qué significa la señal de ALTO?","¿Cuál es el límite en zona urbana?","¿Quién cede en la rotonda?","¿Es obligatorio el cinturón?"];

function ChatScreen(){
  const [msgs,setMsgs]=useState([
    {role:"assistant",text:"¡Hola! Soy VialBot CR 🤖, tu asistente para prepararte para el examen teórico de manejo en Costa Rica. Puedo ayudarte con señales de tránsito, normas de circulación, límites de velocidad y mucho más. ¿Qué tema te gustaría repasar hoy?"}
  ]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const endRef=useRef(null);

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"})},[msgs,loading]);

  const send=async(text)=>{
    const t=text.trim();
    if(!t||loading)return;
    setMsgs(p=>[...p,{role:"user",text:t}]);
    setInput("");
    setLoading(true);
    try{
      const history=msgs.map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}));
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:SYSTEM,
          messages:[...history,{role:"user",content:t}],
        }),
      });
      const data=await res.json();
      const reply=data.content?.[0]?.text||"Lo siento, tuve un error técnico. ¿Podés intentarlo de nuevo?";
      setMsgs(p=>[...p,{role:"assistant",text:reply}]);
    }catch{
      setMsgs(p=>[...p,{role:"assistant",text:"Mmm, tuve un problema técnico 😅. ¿Podés intentar de nuevo?"}]);
    }
    setLoading(false);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 80px)",padding:"0 16px",
      animation:"vbFadeIn .4s ease"}}>
      {/* Bot header */}
      <div style={{display:"flex",alignItems:"center",gap:14,paddingBottom:14,
        borderBottom:"1px solid rgba(255,255,255,.06)",marginBottom:12}}>
        <div style={{width:46,height:46,borderRadius:"50%",display:"flex",alignItems:"center",
          justifyContent:"center",fontSize:22,
          background:"linear-gradient(135deg,rgba(0,188,212,.3),rgba(0,188,212,.1))",
          border:"2px solid rgba(0,188,212,.5)",boxShadow:"0 0 22px rgba(0,188,212,.3)",
          animation:"vbGlow 3s ease infinite"}}>
          🤖
        </div>
        <div>
          <div style={{fontFamily:F.head,fontSize:15,color:P.white,fontWeight:700}}>VialBot CR</div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#00E676",boxShadow:"0 0 8px #00E676"}}/>
            <span style={{fontFamily:F.body,fontSize:11,color:P.dim}}>En línea</span>
          </div>
        </div>
        <div style={{marginLeft:"auto",...gc({padding:"4px 12px",borderRadius:10,borderColor:"rgba(0,188,212,.2)"}),
          fontFamily:F.body,fontSize:11,color:P.dim}}>
          🇨🇷 COSEVI
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,paddingRight:2,marginBottom:12}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",
            alignItems:"flex-end",gap:8,animation:"vbFadeIn .3s ease"}}>
            {m.role==="assistant"&&(
              <div style={{width:26,height:26,borderRadius:"50%",background:"rgba(0,188,212,.18)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>
                🤖
              </div>
            )}
            <div style={{maxWidth:"78%",padding:"12px 16px",
              borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
              background:m.role==="user"
                ?"linear-gradient(135deg,rgba(0,188,212,.22),rgba(0,188,212,.14))"
                :"rgba(255,255,255,.055)",
              border:m.role==="user"?"1px solid rgba(0,188,212,.4)":"1px solid rgba(255,255,255,.08)",
              backdropFilter:"blur(10px)",
              fontFamily:F.body,fontSize:14,color:P.white,lineHeight:1.6,
              boxShadow:m.role==="user"?"0 4px 16px rgba(0,188,212,.12)":"none",
              whiteSpace:"pre-wrap"}}>
              {m.text}
            </div>
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:"rgba(0,188,212,.18)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>
            <div style={{...gc({padding:"13px 18px",borderRadius:"18px 18px 18px 4px"}),display:"flex",gap:5,alignItems:"center"}}>
              {[0,1,2].map(i=>(
                <div key={i} style={{width:7,height:7,borderRadius:"50%",background:P.cyan,
                  animation:`vbPulse 1.2s ease ${i*.2}s infinite`}}/>
              ))}
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Suggestions */}
      {msgs.length<=2&&(
        <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:10,paddingBottom:3}}>
          {SUGGESTIONS.map(s=>(
            <button key={s} className="vb-btn" onClick={()=>send(s)} style={{
              ...gc({padding:"7px 13px",borderRadius:20,whiteSpace:"nowrap",borderColor:"rgba(0,188,212,.22)"}),
              cursor:"pointer",fontFamily:F.body,fontSize:11,color:P.cyan,
              background:"rgba(0,188,212,.08)",border:"1px solid rgba(0,188,212,.25)"}}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{display:"flex",gap:10,paddingBottom:14}}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send(input)}
          placeholder="Pregúntale a VialBot CR..."
          style={{flex:1,...gc({padding:"13px 18px",borderRadius:16}),
            border:"1px solid rgba(0,188,212,.2)",color:P.white,
            fontFamily:F.body,fontSize:14}}/>
        <button className="vb-btn" onClick={()=>send(input)} disabled={!input.trim()||loading} style={{
          width:48,height:48,borderRadius:13,flexShrink:0,
          background:input.trim()?"linear-gradient(135deg,#00BCD4,#0097A7)":"rgba(255,255,255,.07)",
          border:"none",cursor:input.trim()?"pointer":"default",
          fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:input.trim()?"0 4px 16px rgba(0,188,212,.35)":"none"}}>
          ➤
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ─── SCREEN: SIGNS ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const catalog=[
  {id:1,icon:"🛑",name:"ALTO / PARE",type:"Reglamentaria",color:"#F44336",shape:"Octagonal",
   desc:"Detén el vehículo completamente antes de la línea de pare. Verifica que no vengan otros vehículos."},
  {id:2,icon:"⛔",name:"Prohibido el Paso",type:"Reglamentaria",color:"#F44336",shape:"Circular",
   desc:"No está permitido circular en esa dirección. Multa severa por incumplimiento."},
  {id:3,icon:"⚠️",name:"Curva Peligrosa",type:"Preventiva",color:P.orange,shape:"Triangular",
   desc:"Reduce velocidad. Hay una curva cerrada adelante. Máximo 30 km/h recomendado."},
  {id:4,icon:"🚸",name:"Zona Escolar",type:"Preventiva",color:P.orange,shape:"Triangular",
   desc:"Máximo 25 km/h. Ten especial cuidado con estudiantes cruzando."},
  {id:5,icon:"🔵",name:"Autopista",type:"Informativa",color:"#2196F3",shape:"Rectangular",
   desc:"Indica inicio de autopista. Velocidad máxima 120 km/h."},
  {id:6,icon:"🅿️",name:"Estacionamiento",type:"Informativa",color:"#2196F3",shape:"Rectangular",
   desc:"Zona permitida para estacionar. Respeta el horario indicado."},
  {id:7,icon:"🚦",name:"Semáforo",type:"Reglamentaria",color:"#F44336",shape:"—",
   desc:"Rojo: detente completamente. Amarillo: precaución, prepárate a detenerte. Verde: avanza."},
  {id:8,icon:"🔄",name:"Rotonda",type:"Preventiva",color:P.orange,shape:"Circular",
   desc:"Cede el paso a los vehículos que ya circulan dentro de la rotonda."},
];

function SignsScreen(){
  const [sel,setSel]=useState(null);
  const [filter,setFilter]=useState("Todas");
  const filters=["Todas","Reglamentaria","Preventiva","Informativa"];
  const shown=filter==="Todas"?catalog:catalog.filter(s=>s.type===filter);

  return (
    <div style={{padding:"0 16px",paddingBottom:90,animation:"vbFadeIn .4s ease"}}>
      {/* Camera card */}
      <div className="vb-3d" style={{...card({marginBottom:20,textAlign:"center",
        background:"linear-gradient(135deg,rgba(0,188,212,.1) 0%,rgba(124,58,237,.08) 100%)",
        borderColor:"rgba(0,188,212,.25)"})}}>
        <div style={{fontSize:40,marginBottom:10,animation:"vbFloat 3s ease infinite"}}>📸</div>
        <div style={{fontFamily:F.head,fontSize:13,color:P.white,fontWeight:700,marginBottom:6}}>
          Reconocimiento con Cámara
        </div>
        <div style={{fontFamily:F.body,fontSize:12,color:P.dim,marginBottom:16,lineHeight:1.5}}>
          Apunta tu cámara a cualquier señal de tránsito costarricense para identificarla instantáneamente
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          {["📷 Abrir Cámara","🖼️ Subir Imagen"].map(btn=>(
            <button key={btn} className="vb-btn" style={{
              ...gc({padding:"10px 18px",borderRadius:12,borderColor:"rgba(0,188,212,.28)"}),
              cursor:"pointer",fontFamily:F.body,fontSize:12,color:P.cyan,fontWeight:700,
              background:"rgba(0,188,212,.09)"}}>
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:3}}>
        {filters.map(f=>(
          <button key={f} className="vb-btn" onClick={()=>setFilter(f)} style={{
            ...gc({padding:"7px 15px",borderRadius:20,whiteSpace:"nowrap"}),
            border:`1px solid ${filter===f?"rgba(0,188,212,.5)":"rgba(255,255,255,.07)"}`,
            background:filter===f?"rgba(0,188,212,.14)":"rgba(255,255,255,.03)",
            fontFamily:F.body,fontSize:11,color:filter===f?P.cyan:P.dim,
            fontWeight:filter===f?700:400,cursor:"pointer"}}>
            {f}
          </button>
        ))}
      </div>

      {/* Detail card */}
      {sel&&(
        <div style={{...card({marginBottom:16,
          background:`linear-gradient(135deg,${sel.color}14 0%,rgba(0,0,0,.08) 100%)`,
          borderColor:`${sel.color}40`,animation:"vbFadeIn .3s ease"})}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{width:60,height:60,borderRadius:16,display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:34,background:`${sel.color}20`,
              border:`2px solid ${sel.color}50`,boxShadow:`0 0 22px ${sel.color}30`}}>
              {sel.icon}
            </div>
            <div style={{flex:1}}>
              <div style={{fontFamily:F.head,fontSize:14,color:P.white,fontWeight:700,marginBottom:3}}>{sel.name}</div>
              <div style={{display:"flex",gap:8,marginBottom:6}}>
                <span style={{background:`${sel.color}20`,border:`1px solid ${sel.color}40`,
                  borderRadius:8,padding:"2px 8px",fontFamily:F.body,fontSize:10,color:sel.color}}>{sel.type}</span>
                <span style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",
                  borderRadius:8,padding:"2px 8px",fontFamily:F.body,fontSize:10,color:P.dim}}>{sel.shape}</span>
              </div>
              <div style={{fontFamily:F.body,fontSize:12,color:P.dim,lineHeight:1.5}}>{sel.desc}</div>
            </div>
          </div>
          <button className="vb-btn" onClick={()=>setSel(null)} style={{
            marginTop:12,width:"100%",...gc({padding:"8px",borderRadius:10}),
            border:"1px solid rgba(255,255,255,.09)",cursor:"pointer",
            fontFamily:F.body,fontSize:12,color:P.dim}}>
            ✕ Cerrar
          </button>
        </div>
      )}

      {/* Grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {shown.map(s=>(
          <div key={s.id} className="vb-3d" onClick={()=>setSel(sel?.id===s.id?null:s)} style={{
            ...card({padding:"16px 14px",cursor:"pointer",textAlign:"center",
              borderColor:sel?.id===s.id?`${s.color}55`:"rgba(255,255,255,.07)"}),
            transform:sel?.id===s.id?"scale(.97)":"scale(1)"}}>
            <div style={{fontSize:34,marginBottom:8}}>{s.icon}</div>
            <div style={{fontFamily:F.body,fontSize:12,color:P.white,fontWeight:700,marginBottom:5,lineHeight:1.2}}>{s.name}</div>
            <div style={{display:"inline-block",padding:"2px 10px",borderRadius:20,
              background:`${s.color}1A`,border:`1px solid ${s.color}38`,
              fontFamily:F.body,fontSize:9,color:s.color}}>{s.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ─── SCREEN: QUIZ ──────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const QQ=[
  {q:"¿Cuál es el límite de velocidad en zona urbana en Costa Rica?",
   opts:["60 km/h","40 km/h","50 km/h","80 km/h"],c:1,
   exp:"En zonas urbanas el límite es 40 km/h según el Reglamento de Tránsito de Costa Rica."},
  {q:"¿Qué forma tiene la señal de ALTO (PARE)?",
   opts:["Triangular","Circular","Octagonal","Cuadrada"],c:2,
   exp:"La señal de ALTO es octagonal y de color rojo, única en su forma para ser reconocida fácilmente en cualquier condición."},
  {q:"¿Quién tiene prioridad de paso en una rotonda?",
   opts:["El que entra primero","Los dentro de la rotonda","El que viene de la derecha","Los vehículos más grandes"],c:1,
   exp:"Los vehículos que ya circulan dentro de la rotonda tienen la prioridad. Quien ingresa debe ceder el paso."},
  {q:"¿Cuál es el límite de velocidad en zona escolar?",
   opts:["30 km/h","40 km/h","25 km/h","20 km/h"],c:2,
   exp:"En zonas escolares el límite es de 25 km/h para proteger a los estudiantes."},
  {q:"El cinturón de seguridad es obligatorio para:",
   opts:["Solo el conductor","Conductor y asiento delantero","Conductor y todos los pasajeros","Solo en autopistas"],c:2,
   exp:"El cinturón es obligatorio para el conductor Y TODOS los pasajeros. Reduce hasta un 50% el riesgo de muerte."},
  {q:"¿Cuántos segundos de distancia mínima debe mantener con el vehículo de adelante?",
   opts:["1 segundo","2 segundos","3 segundos","5 segundos"],c:1,
   exp:"La regla de los 2 segundos es la mínima recomendada. Con lluvia o mal tiempo, duplica esa distancia."},
];

function QuizScreen(){
  const [curr,setCurr]=useState(0);
  const [sel,setSel]=useState(null);
  const [score,setScore]=useState(0);
  const [hist,setHist]=useState([]);
  const [done,setDone]=useState(false);

  const q=QQ[curr];

  const answer=(i)=>{
    if(sel!==null)return;
    setSel(i);
    const ok=i===q.c;
    if(ok)setScore(s=>s+1);
    setHist(h=>[...h,{ok}]);
  };

  const next=()=>{
    if(curr<QQ.length-1){setCurr(c=>c+1);setSel(null);}
    else setDone(true);
  };

  const reset=()=>{setCurr(0);setSel(null);setScore(0);setHist([]);setDone(false);};

  if(done){
    const pct=Math.round(score/QQ.length*100);
    const pass=pct>=70;
    return (
      <div style={{padding:"20px 16px",paddingBottom:90,textAlign:"center",animation:"vbFadeIn .4s ease"}}>
        <div style={{fontSize:72,marginBottom:16,animation:"vbFloat 3s ease infinite"}}>{pass?"🏆":"📚"}</div>
        <div style={{fontFamily:F.head,fontSize:32,color:pass?P.gold:P.orange,fontWeight:900,marginBottom:8}}>{pct}%</div>
        <div style={{fontFamily:F.head,fontSize:14,color:P.white,marginBottom:6}}>
          {pass?"¡Excelente resultado!":"Sigue practicando"}
        </div>
        <div style={{fontFamily:F.body,fontSize:14,color:P.dim,marginBottom:28}}>
          {score} de {QQ.length} respuestas correctas
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:28,flexWrap:"wrap"}}>
          {hist.map((h,i)=>(
            <div key={i} style={{width:34,height:34,borderRadius:8,display:"flex",alignItems:"center",
              justifyContent:"center",background:h.ok?"rgba(0,230,118,.18)":"rgba(255,87,34,.18)",
              border:`1px solid ${h.ok?"#00E676":"#FF5722"}`,
              fontFamily:F.head,fontSize:11,color:h.ok?"#00E676":"#FF5722",fontWeight:700}}>
              {i+1}
            </div>
          ))}
        </div>
        {pass&&(
          <div style={{...card({marginBottom:24,
            background:"rgba(255,215,0,.09)",borderColor:"rgba(255,215,0,.3)"})}}>
            <div style={{fontFamily:F.head,fontSize:12,color:P.gold,textAlign:"center"}}>
              🌟 +{pct>=100?200:pct>=80?150:100} XP Ganados
            </div>
          </div>
        )}
        <button className="vb-btn" onClick={reset} style={{
          background:"linear-gradient(135deg,#00BCD4,#0097A7)",
          border:"none",borderRadius:14,padding:"14px 40px",cursor:"pointer",
          fontFamily:F.head,fontSize:13,color:"white",fontWeight:700,
          boxShadow:"0 4px 20px rgba(0,188,212,.4)"}}>
          🔄 Intentar de Nuevo
        </button>
      </div>
    );
  }

  return (
    <div style={{padding:"0 16px",paddingBottom:90,animation:"vbFadeIn .4s ease"}}>
      {/* Progress */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div style={{fontFamily:F.head,fontSize:11,color:P.dim}}>Pregunta {curr+1}/{QQ.length}</div>
        <div style={{display:"flex",gap:5}}>
          {QQ.map((_,i)=>(
            <div key={i} style={{width:22,height:5,borderRadius:3,
              background:i<curr?P.cyan:i===curr?P.cyan:"rgba(255,255,255,.14)",
              opacity:i===curr?1:i<curr?.8:.3,
              boxShadow:i===curr?`0 0 8px ${P.cyan}`:"none"}}/>
          ))}
        </div>
        <div style={{fontFamily:F.head,fontSize:12,color:P.gold}}>⭐ {score*20} XP</div>
      </div>

      {/* Question card */}
      <div className="vb-3d" style={{...card({marginBottom:22,minHeight:100,display:"flex",
        alignItems:"center",
        background:"linear-gradient(135deg,rgba(0,188,212,.11) 0%,rgba(124,58,237,.07) 100%)",
        borderColor:"rgba(0,188,212,.25)"})}}>
        <div style={{fontFamily:F.body,fontSize:16,color:P.white,lineHeight:1.55,fontWeight:700}}>
          {q.q}
        </div>
      </div>

      {/* Options */}
      <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:18}}>
        {q.opts.map((opt,i)=>{
          let bg="rgba(255,255,255,.04)",border="1px solid rgba(255,255,255,.09)",color=P.white,pre=String.fromCharCode(65+i);
          if(sel!==null){
            if(i===q.c){bg="rgba(0,230,118,.13)";border="1px solid rgba(0,230,118,.5)";color="#00E676";pre="✓";}
            else if(i===sel){bg="rgba(255,87,34,.13)";border="1px solid rgba(255,87,34,.5)";color="#FF5722";pre="✗";}
          }
          return (
            <button key={i} onClick={()=>answer(i)} style={{
              ...gc({padding:"15px 18px",borderRadius:13,display:"flex",alignItems:"center",
                gap:14,cursor:sel!==null?"default":"pointer",textAlign:"left",width:"100%"}),
              border,background:bg,transition:"all .3s ease",
              boxShadow:sel!==null&&i===q.c?"0 0 18px rgba(0,230,118,.18)":"none"}}>
              <div style={{width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",
                justifyContent:"center",background:"rgba(255,255,255,.06)",
                fontFamily:F.head,fontSize:12,color,fontWeight:700,flexShrink:0}}>
                {pre}
              </div>
              <span style={{fontFamily:F.body,fontSize:14,color,lineHeight:1.35}}>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {sel!==null&&(
        <div style={{...card({marginBottom:16,animation:"vbFadeIn .35s ease",
          background:sel===q.c?"rgba(0,230,118,.09)":"rgba(255,107,53,.09)",
          borderColor:sel===q.c?"rgba(0,230,118,.35)":"rgba(255,107,53,.35)"})}}>
          <div style={{fontFamily:F.head,fontSize:11,color:sel===q.c?"#00E676":P.orange,marginBottom:7}}>
            {sel===q.c?"✅ ¡CORRECTO!":"❌ RESPUESTA INCORRECTA"}
          </div>
          <div style={{fontFamily:F.body,fontSize:13,color:P.white,lineHeight:1.55}}>
            💡 {q.exp}
          </div>
        </div>
      )}

      {sel!==null&&(
        <button className="vb-btn" onClick={next} style={{
          width:"100%",background:"linear-gradient(135deg,#00BCD4,#0097A7)",
          border:"none",borderRadius:14,padding:"15px",cursor:"pointer",
          fontFamily:F.head,fontSize:13,color:"white",fontWeight:700,
          boxShadow:"0 4px 20px rgba(0,188,212,.38)",animation:"vbFadeIn .3s ease"}}>
          {curr<QQ.length-1?"Siguiente Pregunta →":"Ver Resultados 🏆"}
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ─── ROOT ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const SCREENS={home:HomeScreen,learn:LearnScreen,chat:ChatScreen,signs:SignsScreen,quiz:QuizScreen};

export default function App(){
  const [screen,setScreen]=useState("home");
  useEffect(()=>{ injectAssets(); },[]);

  const Scr=SCREENS[screen];
  return (
    <div style={{minHeight:"100vh",background:"transparent",color:P.white,
      fontFamily:F.body,position:"relative",maxWidth:480,margin:"0 auto",overflowX:"hidden"}}>
      <Background/>
      <div style={{position:"relative",zIndex:1,minHeight:"100vh"}}>
        <Header screen={screen}/>
        <Scr/>
      </div>
      <NavBar active={screen} onNav={setScreen}/>
    </div>
  );
}
