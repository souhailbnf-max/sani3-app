import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TEXT, SERVICES, CITIES, MOCK_WORKERS, getDistance } from "../lib/constants";

const GOOGLE_MAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;

export default function Search({ lang }) {
  const t = TEXT[lang];
  const isRTL = lang === "ar";
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);

  const [view,            setView]            = useState("list");
  const [selectedService, setSelectedService] = useState(params.get("service") || "");
  const [radius,          setRadius]          = useState(10);
  const [userLat,         setUserLat]         = useState(null);
  const [userLng,         setUserLng]         = useState(null);
  const [locating,        setLocating]        = useState(false);
  const [selectedCity,    setSelectedCity]    = useState("");
  const [workers,         setWorkers]         = useState([]);
  const [isMobile,        setIsMobile]        = useState(window.innerWidth < 768);
  const [mapLoaded,       setMapLoaded]       = useState(false);
  const [mapInstance,     setMapInstance]     = useState(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    if (params.get("gps") === "true") getGPS();
    else filterWorkers();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => { filterWorkers(); }, [userLat, userLng, selectedService, radius, selectedCity]);

  // Load Google Maps script
  useEffect(() => {
    if (!GOOGLE_MAPS_KEY || GOOGLE_MAPS_KEY === "your-google-maps-api-key") return;
    const scriptId = "google-maps-search";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&callback=initSearchMap`;
      script.async = true;
      window.initSearchMap = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else if (window.google) {
      setMapLoaded(true);
    }
  }, []);

  // Render map when tab switches to map view
  useEffect(() => {
    if (view !== "map" || !mapRef.current) return;
    if (mapLoaded && window.google) {
      renderGoogleMap();
    }
  }, [view, mapLoaded, workers]);

  const renderGoogleMap = () => {
    const center = userLat ? { lat: userLat, lng: userLng } : { lat: 33.5731, lng: -7.5898 };
    const map = new window.google.maps.Map(mapRef.current, {
      center, zoom: 12,
      styles: [{ featureType:"poi", stylers:[{ visibility:"off" }] }],
    });
    setMapInstance(map);

    // Add worker markers
    workers.forEach(w => {
      const svc = SERVICES.find(s => s.id === w.service) || {};
      const marker = new window.google.maps.Marker({
        position: { lat: w.lat, lng: w.lng },
        map,
        title: w.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: w.available ? "#16a34a" : "#ef4444",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family:'Cairo',sans-serif;padding:8px;min-width:160px">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px">${w.name} ${w.verified ? "✓" : ""}</div>
            <div style="font-size:12px;color:#6b7280;margin-bottom:6px">${svc.icon} ${isRTL ? svc.ar : svc.fr}</div>
            <div style="font-size:13px;margin-bottom:4px">⭐ ${w.rating}</div>
            <div style="font-size:13px;color:#16a34a;font-weight:600">💰 ${w.price}</div>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    });

    // User location marker
    if (userLat) {
      new window.google.maps.Marker({
        position: { lat: userLat, lng: userLng },
        map,
        title: isRTL ? "موقعك" : "Votre position",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#2563eb",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 3,
        },
      });
    }
  };

  const getGPS = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert(isRTL ? "لم نتمكن من تحديد موقعك" : "Impossible de vous localiser");
      }
    );
  };

  const filterWorkers = () => {
    let filtered = [...MOCK_WORKERS];
    if (selectedService) filtered = filtered.filter(w => w.service === selectedService);
    if (userLat && userLng) {
      filtered = filtered.map(w => ({ ...w, distance: getDistance(userLat, userLng, w.lat, w.lng) }))
        .filter(w => w.distance <= radius)
        .sort((a, b) => a.distance - b.distance);
    } else if (selectedCity) {
      filtered = filtered.filter(w => w.city === selectedCity);
    }
    setWorkers(filtered);
  };

  const getServiceInfo = (id) => SERVICES.find(s => s.id === id) || {};

  return (
    <div style={st.page} dir={isRTL ? "rtl" : "ltr"}>
      {/* ── FILTERS BAR ── */}
      <div style={st.filtersBar}>
        <div style={st.filtersInner}>
          <select value={selectedService} onChange={e => setSelectedService(e.target.value)} style={st.select}>
            <option value="">{t.allServices}</option>
            {SERVICES.map(s => <option key={s.id} value={s.id}>{s.icon} {isRTL ? s.ar : s.fr}</option>)}
          </select>

          <select value={selectedCity} onChange={e => { setSelectedCity(e.target.value); setUserLat(null); setUserLng(null); }} style={st.select}>
            <option value="">{t.chooseCity}</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <button onClick={getGPS} style={{ ...st.gpsBtn, ...(userLat ? st.gpsBtnActive : {}) }} disabled={locating}>
            {locating ? t.locating : `📍 ${t.nearMe}`}
          </button>

          {userLat && (
            <div style={st.radiusWrap}>
              <span style={st.radiusLabel}>{t.radius}: {radius} {t.km}</span>
              <input type="range" min={1} max={50} value={radius} onChange={e => setRadius(Number(e.target.value))} style={st.slider} />
            </div>
          )}

          <div style={st.viewToggle}>
            <button onClick={() => setView("list")} style={{ ...st.viewBtn, ...(view === "list" ? st.viewBtnActive : {}) }}>☰ {t.listView}</button>
            <button onClick={() => setView("map")}  style={{ ...st.viewBtn, ...(view === "map"  ? st.viewBtnActive : {}) }}>🗺️ {t.mapView}</button>
          </div>
        </div>
      </div>

      {/* ── RESULTS ── */}
      <div style={st.results}>
        <div style={st.resultsHeader}>
          <h2 style={st.resultsTitle}>{t.workers} ({workers.length})</h2>
        </div>

        {workers.length === 0 ? (
          <div style={st.empty}>
            <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
            <p style={st.emptyText}>{t.noWorkers}</p>
            <button style={st.emptyBtn} onClick={() => { setSelectedService(""); setSelectedCity(""); setRadius(10); }}>
              {isRTL ? "إعادة تعيين الفلاتر" : "Réinitialiser les filtres"}
            </button>
          </div>
        ) : view === "list" ? (
          <div style={{ ...st.listGrid, gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(320px,1fr))" }}>
            {workers.map(w => {
              const svc = getServiceInfo(w.service);
              return (
                <div key={w.id} style={st.workerCard}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"}
                >
                  <div style={st.cardTop}>
                    <div style={{ ...st.avatar, background: svc.color + "22", color: svc.color }}>
                      {w.name[0]}
                    </div>
                    <div style={st.cardInfo}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <div style={st.cardName}>{w.name}</div>
                        {w.verified && (
                          <span style={st.verifiedBadge}>✓ {t.verified}</span>
                        )}
                      </div>
                      <div style={st.cardService}>{svc.icon} {isRTL ? svc.ar : svc.fr}</div>
                    </div>
                    <div style={{ ...st.statusBadge, background: w.available ? "#dcfce7" : "#fee2e2", color: w.available ? "#16a34a" : "#ef4444" }}>
                      {w.available ? t.available : t.busy}
                    </div>
                  </div>

                  <div style={st.cardMeta}>
                    <span style={st.cardRating}>⭐ {w.rating} · {w.reviews} {t.reviews}</span>
                    {w.distance !== undefined && (
                      <span style={st.cardDist}>📍 {w.distance.toFixed(1)} {t.away}</span>
                    )}
                  </div>

                  <div style={st.cardPrice}>💰 {w.price}</div>

                  <div style={st.cardBtns}>
                    <button style={st.profileBtn} onClick={() => navigate(`/worker/${w.id}`)}>
                      👤 {t.viewProfile}
                    </button>
                    <button style={st.chatBtn} onClick={() => navigate(`/chat/${w.id}`)}>
                      💬 {t.chat}
                    </button>
                    <button style={st.bookBtn} onClick={() => navigate(`/booking/${w.id}`)}>
                      {t.book}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* MAP VIEW */
          <div style={st.mapContainer}>
            {GOOGLE_MAPS_KEY && GOOGLE_MAPS_KEY !== "your-google-maps-api-key" ? (
              <div ref={mapRef} style={{ width:"100%", height:"100%", minHeight:520 }} />
            ) : (
              <div style={st.mapPlaceholder}>
                <div style={{ fontSize:48, marginBottom:16 }}>🗺️</div>
                <p style={{ fontSize:16, color:"#6b7280", marginBottom:8 }}>
                  {isRTL ? "خرائط جوجل - Google Maps" : "Google Maps"}
                </p>
                <p style={{ fontSize:13, color:"#9ca3af", marginBottom:16, textAlign:"center", maxWidth:300 }}>
                  {isRTL
                    ? "أضف مفتاح Google Maps API في ملف .env لعرض الخريطة التفاعلية مع مواقع الحرفيين"
                    : "Ajoutez votre clé Google Maps API dans le fichier .env pour afficher la carte interactive avec les artisans"}
                </p>
                <div style={st.mapPins}>
                  {workers.slice(0,6).map(w => {
                    const svc = getServiceInfo(w.service);
                    return (
                      <div key={w.id} style={{ ...st.mapPin, borderColor: svc.color, cursor:"pointer" }} onClick={() => navigate(`/worker/${w.id}`)}>
                        <span>{svc.icon}</span>
                        <span style={{ fontSize:12, fontWeight:600 }}>{w.name.split(" ")[0]}</span>
                        {w.distance !== undefined && <span style={{ fontSize:11, color:"#6b7280" }}>{w.distance.toFixed(1)} km</span>}
                        {w.verified && <span style={{ fontSize:10, color:"#16a34a" }}>✓</span>}
                      </div>
                    );
                  })}
                </div>
                <p style={{ fontSize:12, color:"#9ca3af", marginTop:16 }}>
                  {isRTL ? "* REACT_APP_GOOGLE_MAPS_KEY في .env" : "* REACT_APP_GOOGLE_MAPS_KEY dans .env"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const st = {
  page:          { fontFamily:"'Cairo',sans-serif", background:"#f9fafb", minHeight:"100vh", color:"#111827" },
  filtersBar:    { background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"16px 0", position:"sticky", top:64, zIndex:50 },
  filtersInner:  { display:"flex", alignItems:"center", gap:12, padding:"0 48px", flexWrap:"wrap" },
  select:        { padding:"10px 14px", border:"1px solid #e5e7eb", borderRadius:10, fontSize:14, color:"#374151", fontFamily:"'Cairo',sans-serif", background:"#fff", outline:"none", cursor:"pointer" },
  gpsBtn:        { background:"#f0fdf4", border:"1px solid #86efac", color:"#16a34a", padding:"10px 16px", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'Cairo',sans-serif", whiteSpace:"nowrap" },
  gpsBtnActive:  { background:"#16a34a", color:"#fff", borderColor:"#16a34a" },
  radiusWrap:    { display:"flex", flexDirection:"column", gap:4 },
  radiusLabel:   { fontSize:12, color:"#6b7280", whiteSpace:"nowrap" },
  slider:        { width:120, accentColor:"#16a34a", cursor:"pointer" },
  viewToggle:    { display:"flex", borderRadius:10, overflow:"hidden", border:"1px solid #e5e7eb", marginRight:"auto" },
  viewBtn:       { background:"#fff", border:"none", padding:"10px 16px", fontSize:13, cursor:"pointer", fontFamily:"'Cairo',sans-serif", color:"#6b7280", transition:"all 0.2s" },
  viewBtnActive: { background:"#16a34a", color:"#fff" },
  results:       { padding:"32px 48px" },
  resultsHeader: { marginBottom:24 },
  resultsTitle:  { fontSize:22, fontWeight:700, color:"#111827" },
  listGrid:      { display:"grid", gap:16 },
  workerCard:    { background:"#fff", borderRadius:16, padding:24, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", transition:"box-shadow 0.2s" },
  cardTop:       { display:"flex", alignItems:"center", gap:14, marginBottom:14 },
  avatar:        { width:52, height:52, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:700, flexShrink:0 },
  cardInfo:      { flex:1 },
  cardName:      { fontSize:16, fontWeight:700, color:"#111827", marginBottom:2 },
  verifiedBadge: { background:"#16a34a", color:"#fff", fontSize:10, padding:"2px 8px", borderRadius:999, fontWeight:700 },
  cardService:   { fontSize:13, color:"#6b7280" },
  statusBadge:   { fontSize:12, padding:"4px 10px", borderRadius:999, fontWeight:600, whiteSpace:"nowrap" },
  cardMeta:      { display:"flex", justifyContent:"space-between", marginBottom:10, flexWrap:"wrap", gap:8 },
  cardRating:    { fontSize:13, color:"#374151" },
  cardDist:      { fontSize:13, color:"#16a34a", fontWeight:600 },
  cardPrice:     { fontSize:14, color:"#374151", marginBottom:16, fontWeight:500 },
  cardBtns:      { display:"flex", gap:8 },
  profileBtn:    { flex:1, background:"#f9fafb", color:"#374151", border:"1px solid #e5e7eb", padding:"10px 8px", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", textAlign:"center", fontFamily:"'Cairo',sans-serif" },
  chatBtn:       { background:"#eff6ff", color:"#2563eb", border:"1px solid #bfdbfe", padding:"10px 8px", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Cairo',sans-serif" },
  bookBtn:       { flex:1, background:"#16a34a", color:"#fff", border:"none", padding:"10px", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Cairo',sans-serif" },
  empty:         { textAlign:"center", padding:"80px 24px" },
  emptyText:     { fontSize:16, color:"#6b7280", marginBottom:24 },
  emptyBtn:      { background:"#16a34a", color:"#fff", border:"none", padding:"12px 24px", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'Cairo',sans-serif" },
  mapContainer:  { background:"#fff", borderRadius:16, overflow:"hidden", minHeight:520, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" },
  mapPlaceholder:{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:520, background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", padding:32 },
  mapPins:       { display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center", marginTop:16 },
  mapPin:        { background:"#fff", border:"2px solid", borderRadius:12, padding:"10px 16px", display:"flex", flexDirection:"column", alignItems:"center", gap:2, boxShadow:"0 2px 8px rgba(0,0,0,0.1)", transition:"transform 0.2s" },
};
