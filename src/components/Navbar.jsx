import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { TEXT } from "../lib/constants";

export default function Navbar({ lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user,     setUser]     = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const t = TEXT[lang];
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/"); };
  const isAdmin = user?.user_metadata?.role === "admin";

  return (
    <nav style={{ ...st.nav, ...(scrolled ? st.scrolled : {}) }} dir={lang === "ar" ? "rtl" : "ltr"}>
      <div style={st.logo} onClick={() => navigate("/")}>
        <span style={st.logoText}>صانع</span>
        <span style={st.logoDot}>.ma</span>
      </div>

      {!isMobile && (
        <div style={st.links}>
          <button style={st.link} onClick={() => navigate("/search")}>{t.workers}</button>
          <button style={st.link} onClick={() => navigate("/join")}>{t.joinWorker}</button>
          {isAdmin && <button style={{ ...st.link, color:"#8b5cf6" }} onClick={() => navigate("/admin")}>{t.adminPanel}</button>}
        </div>
      )}

      {!isMobile && (
        <div style={st.right}>
          <button style={st.langBtn} onClick={() => setLang(lang === "ar" ? "fr" : "ar")}>
            {lang === "ar" ? "FR" : "عر"}
          </button>
          {user ? (
            <>
              <button style={st.btnOutline} onClick={() => navigate("/dashboard")}>{t.dashboard}</button>
              <button style={{ ...st.btnOutline, color:"#ef4444", borderColor:"#ef444430" }} onClick={handleLogout}>{t.logout}</button>
            </>
          ) : (
            <>
              <button style={st.btnOutline} onClick={() => navigate("/login")}>{t.login}</button>
              <button style={st.btnFill}    onClick={() => navigate("/signup")}>{t.signup}</button>
            </>
          )}
        </div>
      )}

      {isMobile && (
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button style={st.langBtn} onClick={() => setLang(lang === "ar" ? "fr" : "ar")}>
            {lang === "ar" ? "FR" : "عر"}
          </button>
          <button style={st.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            <span style={{ ...st.bar, transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ ...st.bar, opacity: menuOpen ? 0 : 1 }} />
            <span style={{ ...st.bar, transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </button>
        </div>
      )}

      {isMobile && menuOpen && (
        <div style={st.mobileMenu} dir={lang === "ar" ? "rtl" : "ltr"}>
          {[
            [t.workers, "/search"],
            [t.joinWorker, "/join"],
            ...(isAdmin ? [[t.adminPanel, "/admin"]] : []),
          ].map(([label, path]) => (
            <button key={path} style={st.mobileLink} onClick={() => { navigate(path); setMenuOpen(false); }}>{label}</button>
          ))}
          <div style={{ borderTop:"1px solid rgba(0,0,0,0.08)", paddingTop:16, display:"flex", flexDirection:"column", gap:10 }}>
            {user ? (
              <>
                <button style={st.btnFill} onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}>{t.dashboard}</button>
                <button style={{ ...st.btnOutline, color:"#ef4444" }} onClick={handleLogout}>{t.logout}</button>
              </>
            ) : (
              <>
                <button style={st.btnOutline} onClick={() => { navigate("/login");  setMenuOpen(false); }}>{t.login}</button>
                <button style={st.btnFill}    onClick={() => { navigate("/signup"); setMenuOpen(false); }}>{t.signup}</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

const st = {
  nav:       { fontFamily:"'Cairo',sans-serif", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 48px", position:"sticky", top:0, zIndex:100, background:"#fff", borderBottom:"1px solid rgba(0,0,0,0.08)", transition:"box-shadow 0.3s" },
  scrolled:  { boxShadow:"0 2px 20px rgba(0,0,0,0.08)" },
  logo:      { display:"flex", alignItems:"baseline", gap:2, cursor:"pointer" },
  logoText:  { fontFamily:"'Cairo',sans-serif", fontSize:24, fontWeight:800, color:"#16a34a" },
  logoDot:   { fontSize:14, color:"#6b7280", fontWeight:400 },
  links:     { display:"flex", gap:8 },
  link:      { background:"none", border:"none", color:"#374151", fontSize:15, cursor:"pointer", padding:"8px 16px", borderRadius:8, fontFamily:"'Cairo',sans-serif", transition:"background 0.2s" },
  right:     { display:"flex", alignItems:"center", gap:10 },
  langBtn:   { background:"#f3f4f6", border:"none", color:"#374151", padding:"6px 12px", borderRadius:8, fontSize:13, cursor:"pointer", fontWeight:600, fontFamily:"'Cairo',sans-serif" },
  btnOutline:{ background:"transparent", border:"1px solid #d1d5db", color:"#374151", padding:"8px 18px", fontSize:14, borderRadius:8, cursor:"pointer", fontFamily:"'Cairo',sans-serif", transition:"all 0.2s" },
  btnFill:   { background:"#16a34a", border:"none", color:"#fff", padding:"8px 18px", fontSize:14, borderRadius:8, cursor:"pointer", fontFamily:"'Cairo',sans-serif", fontWeight:600 },
  hamburger: { display:"flex", flexDirection:"column", gap:5, background:"none", border:"none", cursor:"pointer", padding:4 },
  bar:       { display:"block", width:22, height:2, background:"#374151", transition:"all 0.3s" },
  mobileMenu:{ position:"absolute", top:"100%", left:0, right:0, background:"#fff", borderBottom:"1px solid rgba(0,0,0,0.08)", padding:"20px 32px", display:"flex", flexDirection:"column", gap:16, boxShadow:"0 4px 20px rgba(0,0,0,0.1)" },
  mobileLink:{ background:"none", border:"none", color:"#374151", fontSize:16, textAlign:"right", cursor:"pointer", fontFamily:"'Cairo',sans-serif", padding:"8px 0" },
};
