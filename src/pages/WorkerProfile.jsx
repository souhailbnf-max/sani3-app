import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TEXT, SERVICES, MOCK_WORKERS, MOCK_REVIEWS } from "../lib/constants";

const GOOGLE_MAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;

export default function WorkerProfile({ lang }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = TEXT[lang];
  const isRTL = lang === "ar";
  const mapRef = useRef(null);
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("about");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const w = MOCK_WORKERS.find(w => w.id === Number(id));
    setWorker(w);
    setReviews(MOCK_REVIEWS.filter(r => r.worker_id === Number(id)));
  }, [id]);

  // Load Google Maps
  useEffect(() => {
    if (!worker || !GOOGLE_MAPS_KEY || GOOGLE_MAPS_KEY === "your-google-maps-api-key") {
      setMapLoaded(false);
      return;
    }
    const scriptId = "google-maps-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&callback=initMap`;
      script.async = true;
      window.initMap = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else if (window.google) {
      setMapLoaded(true);
    }
  }, [worker]);

  useEffect(() => {
    if (mapLoaded && worker && mapRef.current && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: worker.lat, lng: worker.lng },
        zoom: 14,
        styles: [{ featureType:"poi", stylers:[{ visibility:"off" }] }],
      });
      new window.google.maps.Marker({
        position: { lat: worker.lat, lng: worker.lng },
        map,
        title: worker.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#16a34a",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });
    }
  }, [mapLoaded, worker]);

  const handleReviewSubmit = () => {
    const review = {
      id: Date.now(),
      worker_id: worker.id,
      client: "أنت / Vous",
      rating: newReview.rating,
      comment_ar: newReview.comment,
      comment_fr: newReview.comment,
      date: new Date().toISOString().split("T")[0],
    };
    setReviews(prev => [review, ...prev]);
    setReviewSubmitted(true);
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: "" });
  };

  if (!worker) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"60vh", fontFamily:"'Cairo',sans-serif", fontSize:18, color:"#16a34a" }}>
      ⏳ {isRTL ? "جاري التحميل..." : "Chargement..."}
    </div>
  );

  const svc = SERVICES.find(s => s.id === worker.service) || {};
  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : worker.rating;

  return (
    <div style={st.page} dir={isRTL ? "rtl" : "ltr"}>
      {/* ── HEADER ── */}
      <div style={st.header}>
        <div style={st.headerInner}>
          <button style={st.backBtn} onClick={() => navigate(-1)}>
            {isRTL ? "→ رجوع" : "← Retour"}
          </button>

          <div style={st.profileTop}>
            {/* Avatar */}
            <div style={{ ...st.avatar, background: svc.color + "22", color: svc.color }}>
              {worker.name[0]}
            </div>

            {/* Info */}
            <div style={st.profileInfo}>
              <div style={st.nameRow}>
                <h1 style={st.name}>{worker.name}</h1>
                {worker.verified && (
                  <span style={st.verifiedBadge}>
                    ✓ {t.verified}
                  </span>
                )}
              </div>
              <div style={st.serviceTag}>
                {svc.icon} {isRTL ? svc.ar : svc.fr}
              </div>
              <div style={st.metaRow}>
                <span style={st.ratingBig}>⭐ {avgRating}</span>
                <span style={st.reviewCount}>({reviews.length + 89} {t.reviews})</span>
                <span style={{ ...st.statusBadge, background: worker.available ? "#dcfce7" : "#fee2e2", color: worker.available ? "#16a34a" : "#ef4444" }}>
                  {worker.available ? t.available : t.busy}
                </span>
              </div>
              <div style={st.priceTag}>💰 {worker.price}</div>
            </div>

            {/* Action buttons */}
            <div style={st.actionBtns}>
              <a href={`tel:${worker.phone}`} style={st.callBtn}>📞 {t.contact}</a>
              <button style={st.chatBtn} onClick={() => navigate(`/chat/${worker.id}`)}>💬 {t.chat}</button>
              <button style={st.bookBtn} onClick={() => navigate(`/booking/${worker.id}`)}>{t.bookNow}</button>
            </div>
          </div>

          {/* Tabs */}
          <div style={st.tabs}>
            {[["about", isRTL?"نبذة":"À propos"], ["reviews", isRTL?"التقييمات":"Avis"], ["map", isRTL?"الموقع":"Localisation"]].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)}
                style={{ ...st.tab, ...(activeTab === id ? st.tabActive : {}) }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={st.content}>

        {/* ABOUT TAB */}
        {activeTab === "about" && (
          <div style={st.aboutGrid}>
            <div style={st.card}>
              <h3 style={st.cardTitle}>{isRTL ? "نبذة عن الحرفي" : "À propos de l'artisan"}</h3>
              <p style={st.bio}>{isRTL ? worker.bio_ar : worker.bio_fr}</p>
              <div style={st.statsRow}>
                <div style={st.statBox}>
                  <span style={st.statNum}>{worker.experience}</span>
                  <span style={st.statLabel}>{isRTL ? "سنوات خبرة" : "Ans d'exp."}</span>
                </div>
                <div style={st.statBox}>
                  <span style={st.statNum}>{worker.reviews + reviews.length}</span>
                  <span style={st.statLabel}>{t.reviews}</span>
                </div>
                <div style={st.statBox}>
                  <span style={st.statNum}>{avgRating}⭐</span>
                  <span style={st.statLabel}>{t.rating}</span>
                </div>
              </div>
            </div>

            <div style={st.card}>
              <h3 style={st.cardTitle}>{isRTL ? "معلومات الاتصال" : "Informations de contact"}</h3>
              <div style={st.infoRow}><span>📞</span><span>{worker.phone}</span></div>
              <div style={st.infoRow}><span>🏙️</span><span>{worker.city}</span></div>
              <div style={st.infoRow}><span>⚙️</span><span>{isRTL ? svc.ar : svc.fr}</span></div>
              {worker.verified && (
                <div style={{ marginTop:16, background:"#f0fdf4", border:"1px solid #86efac", borderRadius:10, padding:"12px 16px", display:"flex", gap:10, alignItems:"center" }}>
                  <span style={{ fontSize:20 }}>✅</span>
                  <span style={{ fontSize:14, color:"#16a34a", fontWeight:600 }}>
                    {isRTL ? "هذا الحرفي موثق ومعتمد من فريق صانع.ma" : "Cet artisan est vérifié et certifié par l'équipe Sani3.ma"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <h2 style={st.sectionTitle}>
                {isRTL ? `التقييمات (${reviews.length + 89})` : `Avis (${reviews.length + 89})`}
              </h2>
              {!reviewSubmitted && (
                <button style={st.bookBtn} onClick={() => setShowReviewForm(!showReviewForm)}>
                  ✏️ {t.writeReview}
                </button>
              )}
            </div>

            {/* Review form */}
            {showReviewForm && (
              <div style={{ ...st.card, marginBottom:24, border:"2px solid #16a34a" }}>
                <h3 style={st.cardTitle}>{t.writeReview}</h3>
                <div style={{ marginBottom:16 }}>
                  <label style={st.label}>{t.rating}</label>
                  <div style={{ display:"flex", gap:8, marginTop:8 }}>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setNewReview(r => ({ ...r, rating:n }))}
                        style={{ fontSize:24, background:"none", border:"none", cursor:"pointer", opacity: newReview.rating >= n ? 1 : 0.3 }}>
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom:16 }}>
                  <label style={st.label}>{isRTL ? "تعليقك" : "Votre commentaire"}</label>
                  <textarea
                    value={newReview.comment}
                    onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))}
                    style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"12px", fontSize:14, resize:"vertical", minHeight:80, marginTop:8, fontFamily:"'Cairo',sans-serif" }}
                    placeholder={isRTL ? "اكتب تجربتك مع هذا الحرفي..." : "Décrivez votre expérience avec cet artisan..."}
                  />
                </div>
                <button style={st.bookBtn} onClick={handleReviewSubmit} disabled={!newReview.comment}>
                  {isRTL ? "نشر التقييم" : "Publier l'avis"}
                </button>
              </div>
            )}

            {/* Rating summary */}
            <div style={{ ...st.card, marginBottom:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:24 }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:56, fontWeight:800, color:"#16a34a", lineHeight:1 }}>{avgRating}</div>
                  <div style={{ fontSize:20, marginTop:4 }}>{"⭐".repeat(Math.round(avgRating))}</div>
                  <div style={{ fontSize:13, color:"#6b7280", marginTop:4 }}>{reviews.length + 89} {t.reviews}</div>
                </div>
                <div style={{ flex:1 }}>
                  {[5,4,3,2,1].map(star => {
                    const count = reviews.filter(r => r.rating === star).length + (star === 5 ? 60 : star === 4 ? 20 : star === 3 ? 8 : 1);
                    const total = reviews.length + 89;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={star} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                        <span style={{ fontSize:13, width:12 }}>{star}</span>
                        <span style={{ fontSize:12 }}>⭐</span>
                        <div style={{ flex:1, background:"#f3f4f6", borderRadius:999, height:8 }}>
                          <div style={{ width:`${pct}%`, background:"#16a34a", height:8, borderRadius:999 }} />
                        </div>
                        <span style={{ fontSize:12, color:"#6b7280", width:30 }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Review list */}
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {reviews.map(r => (
                <div key={r.id} style={st.reviewCard}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:"#f0fdf4", color:"#16a34a", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>
                        {r.client[0]}
                      </div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700 }}>{r.client}</div>
                        <div style={{ fontSize:12, color:"#9ca3af" }}>{r.date}</div>
                      </div>
                    </div>
                    <span style={{ fontSize:16 }}>{"⭐".repeat(r.rating)}</span>
                  </div>
                  <p style={{ fontSize:14, color:"#374151", lineHeight:1.7 }}>
                    {isRTL ? r.comment_ar : r.comment_fr}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAP TAB */}
        {activeTab === "map" && (
          <div style={st.card}>
            <h3 style={st.cardTitle}>{isRTL ? "موقع الحرفي" : "Localisation de l'artisan"}</h3>
            <p style={{ fontSize:14, color:"#6b7280", marginBottom:16 }}>
              📍 {worker.city}
            </p>
            {GOOGLE_MAPS_KEY && GOOGLE_MAPS_KEY !== "your-google-maps-api-key" ? (
              <div ref={mapRef} style={{ width:"100%", height:420, borderRadius:12, overflow:"hidden", border:"1px solid #e5e7eb" }} />
            ) : (
              <div style={{ width:"100%", height:420, borderRadius:12, background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", border:"1px solid #e5e7eb" }}>
                <div style={{ fontSize:64, marginBottom:16 }}>🗺️</div>
                <div style={{ fontSize:18, fontWeight:700, color:"#111827", marginBottom:8 }}>
                  {isRTL ? "خرائط جوجل" : "Google Maps"}
                </div>
                <div style={{ fontSize:14, color:"#6b7280", textAlign:"center", maxWidth:320, lineHeight:1.7 }}>
                  {isRTL
                    ? `الحرفي موجود في ${worker.city}. أضف مفتاح Google Maps API في ملف .env لعرض الخريطة التفاعلية`
                    : `L'artisan se trouve à ${worker.city}. Ajoutez votre clé Google Maps API dans le fichier .env pour afficher la carte interactive`}
                </div>
                <div style={{ marginTop:16, background:"#fff", borderRadius:12, padding:"12px 20px", fontSize:13, color:"#16a34a", fontFamily:"monospace" }}>
                  📍 {worker.lat.toFixed(4)}, {worker.lng.toFixed(4)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const st = {
  page:        { fontFamily:"'Cairo',sans-serif", background:"#f9fafb", minHeight:"100vh", color:"#111827" },
  header:      { background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"24px 0 0" },
  headerInner: { maxWidth:960, margin:"0 auto", padding:"0 32px" },
  backBtn:     { background:"none", border:"none", color:"#6b7280", cursor:"pointer", fontSize:14, marginBottom:20, padding:0 },
  profileTop:  { display:"flex", gap:24, alignItems:"flex-start", flexWrap:"wrap", marginBottom:24 },
  avatar:      { width:80, height:80, borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, fontWeight:800, flexShrink:0 },
  profileInfo: { flex:1, minWidth:200 },
  nameRow:     { display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", marginBottom:6 },
  name:        { fontSize:26, fontWeight:800, color:"#111827" },
  verifiedBadge:{ background:"#16a34a", color:"#fff", fontSize:12, padding:"4px 12px", borderRadius:999, fontWeight:700, display:"flex", alignItems:"center", gap:4 },
  serviceTag:  { fontSize:15, color:"#6b7280", marginBottom:8 },
  metaRow:     { display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", marginBottom:8 },
  ratingBig:   { fontSize:18, fontWeight:700 },
  reviewCount: { fontSize:14, color:"#6b7280" },
  statusBadge: { fontSize:12, padding:"4px 10px", borderRadius:999, fontWeight:600 },
  priceTag:    { fontSize:15, fontWeight:600, color:"#374151" },
  actionBtns:  { display:"flex", flexDirection:"column", gap:10, minWidth:160 },
  callBtn:     { background:"#f0fdf4", color:"#16a34a", border:"1px solid #86efac", padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:600, textAlign:"center", textDecoration:"none", fontFamily:"'Cairo',sans-serif", cursor:"pointer" },
  chatBtn:     { background:"#eff6ff", color:"#2563eb", border:"1px solid #bfdbfe", padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer" },
  bookBtn:     { background:"#16a34a", color:"#fff", border:"none", padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" },
  tabs:        { display:"flex", gap:0, borderBottom:"none" },
  tab:         { background:"none", border:"none", borderBottom:"3px solid transparent", padding:"12px 20px", fontSize:15, cursor:"pointer", fontFamily:"'Cairo',sans-serif", color:"#6b7280", transition:"all 0.2s" },
  tabActive:   { color:"#16a34a", borderBottomColor:"#16a34a", fontWeight:700 },
  content:     { maxWidth:960, margin:"0 auto", padding:"32px" },
  aboutGrid:   { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20 },
  card:        { background:"#fff", borderRadius:16, padding:24, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" },
  cardTitle:   { fontSize:17, fontWeight:700, marginBottom:16, color:"#111827" },
  bio:         { fontSize:15, color:"#374151", lineHeight:1.8, marginBottom:20 },
  statsRow:    { display:"flex", gap:16 },
  statBox:     { flex:1, textAlign:"center", background:"#f9fafb", borderRadius:12, padding:16 },
  statNum:     { display:"block", fontSize:22, fontWeight:800, color:"#16a34a" },
  statLabel:   { display:"block", fontSize:12, color:"#6b7280", marginTop:4 },
  infoRow:     { display:"flex", gap:12, alignItems:"center", padding:"10px 0", borderBottom:"1px solid #f3f4f6", fontSize:14, color:"#374151" },
  sectionTitle:{ fontSize:20, fontWeight:700, color:"#111827" },
  label:       { fontSize:13, fontWeight:600, color:"#374151" },
  reviewCard:  { background:"#fff", borderRadius:12, padding:20, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" },
};
