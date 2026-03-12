import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home         from "./pages/Home";
import Search       from "./pages/Search";
import { Login, Signup } from "./pages/Auth";
import Dashboard    from "./pages/Dashboard";
import WorkerProfile from "./pages/WorkerProfile";
import Booking      from "./pages/Booking";
import Chat         from "./pages/Chat";
import Admin        from "./pages/Admin";

export default function App() {
  const [lang, setLang] = useState("ar");
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{background:#f9fafb;overflow-x:hidden;font-family:'Cairo',sans-serif;}
        input,textarea,select,button{font-family:'Cairo',sans-serif;}
        select option{background:#fff;color:#111827;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);}}
      `}</style>
      <BrowserRouter>
        <Routes>
          <Route path="/"           element={<><Navbar lang={lang} setLang={setLang}/><Home lang={lang}/></>}/>
          <Route path="/search"     element={<><Navbar lang={lang} setLang={setLang}/><Search lang={lang}/></>}/>
          <Route path="/join"       element={<><Navbar lang={lang} setLang={setLang}/><Signup lang={lang}/></>}/>
          <Route path="/worker/:id" element={<><Navbar lang={lang} setLang={setLang}/><WorkerProfile lang={lang}/></>}/>
          <Route path="/login"      element={<Login  lang={lang}/>}/>
          <Route path="/signup"     element={<Signup lang={lang}/>}/>
          <Route path="/dashboard"  element={<ProtectedRoute><Navbar lang={lang} setLang={setLang}/><Dashboard lang={lang}/></ProtectedRoute>}/>
          <Route path="/booking/:id" element={<ProtectedRoute><Navbar lang={lang} setLang={setLang}/><Booking lang={lang}/></ProtectedRoute>}/>
          <Route path="/chat/:id"   element={<ProtectedRoute><Navbar lang={lang} setLang={setLang}/><Chat lang={lang}/></ProtectedRoute>}/>
          <Route path="/admin"      element={<ProtectedRoute><Navbar lang={lang} setLang={setLang}/><Admin lang={lang}/></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}
