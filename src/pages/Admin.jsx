import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TEXT, SERVICES, MOCK_WORKERS, MOCK_BOOKINGS } from "../lib/constants";

export default function Admin({ lang }) {
  const t = TEXT[lang];
  const isRTL = lang === "ar";
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [workers, setWorkers] = useState(MOCK_WORKERS);
  const [bookings] = useState(MOCK_BOOKINGS);
  const [search, setSearch] = useState("");

  const toggleVerification = (workerId) => {
    setWorkers(prev => prev.map(w =>
      w.id === workerId ? { ...w, verified: !w.verified } : w
    ));
  };

  const filteredWorkers = workers.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.city.includes(search)
  );

  const stats = {
    totalWorkers: workers.length,
    verified: workers.filter(w => w.verified).length,
    pending: workers.filter(w => !w.verified).length,
    totalBookings: bookings.length,
  };

  const tabs = [
    ["overview", isRTL ? "نظرة عامة" : "Vue d'ensemble"],
    ["workers", isRTL ? "الحرفيون" : "Artisans"],
    ["bookings", isRTL ? "الحجوزات" : "Réservations"],
    ["sms", isRTL ? "SMS / Twilio" : "SMS / Twilio"],
  ];

  return (
    <div style={st.page} dir={isRTL ? "rtl" : "ltr"}>
      {/* Sidebar */}
      <aside style={st.sidebar}>
        <div style={st.sideTop}>
          <div style={st.sideTitle}>
            <span style={{ fontSize:20 }}>🛡️</span>
            <span>{isRTL ? "لوحة الإدارة" : "Admin Panel"}</span>
          </div>
          <nav style={st.nav}>
            {tabs.map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)}
                style={{ ...st.navBtn, ...(activeTab === id ? st.navBtnActive : {}) }}>
                {label}
              </button>
            ))}
          </nav>
        </div>
        <button style={st.backBtn} onClick={() => navigate("/dashboard")}>
          {isRTL ? "← العودة" : "← Retour"}
        </button>
      </aside>

      {/* Main */}
      <main style={st.main}>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <h1 style={st.pageTitle}>{isRTL ? "نظرة عامة" : "Vue d'ensemble"}</h1>
            <div style={st.statsGrid}>
              {[
                ["👷", isRTL?"إجمالي الحرفيين":"Total artisans", stats.totalWorkers, "#2563eb"],
                ["✅", isRTL?"الموثقون":"Vérifiés", stats.verified, "#16a34a"],
                ["⏳", isRTL?"في الانتظار":"En attente", stats.pending, "#f59e0b"],
                ["📅", isRTL?"الحجوزات":"Réservations", stats.totalBookings, "#8b5cf6"],
              ].map(([icon, label, val, color]) => (
                <div key={label} style={st.statCard}>
                  <div style={{ fontSize:32, marginBottom:8 }}>{icon}</div>
                  <div style={{ fontSize:36, fontWeight:800, color }}>{val}</div>
                  <div style={{ fontSize:13, color:"#6b7280", marginTop:4 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Pending verifications */}
            <div style={st.card}>
              <h3 style={st.cardTitle}>
                ⏳ {isRTL ? "طلبات التوثيق المعلقة" : "Demandes de vérification en attente"}
              </h3>
              {workers.filter(w => !w.verified).map(w => {
                const svc = SERVICES.find(s => s.id === w.service) || {};
                return (
                  <div key={w.id} style={st.workerRow}>
                    <div style={{ ...st.miniAvatar, background: svc.color + "22", color: svc.color }}>
                      {w.name[0]}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:15, fontWeight:700 }}>{w.name}</div>
                      <div style={{ fontSize:13, color:"#6b7280" }}>{svc.icon} {isRTL ? svc.ar : svc.fr} · {w.city}</div>
                    </div>
                    <button style={st.verifyBtn} onClick={() => toggleVerification(w.id)}>
                      ✓ {isRTL ? "توثيق" : "Vérifier"}
                    </button>
                  </div>
                );
              })}
              {workers.filter(w => !w.verified).length === 0 && (
                <p style={{ color:"#6b7280", fontSize:14, textAlign:"center", padding:20 }}>
                  {isRTL ? "لا توجد طلبات معلقة ✅" : "Aucune demande en attente ✅"}
                </p>
              )}
            </div>
          </div>
        )}

        {/* WORKERS */}
        {activeTab === "workers" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12 }}>
              <h1 style={st.pageTitle}>{isRTL ? "إدارة الحرفيين" : "Gestion des artisans"}</h1>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={isRTL ? "بحث..." : "Rechercher..."}
                style={st.searchInput}
              />
            </div>
            <div style={st.tableWrap}>
              <table style={st.table}>
                <thead>
                  <tr style={st.theadRow}>
                    {["#", isRTL?"الاسم":"Nom", isRTL?"الخدمة":"Service", isRTL?"التقييم":"Note", isRTL?"الحالة":"Statut", isRTL?"التوثيق":"Vérification", isRTL?"إجراءات":"Actions"].map(h => (
                      <th key={h} style={st.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkers.map((w, i) => {
                    const svc = SERVICES.find(s => s.id === w.service) || {};
                    return (
                      <tr key={w.id} style={{ ...st.tr, background: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                        <td style={st.td}>{w.id}</td>
                        <td style={st.td}>
                          <div style={{ fontWeight:700 }}>{w.name}</div>
                          <div style={{ fontSize:12, color:"#6b7280" }}>{w.phone}</div>
                        </td>
                        <td style={st.td}>{svc.icon} {isRTL ? svc.ar : svc.fr}</td>
                        <td style={st.td}>⭐ {w.rating}</td>
                        <td style={st.td}>
                          <span style={{ background: w.available ? "#dcfce7" : "#fee2e2", color: w.available ? "#16a34a" : "#ef4444", padding:"4px 10px", borderRadius:999, fontSize:12, fontWeight:600 }}>
                            {w.available ? (isRTL ? "متاح" : "Dispo") : (isRTL ? "مشغول" : "Occupé")}
                          </span>
                        </td>
                        <td style={st.td}>
                          <span style={{ background: w.verified ? "#dcfce7" : "#fef9c3", color: w.verified ? "#16a34a" : "#92400e", padding:"4px 10px", borderRadius:999, fontSize:12, fontWeight:600 }}>
                            {w.verified ? "✓ " + (isRTL ? "موثق" : "Vérifié") : "⏳ " + (isRTL ? "معلق" : "En attente")}
                          </span>
                        </td>
                        <td style={st.td}>
                          <div style={{ display:"flex", gap:8 }}>
                            <button style={st.actionBtn} onClick={() => navigate(`/worker/${w.id}`)}>
                              👁️
                            </button>
                            <button
                              style={{ ...st.actionBtn, background: w.verified ? "#fef2f2" : "#f0fdf4", color: w.verified ? "#ef4444" : "#16a34a" }}
                              onClick={() => toggleVerification(w.id)}>
                              {w.verified ? "✗" : "✓"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <div>
            <h1 style={st.pageTitle}>{isRTL ? "جميع الحجوزات" : "Toutes les réservations"}</h1>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:24 }}>
              {bookings.map((b, i) => {
                const svc = SERVICES.find(s => s.id === b.service) || {};
                const statusColors = { pending:"#f59e0b", confirmed:"#2563eb", completed:"#16a34a", cancelled:"#ef4444" };
                const statusLabels = {
                  pending:   isRTL ? "قيد الانتظار" : "En attente",
                  confirmed: isRTL ? "مؤكد" : "Confirmé",
                  completed: isRTL ? "مكتمل" : "Terminé",
                  cancelled: isRTL ? "ملغي" : "Annulé",
                };
                const w = MOCK_WORKERS.find(w => w.id === b.worker_id);
                return (
                  <div key={b.id} style={st.bookingCard}>
                    <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                      <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                        <span style={{ fontSize:28 }}>{svc.icon}</span>
                        <div>
                          <div style={{ fontWeight:700, fontSize:15 }}>{b.client_name}</div>
                          <div style={{ fontSize:13, color:"#6b7280" }}>
                            {isRTL ? "الحرفي:" : "Artisan:"} {w?.name} · {b.date} {b.time}
                          </div>
                          <div style={{ fontSize:13, color:"#374151", marginTop:4 }}>
                            {isRTL ? b.notes_ar : b.notes_fr}
                          </div>
                        </div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                        <span style={{ fontSize:12, padding:"4px 12px", borderRadius:999, background:statusColors[b.status]+"20", color:statusColors[b.status], fontWeight:600 }}>
                          {statusLabels[b.status]}
                        </span>
                        <span style={{ fontWeight:700, color:"#374151" }}>{b.price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SMS / TWILIO */}
        {activeTab === "sms" && (
          <div>
            <h1 style={st.pageTitle}>📱 SMS / Twilio</h1>
            <div style={{ display:"flex", flexDirection:"column", gap:16, marginTop:24 }}>

              <div style={st.card}>
                <h3 style={st.cardTitle}>{isRTL ? "إعداد Twilio" : "Configuration Twilio"}</h3>
                <p style={{ fontSize:14, color:"#6b7280", marginBottom:20, lineHeight:1.7 }}>
                  {isRTL
                    ? "لتفعيل إرسال SMS، يجب إضافة مفاتيح Twilio في ملف .env وإنشاء endpoint في الخادم."
                    : "Pour activer l'envoi de SMS, ajoutez vos clés Twilio dans le fichier .env et créez un endpoint côté serveur."}
                </p>
                {[
                  ["REACT_APP_TWILIO_ACCOUNT_SID", "ACxxxxxxxxxxxxxxxxxx"],
                  ["REACT_APP_TWILIO_AUTH_TOKEN", "your-auth-token"],
                  ["REACT_APP_TWILIO_PHONE", "+1xxxxxxxxxx"],
                ].map(([key, val]) => (
                  <div key={key} style={{ marginBottom:12 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>{key}</label>
                    <input defaultValue={val} style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, fontFamily:"monospace", color:"#374151", background:"#f9fafb" }} readOnly />
                  </div>
                ))}
              </div>

              <div style={st.card}>
                <h3 style={st.cardTitle}>{isRTL ? "إرسال SMS تجريبي" : "Envoyer un SMS de test"}</h3>
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>
                    {isRTL ? "رقم الهاتف" : "Numéro de téléphone"}
                  </label>
                  <input defaultValue="+212600000001" style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:14, fontFamily:"'Cairo',sans-serif" }} />
                </div>
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>
                    {isRTL ? "نص الرسالة" : "Message"}
                  </label>
                  <textarea
                    defaultValue={isRTL ? "مرحباً، تم تأكيد حجزك في صانع.ma" : "Bonjour, votre réservation sur Sani3.ma est confirmée"}
                    style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:14, fontFamily:"'Cairo',sans-serif", minHeight:80, resize:"vertical" }}
                  />
                </div>
                <button style={{ background:"#16a34a", color:"#fff", border:"none", padding:"12px 24px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}
                  onClick={() => alert(isRTL ? "✅ تم الإرسال! (مثال - أضف مفاتيح Twilio الحقيقية)" : "✅ Envoyé! (Demo - Ajoutez vos vraies clés Twilio)")}>
                  📱 {isRTL ? "إرسال SMS" : "Envoyer SMS"}
                </button>
              </div>

              <div style={{ ...st.card, background:"#f0fdf4", border:"1px solid #86efac" }}>
                <h3 style={{ ...st.cardTitle, color:"#16a34a" }}>
                  {isRTL ? "📋 كود الخادم (Node.js)" : "📋 Code serveur (Node.js)"}
                </h3>
                <pre style={{ fontSize:12, color:"#374151", overflowX:"auto", lineHeight:1.7, fontFamily:"monospace" }}>{`
// backend/sms.js
const twilio = require('twilio');
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.post('/api/send-sms', async (req, res) => {
  const { to, message } = req.body;
  const msg = await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to: to
  });
  res.json({ success: true, sid: msg.sid });
});
`.trim()}</pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const st = {
  page:       { fontFamily:"'Cairo',sans-serif", display:"flex", minHeight:"calc(100vh - 65px)", color:"#111827" },
  sidebar:    { width:220, background:"#111827", color:"#fff", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"24px 0", flexShrink:0 },
  sideTop:    { padding:"0 16px" },
  sideTitle:  { display:"flex", alignItems:"center", gap:8, fontSize:16, fontWeight:700, marginBottom:24, color:"#fff" },
  nav:        { display:"flex", flexDirection:"column", gap:4 },
  navBtn:     { background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:14, padding:"10px 12px", borderRadius:8, cursor:"pointer", textAlign:"right", fontFamily:"'Cairo',sans-serif", transition:"all 0.2s" },
  navBtnActive:{ background:"rgba(255,255,255,0.1)", color:"#fff", fontWeight:700 },
  backBtn:    { background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:13, padding:"12px 16px", cursor:"pointer", fontFamily:"'Cairo',sans-serif", textAlign:"right" },
  main:       { flex:1, padding:"32px 40px", background:"#f9fafb", overflowY:"auto" },
  pageTitle:  { fontSize:26, fontWeight:800, marginBottom:24 },
  statsGrid:  { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:16, marginBottom:24 },
  statCard:   { background:"#fff", borderRadius:16, padding:24, boxShadow:"0 2px 8px rgba(0,0,0,0.05)", textAlign:"center" },
  card:       { background:"#fff", borderRadius:16, padding:24, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" },
  cardTitle:  { fontSize:16, fontWeight:700, marginBottom:16, color:"#111827" },
  workerRow:  { display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:"1px solid #f3f4f6" },
  miniAvatar: { width:40, height:40, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, flexShrink:0 },
  verifyBtn:  { background:"#16a34a", color:"#fff", border:"none", padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" },
  tableWrap:  { background:"#fff", borderRadius:16, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.05)", overflowX:"auto" },
  table:      { width:"100%", borderCollapse:"collapse" },
  theadRow:   { background:"#f9fafb", borderBottom:"2px solid #e5e7eb" },
  th:         { padding:"14px 16px", textAlign:"right", fontSize:13, fontWeight:700, color:"#374151", whiteSpace:"nowrap" },
  tr:         { borderBottom:"1px solid #f3f4f6" },
  td:         { padding:"14px 16px", fontSize:14, color:"#374151", verticalAlign:"middle" },
  actionBtn:  { background:"#f3f4f6", border:"none", width:32, height:32, borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 },
  bookingCard:{ background:"#fff", borderRadius:12, padding:20, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" },
  searchInput:{ border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 16px", fontSize:14, fontFamily:"'Cairo',sans-serif", outline:"none", minWidth:200 },
};
