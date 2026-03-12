import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { TEXT, SERVICES } from "../lib/constants";

export default function Dashboard({ lang }) {
  const t = TEXT[lang];
  const isRTL = lang === "ar";
  const [user,      setUser]      = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobile,  setIsMobile]  = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user));
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/"); };
  const isWorker = user?.user_metadata?.role === "worker";

  const tabs = isWorker
    ? [["overview", isRTL?"نظرة عامة":"Aperçu"], ["requests", isRTL?"الطلبات":"Demandes"], ["profile", isRTL?"ملفي":"Mon profil"]]
    : [["overview", isRTL?"نظرة عامة":"Aperçu"], ["bookings", isRTL?"حجوزاتي":"Mes réservations"], ["settings", isRTL?"الإعدادات":"Paramètres"]];

  return (
    <div style={st.page} dir={isRTL ? "rtl" : "ltr"}>
      {/* Sidebar */}
      {!isMobile && (
        <aside style={st.sidebar}>
          <div style={st.sideTop}>
            <div style={st.logo} onClick={() => navigate("/")}>صانع.ma</div>
            <div style={st.userCard}>
              <div style={st.avatar}>{user?.user_metadata?.full_name?.[0] || "U"}</div>
              <div>
                <div style={st.userName}>{user?.user_metadata?.full_name || "User"}</div>
                <div style={st.userRole}>{isWorker ? (isRTL?"حرفي":"Artisan") : (isRTL?"عميل":"Client")}</div>
              </div>
            </div>
            <nav style={st.nav}>
              {tabs.map(([id, label]) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  style={{ ...st.navItem, ...(activeTab===id ? st.navActive : {}) }}>
                  {label}
                </button>
              ))}
            </nav>
          </div>
          <div style={st.sideBottom}>
            <button style={st.sideBtn} onClick={() => navigate("/")}>{isRTL ? "← العودة للموقع" : "← Retour au site"}</button>
            <button style={{ ...st.sideBtn, color:"#ef4444" }} onClick={handleLogout}>{t.logout}</button>
          </div>
        </aside>
      )}

      <main style={st.main}>
        {/* Mobile header */}
        {isMobile && (
          <div style={st.mobileHeader}>
            <span style={st.logo}>صانع.ma</span>
            <button onClick={handleLogout} style={st.mobileLogout}>{t.logout}</button>
          </div>
        )}
        {isMobile && (
          <div style={st.mobileTabs}>
            {tabs.map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)}
                style={{ ...st.mobileTab, ...(activeTab===id ? st.mobileTabActive : {}) }}>{label}</button>
            ))}
          </div>
        )}

        <div style={st.content}>
          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div>
              <h1 style={st.pageTitle}>
                {isRTL ? `مرحباً ${user?.user_metadata?.full_name?.split(" ")[0] || ""} 👋` : `Bonjour ${user?.user_metadata?.full_name?.split(" ")[0] || ""} 👋`}
              </h1>
              <div style={{ display:"grid", gridTemplateColumns: isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:16, marginTop:24, marginBottom:32 }}>
                {(isWorker ? [
                  [isRTL?"طلب جديد":"Nouvelles demandes", "3", "#16a34a"],
                  [isRTL?"المكتملة":"Terminés", "24", "#2563eb"],
                  [isRTL?"تقييمي":"Ma note", "4.8 ⭐", "#f59e0b"],
                  [isRTL?"أرباحي":"Mes gains", "2,400 MAD", "#8b5cf6"],
                ] : [
                  [isRTL?"حجوزاتي":"Mes réservations", "5", "#16a34a"],
                  [isRTL?"المكتملة":"Terminées", "12", "#2563eb"],
                  [isRTL?"المفضلة":"Favoris", "8", "#f59e0b"],
                  [isRTL?"تقييماتي":"Mes avis", "7", "#8b5cf6"],
                ]).map(([label, val, color]) => (
                  <div key={label} style={st.statCard}>
                    <div style={{ fontSize:28, fontWeight:800, color }}>{val}</div>
                    <div style={{ fontSize:13, color:"#6b7280", marginTop:4 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Recent activity */}
              <div style={st.card}>
                <h3 style={st.cardTitle}>{isRTL ? "آخر النشاطات" : "Activité récente"}</h3>
                {[
                  [isRTL?"طلب سباكة - الدار البيضاء":"Demande plomberie - Casablanca", isRTL?"منذ ساعتين":"Il y a 2h", "#16a34a"],
                  [isRTL?"تقييم جديد ⭐ 5/5":"Nouvel avis ⭐ 5/5", isRTL?"منذ 5 ساعات":"Il y a 5h", "#f59e0b"],
                  [isRTL?"مكالمة هاتفية من عميل":"Appel d'un client", isRTL?"أمس":"Hier", "#2563eb"],
                ].map(([text, time, color], i) => (
                  <div key={i} style={st.actRow}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:color, flexShrink:0 }} />
                    <span style={{ flex:1, fontSize:14, color:"#374151" }}>{text}</span>
                    <span style={{ fontSize:12, color:"#9ca3af" }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BOOKINGS / REQUESTS ── */}
          {(activeTab === "bookings" || activeTab === "requests") && (
            <div>
              <h1 style={st.pageTitle}>{isRTL ? (isWorker ? "الطلبات الواردة" : "حجوزاتي") : (isWorker ? "Demandes reçues" : "Mes réservations")}</h1>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:24 }}>
                {[
                  { service:"plumber",     client: isRTL?"محمد الأمين":"Mohamed Amine", date:"12 Mar 2025", status:"pending",   price:"250 MAD" },
                  { service:"electrician", client: isRTL?"فاطمة الزهراء":"Fatima Zahra", date:"10 Mar 2025", status:"completed", price:"400 MAD" },
                  { service:"cleaner",     client: isRTL?"يوسف بنعلي":"Youssef Benali", date:"8 Mar 2025",  status:"cancelled", price:"150 MAD" },
                ].map((b, i) => {
                  const svc = SERVICES.find(s => s.id === b.service) || {};
                  const statusColors = { pending:"#f59e0b", completed:"#16a34a", cancelled:"#ef4444" };
                  const statusLabels = {
                    pending:   isRTL ? "قيد الانتظار" : "En attente",
                    completed: isRTL ? "مكتمل" : "Terminé",
                    cancelled: isRTL ? "ملغي" : "Annulé",
                  };
                  return (
                    <div key={i} style={st.bookingCard}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                          <span style={{ fontSize:28 }}>{svc.icon}</span>
                          <div>
                            <div style={{ fontSize:15, fontWeight:700, color:"#111827" }}>{isRTL ? svc.ar : svc.fr}</div>
                            <div style={{ fontSize:13, color:"#6b7280" }}>{b.client} · {b.date}</div>
                          </div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                          <span style={{ fontSize:14, fontWeight:700, color:"#374151" }}>{b.price}</span>
                          <span style={{ fontSize:12, padding:"4px 12px", borderRadius:999, background:statusColors[b.status]+"20", color:statusColors[b.status], fontWeight:600 }}>
                            {statusLabels[b.status]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── SETTINGS / PROFILE ── */}
          {(activeTab === "settings" || activeTab === "profile") && (
            <div>
              <h1 style={st.pageTitle}>{isRTL ? "الإعدادات" : "Paramètres"}</h1>
              <div style={{ display:"flex", flexDirection:"column", gap:16, marginTop:24 }}>
                {[
                  [isRTL?"الاسم الكامل":"Nom complet", user?.user_metadata?.full_name || ""],
                  [isRTL?"البريد الإلكتروني":"Email", user?.email || ""],
                  [isRTL?"رقم الهاتف":"Téléphone", "+212"],
                  [isRTL?"المدينة":"Ville", "الدار البيضاء"],
                ].map(([label, val], i) => (
                  <div key={i} style={st.card}>
                    <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:8 }}>{label}</label>
                    <input defaultValue={val} style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"12px 14px", fontSize:15, color:"#111827", fontFamily:"'Cairo',sans-serif", outline:"none" }} />
                  </div>
                ))}
                <button style={{ background:"#16a34a", color:"#fff", border:"none", padding:"14px", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Cairo',sans-serif" }}>
                  {isRTL ? "حفظ التغييرات" : "Sauvegarder"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const st = {
  page:         { fontFamily:"'Cairo',sans-serif", background:"#f9fafb", color:"#111827", minHeight:"100vh", display:"flex" },
  sidebar:      { width:240, background:"#fff", borderRight:"1px solid #e5e7eb", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"28px 0", position:"sticky", top:0, height:"100vh", flexShrink:0 },
  sideTop:      { padding:"0 20px", display:"flex", flexDirection:"column", gap:0 },
  logo:         { fontSize:20, fontWeight:800, color:"#16a34a", marginBottom:24, cursor:"pointer" },
  userCard:     { display:"flex", gap:10, alignItems:"center", background:"#f0fdf4", borderRadius:12, padding:"12px", marginBottom:24 },
  avatar:       { width:38, height:38, borderRadius:"50%", background:"#16a34a", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, flexShrink:0 },
  userName:     { fontSize:14, fontWeight:700, color:"#111827" },
  userRole:     { fontSize:12, color:"#16a34a", fontWeight:600 },
  nav:          { display:"flex", flexDirection:"column", gap:4 },
  navItem:      { background:"none", border:"none", color:"#6b7280", fontSize:14, padding:"10px 12px", borderRadius:10, cursor:"pointer", textAlign:"right", fontFamily:"'Cairo',sans-serif", transition:"all 0.2s" },
  navActive:    { background:"#f0fdf4", color:"#16a34a", fontWeight:700 },
  sideBottom:   { padding:"0 20px", display:"flex", flexDirection:"column", gap:8 },
  sideBtn:      { background:"none", border:"none", color:"#6b7280", fontSize:13, padding:"8px 12px", textAlign:"right", cursor:"pointer", fontFamily:"'Cairo',sans-serif" },
  main:         { flex:1, overflow:"auto" },
  mobileHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 24px", background:"#fff", borderBottom:"1px solid #e5e7eb" },
  mobileLogout: { background:"#fef2f2", border:"none", color:"#ef4444", padding:"8px 14px", borderRadius:8, fontSize:13, cursor:"pointer", fontFamily:"'Cairo',sans-serif" },
  mobileTabs:   { display:"flex", overflowX:"auto", background:"#fff", borderBottom:"1px solid #e5e7eb" },
  mobileTab:    { background:"none", border:"none", color:"#6b7280", fontSize:13, padding:"14px 16px", cursor:"pointer", fontFamily:"'Cairo',sans-serif", whiteSpace:"nowrap", borderBottom:"2px solid transparent" },
  mobileTabActive:{ color:"#16a34a", borderBottom:"2px solid #16a34a", fontWeight:700 },
  content:      { padding:"32px 40px", maxWidth:960 },
  pageTitle:    { fontSize:"clamp(22px,4vw,32px)", fontWeight:800, marginBottom:4 },
  statCard:     { background:"#fff", borderRadius:12, padding:"20px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" },
  card:         { background:"#fff", borderRadius:12, padding:"20px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" },
  cardTitle:    { fontSize:16, fontWeight:700, marginBottom:16, color:"#111827" },
  actRow:       { display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid #f3f4f6" },
  bookingCard:  { background:"#fff", borderRadius:12, padding:"20px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" },
};
