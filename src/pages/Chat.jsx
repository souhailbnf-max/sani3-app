import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TEXT, SERVICES, MOCK_WORKERS, MOCK_MESSAGES } from "../lib/constants";
import { supabase } from "../lib/supabaseClient";

export default function Chat({ lang }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = TEXT[lang];
  const isRTL = lang === "ar";
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [worker, setWorker]   = useState(null);
  const [user, setUser]       = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput]     = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping]   = useState(false);

  useEffect(() => {
    const w = MOCK_WORKERS.find(w => w.id === Number(id));
    setWorker(w);
    // Load mock messages
    setMessages(MOCK_MESSAGES[Number(id)] || []);

    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user));
  }, [id]);

  useEffect(() => {
    // Subscribe to real-time messages from Supabase
    // In production:
    // const channel = supabase.channel(`chat-${id}`)
    //   .on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', filter:`chat_id=eq.${id}` },
    //     payload => setMessages(prev => [...prev, payload.new]))
    //   .subscribe();
    // return () => supabase.removeChannel(channel);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages]);

  const simulateWorkerReply = (userMsg) => {
    setTyping(true);
    const replies_ar = [
      "نعم، يمكنني المساعدة في ذلك",
      "متى تريد أن أحضر؟",
      "حسناً، سأكون هناك في الوقت المحدد",
      "شكراً، سأتصل بك للتأكيد",
      "سعر الخدمة يتراوح بين " + (worker?.price || "150-300 MAD"),
    ];
    const replies_fr = [
      "Oui, je peux vous aider avec ça",
      "Quand voulez-vous que je vienne?",
      "Bien, je serai là à l'heure convenue",
      "Merci, je vous appellerai pour confirmer",
      "Le prix du service est entre " + (worker?.price || "150-300 MAD"),
    ];
    const replies = isRTL ? replies_ar : replies_fr;
    const reply = replies[Math.floor(Math.random() * replies.length)];

    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        from: "worker",
        text: reply,
        time: new Date().toLocaleTimeString("fr-MA", { hour:"2-digit", minute:"2-digit" }),
      }]);
    }, 1500 + Math.random() * 1000);
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);

    const msg = {
      id: Date.now(),
      from: "client",
      text,
      time: new Date().toLocaleTimeString("fr-MA", { hour:"2-digit", minute:"2-digit" }),
    };

    // In production: save to Supabase
    // await supabase.from('messages').insert({ chat_id: id, sender_id: user.id, text });

    setMessages(prev => [...prev, msg]);
    setSending(false);
    simulateWorkerReply(text);
    inputRef.current?.focus();
  };

  if (!worker) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"60vh", fontFamily:"'Cairo',sans-serif", fontSize:18, color:"#16a34a" }}>
      ⏳ {isRTL ? "جاري التحميل..." : "Chargement..."}
    </div>
  );

  const svc = SERVICES.find(s => s.id === worker.service) || {};

  return (
    <div style={st.page} dir={isRTL ? "rtl" : "ltr"}>
      {/* Chat header */}
      <div style={st.chatHeader}>
        <button style={st.backBtn} onClick={() => navigate(-1)}>
          {isRTL ? "→" : "←"}
        </button>
        <div style={{ ...st.workerAvatar, background: svc.color + "22", color: svc.color }}>
          {worker.name[0]}
        </div>
        <div style={st.headerInfo}>
          <div style={st.headerName}>
            {worker.name}
            {worker.verified && <span style={st.verifiedSmall}>✓</span>}
          </div>
          <div style={st.headerStatus}>
            <span style={{ ...st.statusDot, background: worker.available ? "#16a34a" : "#ef4444" }} />
            {worker.available ? (isRTL ? "متاح الآن" : "Disponible") : (isRTL ? "مشغول" : "Occupé")}
          </div>
        </div>
        <button style={st.callBtn} onClick={() => window.location.href = `tel:${worker.phone}`}>
          📞
        </button>
        <button style={st.bookBtn} onClick={() => navigate(`/booking/${worker.id}`)}>
          {t.bookNow}
        </button>
      </div>

      {/* Messages area */}
      <div style={st.messagesArea}>
        {/* Date separator */}
        <div style={st.dateSep}>
          <span style={st.dateSepText}>{isRTL ? "اليوم" : "Aujourd'hui"}</span>
        </div>

        {messages.map(msg => {
          const isMe = msg.from === "client";
          return (
            <div key={msg.id} style={{ ...st.msgRow, justifyContent: isMe ? "flex-end" : "flex-start" }}>
              {!isMe && (
                <div style={{ ...st.msgAvatar, background: svc.color + "22", color: svc.color }}>
                  {worker.name[0]}
                </div>
              )}
              <div style={{ maxWidth:"72%", display:"flex", flexDirection:"column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                <div style={{ ...st.bubble, ...(isMe ? st.bubbleMe : st.bubbleThem) }}>
                  {msg.text}
                </div>
                <span style={st.timeLabel}>{msg.time}</span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <div style={{ ...st.msgRow, justifyContent:"flex-start" }}>
            <div style={{ ...st.msgAvatar, background: svc.color + "22", color: svc.color }}>
              {worker.name[0]}
            </div>
            <div style={{ ...st.bubble, ...st.bubbleThem, display:"flex", gap:4, alignItems:"center" }}>
              {[0,1,2].map(i => (
                <span key={i} style={{ width:8, height:8, borderRadius:"50%", background:"#9ca3af", display:"inline-block", animation:`bounce 1s ${i*0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div style={st.inputBar}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder={t.typeMessage}
          style={st.input}
          dir={isRTL ? "rtl" : "ltr"}
        />
        <button style={{ ...st.sendBtn, opacity: input.trim() ? 1 : 0.5 }} onClick={sendMessage} disabled={!input.trim() || sending}>
          {isRTL ? "←" : "→"}
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

const st = {
  page:        { fontFamily:"'Cairo',sans-serif", background:"#f9fafb", height:"calc(100vh - 65px)", display:"flex", flexDirection:"column", color:"#111827" },
  chatHeader:  { background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"16px 24px", display:"flex", alignItems:"center", gap:12, flexShrink:0 },
  backBtn:     { background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#374151", padding:4 },
  workerAvatar:{ width:44, height:44, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, flexShrink:0 },
  headerInfo:  { flex:1 },
  headerName:  { fontSize:15, fontWeight:700, display:"flex", alignItems:"center", gap:6 },
  verifiedSmall:{ background:"#16a34a", color:"#fff", fontSize:10, padding:"2px 6px", borderRadius:999, fontWeight:700 },
  headerStatus:{ fontSize:12, color:"#6b7280", display:"flex", alignItems:"center", gap:4, marginTop:2 },
  statusDot:   { width:7, height:7, borderRadius:"50%", display:"inline-block" },
  callBtn:     { background:"#f0fdf4", border:"1px solid #86efac", color:"#16a34a", width:38, height:38, borderRadius:10, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" },
  bookBtn:     { background:"#16a34a", color:"#fff", border:"none", padding:"8px 16px", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" },
  messagesArea:{ flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:8 },
  dateSep:     { display:"flex", alignItems:"center", justifyContent:"center", margin:"8px 0" },
  dateSepText: { background:"#e5e7eb", color:"#6b7280", fontSize:11, padding:"4px 12px", borderRadius:999 },
  msgRow:      { display:"flex", gap:10, alignItems:"flex-end" },
  msgAvatar:   { width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, flexShrink:0 },
  bubble:      { padding:"12px 16px", borderRadius:18, fontSize:15, lineHeight:1.5, maxWidth:"100%", wordBreak:"break-word" },
  bubbleMe:    { background:"#16a34a", color:"#fff", borderBottomRightRadius:4 },
  bubbleThem:  { background:"#fff", color:"#111827", borderBottomLeftRadius:4, boxShadow:"0 1px 4px rgba(0,0,0,0.08)" },
  timeLabel:   { fontSize:11, color:"#9ca3af", marginTop:2, padding:"0 4px" },
  inputBar:    { background:"#fff", borderTop:"1px solid #e5e7eb", padding:"14px 20px", display:"flex", gap:12, alignItems:"center", flexShrink:0 },
  input:       { flex:1, border:"1px solid #e5e7eb", borderRadius:24, padding:"12px 18px", fontSize:15, fontFamily:"'Cairo',sans-serif", outline:"none", background:"#f9fafb" },
  sendBtn:     { width:44, height:44, borderRadius:"50%", background:"#16a34a", color:"#fff", border:"none", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
};
