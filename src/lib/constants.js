export const SERVICES = [
  { id: "plumber",     icon: "🔧", ar: "سباك",       fr: "Plombier",       color: "#2563eb" },
  { id: "electrician", icon: "⚡", ar: "كهربائي",    fr: "Electricien",    color: "#f59e0b" },
  { id: "carpenter",   icon: "🪚", ar: "نجار",        fr: "Menuisier",      color: "#92400e" },
  { id: "cleaner",     icon: "🧹", ar: "عامل نظافة",  fr: "Agent de ménage",color: "#10b981" },
  { id: "ac",          icon: "❄️", ar: "تقني تكييف",  fr: "Technicien Clim",color: "#06b6d4" },
  { id: "painter",     icon: "🎨", ar: "دهان",        fr: "Peintre",        color: "#8b5cf6" },
  { id: "mason",       icon: "🧱", ar: "بناء",        fr: "Maçon",          color: "#78716c" },
];

export const CITIES = [
  "الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة",
  "مكناس", "أكادير", "وجدة", "القنيطرة", "تطوان",
  "سلا", "الجديدة", "بني ملال", "خريبكة", "ناظور",
];

export const TEXT = {
  ar: {
    brand:"صانع", tagline:"ابحث عن أفضل الحرفيين القريبين منك",
    subtitle:"نربطك بأفضل السباكين، الكهربائيين، والحرفيين في مدينتك",
    search:"ابحث عن خدمة...", nearMe:"بالقرب مني", chooseCity:"اختر مدينة",
    radius:"نطاق البحث", km:"كم", listView:"قائمة", mapView:"خريطة",
    workers:"الحرفيون المتاحون", away:"كم منك", rating:"التقييم",
    contact:"تواصل معه", book:"احجز الآن", login:"تسجيل الدخول",
    signup:"إنشاء حساب", logout:"خروج", dashboard:"لوحة التحكم",
    joinWorker:"انضم كحرفي", howItWorks:"كيف يعمل؟",
    step1:"ابحث عن الخدمة", step1d:"اختر نوع الخدمة التي تحتاجها",
    step2:"اختر الحرفي", step2d:"اطلع على التقييمات والمسافة",
    step3:"احجز مباشرة", step3d:"تواصل وحدد الموعد المناسب",
    available:"متاح", busy:"مشغول", reviews:"تقييم",
    allowLocation:"السماح بالموقع", locating:"جاري تحديد موقعك...",
    noWorkers:"لا يوجد حرفيون في هذه المنطقة حالياً", allServices:"كل الخدمات",
    verified:"✓ موثق", viewProfile:"عرض الملف", chat:"محادثة",
    bookNow:"احجز موعد", writeReview:"اكتب تقييماً", adminPanel:"لوحة الإدارة",
    experience:"سنوات الخبرة", about:"نبذة", selectDate:"اختر التاريخ",
    selectTime:"اختر الوقت", notes:"ملاحظات", confirmBooking:"تأكيد الحجز",
    bookingSuccess:"تم الحجز بنجاح!", smsSent:"تم إرسال رسالة SMS",
    sendMessage:"إرسال رسالة", typeMessage:"اكتب رسالتك...",
    pendingVerification:"في انتظار التوثيق",
  },
  fr: {
    brand:"Sani3", tagline:"Trouvez les meilleurs artisans près de vous",
    subtitle:"Nous vous connectons aux meilleurs plombiers, électriciens et artisans de votre ville",
    search:"Rechercher un service...", nearMe:"Près de moi", chooseCity:"Choisir une ville",
    radius:"Rayon de recherche", km:"km", listView:"Liste", mapView:"Carte",
    workers:"Artisans disponibles", away:"km de vous", rating:"Note",
    contact:"Contacter", book:"Réserver", login:"Connexion",
    signup:"S'inscrire", logout:"Déconnexion", dashboard:"Tableau de bord",
    joinWorker:"Rejoindre comme artisan", howItWorks:"Comment ça marche?",
    step1:"Cherchez le service", step1d:"Choisissez le type de service dont vous avez besoin",
    step2:"Choisissez l'artisan", step2d:"Consultez les avis et la distance",
    step3:"Réservez directement", step3d:"Contactez et fixez le rendez-vous",
    available:"Disponible", busy:"Occupé", reviews:"avis",
    allowLocation:"Autoriser la localisation", locating:"Localisation en cours...",
    noWorkers:"Aucun artisan disponible dans cette zone", allServices:"Tous les services",
    verified:"✓ Vérifié", viewProfile:"Voir profil", chat:"Message",
    bookNow:"Réserver", writeReview:"Laisser un avis", adminPanel:"Panneau Admin",
    experience:"Années d'expérience", about:"À propos", selectDate:"Choisir la date",
    selectTime:"Choisir l'heure", notes:"Notes", confirmBooking:"Confirmer la réservation",
    bookingSuccess:"Réservation confirmée!", smsSent:"SMS envoyé",
    sendMessage:"Envoyer", typeMessage:"Écrivez votre message...",
    pendingVerification:"En attente de vérification",
  }
};

