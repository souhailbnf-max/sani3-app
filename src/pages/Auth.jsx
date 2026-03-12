import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { TEXT } from "../lib/constants";

export function Login({ lang }) {
  const t = TEXT[lang];
  const isRTL = lang === "ar";
  const [form,    setForm]    = useState({ email:"", password:"" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(form);
    setLoading(false);
    if (error) setError(error.message);
    else navigate("/dashboard");
  };

  const fieldStyle = (name) => ({ ...st.input, borderColor: focused===name ? "#16a34a" : "#e5e7eb", outline:"none" });

  return (
    <div style={st.page} dir={isRTL ? "rtl" : "ltr"}>
      <div style={st.card}>
        <div style={st.logo}>صانع.ma</div>
        <h1 style={st.title}>{isRTL ? "مرحباً بك" : "Bienvenue"}</h1>
        <p style={st.sub}>{isRTL ? "سجل دخولك إلى حسابك" : "Connectez-vous à votre compte"}</p>

        {error && <div style={st.error}>{error}</div>}

        <div style={st.form}>
          <div style={st.field}>
            <label style={st.lbl}>{isRTL ? "البريد الإلكتروني" : "Email"}</label>
            <input name="email" type="email" value={form.email}
              onChange={e => setForm(f=>({...f, email:e.target.value}))} placeholder="exemple@gmail.com"
              style={fieldStyle("email")} onFocus={()=>setFocused("email")} onBlur={()=>setFocused("")} />
          </div>
          <div style={st.field}>
            <label style={st.lbl}>{isRTL ? "كلمة المرور" : "Mot de passe"}</label>
            <input name="password" type="password" value={form.password}
              onChange={e => setForm(f=>({...f, password:e.target.value}))} placeholder="••••••••"
              style={fieldStyle("password")} onFocus={()=>setFocused("password")} onBlur={()=>setFocused("")}
              onKeyDown={e => e.key==="Enter" && handleSubmit()} />
          </div>
          <button onClick={handleSubmit} disabled={loading} style={{ ...st.btn, opacity:loading?0.7:1 }}>
            {loading ? (isRTL ? "جاري الدخول..." : "Connexion...") : (isRTL ? "تسجيل الدخول ←" : "Se connecter →")}
          </button>
        </div>

        <p style={st.footer}>
          {isRTL ? "ليس لديك حساب؟ " : "Pas de compte? "}
          <Link to="/signup" style={st.link}>{isRTL ? "إنشاء حساب" : "S'inscrire"}</Link>
        </p>
      </div>
    </div>
  );
}

export function Signup({ lang }) {
  const isRTL = lang === "ar";
  const [form,    setForm]    = useState({ name:"", email:"", password:"", role:"client" });
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.email || !form.password) return setError(isRTL ? "يرجى ملء جميع الحقول" : "Veuillez remplir tous les champs");
    if (form.password.length < 6) return setError(isRTL ? "كلمة المرور قصيرة جداً" : "Mot de passe trop court");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { full_name: form.name, role: form.role } }
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSuccess(true);
  };

  const fieldStyle = (name) => ({ ...st.input, borderColor: focused===name ? "#16a34a" : "#e5e7eb", outline:"none" });

  if (success) return (
    <div style={st.page} dir={isRTL ? "rtl" : "ltr"}>
      <div style={{ ...st.card, textAlign:"center" }}>
        <div style={{ fontSize:56, marginBottom:16 }}>📧</div>
        <h2 style={{ ...st.title }}>{isRTL ? "تحقق من بريدك الإلكتروني!" : "Vérifiez votre email!"}</h2>
        <p style={{ fontSize:15, color:"#6b7280", lineHeight:1.8, marginBottom:24 }}>
          {isRTL ? `أرسلنا رابط التأكيد إلى ${form.email}` : `Nous avons envoyé un lien à ${form.email}`}
        </p>
        <button onClick={() => navigate("/login")} style={st.btn}>
          {isRTL ? "الذهاب لتسجيل الدخول" : "Aller à la connexion"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={st.page} dir={isRTL ? "rtl" : "ltr"}>
      <div style={st.card}>
        <div style={st.logo}>صانع.ma</div>
        <h1 style={st.title}>{isRTL ? "إنشاء حساب" : "Créer un compte"}</h1>

        {/* Role selector */}
        <div style={st.roleRow}>
          {[["client", isRTL?"أنا عميل":"Je suis client","👤"],["worker",isRTL?"أنا حرفي":"Je suis artisan","👷"]].map(([role,label,icon])=>(
            <button key={role} onClick={()=>setForm(f=>({...f,role}))}
              style={{ ...st.roleBtn, ...(form.role===role ? st.roleBtnActive : {}) }}>
              {icon} {label}
            </button>
          ))}
        </div>

        {error && <div style={st.error}>{error}</div>}

        <div style={st.form}>
          <div style={st.field}>
            <label style={st.lbl}>{isRTL ? "الاسم الكامل" : "Nom complet"}</label>
            <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder={isRTL?"محمد أمين":"Mohamed Amine"}
              style={fieldStyle("name")} onFocus={()=>setFocused("name")} onBlur={()=>setFocused("")} />
          </div>
          <div style={st.field}>
            <label style={st.lbl}>{isRTL ? "البريد الإلكتروني" : "Email"}</label>
            <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="exemple@gmail.com"
              style={fieldStyle("email")} onFocus={()=>setFocused("email")} onBlur={()=>setFocused("")} />
          </div>
          <div style={st.field}>
            <label style={st.lbl}>{isRTL ? "كلمة المرور" : "Mot de passe"}</label>
            <input type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••"
              style={fieldStyle("password")} onFocus={()=>setFocused("password")} onBlur={()=>setFocused("")}
              onKeyDown={e=>e.key==="Enter"&&handleSubmit()} />
          </div>
          <button onClick={handleSubmit} disabled={loading} style={{ ...st.btn, opacity:loading?0.7:1 }}>
            {loading ? (isRTL?"جاري الإنشاء...":"Création...") : (isRTL?"إنشاء الحساب ←":"Créer le compte →")}
          </button>
        </div>

        <p style={st.footer}>
          {isRTL ? "لديك حساب بالفعل؟ " : "Déjà un compte? "}
          <Link to="/login" style={st.link}>{isRTL ? "تسجيل الدخول" : "Se connecter"}</Link>
        </p>
      </div>
    </div>
  );
}

