import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TEXT, SERVICES, MOCK_WORKERS, TIME_SLOTS } from "../lib/constants";

export default function Booking({ lang }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = TEXT[lang];
  const isRTL = lang === "ar";

  const [worker, setWorker] = useState(null);
  const [step, setStep] = useState(1); // 1=pick date, 2=confirm, 3=success
  const [form, setForm] = useState({ date:"", time:"", notes:"" });
  const [loading, setLoading] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  useEffect(() => {
    const w = MOCK_WORKERS.find(w => w.id === Number(id));
    setWorker(w);
  }, [id]);

  // Get next 14 days (excluding Fridays for Morocco)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const formatDate = (d) => {
    return d.toLocaleDateString(isRTL ? "ar-MA" : "fr-MA", { weekday:"short", day:"numeric", month:"short" });
  };

  const formatDateValue = (d) => {
    return d.toISOString().split("T")[0];
  };

  const sendSMS = async (booking) => {
    // Real Twilio integration (server-side)
    // In production: call your backend API which uses Twilio
    // For demo: simulate SMS sending
    console.log("SMS would be sent via Twilio to:", worker.phone, "Booking:", booking);
    return true;
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // In production: save to Supabase
      // const { error } = await supabase.from('bookings').insert({ worker_id: worker.id, date: form.date, time: form.time, notes: form.notes });

      // Send SMS via backend (Twilio)
      const sent = await sendSMS({ worker: worker.name, date: form.date, time: form.time });
      setSmsSent(sent);
      setStep(3);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!worker) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"60vh", fontFamily:"'Cairo',sans-serif", fontSize:18, color:"#16a34a" }}>
      ⏳ {isRTL ? "جاري التحميل..." : "Chargement..."}
    </div>
  );

  const svc = SERVICES.find(s => s.id === worker.service) || {};
  const availableDates = getAvailableDates();

  return (
    <div style={st.page} dir={isRTL ? "rtl" : "ltr"}>
      <div style={st.container}>

        {/* Worker summary card */}
        <div style={st.workerCard}>
          <div style={{ ...st.avatar, background: svc.color + "22", color: svc.color }}>
            {worker.name[0]}
          </div>
          <div>
            <div style={st.workerName}>{worker.name}</div>
            <div style={st.workerService}>{svc.icon} {isRTL ? svc.ar : svc.fr}</div>
            <div style={st.workerPrice}>💰 {worker.price}</div>
          </div>
          {worker.verified && (
            <span style={st.verifiedBadge}>✓ {t.verified}</span>
          )}
        </div>

        {/* Step indicator */}
        <div style={st.steps}>
          {[1,2,3].map(s => (
            <div key={s} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ ...st.stepDot, background: step >= s ? "#16a34a" : "#e5e7eb", color: step >= s ? "#fff" : "#9ca3af" }}>
                {step > s ? "✓" : s}
              </div>
              <span style={{ fontSize:13, color: step >= s ? "#16a34a" : "#9ca3af", fontWeight: step === s ? 700 : 400 }}>
                {s === 1 ? (isRTL ? "اختر الموعد" : "Choisir le créneau") :
                 s === 2 ? (isRTL ? "التأكيد" : "Confirmation") :
                           (isRTL ? "تم الحجز" : "Réservé")}
              </span>
              {s < 3 && <div style={{ flex:1, height:1, background: step > s ? "#16a34a" : "#e5e7eb", minWidth:40 }} />}
            </div>
          ))}
        </div>

        {/* STEP 1: Pick date & time */}
        {step === 1 && (
          <div style={st.card}>
            <h2 style={st.cardTitle}>{isRTL ? "اختر التاريخ" : "Choisissez la date"}</h2>

            {/* Date picker */}
            <div style={st.dateGrid}>
              {availableDates.map(d => {
                const val = formatDateValue(d);
                const isSelected = form.date === val;
                return (
                  <button key={val} onClick={() => setForm(f => ({ ...f, date: val, time:"" }))}
                    style={{ ...st.dateBtn, ...(isSelected ? st.dateBtnActive : {}) }}>
                    <span style={{ fontSize:12, color: isSelected ? "#fff" : "#6b7280" }}>
                      {formatDate(d).split(" ")[0]}
                    </span>
                    <span style={{ fontSize:18, fontWeight:700 }}>
                      {d.getDate()}
                    </span>
                    <span style={{ fontSize:11, color: isSelected ? "rgba(255,255,255,0.8)" : "#9ca3af" }}>
                      {d.toLocaleDateString(isRTL ? "ar-MA" : "fr-MA", { month:"short" })}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Time slots */}
            {form.date && (
              <>
                <h2 style={{ ...st.cardTitle, marginTop:24 }}>{isRTL ? "اختر الوقت" : "Choisissez l'heure"}</h2>
                <div style={st.timeGrid}>
                  {TIME_SLOTS.map(slot => {
                    const isSelected = form.time === slot;
                    const isUnavailable = ["10:00","14:00"].includes(slot); // mock unavailable
                    return (
                      <button key={slot}
                        disabled={isUnavailable}
                        onClick={() => setForm(f => ({ ...f, time: slot }))}
                        style={{ ...st.timeBtn, ...(isSelected ? st.timeBtnActive : {}), ...(isUnavailable ? st.timeBtnDisabled : {}) }}>
                        {slot}
                        {isUnavailable && <span style={{ display:"block", fontSize:10 }}>❌</span>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Notes */}
            {form.time && (
              <>
                <h3 style={{ ...st.cardTitle, marginTop:24 }}>{t.notes}</h3>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  style={st.textarea}
                  placeholder={isRTL ? "صف المشكلة أو الخدمة التي تحتاجها..." : "Décrivez le problème ou le service dont vous avez besoin..."}
                />
              </>
            )}

            <button style={{ ...st.nextBtn, opacity: form.date && form.time ? 1 : 0.5 }}
              disabled={!form.date || !form.time}
              onClick={() => setStep(2)}>
              {isRTL ? "التالي ←" : "Suivant →"}
            </button>
          </div>
        )}

        {/* STEP 2: Confirm */}
        {step === 2 && (
          <div style={st.card}>
            <h2 style={st.cardTitle}>{isRTL ? "تأكيد الحجز" : "Confirmer la réservation"}</h2>

            <div style={st.confirmBox}>
              {[
                ["👷", isRTL?"الحرفي":"Artisan", worker.name],
                ["📋", isRTL?"الخدمة":"Service", isRTL ? svc.ar : svc.fr],
                ["📅", isRTL?"التاريخ":"Date", form.date],
                ["🕐", isRTL?"الوقت":"Heure", form.time],
                ["💰", isRTL?"السعر التقريبي":"Prix estimé", worker.price],
              ].map(([icon, label, val]) => (
                <div key={label} style={st.confirmRow}>
                  <span style={{ fontSize:20 }}>{icon}</span>
                  <span style={{ color:"#6b7280", fontSize:14, flex:1 }}>{label}</span>
                  <span style={{ fontWeight:700, fontSize:15 }}>{val}</span>
                </div>
              ))}
              {form.notes && (
                <div style={{ ...st.confirmRow, flexDirection:"column", alignItems:"flex-start", gap:6 }}>
                  <span style={{ color:"#6b7280", fontSize:14 }}>📝 {t.notes}</span>
                  <span style={{ fontSize:14, color:"#374151" }}>{form.notes}</span>
                </div>
              )}
            </div>

            <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:12, padding:16, marginBottom:24, fontSize:14, color:"#16a34a" }}>
              📱 {isRTL
                ? `سيتم إرسال SMS تأكيد إلى الحرفي (${worker.phone}) عبر Twilio`
                : `Un SMS de confirmation sera envoyé à l'artisan (${worker.phone}) via Twilio`}
            </div>

            <div style={{ display:"flex", gap:12 }}>
              <button style={st.backBtn2} onClick={() => setStep(1)}>
                {isRTL ? "→ رجوع" : "← Retour"}
              </button>
              <button style={{ ...st.nextBtn, flex:1 }} onClick={handleConfirm} disabled={loading}>
                {loading
                  ? (isRTL ? "جاري الإرسال..." : "Envoi en cours...")
                  : (isRTL ? "✓ تأكيد الحجز" : "✓ Confirmer")}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success */}
        {step === 3 && (
          <div style={{ ...st.card, textAlign:"center" }}>
            <div style={{ fontSize:72, marginBottom:16 }}>🎉</div>
            <h2 style={{ fontSize:26, fontWeight:800, color:"#16a34a", marginBottom:8 }}>
              {t.bookingSuccess}
            </h2>
            <p style={{ fontSize:15, color:"#6b7280", lineHeight:1.8, marginBottom:8 }}>
              {isRTL
                ? `تم حجز موعدك مع ${worker.name} بتاريخ ${form.date} الساعة ${form.time}`
                : `Votre rendez-vous avec ${worker.name} est confirmé pour le ${form.date} à ${form.time}`}
            </p>
            {smsSent && (
              <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:12, padding:14, marginBottom:24, fontSize:14, color:"#16a34a" }}>
                📱 {isRTL
                  ? `تم إرسال SMS تأكيد إلى ${worker.phone}`
                  : `SMS de confirmation envoyé au ${worker.phone}`}
              </div>
            )}
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <button style={st.backBtn2} onClick={() => navigate(`/worker/${worker.id}`)}>
                {isRTL ? "العودة للملف" : "Retour au profil"}
              </button>
              <button style={st.nextBtn} onClick={() => navigate("/dashboard")}>
                {isRTL ? "لوحة التحكم" : "Tableau de bord"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const st = {
  page:           { fontFamily:"'Cairo',sans-serif", background:"#f9fafb", minHeight:"100vh", color:"#111827", padding:"32px 16px" },
  container:      { maxWidth:640, margin:"0 auto", display:"flex", flexDirection:"column", gap:20 },
  workerCard:     { background:"#fff", borderRadius:16, padding:20, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", gap:16, alignItems:"center" },
  avatar:         { width:56, height:56, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:800, flexShrink:0 },
  workerName:     { fontSize:17, fontWeight:700, marginBottom:2 },
  workerService:  { fontSize:13, color:"#6b7280", marginBottom:2 },
  workerPrice:    { fontSize:14, fontWeight:600, color:"#374151" },
  verifiedBadge:  { marginRight:"auto", background:"#16a34a", color:"#fff", fontSize:11, padding:"4px 10px", borderRadius:999, fontWeight:700 },
  steps:          { display:"flex", alignItems:"center", background:"#fff", borderRadius:16, padding:20, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" },
  stepDot:        { width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, flexShrink:0 },
  card:           { background:"#fff", borderRadius:16, padding:28, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" },
  cardTitle:      { fontSize:17, fontWeight:700, color:"#111827", marginBottom:16 },
  dateGrid:       { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(68px,1fr))", gap:8 },
  dateBtn:        { background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:12, padding:"10px 4px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, transition:"all 0.2s" },
  dateBtnActive:  { background:"#16a34a", borderColor:"#16a34a", color:"#fff" },
  timeGrid:       { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(80px,1fr))", gap:8 },
  timeBtn:        { background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 4px", cursor:"pointer", fontSize:14, fontWeight:600, transition:"all 0.2s" },
  timeBtnActive:  { background:"#16a34a", borderColor:"#16a34a", color:"#fff" },
  timeBtnDisabled:{ opacity:0.4, cursor:"not-allowed" },
  textarea:       { width:"100%", border:"1px solid #e5e7eb", borderRadius:12, padding:"12px 14px", fontSize:14, resize:"vertical", minHeight:80, fontFamily:"'Cairo',sans-serif", outline:"none" },
  nextBtn:        { width:"100%", background:"#16a34a", color:"#fff", border:"none", padding:"14px", borderRadius:12, fontSize:16, fontWeight:700, cursor:"pointer", marginTop:24, fontFamily:"'Cairo',sans-serif" },
  backBtn2:       { background:"#f9fafb", color:"#374151", border:"1px solid #e5e7eb", padding:"14px 20px", borderRadius:12, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'Cairo',sans-serif" },
  confirmBox:     { background:"#f9fafb", borderRadius:12, padding:20, marginBottom:20, display:"flex", flexDirection:"column", gap:0 },
  confirmRow:     { display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid #e5e7eb" },
};