export const MOCK_WORKERS = [
  { id:1,  name:"Hassan Benali",   service:"plumber",     rating:4.8, reviews:124, lat:33.5731, lng:-7.5898, city:"الدار البيضاء", available:true,  price:"150-300 MAD", phone:"+212600000001", verified:true,  experience:10, bio_ar:"سباك محترف بخبرة 10 سنوات", bio_fr:"Plombier professionnel 10 ans d'expérience" },
  { id:2,  name:"Youssef Idrissi", service:"electrician", rating:4.6, reviews:89,  lat:33.5800, lng:-7.6100, city:"الدار البيضاء", available:true,  price:"200-400 MAD", phone:"+212600000002", verified:true,  experience:7,  bio_ar:"كهربائي معتمد متخصص في التمديدات", bio_fr:"Électricien certifié spécialisé en installations" },
  { id:3,  name:"Khalid Moroccan", service:"carpenter",   rating:4.9, reviews:56,  lat:33.5650, lng:-7.5750, city:"الدار البيضاء", available:false, price:"300-600 MAD", phone:"+212600000003", verified:false, experience:15, bio_ar:"نجار ماهر متخصص في الأثاث المنزلي", bio_fr:"Menuisier habile spécialisé en mobilier" },
  { id:4,  name:"Omar Tazi",       service:"cleaner",     rating:4.7, reviews:201, lat:33.5900, lng:-7.5600, city:"الدار البيضاء", available:true,  price:"100-200 MAD", phone:"+212600000004", verified:true,  experience:5,  bio_ar:"متخصص في خدمات التنظيف للمنازل", bio_fr:"Spécialiste du nettoyage résidentiel" },
  { id:5,  name:"Rachid Alami",    service:"ac",          rating:4.5, reviews:78,  lat:33.5500, lng:-7.6200, city:"الدار البيضاء", available:true,  price:"250-500 MAD", phone:"+212600000005", verified:true,  experience:8,  bio_ar:"تقني تكييف معتمد، صيانة وتركيب", bio_fr:"Technicien clim certifié, maintenance et installation" },
  { id:6,  name:"Mustapha Filali", service:"plumber",     rating:4.3, reviews:45,  lat:33.5750, lng:-7.5500, city:"الدار البيضاء", available:true,  price:"150-250 MAD", phone:"+212600000006", verified:false, experience:6,  bio_ar:"سباك بخبرة 6 سنوات", bio_fr:"Plombier avec 6 ans d'expérience" },
  { id:7,  name:"Amine Sabri",     service:"electrician", rating:4.9, reviews:167, lat:33.5600, lng:-7.6000, city:"الدار البيضاء", available:false, price:"200-350 MAD", phone:"+212600000007", verified:true,  experience:12, bio_ar:"مهندس كهرباء بخبرة 12 سنة", bio_fr:"Ingénieur électricien 12 ans d'expérience" },
  { id:8,  name:"Karim Bensouda",  service:"carpenter",   rating:4.4, reviews:33,  lat:33.5850, lng:-7.5800, city:"الدار البيضاء", available:true,  price:"400-800 MAD", phone:"+212600000008", verified:false, experience:9,  bio_ar:"نجار متخصص في الديكور", bio_fr:"Menuisier spécialisé en décoration" },
  { id:9,  name:"Samir Ouali",     service:"painter",     rating:4.7, reviews:62,  lat:33.5680, lng:-7.5920, city:"الدار البيضاء", available:true,  price:"200-450 MAD", phone:"+212600000009", verified:true,  experience:11, bio_ar:"دهان محترف متخصص في الديكور الداخلي", bio_fr:"Peintre professionnel décoration intérieure" },
  { id:10, name:"Abdellah Soussi", service:"mason",       rating:4.6, reviews:88,  lat:33.5720, lng:-7.6050, city:"الدار البيضاء", available:true,  price:"300-700 MAD", phone:"+212600000010", verified:true,  experience:14, bio_ar:"بناء محترف متخصص في الترميم", bio_fr:"Maçon professionnel spécialisé en rénovation" },
];

