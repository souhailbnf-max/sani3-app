// Mock workers data for testing — replace with Supabase data later
export const mockWorkers = [
  { id:1,  name:"Hassan Benali",    specialty:"plumber",     city:"Casablanca", lat:33.5731, lng:-7.5898, rating:4.8, reviews:124, phone:"0661234567", available:true,  experience:8,  bio:"سباك محترف مع خبرة 8 سنوات في جميع أعمال السباكة" },
  { id:2,  name:"Youssef Alami",    specialty:"electrician", city:"Casablanca", lat:33.5800, lng:-7.6100, rating:4.9, reviews:89,  phone:"0662345678", available:true,  experience:12, bio:"كهربائي معتمد متخصص في التركيبات الكهربائية المنزلية" },
  { id:3,  name:"Khalid Tazi",      specialty:"carpenter",   city:"Casablanca", lat:33.5650, lng:-7.5700, rating:4.7, reviews:67,  phone:"0663456789", available:false, experience:15, bio:"نجار ماهر متخصص في الأثاث والأبواب والنوافذ" },
  { id:4,  name:"Mohamed Fassi",    specialty:"cleaner",     city:"Casablanca", lat:33.5900, lng:-7.6200, rating:4.6, reviews:203, phone:"0664567890", available:true,  experience:5,  bio:"خدمة تنظيف احترافية للمنازل والمكاتب" },
  { id:5,  name:"Rachid Idrissi",   specialty:"ac",          city:"Casablanca", lat:33.5550, lng:-7.5500, rating:4.9, reviews:156, phone:"0665678901", available:true,  experience:10, bio:"متخصص في تركيب وصيانة أجهزة التكييف جميع الأنواع" },
  { id:6,  name:"Omar Cherkaoui",   specialty:"plumber",     city:"Casablanca", lat:33.5820, lng:-7.5950, rating:4.5, reviews:45,  phone:"0666789012", available:true,  experience:6,  bio:"سباك سريع ومتاح على مدار الساعة للطوارئ" },
  { id:7,  name:"Samir Belkadi",    specialty:"electrician", city:"Casablanca", lat:33.5700, lng:-7.6050, rating:4.7, reviews:78,  phone:"0667890123", available:false, experience:9,  bio:"كهربائي متخصص في الطاقة الشمسية والتركيبات الحديثة" },
  { id:8,  name:"Hamid Ouali",      specialty:"carpenter",   city:"Casablanca", lat:33.5780, lng:-7.5800, rating:4.8, reviews:92,  phone:"0668901234", available:true,  experience:20, bio:"نجار خبير في الديكور الداخلي والأثاث المصنوع يدوياً" },
  { id:9,  name:"Abdelali Nasri",   specialty:"cleaner",     city:"Casablanca", lat:33.5620, lng:-7.6150, rating:4.4, reviews:167, phone:"0669012345", available:true,  experience:7,  bio:"شركة تنظيف متكاملة مع فريق متخصص ومعدات حديثة" },
  { id:10, name:"Fouad Benkirane",  specialty:"ac",          city:"Casablanca", lat:33.5850, lng:-7.5600, rating:4.6, reviews:88,  phone:"0660123456", available:false, experience:8,  bio:"تركيب وصيانة تكييف بضمان سنة كاملة" },
];

// Calculate distance between two coordinates in km
export function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
