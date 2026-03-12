import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TEXT, SERVICES } from "../lib/constants";

export default function Home({ lang }) {
  const t = TEXT[lang];
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState("");
  const isRTL = lang === "ar";

  const handleSearch = () => {
    navigate(`/search?service=${selectedService}`);
  };

  return (
    <div style={st.page} dir={isRTL ? "rtl" : "ltr"}>

      {/* ── HERO ── */}
      <section style={st.hero}>
        <div style={st.heroContent}>
          <div style={st.heroBadge}>🇲🇦 {isRTL ? "المغرب" : "Maroc"}</div>
          <h1 style={st.heroTitle}>{t.tagline}</h1>
          <p style={st.heroSub}>{t.subtitle}</p>

          {/* Search Box */}
          <div style={st.searchBox}>
            <div style={st.searchRow}>
              {/* Service selector */}
              <select value={selectedService} onChange={e => setSelectedService(e.target.value)} style={st.select}>
                <option value="">{t.allServices}</option>
                {SERVICES.map(s => (
                  <option key={s.id} value={s.id}>{s.icon} {isRTL ? s.ar : s.fr}</option>
                ))}
              </select>

              {/* Search button */}
              <button onClick={handleSearch} style={st.searchBtn}>
                🔍 {isRTL ? "ابحث الآن" : "Rechercher"}
              </button>
            </div>

            {/* Near me button */}
            <button onClick={() => navigate("/search?gps=true")} style={st.nearBtn}>
              📍 {t.nearMe}
            </button>
          </div>

          {/* Stats */}
          <div style={st.stats}>
            {[
              ["500+", isRTL ? "حرفي مسجل" : "Artisans inscrits"],
              ["2000+", isRTL ? "عميل راضٍ" : "Clients satisfaits"],
              ["10+", isRTL ? "مدن مغربية" : "Villes marocaines"],
            ].map(([n, l]) => (
              <div key={l} style={st.stat}>
                <span style={st.statNum}>{n}</span>
                <span style={st.statLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <div style={st.heroVisual}>
          <div style={st.heroCard}>
            <div style={st.heroCardHeader}>
              <div style={st.heroAvatar}>H</div>
              <div>
                <div style={st.heroName}>Hassan Benali</div>
                <div style={st.heroService}>🔧 {isRTL ? "سباك محترف" : "Plombier professionnel"}</div>
              </div>
              <div style={st.heroBadgeGreen}>{t.available}</div>
            </div>
            <div style={st.heroRating}>⭐ 4.8 · 124 {t.reviews}</div>
            <div style={st.heroDistance}>📍 1.2 {t.km} {isRTL ? "منك" : "de vous"}</div>
            <button style={st.heroBookBtn}>{t.book}</button>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section style={st.section}>
        <h2 style={st.sectionTitle}>{isRTL ? "خدماتنا" : "Nos Services"}</h2>
        <div style={st.servicesGrid}>
          {SERVICES.map(s => (
            <div key={s.id} style={{ ...st.serviceCard, borderTop:`3px solid ${s.color}` }}
              onClick={() => navigate(`/search?service=${s.id}`)}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <span style={st.serviceIcon}>{s.icon}</span>
              <span style={st.serviceName}>{isRTL ? s.ar : s.fr}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ ...st.section, background:"#f0fdf4" }}>
        <h2 style={st.sectionTitle}>{t.howItWorks}</h2>
        <div style={st.stepsGrid}>
          {[
            { num:"01", title: t.step1, desc: t.step1d, icon:"🔍" },
            { num:"02", title: t.step2, desc: t.step2d, icon:"👷" },
            { num:"03", title: t.step3, desc: t.step3d, icon:"✅" },
          ].map((step) => (
            <div key={step.num} style={st.stepCard}>
              <div style={st.stepNum}>{step.num}</div>
              <div style={st.stepIcon}>{step.icon}</div>
              <h3 style={st.stepTitle}>{step.title}</h3>
              <p style={st.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── JOIN AS WORKER ── */}
      <section style={st.joinSection}>
        <div style={st.joinContent}>
          <h2 style={st.joinTitle}>{isRTL ? "أنت حرفي؟ انضم إلينا!" : "Vous êtes artisan? Rejoignez-nous!"}</h2>
          <p style={st.joinSub}>{isRTL ? "سجل مجاناً واحصل على مزيد من العملاء في مدينتك" : "Inscrivez-vous gratuitement et obtenez plus de clients dans votre ville"}</p>
          <button style={st.joinBtn} onClick={() => navigate("/join")}>
            {t.joinWorker} →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={st.footer}>
        <div style={st.footerTop}>
          <div>
            <div style={st.footerLogo}>صانع.ma</div>
            <p style={st.footerTagline}>{isRTL ? "نربطك بأفضل الحرفيين" : "Votre artisan de confiance"}</p>
          </div>
          <div style={st.footerLinks}>
            {[
              [isRTL ? "ابحث عن حرفي" : "Trouver un artisan", "/search"],
              [isRTL ? "انضم كحرفي" : "Devenir artisan", "/join"],
              [isRTL ? "تسجيل الدخول" : "Connexion", "/login"],
            ].map(([label, path]) => (
              <button key={path} style={st.footerLink} onClick={() => navigate(path)}>{label}</button>
            ))}
          </div>
        </div>
        <div style={st.footerBottom}>
          <span>© 2025 Sani3.ma — {isRTL ? "جميع الحقوق محفوظة" : "Tous droits réservés"}</span>
        </div>
      </footer>
    </div>
  );
}

const st = {
  page:          { fontFamily:"'Cairo',sans-serif", background:"#fff", color:"#111827" },
  hero:          { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"80px 48px", background:"linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", gap:40, flexWrap:"wrap" },
  heroContent:   { flex:"1 1 400px", maxWidth:560 },
  heroBadge:     { display:"inline-block", background:"#16a34a", color:"#fff", fontSize:12, padding:"4px 12px", borderRadius:999, marginBottom:20, letterSpacing:1 },
  heroTitle:     { fontSize:"clamp(32px,5vw,52px)", fontWeight:800, lineHeight:1.2, marginBottom:16, color:"#111827" },
  heroSub:       { fontSize:17, lineHeight:1.8, color:"#6b7280", marginBottom:36, fontWeight:400 },
  searchBox:     { background:"#fff", borderRadius:16, padding:20, boxShadow:"0 4px 24px rgba(0,0,0,0.1)", marginBottom:36 },
  searchRow:     { display:"flex", gap:12, marginBottom:12, flexWrap:"wrap" },
  select:        { flex:1, padding:"12px 16px", border:"1px solid #e5e7eb", borderRadius:10, fontSize:15, color:"#374151", fontFamily:"'Cairo',sans-serif", background:"#f9fafb", outline:"none", minWidth:160 },
  searchBtn:     { background:"#16a34a", color:"#fff", border:"none", padding:"12px 24px", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Cairo',sans-serif", whiteSpace:"nowrap" },
  nearBtn:       { width:"100%", background:"#f0fdf4", border:"1px solid #86efac", color:"#16a34a", padding:"10px", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'Cairo',sans-serif" },
  stats:         { display:"flex", gap:32, flexWrap:"wrap" },
  stat:          { display:"flex", flexDirection:"column" },
  statNum:       { fontSize:28, fontWeight:800, color:"#16a34a" },
  statLabel:     { fontSize:13, color:"#6b7280" },
  heroVisual:    { flex:"0 1 320px" },
  heroCard:      { background:"#fff", borderRadius:16, padding:24, boxShadow:"0 8px 32px rgba(0,0,0,0.12)" },
  heroCardHeader:{ display:"flex", alignItems:"center", gap:12, marginBottom:12 },
  heroAvatar:    { width:48, height:48, borderRadius:"50%", background:"#16a34a", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:700 },
  heroName:      { fontSize:16, fontWeight:700, color:"#111827" },
  heroService:   { fontSize:13, color:"#6b7280" },
  heroBadgeGreen:{ marginRight:"auto", background:"#dcfce7", color:"#16a34a", fontSize:11, padding:"3px 10px", borderRadius:999, fontWeight:600 },
  heroRating:    { fontSize:14, color:"#374151", marginBottom:6 },
  heroDistance:  { fontSize:14, color:"#6b7280", marginBottom:16 },
  heroBookBtn:   { width:"100%", background:"#16a34a", color:"#fff", border:"none", padding:"12px", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Cairo',sans-serif" },
  section:       { padding:"80px 48px" },
  sectionTitle:  { fontSize:"clamp(24px,4vw,36px)", fontWeight:800, textAlign:"center", marginBottom:48, color:"#111827" },
  servicesGrid:  { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:16 },
  serviceCard:   { background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"28px 16px", textAlign:"center", cursor:"pointer", transition:"transform 0.2s, box-shadow 0.2s", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" },
  serviceIcon:   { display:"block", fontSize:36, marginBottom:10 },
  serviceName:   { fontSize:15, fontWeight:600, color:"#374151" },
  stepsGrid:     { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:24 },
  stepCard:      { background:"#fff", borderRadius:16, padding:32, textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" },
  stepNum:       { fontSize:48, fontWeight:800, color:"#bbf7d0", lineHeight:1, marginBottom:8 },
  stepIcon:      { fontSize:36, marginBottom:12 },
  stepTitle:     { fontSize:18, fontWeight:700, marginBottom:8, color:"#111827" },
  stepDesc:      { fontSize:14, color:"#6b7280", lineHeight:1.7 },
  joinSection:   { background:"#16a34a", padding:"80px 48px", textAlign:"center" },
  joinContent:   { maxWidth:600, margin:"0 auto" },
  joinTitle:     { fontSize:"clamp(24px,4vw,40px)", fontWeight:800, color:"#fff", marginBottom:16 },
  joinSub:       { fontSize:17, color:"rgba(255,255,255,0.8)", marginBottom:32 },
  joinBtn:       { background:"#fff", color:"#16a34a", border:"none", padding:"16px 40px", borderRadius:12, fontSize:16, fontWeight:800, cursor:"pointer", fontFamily:"'Cairo',sans-serif" },
  footer:        { background:"#111827", color:"#f9fafb", padding:"48px 48px 24px" },
  footerTop:     { display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:32, marginBottom:32, paddingBottom:32, borderBottom:"1px solid rgba(255,255,255,0.1)" },
  footerLogo:    { fontSize:24, fontWeight:800, color:"#16a34a", marginBottom:8 },
  footerTagline: { fontSize:14, color:"rgba(255,255,255,0.5)" },
  footerLinks:   { display:"flex", gap:24, flexWrap:"wrap", alignItems:"center" },
  footerLink:    { background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:14, cursor:"pointer", fontFamily:"'Cairo',sans-serif" },
  footerBottom:  { fontSize:13, color:"rgba(255,255,255,0.3)", textAlign:"center" },
};