export const MOCK_REVIEWS = [
  { id:1, worker_id:1, client:"Mohamed A.", rating:5, comment_ar:"خدمة ممتازة، سريع ومحترف", comment_fr:"Service excellent, rapide et professionnel", date:"2025-03-01" },
  { id:2, worker_id:1, client:"Fatima Z.",  rating:4, comment_ar:"عمل جيد، سعر معقول", comment_fr:"Bon travail, prix raisonnable", date:"2025-02-20" },
  { id:3, worker_id:2, client:"Karim B.",   rating:5, comment_ar:"ممتاز جداً، أنصح به", comment_fr:"Excellent, je le recommande", date:"2025-02-28" },
  { id:4, worker_id:1, client:"Sara M.",    rating:5, comment_ar:"أفضل سباك في الدار البيضاء", comment_fr:"Meilleur plombier de Casablanca", date:"2025-03-05" },
  { id:5, worker_id:3, client:"Ali K.",     rating:5, comment_ar:"نجار بارع جداً", comment_fr:"Menuisier très habile", date:"2025-03-08" },
];

export const MOCK_BOOKINGS = [
  { id:1, worker_id:1, client_id:"user1", client_name:"Mohamed Amine", date:"2025-03-15", time:"10:00", service:"plumber",     status:"pending",   notes_ar:"إصلاح تسرب في الحمام",  notes_fr:"Réparation fuite salle de bain", price:"250 MAD" },
  { id:2, worker_id:2, client_id:"user2", client_name:"Fatima Zahra",  date:"2025-03-14", time:"14:00", service:"electrician", status:"confirmed",  notes_ar:"تركيب مقابس جديدة",     notes_fr:"Installation nouvelles prises",  price:"350 MAD" },
  { id:3, worker_id:1, client_id:"user3", client_name:"Youssef B.",    date:"2025-03-10", time:"09:00", service:"plumber",     status:"completed",  notes_ar:"تركيب حنفية جديدة",     notes_fr:"Installation nouveau robinet",   price:"200 MAD" },
];

export const MOCK_MESSAGES = {
  1: [
    { id:1, from:"client", text:"مرحباً، هل أنت متاح غداً؟", time:"10:30" },
    { id:2, from:"worker", text:"نعم، متاح من الساعة 9 صباحاً", time:"10:32" },
    { id:3, from:"client", text:"ممتاز، سأحجز الساعة 10", time:"10:33" },
  ]
};

export const TIME_SLOTS = [
  "08:00","09:00","10:00","11:00","12:00",
  "14:00","15:00","16:00","17:00","18:00",
];

export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
    Math.sin(dLon/2)*Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