const st = {
  page:        { fontFamily:"'Cairo',sans-serif", background:"#f9fafb", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 },
  card:        { background:"#fff", borderRadius:20, padding:"40px 36px", width:"100%", maxWidth:440, boxShadow:"0 4px 24px rgba(0,0,0,0.08)", color:"#111827" },
  logo:        { fontSize:22, fontWeight:800, color:"#16a34a", textAlign:"center", marginBottom:24 },
  title:       { fontSize:26, fontWeight:800, textAlign:"center", marginBottom:6, color:"#111827" },
  sub:         { fontSize:14, color:"#6b7280", textAlign:"center", marginBottom:28 },
  error:       { background:"#fef2f2", border:"1px solid #fecaca", color:"#ef4444", padding:"10px 14px", borderRadius:8, fontSize:14, marginBottom:16 },
  roleRow:     { display:"flex", gap:10, marginBottom:24 },
  roleBtn:     { flex:1, padding:"12px", border:"2px solid #e5e7eb", borderRadius:12, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'Cairo',sans-serif", background:"#fff", color:"#6b7280", transition:"all 0.2s" },
  roleBtnActive:{ borderColor:"#16a34a", background:"#f0fdf4", color:"#16a34a" },
  form:        { display:"flex", flexDirection:"column", gap:18 },
  field:       { display:"flex", flexDirection:"column", gap:6 },
  lbl:         { fontSize:13, fontWeight:600, color:"#374151" },
  input:       { border:"1px solid", borderRadius:10, padding:"12px 14px", fontSize:15, color:"#111827", transition:"border-color 0.2s", fontFamily:"'Cairo',sans-serif", background:"#fff" },
  btn:         { background:"#16a34a", color:"#fff", border:"none", padding:"14px", fontSize:16, fontWeight:700, borderRadius:12, cursor:"pointer", fontFamily:"'Cairo',sans-serif", transition:"background 0.2s" },
  footer:      { fontSize:14, color:"#6b7280", textAlign:"center", marginTop:24 },
  link:        { color:"#16a34a", textDecoration:"none", fontWeight:600 },
};
